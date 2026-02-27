import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CameraComponent from '../components/Camera';
import { FaSignOutAlt, FaHome, FaBaby, FaHeart, FaHandPaper } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [lastGesture, setLastGesture] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState('gesture');

  const handleGesture = (gesture) => {
    setLastGesture(gesture);
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

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
    setLogs([newLog, ...logs].slice(0, 10));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeHelp = () => {
    setShowHelp(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F3EE' }}>
      {/* Header */}
      <header className="py-4 px-6" style={{ backgroundColor: '#FFFFFF', borderBottom: '2px solid #D4A5A5' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <FaHeart style={{ color: '#D4A5A5' }} />
              <span className="text-xl font-light" style={{ color: '#487A7B' }}>MediMom</span>
            </Link>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#9CAF88', color: '#F6F3EE' }}>
              2.1
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span style={{ color: '#487A7B' }}>
              Hi, {currentUser?.name?.split(' ')[0] || 'Mama'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-full transition"
              style={{ color: '#487A7B', border: '2px solid #487A7B' }}
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Baby Info Banner */}
        {currentUser?.babyName && (
          <div className="mb-6 p-4 rounded-xl flex items-center space-x-3" style={{ backgroundColor: '#D4A5A5', color: '#F6F3EE' }}>
            <FaBaby className="text-2xl" />
            <div>
              <span className="font-medium">{currentUser.babyName}</span>
              {currentUser.babyAge && <span> • {currentUser.babyAge} old</span>}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('gesture')}
            className={`px-6 py-3 rounded-xl font-medium transition flex items-center space-x-2 ${
              activeTab === 'gesture' 
                ? 'text-white' 
                : 'text-gray-600'
            }`}
            style={{
              backgroundColor: activeTab === 'gesture' ? '#487A7B' : '#FFFFFF',
              color: activeTab === 'gesture' ? '#F6F3EE' : '#487A7B'
            }}
          >
            <FaHandPaper />
            <span>Gesture Logger</span>
          </button>
          
          <button
            onClick={() => setActiveTab('baby')}
            className={`px-6 py-3 rounded-xl font-medium transition flex items-center space-x-2 ${
              activeTab === 'baby' 
                ? 'text-white' 
                : 'text-gray-600'
            }`}
            style={{
              backgroundColor: activeTab === 'baby' ? '#487A7B' : '#FFFFFF',
              color: activeTab === 'baby' ? '#F6F3EE' : '#487A7B'
            }}
          >
            <FaBaby />
            <span>Baby Tracker</span>
          </button>
          
          <button
            onClick={() => setActiveTab('mood')}
            className={`px-6 py-3 rounded-xl font-medium transition flex items-center space-x-2 ${
              activeTab === 'mood' 
                ? 'text-white' 
                : 'text-gray-600'
            }`}
            style={{
              backgroundColor: activeTab === 'mood' ? '#487A7B' : '#FFFFFF',
              color: activeTab === 'mood' ? '#F6F3EE' : '#487A7B'
            }}
          >
            <FaHeart />
            <span>Mood</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
          {activeTab === 'gesture' && (
            <div>
              <h2 className="text-2xl font-light mb-6" style={{ color: '#487A7B' }}>
                Hands-Free Logger
              </h2>
              
              {/* Gesture Guide */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: '#F6F3EE' }}>
                  <div className="text-3xl mb-2">👍</div>
                  <div className="font-medium" style={{ color: '#487A7B' }}>Feeding</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: '#F6F3EE' }}>
                  <div className="text-3xl mb-2">✊</div>
                  <div className="font-medium" style={{ color: '#487A7B' }}>Sleep</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: '#F6F3EE' }}>
                  <div className="text-3xl mb-2">✋</div>
                  <div className="font-medium" style={{ color: '#487A7B' }}>Emergency</div>
                </div>
              </div>

              {/* Camera */}
              <div className="mb-6">
                <CameraComponent onGestureDetected={handleGesture} />
              </div>

              {/* Last Gesture */}
              {lastGesture && (
                <div className="mb-4 p-3 rounded-lg text-center" style={{ backgroundColor: '#D4A5A5', color: '#F6F3EE' }}>
                  Last detected: {
                    lastGesture === 'THUMBS_UP' ? '👍 Feeding' :
                    lastGesture === 'FIST' ? '✊ Baby Sleep' :
                    lastGesture === 'OPEN_PALM' ? '✋ Help' : lastGesture
                  }
                </div>
              )}

              {/* Recent Logs */}
              <h3 className="font-medium mb-3" style={{ color: '#487A7B' }}>Recent Activity</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-center py-4" style={{ color: '#9CAF88' }}>No logs yet. Show a gesture!</p>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: '#F6F3EE' }}>
                      <span className="font-medium" style={{ color: '#487A7B' }}>
                        {log.action === 'Feeding' ? '🍼' : '😴'} {log.action}
                      </span>
                      <span style={{ color: '#9CAF88' }}>{log.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'baby' && (
            <div className="text-center py-12">
              <FaBaby className="text-6xl mx-auto mb-4" style={{ color: '#9CAF88' }} />
              <h3 className="text-xl font-light mb-2" style={{ color: '#487A7B' }}>Baby Tracker</h3>
              <p style={{ color: '#9CAF88' }}>Coming soon! Track feeds, sleep, and diapers.</p>
            </div>
          )}

          {activeTab === 'mood' && (
            <div className="text-center py-12">
              <FaHeart className="text-6xl mx-auto mb-4" style={{ color: '#D4A5A5' }} />
              <h3 className="text-xl font-light mb-2" style={{ color: '#487A7B' }}>Mood Tracker</h3>
              <p style={{ color: '#9CAF88' }}>Coming soon! Check in daily and track your wellbeing.</p>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
          <button
            onClick={() => addLog('Feeding')}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition transform hover:scale-110"
            style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}
            title="Log Feeding"
          >
            🍼
          </button>
          <button
            onClick={() => addLog('Baby Sleep')}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition transform hover:scale-110"
            style={{ backgroundColor: '#9CAF88', color: '#F6F3EE' }}
            title="Log Sleep"
          >
            😴
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition transform hover:scale-110"
            style={{ backgroundColor: '#D4A5A5', color: '#487A7B' }}
            title="Emergency Help"
          >
            🆘
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl p-6 max-w-md w-full" style={{ backgroundColor: '#FFFFFF' }}>
            <h2 className="text-2xl font-light mb-4" style={{ color: '#487A7B' }}>🆘 Quick Help</h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F6F3EE' }}>
                <h3 className="font-medium mb-2" style={{ color: '#487A7B' }}>Fever Threshold</h3>
                <p style={{ color: '#9CAF88' }}>Baby: 100.4°F (38°C) or higher</p>
              </div>
              
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F6F3EE' }}>
                <h3 className="font-medium mb-2" style={{ color: '#487A7B' }}>When to go to hospital</h3>
                <ul className="list-disc list-inside" style={{ color: '#9CAF88' }}>
                  <li>Difficulty breathing</li>
                  <li>Persistent vomiting</li>
                  <li>Unusual drowsiness</li>
                  <li>Not feeding</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F6F3EE' }}>
                <h3 className="font-medium mb-2" style={{ color: '#487A7B' }}>Emergency Contacts</h3>
                <p style={{ color: '#9CAF88' }}>Kerala Helpline: 0471-2552056</p>
                <p style={{ color: '#9CAF88' }}>Ambulance: 108</p>
              </div>
            </div>
            
            <button
              onClick={closeHelp}
              className="w-full mt-6 py-3 rounded-xl font-medium transition"
              style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;