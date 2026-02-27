// src/components/GestureRecognizer.jsx
import { useEffect, useRef, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { useGestureModel } from '../hooks/useGestureModel';

const CONFIDENCE_THRESHOLD = 0.85;

const GESTURE_META = {
  OPEN_PALM: { emoji: '✋', color: '#487A7B', label: 'Open Palm'  },
  NONE:      { emoji: '–',  color: '#B8C9C9', label: 'No Gesture' },
};

export default function GestureRecognizer() {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  const [ready,      setReady]      = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [noHand,     setNoHand]     = useState(false);

  const { modelReady, predict } = useGestureModel();

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
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

      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      if (results.multiHandLandmarks?.length) {
        setNoHand(false);
        const lm = results.multiHandLandmarks[0];

        const mirroredLm = lm.map(p => ({ ...p, x: 1 - p.x }));
        drawConnectors(ctx, mirroredLm, HAND_CONNECTIONS, { color: '#487A7B', lineWidth: 2 });
        drawLandmarks(ctx, mirroredLm,  { color: '#D4A5A5', lineWidth: 1, radius: 4 });

        if (modelReady) {
          const result = predict(lm);
          setPrediction(result);
        }
      } else {
        setNoHand(true);
        setPrediction(null);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => { await hands.send({ image: videoRef.current }); },
      width: 640, height: 480,
    });

    camera.start().then(() => setReady(true));

    return () => camera.stop();
  }, [modelReady]);

  const meta      = prediction ? (GESTURE_META[prediction.label] ?? GESTURE_META.NONE) : null;
  const isLoading = !ready || !modelReady;
  const highConf  = prediction && prediction.confidence >= CONFIDENCE_THRESHOLD;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F3EE' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans  { font-family: 'DM Sans', sans-serif; }
        @keyframes spin   { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pulse  { 0%,100% { transform: scale(1) } 50% { transform: scale(1.06) } }
      `}</style>

      <div style={{ background: '#fff', borderBottom: '1px solid rgba(212,165,165,0.25)', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>🤚</span>
        <h1 className="serif" style={{ color: '#487A7B', fontSize: '22px', fontWeight: 400, margin: 0 }}>Gesture Recognizer</h1>
        <span className="sans" style={{
          fontSize: '11px',
          background: modelReady ? '#9CAF88' : '#D4A5A5',
          color: '#fff', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.05em',
          transition: 'background 0.4s',
        }}>
          {modelReady ? 'MODEL READY' : 'LOADING MODEL…'}
        </span>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>

        <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', background: '#111', width: '100%', aspectRatio: '4/3' }}>
          <video ref={videoRef} style={{ display: 'none' }} playsInline />
          <canvas ref={canvasRef} width={640} height={480} style={{ width: '100%', height: '100%', display: 'block' }} />

          {isLoading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', background: 'rgba(0,0,0,0.75)' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.15)', borderTop: '3px solid #D4A5A5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p className="sans" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                {!ready ? 'Starting camera…' : 'Loading model…'}
              </p>
            </div>
          )}

          {ready && modelReady && noHand && (
            <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', padding: '8px 20px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
              <span className="sans" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>✋ Show your hand to the camera</span>
            </div>
          )}

          {prediction && (
            <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.6)', borderRadius: '14px', padding: '12px 16px', minWidth: '160px', animation: 'fadeIn 0.2s ease' }}>
              {Object.entries(prediction.scores).map(([lbl, score]) => (
                <div key={lbl} style={{ marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span className="sans" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{lbl}</span>
                    <span className="sans" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{(score * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ height: '100%', borderRadius: '2px', width: `${score * 100}%`, background: lbl === prediction.label ? '#D4A5A5' : 'rgba(255,255,255,0.25)', transition: 'width 0.15s' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          width: '100%', background: '#fff', borderRadius: '24px', padding: '32px',
          border: `2px solid ${meta ? meta.color + '55' : 'rgba(212,165,165,0.15)'}`,
          textAlign: 'center', transition: 'border-color 0.3s',
          animation: prediction ? 'fadeIn 0.2s ease' : 'none',
        }}>
          {prediction && meta ? (
            <>
              <div style={{ fontSize: '72px', lineHeight: 1, marginBottom: '12px', animation: highConf ? 'pulse 0.4s ease' : 'none' }}>
                {meta.emoji}
              </div>
              <h2 className="serif" style={{ fontSize: '36px', fontWeight: 300, color: meta.color, margin: '0 0 8px' }}>
                {meta.label}
              </h2>
              <p className="sans" style={{ fontSize: '13px', color: highConf ? '#9CAF88' : '#D4A5A5', fontWeight: 400 }}>
                {highConf ? `${(prediction.confidence * 100).toFixed(1)}% confidence` : `Low confidence — ${(prediction.confidence * 100).toFixed(1)}%`}
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '48px', lineHeight: 1, marginBottom: '12px', opacity: 0.3 }}>🤚</div>
              <h2 className="serif" style={{ fontSize: '28px', fontWeight: 300, color: '#B8C9C9', margin: '0 0 8px' }}>
                Waiting for gesture…
              </h2>
              <p className="sans" style={{ fontSize: '13px', color: '#C5D3D3', fontWeight: 300 }}>
                {isLoading ? 'Loading camera and model…' : 'Hold up your hand'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}