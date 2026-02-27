import { useState, useEffect, useRef } from 'react';
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
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('gesture');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyInput, setEmergencyInput] = useState('');

  // ── Feeding timer ──────────────────────────────────────────────
  const [feedingActive, setFeedingActive] = useState(false);
  const [feedingDuration, setFeedingDuration] = useState(0);
  const [feedingSide, setFeedingSide] = useState('left');
  const feedingIntervalRef = useRef(null);

  // ── Sleep timer ────────────────────────────────────────────────
  const [sleepActive, setSleepActive] = useState(false);
  const [sleepDuration, setSleepDuration] = useState(0);
  const sleepIntervalRef = useRef(null);

  // Load emergency contact
  useEffect(() => {
    const saved = localStorage.getItem('emergencyContact');
    if (saved) setEmergencyContact(saved);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (feedingIntervalRef.current) clearInterval(feedingIntervalRef.current);
      if (sleepIntervalRef.current)   clearInterval(sleepIntervalRef.current);
    };
  }, []);

  // ── Helpers ────────────────────────────────────────────────────
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  };

  const addLog = (action, type = 'normal') => {
    const entry = { id: Date.now(), action, time: new Date().toLocaleTimeString(), type };
    setLogs(prev => [entry, ...prev].slice(0, 15));
  };

  // ── Feeding toggle (fixed with useRef) ────────────────────────
  const handleFeedingToggle = () => {
    if (feedingIntervalRef.current) {
      // STOP
      clearInterval(feedingIntervalRef.current);
      feedingIntervalRef.current = null;
      setFeedingActive(false);

      const duration = feedingDuration; // captured before reset
      const side = feedingSide;
      addLog(`🍼 Feeding done — ${side} side — ${formatTime(duration)}`);

      // Switch side reminder
      const nextSide = side === 'left' ? 'right' : 'left';
      setFeedingSide(nextSide);
      addLog(`💡 Next feed: ${nextSide} side`, 'tip');

      // Save to localStorage
      const history = JSON.parse(localStorage.getItem('feedingHistory') || '[]');
      localStorage.setItem('feedingHistory', JSON.stringify([
        ...history,
        { id: Date.now(), duration, side, time: new Date().toLocaleTimeString() }
      ]));

      setFeedingDuration(0);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else {
      // START
      feedingIntervalRef.current = setInterval(() => {
        setFeedingDuration(prev => prev + 1);
      }, 1000);
      setFeedingActive(true);
      addLog(`🍼 Feeding started — ${feedingSide} side`, 'feeding-start');
      if (navigator.vibrate) navigator.vibrate(100);
    }
  };

  // ── Sleep toggle (fixed with useRef) ──────────────────────────
  const handleSleepToggle = () => {
    if (sleepIntervalRef.current) {
      // STOP
      clearInterval(sleepIntervalRef.current);
      sleepIntervalRef.current = null;
      setSleepActive(false);

      const duration = sleepDuration;
      addLog(`😴 Baby slept for ${formatTime(duration)}`, 'sleep-end');

      const history = JSON.parse(localStorage.getItem('sleepHistory') || '[]');
      const updated = [...history, { id: Date.now(), duration, time: new Date().toLocaleTimeString() }];
      localStorage.setItem('sleepHistory', JSON.stringify(updated));

      // Predict next sleep
      if (updated.length >= 3) {
        const avg = updated.slice(-3).reduce((a, b) => a + b.duration, 0) / 3;
        if (avg > 3600) {
          const next = new Date(Date.now() + 2.5 * 60 * 60 * 1000);
          addLog(`🔮 Next sleepy time ~${next.toLocaleTimeString()}`, 'prediction');
        }
      }

      setSleepDuration(0);
    } else {
      // START
      sleepIntervalRef.current = setInterval(() => {
        setSleepDuration(prev => prev + 1);
      }, 1000);
      setSleepActive(true);
      addLog('😴 Baby sleeping… Zzz', 'sleep-start');
    }
  };

  // ── Gesture handler ───────────────────────────────────────────
  const handleGesture = (gesture) => {
    setLastGesture(gesture);
    if (navigator.vibrate) navigator.vibrate(50);
    switch (gesture) {
      case 'THUMBS_UP':  handleFeedingToggle(); break;
      case 'FIST':       handleSleepToggle();   break;
      case 'OPEN_PALM':  setShowHelp(true);      break;
      default: break;
    }
  };

  // ── Emergency helpers ─────────────────────────────────────────
  const handleEmergencyCall  = () => { window.location.href = 'tel:0471-2552056'; };
  const handleAmbulanceCall  = () => { window.location.href = 'tel:108'; };
  const handleEmergencySMS   = () => {
    window.location.href = `sms:0471-2552056?body=${encodeURIComponent('URGENT: I need immediate assistance. Please call me back.')}`;
  };
  const shareLocation = () => {
    if (!navigator.geolocation) { addLog('❌ Geolocation not supported', 'error'); return; }
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const url = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
      navigator.clipboard.writeText(url);
      addLog('📍 Location copied to clipboard', 'tip');
      if (emergencyContact) {
        window.location.href = `sms:${emergencyContact}?body=${encodeURIComponent(`Emergency! My location: ${url}`)}`;
      }
    });
  };

  const saveEmergencyContact = () => {
    if (!emergencyInput) return;
    localStorage.setItem('emergencyContact', emergencyInput);
    setEmergencyContact(emergencyInput);
    setShowEmergencyModal(false);
    addLog('✅ Emergency contact saved', 'tip');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // ── Log entry colour ──────────────────────────────────────────
  const logBg = (type) => {
    if (type === 'tip' || type === 'prediction') return 'rgba(156,175,136,0.12)';
    if (type === 'feeding-start' || type === 'sleep-start') return 'rgba(72,122,123,0.08)';
    return '#F6F3EE';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F3EE' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans  { font-family: 'DM Sans', system-ui, sans-serif; }

        .tab-btn { padding: 10px 24px; border-radius: 40px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; display: flex; align-items: center; gap: 8px; transition: all 0.25s; letter-spacing: 0.01em; white-space: nowrap; }
        .tab-active   { background-color: #487A7B; color: #F6F3EE; }
        .tab-inactive { background-color: #FFFFFF; color: #487A7B; border: 1px solid rgba(72,122,123,0.2); }
        .tab-inactive:hover { background-color: rgba(72,122,123,0.05); }

        .log-entry { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 12px; margin-bottom: 6px; }

        .quick-fab { width: 52px; height: 52px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); transition: all 0.2s ease; }
        .quick-fab:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(0,0,0,0.18); }

        .gesture-chip { display: flex; flex-direction: column; align-items: center; padding: 18px 12px; background: #F6F3EE; border-radius: 18px; flex: 1; transition: transform 0.2s; }
        .gesture-chip:hover { transform: translateY(-2px); }

        .timer-card { border-radius: 18px; padding: 16px 20px; display: flex; align-items: center; gap: 12px; }

        .emergency-btn { border-radius: 16px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 6px; border: none; cursor: pointer; transition: all 0.2s; flex: 1; }
        .emergency-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }

        .modal-input { width: 100%; padding: 13px 18px; border-radius: 14px; border: 1.5px solid rgba(156,175,136,0.4); background: #FAFAF8; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #487A7B; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .modal-input:focus { border-color: #487A7B; box-shadow: 0 0 0 4px rgba(72,122,123,0.08); }
        .modal-input::placeholder { color: #B8C9C9; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="sans" style={{ background: '#FFFFFF', borderBottom: '1px solid rgba(212,165,165,0.25)', padding: '16px 32px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <FaHeart style={{ color: '#D4A5A5', fontSize: '14px' }} />
            <span className="serif" style={{ fontSize: '20px', color: '#487A7B', fontWeight: 400 }}>MediMom</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="sans" style={{ color: '#487A7B', fontSize: '14px', fontWeight: 300 }}>
              Hi, {currentUser?.email?.split('@')[0] || 'Mama'} 👋
            </span>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '40px', border: '1.5px solid rgba(72,122,123,0.3)', background: 'transparent', color: '#487A7B', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', transition: 'all 0.2s' }}>
              <FaSignOutAlt style={{ fontSize: '12px' }} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 24px 120px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'gesture', icon: <FaHandPaper style={{ fontSize: '13px' }} />, label: 'Gesture Logger' },
            { id: 'baby',    icon: <FaBaby      style={{ fontSize: '13px' }} />, label: 'Baby Tracker'   },
            { id: 'mood',    icon: <FaHeart     style={{ fontSize: '13px' }} />, label: 'Mood'           },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '28px', padding: '40px', boxShadow: '0 4px 40px rgba(72,122,123,0.08)', border: '1px solid rgba(212,165,165,0.1)' }}>

          {/* ── Gesture Logger ──────────────────────────────────── */}
          {activeTab === 'gesture' && (
            <div>
              <h2 className="serif" style={{ fontSize: '36px', fontWeight: 300, color: '#487A7B', marginBottom: '6px' }}>Smart Gesture Logger</h2>
              <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', fontWeight: 300, marginBottom: '28px' }}>Show a gesture to start or stop a timer</p>

              {/* Active timers */}
              {(feedingActive || sleepActive) && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {feedingActive && (
                    <div className="timer-card" style={{ background: 'rgba(212,165,165,0.15)', border: '1px solid rgba(212,165,165,0.3)', flex: 1, minWidth: '180px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#D4A5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🍼</div>
                      <div>
                        <div className="sans" style={{ color: '#8B5E5E', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Feeding — {feedingSide} side</div>
                        <div className="serif" style={{ color: '#8B5E5E', fontSize: '22px', fontWeight: 400 }}>{formatTime(feedingDuration)}</div>
                      </div>
                    </div>
                  )}
                  {sleepActive && (
                    <div className="timer-card" style={{ background: 'rgba(156,175,136,0.15)', border: '1px solid rgba(156,175,136,0.3)', flex: 1, minWidth: '180px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#9CAF88', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>😴</div>
                      <div>
                        <div className="sans" style={{ color: '#4a6b3a', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Baby sleeping</div>
                        <div className="serif" style={{ color: '#4a6b3a', fontSize: '22px', fontWeight: 400 }}>{formatTime(sleepDuration)}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Gesture guide */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                {[
                  { emoji: '👍', label: 'Feeding', sub: feedingActive ? 'Tap to stop' : 'Tap to start', active: feedingActive },
                  { emoji: '✊', label: 'Sleep',   sub: sleepActive   ? 'Tap to stop' : 'Tap to start', active: sleepActive   },
                  { emoji: '✋', label: 'Help',    sub: 'Emergency',                                    active: false         },
                ].map((g, i) => (
                  <div key={i} className="gesture-chip" style={{ border: g.active ? '1.5px solid rgba(72,122,123,0.3)' : '1px solid transparent' }}>
                    <div style={{ fontSize: '30px', marginBottom: '8px' }}>{g.emoji}</div>
                    <div className="sans" style={{ color: '#487A7B', fontSize: '13px', fontWeight: 500 }}>{g.label}</div>
                    <div className="sans" style={{ color: g.active ? '#487A7B' : '#B8C9C9', fontSize: '11px', marginTop: '2px', fontWeight: g.active ? 500 : 300 }}>{g.sub}</div>
                  </div>
                ))}
              </div>

              {/* Camera */}
              <div style={{ marginBottom: '24px' }}>
                <CameraComponent onGestureDetected={handleGesture} />
              </div>

              {/* Last gesture detected */}
              {lastGesture && (
                <div style={{ marginBottom: '20px', padding: '12px 18px', borderRadius: '14px', background: 'rgba(212,165,165,0.12)', border: '1px solid rgba(212,165,165,0.25)', textAlign: 'center' }}>
                  <span className="sans" style={{ color: '#487A7B', fontSize: '14px' }}>
                    ✓ Detected: <strong>
                      {lastGesture === 'THUMBS_UP' ? `👍 Feeding ${feedingActive ? '— now running' : '— stopped'}` :
                       lastGesture === 'FIST'      ? `✊ Sleep ${sleepActive ? '— now running' : '— stopped'}` :
                       lastGesture === 'OPEN_PALM' ? '✋ Help' : lastGesture}
                    </strong>
                  </span>
                </div>
              )}

              {/* Logs */}
              <h3 className="sans" style={{ color: '#487A7B', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>Recent Activity</h3>
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px', color: '#C5D3D3', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 300 }}>
                  No logs yet — show a gesture to begin ✨
                </div>
              ) : (
                <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                  {logs.map(log => (
                    <div key={log.id} className="log-entry" style={{ background: logBg(log.type) }}>
                      <span className="sans" style={{ color: '#487A7B', fontSize: '14px' }}>{log.action}</span>
                      <span className="sans" style={{ color: '#B8C9C9', fontSize: '12px', fontWeight: 300, flexShrink: 0, marginLeft: '12px' }}>{log.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Baby Tracker ─────────────────────────────────────── */}
          {activeTab === 'baby' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>👶</div>
              <h3 className="serif" style={{ fontSize: '28px', fontWeight: 300, color: '#487A7B', marginBottom: '8px' }}>Baby Tracker</h3>
              <p className="sans" style={{ color: '#9CAF88', fontSize: '15px', fontWeight: 300 }}>Coming soon — track feeds, sleep, and diapers</p>
            </div>
          )}

          {/* ── Mood ─────────────────────────────────────────────── */}
          {activeTab === 'mood' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>💙</div>
              <h3 className="serif" style={{ fontSize: '28px', fontWeight: 300, color: '#487A7B', marginBottom: '8px' }}>Mood Tracker</h3>
              <p className="sans" style={{ color: '#9CAF88', fontSize: '15px', fontWeight: 300 }}>Coming soon — check in daily and track your wellbeing</p>
            </div>
          )}
        </div>
      </main>

      {/* ── FABs ─────────────────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: '28px', right: '28px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 40 }}>
        <button onClick={handleFeedingToggle} className="quick-fab" style={{ background: feedingActive ? '#c49090' : '#487A7B', color: '#F6F3EE' }} title={feedingActive ? 'Stop Feeding' : 'Start Feeding'}>
          {feedingActive ? '⏹' : '🍼'}
        </button>
        <button onClick={handleSleepToggle} className="quick-fab" style={{ background: sleepActive ? '#7a9668' : '#9CAF88', color: '#F6F3EE' }} title={sleepActive ? 'Stop Sleep' : 'Log Sleep'}>
          {sleepActive ? '⏹' : '😴'}
        </button>
        <button onClick={() => setShowHelp(true)} className="quick-fab" style={{ background: '#D4A5A5', color: '#F6F3EE' }} title="Emergency Help">
          🆘
        </button>
      </div>

      {/* ── Help Modal ───────────────────────────────────────────── */}
      {showHelp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(60,75,75,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', borderRadius: '28px', padding: '36px', maxWidth: '460px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="serif" style={{ fontSize: '32px', fontWeight: 300, color: '#487A7B', marginBottom: '6px' }}>🆘 Emergency Help</h2>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', fontWeight: 300, marginBottom: '24px' }}>One tap is all it takes</p>

            {/* Call buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <button onClick={handleEmergencyCall} className="emergency-btn" style={{ background: 'rgba(212,165,165,0.15)', border: '1px solid rgba(212,165,165,0.3)' }}>
                <FaPhone style={{ color: '#D4A5A5', fontSize: '22px' }} />
                <div className="sans" style={{ color: '#487A7B', fontSize: '13px', fontWeight: 500 }}>Call Helpline</div>
                <div className="sans" style={{ color: '#9CAF88', fontSize: '11px' }}>0471-2552056</div>
              </button>
              <button onClick={handleAmbulanceCall} className="emergency-btn" style={{ background: 'rgba(72,122,123,0.08)', border: '1px solid rgba(72,122,123,0.2)' }}>
                <FaPhone style={{ color: '#487A7B', fontSize: '22px' }} />
                <div className="sans" style={{ color: '#487A7B', fontSize: '13px', fontWeight: 500 }}>Ambulance</div>
                <div className="sans" style={{ color: '#9CAF88', fontSize: '11px' }}>108</div>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button onClick={handleEmergencySMS} className="emergency-btn" style={{ background: 'rgba(156,175,136,0.12)', border: '1px solid rgba(156,175,136,0.3)' }}>
                <FaSms style={{ color: '#9CAF88', fontSize: '22px' }} />
                <div className="sans" style={{ color: '#487A7B', fontSize: '13px', fontWeight: 500 }}>Send SMS</div>
                <div className="sans" style={{ color: '#9CAF88', fontSize: '11px' }}>To helpline</div>
              </button>
              <button onClick={shareLocation} className="emergency-btn" style={{ background: 'rgba(72,122,123,0.08)', border: '1px solid rgba(72,122,123,0.2)' }}>
                <FaMapMarkerAlt style={{ color: '#487A7B', fontSize: '22px' }} />
                <div className="sans" style={{ color: '#487A7B', fontSize: '13px', fontWeight: 500 }}>Share Location</div>
                <div className="sans" style={{ color: '#9CAF88', fontSize: '11px' }}>Copy to clipboard</div>
              </button>
            </div>

            {/* Set contact */}
            <button onClick={() => { setShowHelp(false); setShowEmergencyModal(true); }} style={{ width: '100%', padding: '12px', borderRadius: '14px', background: '#F6F3EE', border: '1px solid rgba(72,122,123,0.15)', color: '#487A7B', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', transition: 'all 0.2s' }}>
              {emergencyContact ? `📞 Contact: ${emergencyContact}` : '+ Set emergency contact'}
            </button>

            {/* Info cards */}
            {[
              { title: 'Fever threshold', body: 'Baby: 100.4°F (38°C) or higher — contact your pediatrician' },
              { title: 'Go to hospital if', body: 'Difficulty breathing · Persistent vomiting · Unusual drowsiness · Not feeding' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px 18px', borderRadius: '16px', background: '#F6F3EE', marginBottom: '10px' }}>
                <h4 className="sans" style={{ color: '#487A7B', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>{item.title}</h4>
                <p className="sans" style={{ color: '#8BA8A9', fontSize: '13px', fontWeight: 300, lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}

            <button onClick={() => setShowHelp(false)} style={{ width: '100%', marginTop: '8px', padding: '14px', borderRadius: '14px', background: '#487A7B', color: '#F6F3EE', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', transition: 'all 0.2s' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Emergency Contact Modal ───────────────────────────────── */}
      {showEmergencyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(60,75,75,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', borderRadius: '28px', padding: '36px', maxWidth: '420px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}>
            <h2 className="serif" style={{ fontSize: '28px', fontWeight: 300, color: '#487A7B', marginBottom: '8px' }}>Emergency Contact</h2>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', fontWeight: 300, marginBottom: '24px' }}>Saved locally on your device</p>
            <input
              type="tel"
              className="modal-input"
              placeholder="Enter phone number"
              value={emergencyInput}
              onChange={(e) => setEmergencyInput(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={saveEmergencyContact} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: '#487A7B', color: '#F6F3EE', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', transition: 'all 0.2s' }}>Save</button>
              <button onClick={() => setShowEmergencyModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: '#F6F3EE', color: '#487A7B', border: '1.5px solid rgba(72,122,123,0.2)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', transition: 'all 0.2s' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;