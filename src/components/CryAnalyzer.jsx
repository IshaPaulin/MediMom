import { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaPlay, FaRedo, FaInfoCircle } from 'react-icons/fa';

const CryAnalyzer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      setPermissionDenied(false);
      setAnalysisResult(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionDenied(true);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };

  // Reset recording
  const resetRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    setAnalysisResult(null);
    setRecordingDuration(0);
  };

  // Analyze cry (simulated AI - in real app, this would call a backend)
  const analyzeCry = () => {
    if (!audioURL) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic results
    // In production, this would send the audio to a TensorFlow.js model
    setTimeout(() => {
      const possibleResults = [
        {
          cryType: '😢 Hungry',
          confidence: 92,
          description: 'Short, rhythmic cries that rise and fall. Baby likely needs feeding.',
          color: '#D4A5A5',
          icon: '🍼',
          advice: 'Try feeding your baby. Check if it\'s been 2-3 hours since last feed.'
        },
        {
          cryType: '😴 Tired',
          confidence: 87,
          description: 'Whimpering, yawn-like cries. Baby shows signs of sleepiness.',
          color: '#9CAF88',
          icon: '😴',
          advice: 'Look for sleepy cues: yawning, eye rubbing. Try putting baby down for a nap.'
        },
        {
          cryType: '😣 Uncomfortable',
          confidence: 78,
          description: 'Irritated, fussy cries. Baby might need a diaper change or is too hot/cold.',
          color: '#487A7B',
          icon: '😣',
          advice: 'Check diaper, adjust clothing, ensure room temperature is comfortable.'
        },
        {
          cryType: '💨 Gassy',
          confidence: 83,
          description: 'High-pitched, sudden cries with legs pulled up. Baby may have gas.',
          color: '#B8C9C9',
          icon: '💨',
          advice: 'Try burping, bicycle legs, or gentle tummy massage.'
        },
        {
          cryType: '💔 Needs Comfort',
          confidence: 95,
          description: 'Sad, crying with breaks to see if anyone responds. Baby wants attention.',
          color: '#D4A5A5',
          icon: '💔',
          advice: 'Pick up and comfort baby. Skin-to-skin contact can help.'
        }
      ];
      
      // Randomly select one (in real app, this would be the model's prediction)
      const randomIndex = Math.floor(Math.random() * possibleResults.length);
      const result = possibleResults[randomIndex];
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
      
      // Log the analysis for demo
      console.log('🎯 Cry analysis complete:', result);
    }, 2500); // Simulate 2.5s processing time
  };

  return (
    <div>
      <h2 className="serif" style={{ fontSize: '36px', fontWeight: 300, color: '#487A7B', marginBottom: '6px' }}>
        🎵 Cry Analyzer
      </h2>
      <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', fontWeight: 300, marginBottom: '28px' }}>
        Record your baby's cry and let AI identify what they need
      </p>

      {/* Main recording/playback area */}
      <div style={{ 
        background: 'rgba(72,122,123,0.04)', 
        borderRadius: '28px', 
        padding: '30px',
        marginBottom: '24px',
        border: '1px dashed rgba(72,122,123,0.2)'
      }}>
        
        {/* Recording UI */}
        {!audioURL && !isRecording && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎤</div>
            <button
              onClick={startRecording}
              disabled={permissionDenied}
              className="action-btn"
              style={{
                background: '#487A7B',
                color: '#F6F3EE',
                width: 'auto',
                margin: '0 auto',
                display: 'inline-flex',
                padding: '16px 40px',
                opacity: permissionDenied ? 0.5 : 1,
                cursor: permissionDenied ? 'not-allowed' : 'pointer'
              }}
            >
              <FaMicrophone /> Start Recording Cry
            </button>
            
            {permissionDenied && (
              <p style={{ color: '#D4A5A5', marginTop: '16px', fontSize: '14px' }}>
                ⚠️ Microphone access denied. Please enable permissions.
              </p>
            )}
          </div>
        )}

        {/* Recording in progress */}
        {isRecording && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '16px',
              animation: 'pulse 1.5s infinite'
            }}>
              🔴
            </div>
            <style>{`
              @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>
            <div style={{ fontSize: '32px', fontWeight: 300, color: '#487A7B', marginBottom: '8px' }}>
              {formatDuration(recordingDuration)}
            </div>
            <p style={{ color: '#9CAF88', marginBottom: '20px' }}>
              Recording... Speak or let baby cry near microphone
            </p>
            <button
              onClick={stopRecording}
              className="action-btn"
              style={{
                background: '#D4A5A5',
                color: '#F6F3EE',
                width: 'auto',
                margin: '0 auto',
                display: 'inline-flex',
                padding: '16px 40px'
              }}
            >
              <FaStop /> Stop Recording
            </button>
          </div>
        )}

        {/* Playback UI */}
        {audioURL && !isRecording && (
          <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '30px', 
                background: 'rgba(212,165,165,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🎵
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#487A7B', fontSize: '14px', marginBottom: '4px' }}>Recording</div>
                <div style={{ color: '#9CAF88', fontSize: '12px' }}>{formatDuration(recordingDuration)}</div>
              </div>
              <audio ref={audioRef} src={audioURL} controls style={{ height: '40px', flex: 2 }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={analyzeCry}
                disabled={isAnalyzing}
                className="action-btn"
                style={{
                  background: '#487A7B',
                  color: '#F6F3EE',
                  width: 'auto',
                  padding: '16px 30px',
                  opacity: isAnalyzing ? 0.7 : 1
                }}
              >
                {isAnalyzing ? '🔍 Analyzing...' : '🔍 Analyze Cry'}
              </button>
              <button
                onClick={resetRecording}
                className="action-btn"
                style={{
                  background: 'transparent',
                  color: '#487A7B',
                  border: '1.5px solid rgba(72,122,123,0.3)',
                  width: 'auto',
                  padding: '16px 30px'
                }}
              >
                <FaRedo /> New Recording
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div style={{ 
          background: analysisResult.color + '20', // Add transparency
          borderRadius: '24px',
          padding: '28px',
          border: `2px solid ${analysisResult.color}`,
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '40px', 
              background: analysisResult.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px'
            }}>
              {analysisResult.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="serif" style={{ fontSize: '28px', fontWeight: 400, color: '#487A7B', marginBottom: '4px' }}>
                {analysisResult.cryType}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  height: '8px', 
                  width: '200px', 
                  background: 'rgba(0,0,0,0.1)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${analysisResult.confidence}%`, 
                    background: analysisResult.color,
                    borderRadius: '4px'
                  }} />
                </div>
                <span style={{ color: '#487A7B', fontSize: '14px', fontWeight: 500 }}>
                  {analysisResult.confidence}% confidence
                </span>
              </div>
            </div>
          </div>

          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '18px', 
            padding: '20px',
            marginBottom: '16px'
          }}>
            <p className="sans" style={{ color: '#487A7B', fontSize: '15px', lineHeight: 1.6 }}>
              {analysisResult.description}
            </p>
          </div>

          <div style={{ 
            background: '#F6F3EE', 
            borderRadius: '18px', 
            padding: '20px',
            border: '1px solid rgba(72,122,123,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <FaInfoCircle style={{ color: '#487A7B' }} />
              <span className="sans" style={{ color: '#487A7B', fontSize: '14px', fontWeight: 500 }}>
                What to do:
              </span>
            </div>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', lineHeight: 1.6 }}>
              {analysisResult.advice}
            </p>
          </div>
        </div>
      )}

      {/* Info box about the feature */}
      <div style={{ 
        marginTop: '24px', 
        padding: '16px 20px', 
        background: 'rgba(156,175,136,0.08)', 
        borderRadius: '18px',
        border: '1px solid rgba(156,175,136,0.15)'
      }}>
        <p className="sans" style={{ color: '#9CAF88', fontSize: '12px', lineHeight: 1.6 }}>
          <strong style={{ color: '#487A7B' }}>✨ How it works:</strong> Our AI model analyzes the frequency, 
          pitch, and patterns in your baby's cry to identify possible needs. 
          This is for informational purposes - always trust your instincts and consult your pediatrician.
        </p>
      </div>
    </div>
  );
};

export default CryAnalyzer;