import { useState } from 'react';
import CameraComponent from './components/Camera';

function App() {
  const [lastGesture, setLastGesture] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  const handleGesture = (gesture) => {
    setLastGesture(gesture);
    
    // Add haptic feedback if on mobile (optional)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Handle different gestures
    switch(gesture) {
      case 'THUMBS_UP':
        addLog('Feeding');
        break;
      case 'FIST':
        addLog('Baby Sleep');
        break;
      case 'OPEN_PALM':
        setShowHelp(true);
        break;
      default:
        break;
    }
  };

  const addLog = (action) => {
    const newLog = {
      id: Date.now(),
      action: action,
      time: new Date().toLocaleTimeString()
    };
    setLogs([newLog, ...logs].slice(0, 10)); // Keep last 10 logs
  };

  const closeHelp = () => {
    setShowHelp(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-pink-800 mb-2 text-center">
            MediMom 2.1
          </h1>
          <p className="text-gray-600 text-center mb-4">
            AI Companion for New Mothers
          </p>
          
          {/* Gesture Tips */}
          <div className="flex justify-around text-sm bg-pink-100 p-3 rounded-xl">
            <div className="text-center">
              <div className="text-2xl">👍</div>
              <div className="text-pink-800">Feeding</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">✊</div>
              <div className="text-pink-800">Sleep</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">✋</div>
              <div className="text-pink-800">Help</div>
            </div>
          </div>
        </div>

        {/* Camera Component */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-pink-800 mb-3">📸 Camera</h2>
          <CameraComponent onGestureDetected={handleGesture} />
          
          {/* Last Detected Gesture */}
          {lastGesture && (
            <div className="mt-3 p-2 bg-pink-100 rounded-lg text-center">
              <span className="text-pink-800 font-medium">
                Detected: {
                  lastGesture === 'THUMBS_UP' ? '👍 Thumbs Up' :
                  lastGesture === 'FIST' ? '✊ Fist' :
                  lastGesture === 'OPEN_PALM' ? '✋ Open Palm' : lastGesture
                }
              </span>
            </div>
          )}
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-pink-800 mb-3">📋 Recent Activity</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No logs yet. Show a gesture!</p>
          ) : (
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="font-medium">
                    {log.action === 'Feeding' ? '🍼' : log.action === 'Baby Sleep' ? '😴' : '❓'} {log.action}
                  </span>
                  <span className="text-sm text-gray-500">{log.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-pink-800 mb-4">🆘 Quick Help</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Fever Threshold</h3>
                  <p className="text-gray-700">Baby: 100.4°F (38°C) or higher</p>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">When to go to hospital</h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm">
                    <li>Difficulty breathing</li>
                    <li>Persistent vomiting</li>
                    <li>Unusual drowsiness</li>
                    <li>Not feeding</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-green-800">Lactation Tips</h3>
                  <p className="text-gray-700 text-sm">Drink water, rest, feed on demand</p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-red-800">Emergency Contacts</h3>
                  <p className="text-gray-700">Kerala Helpline: 0471-2552056</p>
                  <p className="text-gray-700">Ambulance: 108</p>
                </div>
              </div>
              
              <button
                onClick={closeHelp}
                className="mt-6 w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Manual Buttons (Fallback) */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-pink-800 mb-3">🖱️ Manual Log</h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => addLog('Feeding')}
              className="bg-pink-100 text-pink-800 py-3 rounded-xl font-medium hover:bg-pink-200 transition"
            >
              🍼 Feed
            </button>
            <button
              onClick={() => addLog('Baby Sleep')}
              className="bg-pink-100 text-pink-800 py-3 rounded-xl font-medium hover:bg-pink-200 transition"
            >
              😴 Sleep
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="bg-pink-100 text-pink-800 py-3 rounded-xl font-medium hover:bg-pink-200 transition"
            >
              🆘 Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;