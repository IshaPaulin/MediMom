// src/components/GestureCollector.jsx
// ─────────────────────────────────────────────────────────────
// Temporary dev tool — collect training data for your gesture model.
// Visit localhost:5173/collect to use it.
// Delete the /collect route from App.jsx when done.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';

const LABELS          = ['THUMBS_UP', 'FIST', 'OPEN_PALM', 'NONE'];
const SAMPLES_TARGET  = 200;
const COLLECT_RATE_MS = 100; // save one sample every 100ms while held

export default function GestureCollector() {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  // We store the latest landmarks in a ref so the interval can read them
  const latestLandmarksRef = useRef(null);
  const activeLabelRef     = useRef(null);
  const collectIntervalRef = useRef(null);
  const dataRef            = useRef([]);

  const [ready,       setReady]       = useState(false);
  const [activeLabel, setActiveLabel] = useState(null);
  const [recording,   setRecording]   = useState(false);
  const [counts,      setCounts]      = useState({ THUMBS_UP: 0, FIST: 0, OPEN_PALM: 0, NONE: 0 });
  const [totalSaved,  setTotalSaved]  = useState(0);

  // Keep activeLabelRef in sync with state
  useEffect(() => { activeLabelRef.current = activeLabel; }, [activeLabel]);

  // ── Boot MediaPipe ──────────────────────────────────────────
  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
    });

    hands.setOptions({
      maxNumHands:            1,
      modelComplexity:        1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence:  0.6,
    });

    hands.onResults((results) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mirrored video frame
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      if (results.multiHandLandmarks?.length) {
        const lm = results.multiHandLandmarks[0];

        // Draw skeleton on canvas
        drawConnectors(ctx, lm, HAND_CONNECTIONS, { color: '#487A7B', lineWidth: 2 });
        drawLandmarks(ctx,  lm, { color: '#D4A5A5', lineWidth: 1, radius: 4 });

        latestLandmarksRef.current = lm;
      } else {
        latestLandmarksRef.current = null;
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => { await hands.send({ image: videoRef.current }); },
      width: 640, height: 480,
    });

    camera.start().then(() => setReady(true));

    return () => {
      camera.stop();
      stopRecording();
    };
  }, []);

  // ── Normalize landmarks (must match Colab notebook exactly) ──
  // Translate so wrist = origin, scale so max distance = 1
  const normalizeLandmarks = (landmarks) => {
    const pts = landmarks.map(p => [p.x, p.y, p.z]);
    const [wx, wy, wz] = pts[0];
    const shifted = pts.map(([x, y, z]) => [x - wx, y - wy, z - wz]);
    const dists   = shifted.map(([x, y, z]) => Math.sqrt(x*x + y*y + z*z));
    const scale   = Math.max(...dists) || 1;
    const normed  = shifted.map(([x, y, z]) => [
      parseFloat((x / scale).toFixed(6)),
      parseFloat((y / scale).toFixed(6)),
      parseFloat((z / scale).toFixed(6)),
    ]);
    return normed.flat(); // 63 numbers
  };

  // ── Save one sample ─────────────────────────────────────────
  const saveSample = () => {
    const label     = activeLabelRef.current;
    const landmarks = latestLandmarksRef.current;
    if (!label) return;

    let features;
    if (landmarks) {
      features = normalizeLandmarks(landmarks);
      if (features.length !== 63) return;
    } else if (label === 'NONE') {
      // NONE class can include frames with no hand visible
      features = new Array(63).fill(0);
    } else {
      return; // other classes need a visible hand
    }

    dataRef.current.push({ features, label });

    setCounts(prev => ({ ...prev, [label]: prev[label] + 1 }));
    setTotalSaved(dataRef.current.length);
  };

  // ── Start / stop recording ──────────────────────────────────
  const startRecording = () => {
    if (!activeLabel || !ready) return;
    collectIntervalRef.current = setInterval(saveSample, COLLECT_RATE_MS);
    setRecording(true);
  };

  const stopRecording = () => {
    if (collectIntervalRef.current) {
      clearInterval(collectIntervalRef.current);
      collectIntervalRef.current = null;
    }
    setRecording(false);
  };

  // ── Export JSON ─────────────────────────────────────────────
  const exportData = () => {
    if (dataRef.current.length === 0) { alert('No data yet!'); return; }
    const blob = new Blob([JSON.stringify(dataRef.current)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'gesture_training_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (!window.confirm('Clear all samples?')) return;
    dataRef.current = [];
    setCounts({ THUMBS_UP: 0, FIST: 0, OPEN_PALM: 0, NONE: 0 });
    setTotalSaved(0);
  };

  const allDone = LABELS.every(l => counts[l] >= SAMPLES_TARGET);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F3EE' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400&family=DM+Sans:wght@300;400;500&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans  { font-family: 'DM Sans', sans-serif; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin   { to{transform:rotate(360deg)} }
      `}</style>

      {/* Header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid rgba(212,165,165,0.25)', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>🤚</span>
        <h1 className="serif" style={{ color: '#487A7B', fontSize: '22px', fontWeight: 400, margin: 0 }}>Gesture Data Collector</h1>
        <span className="sans" style={{ fontSize: '11px', background: '#D4A5A5', color: '#fff', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.05em' }}>DEV TOOL</span>
      </div>

      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

        {/* ── Left: camera ────────────────────────────────── */}
        <div>
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: '#111', aspectRatio: '4/3' }}>
            <video ref={videoRef} style={{ display: 'none' }} playsInline />
            <canvas ref={canvasRef} width={640} height={480} style={{ width: '100%', height: '100%', display: 'block' }} />

            {/* Loading spinner */}
            {!ready && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', background: 'rgba(0,0,0,0.7)' }}>
                <div style={{ width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.15)', borderTop: '3px solid #D4A5A5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p className="sans" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Starting camera…</p>
              </div>
            )}

            {/* Recording badge */}
            {recording && (
              <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(180,60,60,0.88)', padding: '6px 14px', borderRadius: '20px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff', animation: 'blink 1s infinite' }} />
                <span className="sans" style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>REC · {activeLabel}</span>
              </div>
            )}

            {/* Selected class badge */}
            {activeLabel && !recording && (
              <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(72,122,123,0.85)', padding: '6px 14px', borderRadius: '20px' }}>
                <span className="sans" style={{ color: '#fff', fontSize: '13px' }}>Selected: {activeLabel}</span>
              </div>
            )}
          </div>

          {/* Hold-to-record button */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={!activeLabel || !ready}
              style={{
                padding: '16px 56px',
                borderRadius: '50px',
                border: 'none',
                background: !activeLabel || !ready ? '#C5D3D3' : recording ? '#b44' : '#487A7B',
                color: '#fff',
                fontSize: '16px',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                cursor: activeLabel && ready ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              {recording ? '● Recording…' : '⏺ Hold to Record'}
            </button>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '12px', marginTop: '10px', fontWeight: 300 }}>
              Hold while performing the gesture. Release to pause.
            </p>
          </div>
        </div>

        {/* ── Right: controls ─────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Step 1 — pick class */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '22px', border: '1px solid rgba(212,165,165,0.15)' }}>
            <p className="sans" style={{ color: '#B8C9C9', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Step 1 — Select class</p>

            {LABELS.map(label => {
              const emoji = { THUMBS_UP: '👍', FIST: '✊', OPEN_PALM: '✋', NONE: '🚫' }[label];
              const hint  = { THUMBS_UP: 'Thumb up, fingers closed', FIST: 'All fingers closed', OPEN_PALM: 'All fingers spread open', NONE: 'Random / no gesture' }[label];
              const count = counts[label];
              const pct   = Math.min((count / SAMPLES_TARGET) * 100, 100);
              const done  = count >= SAMPLES_TARGET;

              return (
                <button
                  key={label}
                  onClick={() => setActiveLabel(label)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: activeLabel === label ? '2px solid #487A7B' : '1.5px solid rgba(72,122,123,0.12)',
                    background: activeLabel === label ? 'rgba(72,122,123,0.07)' : '#FAFAF8',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="sans" style={{ color: '#487A7B', fontSize: '14px', fontWeight: 500 }}>{emoji} {label}</span>
                    <span className="sans" style={{ color: done ? '#9CAF88' : '#B8C9C9', fontSize: '12px', fontWeight: done ? 600 : 300 }}>
                      {count}/{SAMPLES_TARGET}{done ? ' ✓' : ''}
                    </span>
                  </div>
                  <p className="sans" style={{ color: '#B8C9C9', fontSize: '11px', fontWeight: 300, margin: '0 0 6px' }}>{hint}</p>
                  <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(72,122,123,0.08)' }}>
                    <div style={{ height: '100%', borderRadius: '2px', width: `${pct}%`, background: done ? '#9CAF88' : '#487A7B', transition: 'width 0.3s' }} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step 2 — tips */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '22px', border: '1px solid rgba(212,165,165,0.15)' }}>
            <p className="sans" style={{ color: '#B8C9C9', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Step 2 — Tips</p>
            {[
              '🌞 Record in both bright and dim light',
              '📐 Tilt and rotate wrist slightly each time',
              '📏 Vary hand distance from camera',
              '🔄 Do multiple short sessions per class',
              '🚫 For NONE: wave, point, rest your hand',
            ].map((tip, i) => (
              <p key={i} className="sans" style={{ color: '#8BA8A9', fontSize: '12px', fontWeight: 300, lineHeight: 1.7, margin: '2px 0' }}>{tip}</p>
            ))}
          </div>

          {/* Step 3 — export */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '22px', border: '1px solid rgba(212,165,165,0.15)' }}>
            <p className="sans" style={{ color: '#B8C9C9', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Step 3 — Export</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="sans" style={{ color: '#8BA8A9', fontSize: '13px', fontWeight: 300 }}>Total samples</span>
              <span className="sans" style={{ color: '#487A7B', fontSize: '18px', fontWeight: 400, fontFamily: 'Cormorant Garamond, serif' }}>{totalSaved}</span>
            </div>

            {allDone && (
              <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(156,175,136,0.15)', border: '1px solid rgba(156,175,136,0.3)', marginBottom: '12px' }}>
                <p className="sans" style={{ color: '#5a7a4a', fontSize: '13px', fontWeight: 400, margin: 0 }}>✅ All classes complete! Ready to export.</p>
              </div>
            )}

            <button
              onClick={exportData}
              disabled={totalSaved === 0}
              style={{ width: '100%', padding: '13px', borderRadius: '14px', border: 'none', background: totalSaved > 0 ? '#487A7B' : '#C5D3D3', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 400, cursor: totalSaved > 0 ? 'pointer' : 'not-allowed', marginBottom: '8px', transition: 'all 0.2s' }}>
              ⬇ Export gesture_training_data.json
            </button>

            <button
              onClick={clearData}
              style={{ width: '100%', padding: '11px', borderRadius: '14px', border: '1.5px solid rgba(212,165,165,0.35)', background: 'transparent', color: '#8B5E5E', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
              Clear all samples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}