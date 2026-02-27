import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CameraComponent from '../components/Camera';
import { FaSignOutAlt, FaBaby, FaHeart, FaHandPaper, FaPhone, FaSms, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [lastGesture, setLastGesture] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState('gesture');
  
  // Timer states
  const [feedingTimer, setFeedingTimer] = useState(null);
  const [feedingStartTime, setFeedingStartTime] = useState(null);
  const [feedingDuration, setFeedingDuration] = useState(0);
  const [feedingSide, setFeedingSide] = useState('left'); // left or right
  
  // Sleep tracking
  const [sleepTimer, setSleepTimer] = useState(null);
  const [sleepStartTime, setSleepStartTime] = useState(null);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [sleepPatterns, setSleepPatterns] = useState([]);
  
  // Emergency contact
  const [emergencyContact, setEmergencyContact] = useState('');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Load emergency contact from localStorage
  useEffect(() => {
    const savedContact = localStorage.getItem('emergencyContact');
    if (savedContact) {
      setEmergencyContact(savedContact);
    }
  }, []);

  // Timer effect for feeding - cleanup
  useEffect(() => {
    return () => {
      if (feedingTimer) {
        clearInterval(feedingTimer);
      }
    };
  }, [feedingTimer]);

  // Timer effect for sleep - cleanup
  useEffect(() => {
    return () => {
      if (sleepTimer) {
        clearInterval(sleepTimer);
      }
    };
  }, [sleepTimer]);

  const handleGesture = (gesture) => {
    setLastGesture(gesture);
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    switch(gesture) {
      case 'THUMBS_UP':
        handleFeedingGesture();
        break;
      case 'FIST':
        handleSleepGesture();
        break;
      case 'OPEN_PALM':
        setShowHelp(true);
        break;
      default:
        break;
    }
  };

  // 🍼 FIXED FEEDING FUNCTION - Toggle Start/Stop
  const handleFeedingGesture = () => {
    if (feedingTimer) {
      // STOP TIMER - Thumbs up detected while timer is running
      console.log('Stopping feeding timer');
      
      // Clear the interval
      clearInterval(feedingTimer);
      setFeedingTimer(null);
      
      const duration = feedingDuration;
      const side = feedingSide;
      
      // Log feeding with duration and side
      addLog(`🍼 Feeding complete - ${side} side - ${formatTime(duration)}`);
      
      // Show reminder to switch sides for next feed
      if (side === 'left') {
        setFeedingSide('right');
        addLog('💡 Next time feed on right side', 'tip');
      } else {
        setFeedingSide('left');
        addLog('💡 Next time feed on left side', 'tip');
      }
      
      // Store feeding data for patterns
      const feedingData = {
        id: Date.now(),
        type: 'feeding',
        duration: duration,
        side: side,
        time: new Date().toLocaleTimeString()
      };
      
      const savedFeedings = JSON.parse(localStorage.getItem('feedingHistory') || '[]');
      localStorage.setItem('feedingHistory', JSON.stringify([...savedFeedings, feedingData]));
      
      setFeedingDuration(0);
      setFeedingStartTime(null);
      
      // Haptic feedback for stop
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]); // pattern for stop
      }
      
    } else {
      // START TIMER - Thumbs up detected while no timer running
      console.log('Starting feeding timer');
      
      setFeedingStartTime(new Date());
      
      // Create a new interval
      const interval = setInterval(() => {
        setFeedingDuration(prev => prev + 1);
      }, 1000);
      
      setFeedingTimer(interval);
      
      addLog(`🍼 Started feeding on ${feedingSide} side`, 'feeding-start');
      
      // Haptic feedback for start
      if (navigator.vibrate) {
        navigator.vibrate(100); // single buzz for start
      }
    }
  };

  // 😴 FIXED SLEEP FUNCTION - Toggle Start/Stop
  const handleSleepGesture = () => {
    if (sleepTimer) {
      // STOP TIMER - Fist detected while timer is running
      console.log('Stopping sleep timer');
      
      clearInterval(sleepTimer);
      setSleepTimer(null);
      
      const duration = sleepDuration;
      
      // Log sleep with duration
      addLog(`😴 Baby slept for ${formatTime(duration)}`, 'sleep-end');
      
      // Store sleep data for pattern prediction
      const sleepData = {
        id: Date.now(),
        duration: duration,
        time: new Date().toLocaleTimeString(),
        date: new Date().toDateString()
      };
      
      const savedSleeps = JSON.parse(localStorage.getItem('sleepHistory') || '[]');
      const updatedSleeps = [...savedSleeps, sleepData];
      localStorage.setItem('sleepHistory', JSON.stringify(updatedSleeps));
      
      // Predict next sleepy time
      predictNextSleepTime(updatedSleeps);
      
      setSleepDuration(0);
      setSleepStartTime(null);
      
    } else {
      // START TIMER - Fist detected while no timer running
      console.log('Starting sleep timer');
      
      setSleepStartTime(new Date());
      
      const interval = setInterval(() => {
        setSleepDuration(prev => prev + 1);
      }, 1000);
      
      setSleepTimer(interval);
      
      addLog('😴 Baby sleeping... Zzz', 'sleep-start');
    }
  };

  // 🕒 Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // 🔮 Predict next sleep time based on patterns
  const predictNextSleepTime = (history) => {
    if (history.length < 3) return;
    
    // Simple average of last 3 sleep intervals
    const last3 = history.slice(-3);
    const avgDuration = last3.reduce((acc, curr) => acc + curr.duration, 0) / 3;
    
    // Predict next sleep in 2-3 hours if avg duration > 1 hour
    if (avgDuration > 3600) { // more than 1 hour
      const nextSleep = new Date(Date.now() + 2.5 * 60 * 60 * 1000);
      addLog(`🔮 Next sleepy time predicted: ${nextSleep.toLocaleTimeString()}`, 'prediction');
    }
  };

  // 🆘 ENHANCED EMERGENCY FUNCTIONS
  const handleEmergencyCall = () => {
    const helplineNumber = '0471-2552056'; // Kerala helpline
    window.location.href = `tel:${helplineNumber}`;
  };

  const handleEmergencySMS = () => {
    const helplineNumber = '0471-2552056';
    const message = "URGENT: I need immediate assistance. Please call me back.";
    window.location.href = `sms:${helplineNumber}?body=${encodeURIComponent(message)}`;
  };

  const handleAmbulanceCall = () => {
    window.location.href = 'tel:108'; // Ambulance
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(mapsUrl);
        addLog('📍 Location copied to clipboard', 'tip');
        
        // If emergency contact set, could auto-send
        if (emergencyContact) {
          window.location.href = `sms:${emergencyContact}?body=${encodeURIComponent(`Emergency! My location: ${mapsUrl}`)}`;
        }
      });
    } else {
      addLog('❌ Geolocation not supported', 'error');
    }
  };

  const addLog = (action, type = 'normal') => {
    const newLog = {
      id: Date.now(),
      action: action,
      time: new Date().toLocaleTimeString(),
      type: type
    };
    setLogs([newLog, ...logs].slice(0, 15));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeHelp = () => {
    setShowHelp(false);
  };

  const openEmergencyModal = () => {
    setShowHelp(false);
    setShowEmergencyModal(true);
  };

  const saveEmergencyContact = (number) => {
    localStorage.setItem('emergencyContact', number);
    setEmergencyContact(number);
    setShowEmergencyModal(false);
    addLog('✅ Emergency contact saved', 'tip');
  };

  // Debug function (optional)
  const checkTimerState = () => {
    console.log('Feeding Timer:', feedingTimer ? 'Running' : 'Stopped');
    console.log('Sleep Timer:', sleepTimer ? 'Running' : 'Stopped');
    console.log('Feeding Duration:', feedingDuration);
    console.log('Sleep Duration:', sleepDuration);
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
              Hi, {currentUser?.email?.split('@')[0] || 'Mama'}
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
                Smart Gesture Logger
              </h2>
              
              {/* Active Timers Display */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {feedingTimer && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#D4A5A5', color: '#F6F3EE' }}>
                    <FaClock className="inline mr-2" />
                    <span className="font-medium">Feeding: {formatTime(feedingDuration)}</span>
                    <div className="text-sm mt-1">Side: {feedingSide}</div>
                  </div>
                )}
                {sleepTimer && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#9CAF88', color: '#F6F3EE' }}>
                    <FaClock className="inline mr-2" />
                    <span className="font-medium">Sleep: {formatTime(sleepDuration)}</span>
                  </div>
                )}
              </div>
              
              {/* Gesture Guide */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: '#F6F3EE' }}>
                  <div className="text-3xl mb-2">👍</div>
                  <div className="font-medium" style={{ color: '#487A7B' }}>Feeding Timer</div>
                  <div className="text-xs mt-1" style={{ color: '#9CAF88' }}>Tap to start/stop • Tracks duration</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: '#F6F3EE' }}>
                  <div className="text-3xl mb-2">✊</div>
                  <div className="font-medium" style={{ color: '#487A7B' }}>Sleep Timer</div>
                  <div className="text-xs mt-1" style={{ color: '#9CAF88' }}>Tracks sleep • Predicts next sleep</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: '#F6F3EE' }}>
                  <div className="text-3xl mb-2">✋</div>
                  <div className="font-medium" style={{ color: '#487A7B' }}>Emergency Help</div>
                  <div className="text-xs mt-1" style={{ color: '#9CAF88' }}>One-click call • SMS • Location</div>
                </div>
              </div>

              {/* Camera */}
              <div className="mb-6">
                <CameraComponent onGestureDetected={handleGesture} />
              </div>

              {/* Last Gesture */}
              {lastGesture && (
                <div className="mb-4 p-3 rounded-lg text-center" style={{ backgroundColor: '#D4A5A5', color: '#F6F3EE' }}>
                  Detected: {
                    lastGesture === 'THUMBS_UP' ? '👍 Feeding' + (feedingTimer ? ' (Stop)' : ' (Start)') :
                    lastGesture === 'FIST' ? '✊ Baby Sleep' + (sleepTimer ? ' (Stop)' : ' (Start)') :
                    lastGesture === 'OPEN_PALM' ? '✋ Emergency Help' : lastGesture
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
                    <div key={log.id} className="flex justify-between items-center p-3 rounded-lg" 
                         style={{ backgroundColor: log.type === 'tip' ? '#D4A5A5' : log.type === 'prediction' ? '#9CAF88' : '#F6F3EE' }}>
                      <span className="font-medium" style={{ color: '#487A7B' }}>
                        {log.action}
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
            onClick={handleFeedingGesture}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition transform hover:scale-110"
            style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}
            title="Toggle Feeding Timer"
          >
            {feedingTimer ? '⏹️' : '🍼'}
          </button>
          <button
            onClick={handleSleepGesture}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition transform hover:scale-110"
            style={{ backgroundColor: '#9CAF88', color: '#F6F3EE' }}
            title="Toggle Sleep Timer"
          >
            {sleepTimer ? '⏹️' : '😴'}
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

        {/* Hidden debug button - remove in production */}
        <button onClick={checkTimerState} className="hidden">Debug</button>
      </div>

      {/* Enhanced Help Modal with One-Click Actions */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl p-6 max-w-md w-full" style={{ backgroundColor: '#FFFFFF' }}>
            <h2 className="text-2xl font-light mb-4" style={{ color: '#487A7B' }}>🆘 Emergency Help</h2>
            
            <div className="space-y-4">
              {/* One-Click Call Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleEmergencyCall}
                  className="p-4 rounded-xl flex flex-col items-center gap-2 transition hover:scale-105"
                  style={{ backgroundColor: '#D4A5A5' }}
                >
                  <FaPhone className="text-2xl" style={{ color: '#F6F3EE' }} />
                  <span style={{ color: '#F6F3EE' }}>Call Helpline</span>
                  <span className="text-xs" style={{ color: '#F6F3EE' }}>0471-2552056</span>
                </button>
                
                <button
                  onClick={handleAmbulanceCall}
                  className="p-4 rounded-xl flex flex-col items-center gap-2 transition hover:scale-105"
                  style={{ backgroundColor: '#487A7B' }}
                >
                  <FaPhone className="text-2xl" style={{ color: '#F6F3EE' }} />
                  <span style={{ color: '#F6F3EE' }}>Call Ambulance</span>
                  <span className="text-xs" style={{ color: '#F6F3EE' }}>108</span>
                </button>
              </div>

              {/* SMS and Location */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleEmergencySMS}
                  className="p-4 rounded-xl flex flex-col items-center gap-2 transition hover:scale-105"
                  style={{ backgroundColor: '#9CAF88' }}
                >
                  <FaSms className="text-2xl" style={{ color: '#F6F3EE' }} />
                  <span style={{ color: '#F6F3EE' }}>Send SMS</span>
                  <span className="text-xs" style={{ color: '#F6F3EE' }}>To helpline</span>
                </button>
                
                <button
                  onClick={shareLocation}
                  className="p-4 rounded-xl flex flex-col items-center gap-2 transition hover:scale-105"
                  style={{ backgroundColor: '#487A7B' }}
                >
                  <FaMapMarkerAlt className="text-2xl" style={{ color: '#F6F3EE' }} />
                  <span style={{ color: '#F6F3EE' }}>Share Location</span>
                  <span className="text-xs" style={{ color: '#F6F3EE' }}>Copy to clipboard</span>
                </button>
              </div>

              {/* Set Emergency Contact */}
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="w-full p-3 rounded-xl text-center transition"
                style={{ backgroundColor: '#F6F3EE', color: '#487A7B' }}
              >
                Set Emergency Contact
              </button>

              {/* Emergency Info */}
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

      {/* Emergency Contact Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl p-6 max-w-md w-full" style={{ backgroundColor: '#FFFFFF' }}>
            <h2 className="text-2xl font-light mb-4" style={{ color: '#487A7B' }}>Set Emergency Contact</h2>
            
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full p-3 rounded-xl border-2 mb-4"
              style={{ borderColor: '#9CAF88', backgroundColor: '#F6F3EE' }}
              id="emergencyNumber"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const number = document.getElementById('emergencyNumber').value;
                  if (number) saveEmergencyContact(number);
                }}
                className="flex-1 py-3 rounded-xl font-medium transition"
                style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}
              >
                Save
              </button>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 py-3 rounded-xl font-medium transition"
                style={{ backgroundColor: '#F6F3EE', color: '#487A7B' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;