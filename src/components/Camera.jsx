import { useEffect, useRef } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

const CameraComponent = ({ onGestureDetected }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize MediaPipe Hands
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // This function will be called when hands are detected
    hands.onResults(onResults);

    // Initialize camera
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480
    });

    camera.start();

    // Cleanup function
    return () => {
      camera.stop();
    };
  }, []);

  // Function to detect gestures from hand landmarks
  const onResults = (results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const gesture = detectGesture(landmarks);
    
    if (gesture) {
      onGestureDetected(gesture);
    }
  };

  // Simple gesture detection based on finger states
  const detectGesture = (landmarks) => {
    // Get finger tips and base points
    const thumbTip = landmarks[4];
    const thumbBase = landmarks[2];
    const indexTip = landmarks[8];
    const indexBase = landmarks[5];
    const middleTip = landmarks[12];
    const middleBase = landmarks[9];
    const ringTip = landmarks[16];
    const ringBase = landmarks[13];
    const pinkyTip = landmarks[20];
    const pinkyBase = landmarks[17];

    // Check if fingers are extended
    const thumbExtended = thumbTip.x > thumbBase.x; // For right hand
    const indexExtended = indexTip.y < indexBase.y;
    const middleExtended = middleTip.y < middleBase.y;
    const ringExtended = ringTip.y < ringBase.y;
    const pinkyExtended = pinkyTip.y < pinkyBase.y;

    // Count extended fingers
    const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

    // Thumbs Up: thumb extended, all other fingers folded
    if (thumbExtended && extendedCount === 0) {
      return 'THUMBS_UP';
    }
    
    // Fist: no fingers extended
    if (!thumbExtended && extendedCount === 0) {
      return 'FIST';
    }
    
    // Open Palm: all fingers extended
    if (thumbExtended && extendedCount === 4) {
      return 'OPEN_PALM';
    }

    return null;
  };

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-xl border-2 border-pink-300">
      <video
        ref={videoRef}
        className="w-full h-auto transform scale-x-[-1]" // Mirror effect
        style={{ transform: 'scaleX(-1)' }}
      />
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <p className="text-xs text-white bg-black bg-opacity-50 py-1 px-2 rounded-full inline-block">
          Show gesture to camera
        </p>
      </div>
    </div>
  );
};

export default CameraComponent;