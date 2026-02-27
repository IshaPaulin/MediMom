import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CameraComponent from '../components/Camera';
import { FaSignOutAlt, FaBaby, FaHeart, FaHandPaper } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [lastGesture, setLastGesture] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState('gesture');

  const handleGesture = (gesture) => {
    setLastGesture(gesture);
    if (navigator.vibrate) navigator.vibrate(50);
    switch(gesture) {
      case 'THUMBS_UP': addLog('Feeding'); break;
      case 'FIST': addLog('Baby Sleep'); break;
      case 'OPEN_PALM': setShowHelp(true); break;
      default: break;
    }
  };

  const addLog = (action) => {
    const newLog = { id: Date.now(), action, time: new Date().toLocaleTimeString() };
    setLogs(prev => [newLog, ...prev].slice(0, 10));
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F3EE' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans { font-family: 'DM Sans', system-ui, sans-serif; }
        
        .tab-btn {
          padding: 10px 24px;
          border-radius: 40px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }
        .tab-active { background-color: #487A7B; color: #F6F3EE; }
        .tab-inactive { background-color: #FFFFFF; color: #487A7B; border: 1px solid rgba(72,122,123,0.2); }
        .tab-inactive:hover { background-color: rgba(72,122,123,0.05); }
        
        .log-entry {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: #F6F3EE;
          border-radius: 14px;
          margin-bottom: 8px;
          transition: all 0.2s;
        }
        .log-entry:hover { background: #EDE9E3; }
        
        .quick-fab {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }
        .quick-fab:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }
        
        .gesture-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px;
          background: #F6F3EE;
          border-radius: 18px;
          flex: 1;
          transition: transform 0.2s;
        }
        .gesture-chip:hover { transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <header className="sans" style={{ background: '#FFFFFF', borderBottom: '1px solid rgba(212,165,165,0.25)', padding: '16px 32px', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <FaHeart style={{ color: '#D4A5A5', fontSize: '14px' }} />
              <span className="serif" style={{ fontSize: '20px', color: '#487A7B', fontWeight: 400 }}>MediMom</span>
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#487A7B', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              Hi, {currentUser?.name?.split(' ')[0] || 'Mama'} 👋
            </span>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '40px', border: '1.5px solid rgba(72,122,123,0.3)', background: 'transparent', color: '#487A7B', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', transition: 'all 0.2s' }}>
              <FaSignOutAlt style={{ fontSize: '12px' }} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 24px 120px' }}>

        {/* Baby Banner */}
        {currentUser?.babyName && (
          <div style={{ marginBottom: '28px', padding: '16px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #D4A5A5, #c89090)', color: '#F6F3EE', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaBaby style={{ fontSize: '22px' }} />
            <div className="sans">
              <span style={{ fontWeight: 500 }}>{currentUser.babyName}</span>
              {currentUser.babyAge && <span style={{ fontWeight: 300, fontSize: '14px' }}> · {currentUser.babyAge} old</span>}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'gesture', icon: <FaHandPaper style={{ fontSize: '13px' }} />, label: 'Gesture Logger' },
            { id: 'baby', icon: <FaBaby style={{ fontSize: '13px' }} />, label: 'Baby Tracker' },
            { id: 'mood', icon: <FaHeart style={{ fontSize: '13px' }} />, label: 'Mood' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '28px', padding: '40px', boxShadow: '0 4px 40px rgba(72,122,123,0.08)', border: '1px solid rgba(212,165,165,0.1)' }}>

          {activeTab === 'gesture' && (
            <div>
              <h2 className="serif" style={{ fontSize: '36px', fontWeight: 300, color: '#487A7B', marginBottom: '8px' }}>Hands-Free Logger</h2>
              <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', fontWeight: 300, marginBottom: '32px' }}>Show a gesture to log an action</p>

              {/* Gesture Guide */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                {[
                  { emoji: '👍', label: 'Feeding', sub: 'Thumbs up' },
                  { emoji: '✊', label: 'Sleep', sub: 'Fist' },
                  { emoji: '✋', label: 'Emergency', sub: 'Open palm' },
                ].map((g, i) => (
                  <div key={i} className="gesture-chip">
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{g.emoji}</div>
                    <div className="sans" style={{ color: '#487A7B', fontSize: '14px', fontWeight: 500 }}>{g.label}</div>
                    <div className="sans" style={{ color: '#B8C9C9', fontSize: '12px', fontWeight: 300, marginTop: '2px' }}>{g.sub}</div>
                  </div>
                ))}
              </div>

              {/* Camera */}
              <div style={{ marginBottom: '24px' }}>
                <CameraComponent onGestureDetected={handleGesture} />
              </div>

              {/* Last Gesture */}
              {lastGesture && (
                <div style={{ marginBottom: '24px', padding: '14px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(212,165,165,0.2), rgba(212,165,165,0.1))', border: '1px solid rgba(212,165,165,0.3)', textAlign: 'center', color: '#487A7B', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
                  ✓ Detected: <strong>{lastGesture === 'THUMBS_UP' ? '👍 Feeding' : lastGesture === 'FIST' ? '✊ Baby Sleep' : '✋ Help'}</strong>
                </div>
              )}

              {/* Logs */}
              <div>
                <h3 className="sans" style={{ color: '#487A7B', fontSize: '13px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>Recent Activity</h3>
                {logs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#C5D3D3', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 300 }}>
                    No logs yet — show a gesture to begin ✨
                  </div>
                ) : (
                  <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                    {logs.map(log => (
                      <div key={log.id} className="log-entry">
                        <span className="sans" style={{ color: '#487A7B', fontSize: '15px' }}>
                          {log.action === 'Feeding' ? '🍼' : '😴'} {log.action}
                        </span>
                        <span className="sans" style={{ color: '#B8C9C9', fontSize: '13px', fontWeight: 300 }}>{log.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'baby' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>👶</div>
              <h3 className="serif" style={{ fontSize: '28px', fontWeight: 300, color: '#487A7B', marginBottom: '8px' }}>Baby Tracker</h3>
              <p className="sans" style={{ color: '#9CAF88', fontSize: '15px', fontWeight: 300 }}>Coming soon — track feeds, sleep, and diapers</p>
            </div>
          )}

          {activeTab === 'mood' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>💙</div>
              <h3 className="serif" style={{ fontSize: '28px', fontWeight: 300, color: '#487A7B', marginBottom: '8px' }}>Mood Tracker</h3>
              <p className="sans" style={{ color: '#9CAF88', fontSize: '15px', fontWeight: 300 }}>Coming soon — check in daily and track your wellbeing</p>
            </div>
          )}
        </div>
      </main>

      {/* Quick Action FABs */}
      <div style={{ position: 'fixed', bottom: '28px', right: '28px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 40 }}>
        <button onClick={() => addLog('Feeding')} className="quick-fab" style={{ background: '#487A7B', color: '#F6F3EE' }} title="Log Feeding">🍼</button>
        <button onClick={() => addLog('Baby Sleep')} className="quick-fab" style={{ background: '#9CAF88', color: '#F6F3EE' }} title="Log Sleep">😴</button>
        <button onClick={() => setShowHelp(true)} className="quick-fab" style={{ background: '#D4A5A5', color: '#F6F3EE' }} title="Emergency Help">🆘</button>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(72,90,90,0.4)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', borderRadius: '28px', padding: '40px', maxWidth: '440px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}>
            <h2 className="serif" style={{ fontSize: '32px', fontWeight: 300, color: '#487A7B', marginBottom: '8px' }}>🆘 Quick Help</h2>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', fontWeight: 300, marginBottom: '28px' }}>Important information when you need it fast</p>
            
            {[
              { title: 'Fever Threshold', content: <p className="sans" style={{ color: '#8BA8A9', fontSize: '14px', fontWeight: 300 }}>Baby: 100.4°F (38°C) or higher — contact your pediatrician</p> },
              { title: 'When to go to hospital', content: (
                <ul style={{ color: '#8BA8A9', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 300, paddingLeft: '20px', margin: 0, lineHeight: 2 }}>
                  <li>Difficulty breathing</li>
                  <li>Persistent vomiting</li>
                  <li>Unusual drowsiness</li>
                  <li>Not feeding</li>
                </ul>
              )},
              { title: 'Emergency Contacts', content: (
                <div className="sans" style={{ color: '#8BA8A9', fontSize: '14px', fontWeight: 300, lineHeight: 1.75 }}>
                  <p>Kerala Helpline: <strong style={{ color: '#487A7B' }}>0471-2552056</strong></p>
                  <p>Ambulance: <strong style={{ color: '#487A7B' }}>108</strong></p>
                </div>
              )},
            ].map((item, i) => (
              <div key={i} style={{ padding: '18px 20px', borderRadius: '16px', background: '#F6F3EE', marginBottom: '12px' }}>
                <h3 className="sans" style={{ color: '#487A7B', fontSize: '13px', fontWeight: 500, marginBottom: '10px', letterSpacing: '0.04em' }}>{item.title}</h3>
                {item.content}
              </div>
            ))}
            
            <button onClick={() => setShowHelp(false)} style={{ width: '100%', marginTop: '20px', padding: '14px', borderRadius: '14px', background: '#487A7B', color: '#F6F3EE', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 400, transition: 'all 0.2s' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;