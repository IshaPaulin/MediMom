// src/hooks/useGestureModel.js
import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

export function useGestureModel() {
  const modelRef  = useRef(null);
  const labelsRef = useRef([]);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Load label order saved during training
        const res    = await fetch('/gesture_model/labels.json');
        const labels = await res.json();
        labelsRef.current = labels;
        console.log('Labels loaded:', labels);

        // Load the TF.js model
        const model = await tf.loadLayersModel('/gesture_model/model.json');
        modelRef.current = model;

        // Warm up the model with a dummy prediction
        const dummy = tf.zeros([1, 63]);
        model.predict(dummy).dispose();
        dummy.dispose();

        setModelReady(true);
        console.log('✅ Gesture model ready');
      } catch (err) {
        console.error('❌ Failed to load gesture model:', err);
      }
    }
    load();
  }, []);

  // ── Normalize landmarks — must match GestureCollector exactly ──
  const normalize = (landmarks) => {
    const pts     = landmarks.map(p => [p.x, p.y, p.z]);
    const [wx, wy, wz] = pts[0];
    const shifted = pts.map(([x, y, z]) => [x - wx, y - wy, z - wz]);
    const dists   = shifted.map(([x, y, z]) => Math.sqrt(x*x + y*y + z*z));
    const scale   = Math.max(...dists) || 1;
    return shifted.flatMap(([x, y, z]) => [x / scale, y / scale, z / scale]);
  };

  // ── Predict gesture from raw MediaPipe landmarks ──
  // Returns { label, confidence, scores } or null
  const predict = (landmarks) => {
    if (!modelRef.current || !landmarks) return null;

    const features = normalize(landmarks);
    if (features.length !== 63) return null;

    const input  = tf.tensor2d([features]);          // shape [1, 63]
    const output = modelRef.current.predict(input);
    const scores = Array.from(output.dataSync());
    input.dispose();
    output.dispose();

    const maxIdx    = scores.indexOf(Math.max(...scores));
    const label     = labelsRef.current[maxIdx] ?? 'UNKNOWN';
    const confidence = scores[maxIdx];

    return {
      label,
      confidence,
      // e.g. { THUMBS_UP: 0.95, FIST: 0.02, ... }
      scores: Object.fromEntries(labelsRef.current.map((l, i) => [l, scores[i]])),
    };
  };

  return { modelReady, predict };
}