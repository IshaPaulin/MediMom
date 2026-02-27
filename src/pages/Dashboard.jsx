import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CameraComponent from '../components/Camera';
import BabyTracker from '../components/BabyTracker';
import { FaSignOutAlt, FaBaby, FaHeart, FaHandPaper, FaPhone, FaSms, FaTimes } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // ── UI state ───────────────────────────────────────────────────
  const [lastGesture,        setLastGesture]        = useState(null);
  const [logs,               setLogs]               = useState([]);
  const [showHelp,           setShowHelp]           = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [activeTab,          setActiveTab]          = useState('gesture');
  const [emergencyContact,   setEmergencyContact]   = useState('');
  const [emergencyInput,     setEmergencyInput]     = useState('');

  // ── Feeding timer ──────────────────────────────────────────────
  const [feedingActive,   setFeedingActive]   = useState(false);
  const [feedingDuration, setFeedingDuration] = useState(0);
  const feedingIntervalRef = useRef(null);

  // ── Sleep timer ────────────────────────────────────────────────
  const [sleepActive,   setSleepActive]   = useState(false);
  const [sleepDuration, setSleepDuration] = useState(0);
  const sleepIntervalRef = useRef(null);

  // ── Symptom quick-log modal ────────────────────────────────────
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [symName,          setSymName]          = useState('');
  const [symTemp,          setSymTemp]          = useState('');
  const [symNotes,         setSymNotes]         = useState('');
  const [symResolved,      setSymResolved]      = useState(false);

  // ── Medication quick-log modal ─────────────────────────────────
  const [showMedModal, setShowMedModal] = useState(false);
  const [medName,      setMedName]      = useState('');
  const [medDose,      setMedDose]      = useState('');
  const [medFreq,      setMedFreq]      = useState('');
  const [medNotes,     setMedNotes]     = useState('');
  const [medOngoing,   setMedOngoing]   = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('emergencyContact');
    if (saved) setEmergencyContact(saved);
  }, []);

  useEffect(() => {
    return () => {
      if (feedingIntervalRef.current) clearInterval(feedingIntervalRef.current);
      if (sleepIntervalRef.current)   clearInterval(sleepIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  };

  const addLog = (action, type = 'normal') => {
    const entry = { id: Date.now(), action, time: new Date().toLocaleTimeString(), type };
    setLogs(prev => [entry, ...prev].slice(0, 15));
  };

  // ── Feeding toggle ─────────────────────────────────────────────
  const handleFeedingToggle = () => {
    if (feedingIntervalRef.current) {
      clearInterval(feedingIntervalRef.current);
      feedingIntervalRef.current = null;
      setFeedingActive(false);
      const duration = feedingDuration;
      addLog(`🍼 Feeding done — ${formatTime(duration)}`);
      const history = JSON.parse(localStorage.getItem('feedingHistory') || '[]');
      localStorage.setItem('feedingHistory', JSON.stringify([
        ...history, { id: Date.now(), duration, time: new Date().toLocaleTimeString() }
      ]));
      setFeedingDuration(0);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else {
      feedingIntervalRef.current = setInterval(() => setFeedingDuration(p => p + 1), 1000);
      setFeedingActive(true);
      addLog('🍼 Feeding started', 'feeding-start');
      if (navigator.vibrate) navigator.vibrate(100);
    }
  };

  // ── Sleep toggle ───────────────────────────────────────────────
  const handleSleepToggle = () => {
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
      sleepIntervalRef.current = null;
      setSleepActive(false);
      const duration = sleepDuration;
      addLog(`😴 Baby slept for ${formatTime(duration)}`, 'sleep-end');
      const history = JSON.parse(localStorage.getItem('sleepHistory') || '[]');
      localStorage.setItem('sleepHistory', JSON.stringify([
        ...history, { id: Date.now(), duration, time: new Date().toLocaleTimeString() }
      ]));
      setSleepDuration(0);
    } else {
      sleepIntervalRef.current = setInterval(() => setSleepDuration(p => p + 1), 1000);
      setSleepActive(true);
      addLog('😴 Baby sleeping… Zzz', 'sleep-start');
    }
  };

  // ── Save symptom ───────────────────────────────────────────────
  const saveSymptom = () => {
    if (!symName) return;
    const existing = JSON.parse(localStorage.getItem('symptoms') || '[]');
    const entry = { id: Date.now(), date: Date.now(), symptom: symName, temperature: symTemp || null, notes: symNotes, resolved: symResolved, actionTaken: '' };
    localStorage.setItem('symptoms', JSON.stringify([...existing, entry]));
    addLog(`🌡️ Symptom logged: ${symName}`, 'tip');
    setShowSymptomModal(false);
    setSymName(''); setSymTemp(''); setSymNotes(''); setSymResolved(false);
  };

  // ── Save medication ────────────────────────────────────────────
  const saveMedication = () => {
    if (!medName) return;
    const existing = JSON.parse(localStorage.getItem('medications') || '[]');
    const entry = { id: Date.now(), name: medName, dosage: medDose, frequency: medFreq, startDate: Date.now(), ongoing: medOngoing, notes: medNotes };
    localStorage.setItem('medications', JSON.stringify([...existing, entry]));
    addLog(`💊 Medication logged: ${medName}`, 'tip');
    setShowMedModal(false);
    setMedName(''); setMedDose(''); setMedFreq(''); setMedNotes(''); setMedOngoing(true);
  };

  // ── Gesture handler ────────────────────────────────────────────
  const handleGesture = (gesture) => {
    setLastGesture(gesture);
    if (navigator.vibrate) navigator.vibrate(50);
    if (gesture === 'OPEN_PALM') setShowHelp(true);
  };

  // ── Emergency ──────────────────────────────────────────────────
  const handleEmergencyCall = () => { window.location.href = 'tel:0471-2552056'; };
  const handleAmbulanceCall = () => { window.location.href = 'tel:108'; };
  const handleEmergencySMS  = () => {
    window.location.href = `sms:0471-2552056?body=${encodeURIComponent('URGENT: I need immediate assistance. Please call me back.')}`;
  };
  const saveEmergencyContact = () => {
    if (!emergencyInput) return;
    localStorage.setItem('emergencyContact', emergencyInput);
    setEmergencyContact(emergencyInput);
    setShowEmergencyModal(false);
    addLog('✅ Emergency contact saved', 'tip');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const logBg = (type) => {
    if (type === 'tip') return 'rgba(156,175,136,0.12)';
    if (type === 'feeding-start' || type === 'sleep-start') return 'rgba(72,122,123,0.08)';
    return '#F6F3EE';
  };

  // ── Shared modal input style ───────────────────────────────────
  const inp = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid rgba(156,175,136,0.35)', background: '#FAFAF8',
    fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#487A7B',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F3EE' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500&family=DM+Sans:wght@300;400;500&display=swap');
        .serif { font-family:'Cormorant Garamond',Georgia,serif; }
        .sans  { font-family:'DM Sans',system-ui,sans-serif; }

        .tab-btn { padding:10px 24px; border-radius:40px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:400; display:flex; align-items:center; gap:8px; transition:all 0.25s; white-space:nowrap; }
        .tab-active   { background:#487A7B; color:#F6F3EE; }
        .tab-inactive { background:#FFFFFF; color:#487A7B; border:1px solid rgba(72,122,123,0.2); }
        .tab-inactive:hover { background:rgba(72,122,123,0.05); }

        .log-entry { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-radius:12px; margin-bottom:6px; }

        .quick-fab { width:52px; height:52px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 4px 20px rgba(0,0,0,0.12); transition:all 0.2s ease; }
        .quick-fab:hover { transform:scale(1.1); }

        .action-btn { border-radius:18px; padding:18px 24px; border:none; cursor:pointer; display:flex; align-items:center; gap:14px; transition:all 0.2s; width:100%; }
        .action-btn:hover { transform:translateY(-1px); filter:brightness(1.04); }

        .logger-quick { display:flex; align-items:center; gap:10px; padding:13px 16px; border-radius:16px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:400; transition:all 0.2s; flex:1; min-width:120px; }
        .logger-quick:hover { transform:translateY(-1px); filter:brightness(1.04); }

        .emergency-btn { border-radius:16px; padding:16px; display:flex; flex-direction:column; align-items:center; gap:6px; border:none; cursor:pointer; transition:all 0.2s; flex:1; }
        .emergency-btn:hover { transform:translateY(-2px); }

        .close-btn { position:absolute; top:20px; right:20px; width:36px; height:36px; border-radius:50%; border:none; background:#F6F3EE; color:#487A7B; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:16px; transition:all 0.2s; }
        .close-btn:hover { background:rgba(212,165,165,0.2); }

        .modal-back { position:fixed; inset:0; background:rgba(60,75,75,0.45); backdrop-filter:blur(6px); display:flex; align-items:flex-end; justify-content:center; padding:0; z-index:100; }
        .modal-sheet { background:#FFFFFF; border-radius:28px 28px 0 0; padding:32px 28px 44px; width:100%; max-width:520px; box-shadow:0 -12px 60px rgba(0,0,0,0.15); max-height:85vh; overflow-y:auto; }

        .check-toggle { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:14px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; transition:all 0.2s; border:1.5px solid; }
        .modal-label { display:block; font-family:'DM Sans',sans-serif; font-size:12px; color:#487A7B; letter-spacing:0.05em; margin-bottom:6px; }
        .timer-card { border-radius:18px; padding:16px 20px; display:flex; align-items:center; gap:12px; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sans" style={{ background:'#FFFFFF', borderBottom:'1px solid rgba(212,165,165,0.25)', padding:'16px 32px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
            <FaHeart style={{ color:'#D4A5A5', fontSize:'14px' }} />
            <span className="serif" style={{ fontSize:'20px', color:'#487A7B', fontWeight:400 }}>MediMom</span>
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <span className="sans" style={{ color:'#487A7B', fontSize:'14px', fontWeight:300 }}>
              Hi, {currentUser?.email?.split('@')[0] || 'Mama'} 👋
            </span>
            <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 20px', borderRadius:'40px', border:'1.5px solid rgba(72,122,123,0.3)', background:'transparent', color:'#487A7B', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:'13px', transition:'all 0.2s' }}>
              <FaSignOutAlt style={{ fontSize:'12px' }} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main style={{ maxWidth:'900px', margin:'0 auto', padding:'36px 24px 120px' }}>

        {/* Tabs - Updated with Cry Analyzer */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'28px', overflowX:'auto', paddingBottom:'4px' }}>
          {[
            { id:'gesture', icon:<FaHandPaper style={{fontSize:'13px'}}/>, label:'Gesture Logger' },
            { id:'baby',    icon:<FaBaby      style={{fontSize:'13px'}}/>, label:'Baby Tracker'   },
            { id:'mood',    icon:<FaHeart     style={{fontSize:'13px'}}/>, label:'Mood'           },            
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <div style={{ background:'#FFFFFF', borderRadius:'28px', padding:'40px', boxShadow:'0 4px 40px rgba(72,122,123,0.08)', border:'1px solid rgba(212,165,165,0.1)' }}>

          {/* ══ Gesture Logger tab ══════════════════════════════ */}
          {activeTab === 'gesture' && (
            <div>
              <h2 className="serif" style={{ fontSize:'36px', fontWeight:300, color:'#487A7B', marginBottom:'6px' }}>Smart Gesture Logger</h2>
              <p className="sans" style={{ color:'#9CAF88', fontSize:'14px', fontWeight:300, marginBottom:'28px' }}>Show an open palm to trigger emergency help</p>

              {/* Active timers */}
              {(feedingActive || sleepActive) && (
                <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
                  {feedingActive && (
                    <div className="timer-card" style={{ background:'rgba(212,165,165,0.15)', border:'1px solid rgba(212,165,165,0.3)', flex:1, minWidth:'180px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#D4A5A5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>🍼</div>
                      <div>
                        <div className="sans" style={{ color:'#8B5E5E', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'2px' }}>Feeding</div>
                        <div className="serif" style={{ color:'#8B5E5E', fontSize:'22px', fontWeight:400 }}>{formatTime(feedingDuration)}</div>
                      </div>
                    </div>
                  )}
                  {sleepActive && (
                    <div className="timer-card" style={{ background:'rgba(156,175,136,0.15)', border:'1px solid rgba(156,175,136,0.3)', flex:1, minWidth:'180px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#9CAF88', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>😴</div>
                      <div>
                        <div className="sans" style={{ color:'#4a6b3a', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'2px' }}>Baby sleeping</div>
                        <div className="serif" style={{ color:'#4a6b3a', fontSize:'22px', fontWeight:400 }}>{formatTime(sleepDuration)}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Feed & Sleep buttons */}
              <div style={{ display:'flex', gap:'12px', marginBottom:'16px' }}>
                <button onClick={handleFeedingToggle} className="action-btn"
                  style={{ background:feedingActive?'rgba(212,165,165,0.2)':'rgba(212,165,165,0.1)', border:`1.5px solid ${feedingActive?'rgba(212,165,165,0.5)':'rgba(212,165,165,0.2)'}` }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:feedingActive?'#D4A5A5':'rgba(212,165,165,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>🍼</div>
                  <div style={{ textAlign:'left' }}>
                    <div className="sans" style={{ color:'#8B5E5E', fontSize:'14px', fontWeight:500 }}>{feedingActive ? 'Stop Feeding' : 'Start Feeding'}</div>
                    <div className="sans" style={{ color:'#B8C9C9', fontSize:'12px', fontWeight:300 }}>{feedingActive ? formatTime(feedingDuration) : 'Tap to begin'}</div>
                  </div>
                </button>
                <button onClick={handleSleepToggle} className="action-btn"
                  style={{ background:sleepActive?'rgba(156,175,136,0.2)':'rgba(156,175,136,0.1)', border:`1.5px solid ${sleepActive?'rgba(156,175,136,0.5)':'rgba(156,175,136,0.2)'}` }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:sleepActive?'#9CAF88':'rgba(156,175,136,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>😴</div>
                  <div style={{ textAlign:'left' }}>
                    <div className="sans" style={{ color:'#4a6b3a', fontSize:'14px', fontWeight:500 }}>{sleepActive ? 'Stop Sleep' : 'Log Sleep'}</div>
                    <div className="sans" style={{ color:'#B8C9C9', fontSize:'12px', fontWeight:300 }}>{sleepActive ? formatTime(sleepDuration) : 'Tap to begin'}</div>
                  </div>
                </button>
              </div>

              {/* Health quick-log row */}
              <div style={{ display:'flex', gap:'10px', marginBottom:'24px', flexWrap:'wrap' }}>
                <button className="logger-quick" onClick={() => setShowSymptomModal(true)}
                  style={{ background:'rgba(212,165,165,0.08)', color:'#8B5E5E', border:'1px solid rgba(212,165,165,0.2)' }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(212,165,165,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>🌡️</div>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontSize:'13px', fontWeight:500 }}>Log Symptom</div>
                    <div style={{ fontSize:'11px', color:'#C5D3D3', fontWeight:300 }}>Fever, colic, rash…</div>
                  </div>
                </button>
                <button className="logger-quick" onClick={() => setShowMedModal(true)}
                  style={{ background:'rgba(100,130,180,0.06)', color:'#4a5a8a', border:'1px solid rgba(100,130,180,0.15)' }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(100,130,180,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>💊</div>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontSize:'13px', fontWeight:500 }}>Log Medication</div>
                    <div style={{ fontSize:'11px', color:'#C5D3D3', fontWeight:300 }}>Vitamins, prescriptions…</div>
                  </div>
                </button>
              </div>

              {/* Open Palm hint */}
              <div style={{ padding:'16px 20px', borderRadius:'18px', background:'rgba(72,122,123,0.06)', border:'1px solid rgba(72,122,123,0.12)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ fontSize:'36px' }}>✋</div>
                <div>
                  <div className="sans" style={{ color:'#487A7B', fontSize:'14px', fontWeight:500 }}>Open Palm → Emergency Help</div>
                  <div className="sans" style={{ color:'#9CAF88', fontSize:'12px', fontWeight:300, marginTop:'2px' }}>Show your open palm to the camera to instantly open the emergency panel</div>
                </div>
              </div>

              {/* Camera */}
              <div style={{ marginBottom:'24px' }}>
                <CameraComponent onGestureDetected={handleGesture} />
              </div>

              {/* Last gesture */}
              {lastGesture && (
                <div style={{ marginBottom:'20px', padding:'12px 18px', borderRadius:'14px', background:'rgba(212,165,165,0.12)', border:'1px solid rgba(212,165,165,0.25)', textAlign:'center' }}>
                  <span className="sans" style={{ color:'#487A7B', fontSize:'14px' }}>
                    ✓ Detected: <strong>{lastGesture === 'OPEN_PALM' ? '✋ Open Palm — Emergency opened' : lastGesture}</strong>
                  </span>
                </div>
              )}

              {/* Activity log */}
              <h3 className="sans" style={{ color:'#487A7B', fontSize:'12px', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'14px' }}>Recent Activity</h3>
              {logs.length === 0 ? (
                <div style={{ textAlign:'center', padding:'36px', color:'#C5D3D3', fontFamily:'DM Sans,sans-serif', fontSize:'14px', fontWeight:300 }}>
                  No logs yet — use the buttons above to begin ✨
                </div>
              ) : (
                <div style={{ maxHeight:'260px', overflowY:'auto' }}>
                  {logs.map(log => (
                    <div key={log.id} className="log-entry" style={{ background:logBg(log.type) }}>
                      <span className="sans" style={{ color:'#487A7B', fontSize:'14px' }}>{log.action}</span>
                      <span className="sans" style={{ color:'#B8C9C9', fontSize:'12px', fontWeight:300, flexShrink:0, marginLeft:'12px' }}>{log.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ Baby Tracker tab ════════════════════════════════ */}
          {activeTab === 'baby' && (
            <BabyTracker
              onStartFeed={()=>{ setActiveTab('gesture'); setTimeout(handleFeedingToggle, 100); }}
              onStartSleep={()=>{ setActiveTab('gesture'); setTimeout(handleSleepToggle, 100); }}
            />
          )}

          {/* ══ Mood tab ════════════════════════════════════════ */}
          {activeTab === 'mood' && (
            <div style={{ textAlign:'center', padding:'48px 0' }}>
              <div style={{ fontSize:'52px', marginBottom:'16px' }}>💙</div>
              <h3 className="serif" style={{ fontSize:'28px', fontWeight:300, color:'#487A7B', marginBottom:'8px' }}>Mood Tracker</h3>
              <p className="sans" style={{ color:'#9CAF88', fontSize:'15px', fontWeight:300 }}>Coming soon — check in daily and track your wellbeing</p>
            </div>
          )}         
        </div>
      </main>

      {/* ── FABs ───────────────────────────────────────────────── */}
      <div style={{ position:'fixed', bottom:'28px', right:'28px', display:'flex', flexDirection:'column', gap:'12px', zIndex:40 }}>
        <button onClick={handleFeedingToggle} className="quick-fab" style={{ background:feedingActive?'#c49090':'#487A7B', color:'#F6F3EE' }} title={feedingActive?'Stop Feeding':'Start Feeding'}>
          {feedingActive ? '⏹' : '🍼'}
        </button>
        <button onClick={handleSleepToggle} className="quick-fab" style={{ background:sleepActive?'#7a9668':'#9CAF88', color:'#F6F3EE' }} title={sleepActive?'Stop Sleep':'Log Sleep'}>
          {sleepActive ? '⏹' : '😴'}
        </button>
        <button onClick={() => setShowHelp(true)} className="quick-fab" style={{ background:'#D4A5A5', color:'#F6F3EE' }} title="Emergency Help">
          🆘
        </button>
      </div>

      {/* ══ Symptom Quick-Log Modal ══════════════════════════════ */}
      {showSymptomModal && (
        <div className="modal-back" onClick={e => { if (e.target === e.currentTarget) setShowSymptomModal(false); }}>
          <div className="modal-sheet">
            <h3 className="serif" style={{ fontSize:'28px', fontWeight:300, color:'#487A7B', marginBottom:'6px' }}>Log a Symptom</h3>
            <p className="sans" style={{ color:'#9CAF88', fontSize:'13px', marginBottom:'22px' }}>Note what you've observed — visible in Baby Tracker</p>

            <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'20px' }}>
              <div>
                <label className="modal-label">Symptom *</label>
                <input style={inp} type="text" placeholder="e.g. Mild fever, Colic, Diaper rash…" value={symName} onChange={e => setSymName(e.target.value)} />
              </div>
              <div>
                <label className="modal-label">Temperature °F — optional</label>
                <input style={{...inp, width:'120px'}} type="number" placeholder="98.6" value={symTemp} onChange={e => setSymTemp(e.target.value)} />
              </div>
              <div>
                <label className="modal-label">Notes — optional</label>
                <textarea style={{...inp, resize:'none', fontFamily:'DM Sans,sans-serif'}} rows={3} placeholder="Any additional observations…" value={symNotes} onChange={e => setSymNotes(e.target.value)} />
              </div>
              <button
                className="check-toggle"
                onClick={() => setSymResolved(!symResolved)}
                style={{ borderColor:symResolved?'rgba(156,175,136,0.4)':'rgba(72,122,123,0.15)', background:symResolved?'rgba(156,175,136,0.08)':'transparent', color:symResolved?'#4a6b3a':'#487A7B' }}>
                <div style={{ width:'18px', height:'18px', borderRadius:'5px', border:`2px solid ${symResolved?'#9CAF88':'rgba(72,122,123,0.3)'}`, background:symResolved?'#9CAF88':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {symResolved && <span style={{ color:'#fff', fontSize:'11px' }}>✓</span>}
                </div>
                Already resolved
              </button>
            </div>

            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setShowSymptomModal(false)} style={{ flex:1, padding:'13px', borderRadius:'14px', border:'1.5px solid rgba(72,122,123,0.2)', background:'transparent', color:'#487A7B', fontFamily:'DM Sans,sans-serif', fontSize:'14px', cursor:'pointer' }}>Cancel</button>
              <button onClick={saveSymptom} disabled={!symName}
                style={{ flex:2, padding:'13px', borderRadius:'14px', border:'none', background:symName?'#487A7B':'#C5D3D3', color:'#F6F3EE', fontFamily:'DM Sans,sans-serif', fontSize:'15px', cursor:symName?'pointer':'not-allowed' }}>
                Save Symptom ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Medication Quick-Log Modal ═══════════════════════════ */}
      {showMedModal && (
        <div className="modal-back" onClick={e => { if (e.target === e.currentTarget) setShowMedModal(false); }}>
          <div className="modal-sheet">
            <h3 className="serif" style={{ fontSize:'28px', fontWeight:300, color:'#487A7B', marginBottom:'6px' }}>Log Medication</h3>
            <p className="sans" style={{ color:'#9CAF88', fontSize:'13px', marginBottom:'22px' }}>Supplements and prescribed medicines — visible in Baby Tracker</p>

            <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'20px' }}>
              {[
                { label:'Medication name *', ph:'e.g. Vitamin D Drops',  val:medName,  set:setMedName  },
                { label:'Dosage',            ph:'e.g. 0.5 ml',           val:medDose,  set:setMedDose  },
                { label:'Frequency',         ph:'e.g. Once daily',       val:medFreq,  set:setMedFreq  },
                { label:'Notes',             ph:'e.g. Give with feed',   val:medNotes, set:setMedNotes },
              ].map(({ label, ph, val, set }) => (
                <div key={label}>
                  <label className="modal-label">{label}</label>
                  <input style={inp} type="text" placeholder={ph} value={val} onChange={e => set(e.target.value)} />
                </div>
              ))}
              <button
                className="check-toggle"
                onClick={() => setMedOngoing(!medOngoing)}
                style={{ borderColor:medOngoing?'rgba(156,175,136,0.4)':'rgba(72,122,123,0.15)', background:medOngoing?'rgba(156,175,136,0.08)':'transparent', color:medOngoing?'#4a6b3a':'#487A7B' }}>
                <div style={{ width:'18px', height:'18px', borderRadius:'5px', border:`2px solid ${medOngoing?'#9CAF88':'rgba(72,122,123,0.3)'}`, background:medOngoing?'#9CAF88':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {medOngoing && <span style={{ color:'#fff', fontSize:'11px' }}>✓</span>}
                </div>
                Ongoing medication
              </button>
            </div>

            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setShowMedModal(false)} style={{ flex:1, padding:'13px', borderRadius:'14px', border:'1.5px solid rgba(72,122,123,0.2)', background:'transparent', color:'#487A7B', fontFamily:'DM Sans,sans-serif', fontSize:'14px', cursor:'pointer' }}>Cancel</button>
              <button onClick={saveMedication} disabled={!medName}
                style={{ flex:2, padding:'13px', borderRadius:'14px', border:'none', background:medName?'#487A7B':'#C5D3D3', color:'#F6F3EE', fontFamily:'DM Sans,sans-serif', fontSize:'15px', cursor:medName?'pointer':'not-allowed' }}>
                Save Medication ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Help Modal ══════════════════════════════════════════ */}
      {showHelp && (
        <div style={{ position:'fixed', inset:0, background:'rgba(60,75,75,0.45)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', zIndex:100 }}>
          <div style={{ background:'#FFFFFF', borderRadius:'28px', padding:'36px', maxWidth:'460px', width:'100%', boxShadow:'0 24px 80px rgba(0,0,0,0.15)', maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
            <button className="close-btn" onClick={() => setShowHelp(false)}><FaTimes /></button>
            <h2 className="serif" style={{ fontSize:'32px', fontWeight:300, color:'#487A7B', marginBottom:'6px' }}>🆘 Emergency Help</h2>
            <p className="sans" style={{ color:'#9CAF88', fontSize:'14px', fontWeight:300, marginBottom:'24px' }}>One tap is all it takes</p>

            <div style={{ display:'flex', gap:'12px', marginBottom:'12px' }}>
              <button onClick={handleEmergencyCall} className="emergency-btn" style={{ background:'rgba(212,165,165,0.15)', border:'1px solid rgba(212,165,165,0.3)' }}>
                <FaPhone style={{ color:'#D4A5A5', fontSize:'22px' }} />
                <div className="sans" style={{ color:'#487A7B', fontSize:'13px', fontWeight:500 }}>Call Helpline</div>
                <div className="sans" style={{ color:'#9CAF88', fontSize:'11px' }}>0471-2552056</div>
              </button>
              <button onClick={handleAmbulanceCall} className="emergency-btn" style={{ background:'rgba(72,122,123,0.08)', border:'1px solid rgba(72,122,123,0.2)' }}>
                <FaPhone style={{ color:'#487A7B', fontSize:'22px' }} />
                <div className="sans" style={{ color:'#487A7B', fontSize:'13px', fontWeight:500 }}>Ambulance</div>
                <div className="sans" style={{ color:'#9CAF88', fontSize:'11px' }}>108</div>
              </button>
            </div>

            <button onClick={handleEmergencySMS} style={{ width:'100%', padding:'16px', borderRadius:'16px', border:'1px solid rgba(156,175,136,0.3)', background:'rgba(156,175,136,0.12)', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', cursor:'pointer', marginBottom:'20px', transition:'all 0.2s' }}>
              <FaSms style={{ color:'#9CAF88', fontSize:'22px' }} />
              <div className="sans" style={{ color:'#487A7B', fontSize:'13px', fontWeight:500 }}>Send SMS to Helpline</div>
              <div className="sans" style={{ color:'#9CAF88', fontSize:'11px' }}>0471-2552056</div>
            </button>

            <button onClick={() => { setShowHelp(false); setShowEmergencyModal(true); }} style={{ width:'100%', padding:'12px', borderRadius:'14px', background:'#F6F3EE', border:'1px solid rgba(72,122,123,0.15)', color:'#487A7B', fontFamily:'DM Sans,sans-serif', fontSize:'14px', cursor:'pointer', marginBottom:'20px' }}>
              {emergencyContact ? `📞 Contact: ${emergencyContact}` : '+ Set emergency contact'}
            </button>

            {[
              { title:'Fever threshold', body:'Baby: 100.4°F (38°C) or higher — contact your pediatrician' },
              { title:'Go to hospital if', body:'Difficulty breathing · Persistent vomiting · Unusual drowsiness · Not feeding' },
            ].map((item, i) => (
              <div key={i} style={{ padding:'16px 18px', borderRadius:'16px', background:'#F6F3EE', marginBottom:'10px' }}>
                <h4 className="sans" style={{ color:'#487A7B', fontSize:'13px', fontWeight:500, marginBottom:'6px' }}>{item.title}</h4>
                <p className="sans" style={{ color:'#8BA8A9', fontSize:'13px', fontWeight:300, lineHeight:1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ Emergency Contact Modal ══════════════════════════════ */}
      {showEmergencyModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(60,75,75,0.45)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', zIndex:100 }}>
          <div style={{ background:'#FFFFFF', borderRadius:'28px', padding:'36px', maxWidth:'420px', width:'100%', boxShadow:'0 24px 80px rgba(0,0,0,0.15)', position:'relative' }}>
            <button className="close-btn" onClick={() => setShowEmergencyModal(false)}><FaTimes /></button>
            <h2 className="serif" style={{ fontSize:'28px', fontWeight:300, color:'#487A7B', marginBottom:'8px' }}>Emergency Contact</h2>
            <p className="sans" style={{ color:'#9CAF88', fontSize:'14px', fontWeight:300, marginBottom:'24px' }}>Saved locally on your device</p>
            <input type="tel" placeholder="Enter phone number" value={emergencyInput} onChange={e => setEmergencyInput(e.target.value)}
              style={{ ...inp, marginBottom:'16px' }} />
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={saveEmergencyContact} style={{ flex:1, padding:'14px', borderRadius:'14px', background:'#487A7B', color:'#F6F3EE', border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:'15px' }}>Save</button>
              <button onClick={() => setShowEmergencyModal(false)} style={{ flex:1, padding:'14px', borderRadius:'14px', background:'#F6F3EE', color:'#487A7B', border:'1.5px solid rgba(72,122,123,0.2)', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:'15px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;