import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CameraComponent from '../components/Camera';
import BabyTracker from '../components/BabyTracker';
import Logo from '../assets/logo/MediMom_logo.svg';
import { FaSignOutAlt, FaBaby, FaHeart, FaHandPaper, FaPhone, FaSms, FaTimes, FaLeaf } from 'react-icons/fa';

// ── Mood Tracker Component ─────────────────────────────────────
const MoodTracker = () => {
  const MOODS = [
    { emoji: '🌟', label: 'Wonderful', value: 5, color: '#F6C90E', bg: 'rgba(246,201,14,0.12)' },
    { emoji: '😊', label: 'Good',      value: 4, color: '#9CAF88', bg: 'rgba(156,175,136,0.12)' },
    { emoji: '😐', label: 'Okay',      value: 3, color: '#8BA8A9', bg: 'rgba(139,168,169,0.12)' },
    { emoji: '😔', label: 'Low',       value: 2, color: '#D4A5A5', bg: 'rgba(212,165,165,0.12)' },
    { emoji: '😢', label: 'Rough',     value: 1, color: '#B07070', bg: 'rgba(176,112,112,0.12)' },
  ];

  const TAGS = ['Anxious', 'Hopeful', 'Tired', 'Grateful', 'Overwhelmed', 'Peaceful', 'Lonely', 'Loved', 'Nauseous', 'Energetic'];

  const today = new Date().toDateString();
  const storageKey = 'medimom_mood_logs';

  const loadLogs = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
    catch { return []; }
  };

  const [logs, setLogs]               = useState(loadLogs);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote]               = useState('');
  const [saved, setSaved]             = useState(false);
  const [view, setView]               = useState('log'); // 'log' | 'history'

  const todayLog = logs.find(l => new Date(l.date).toDateString() === today);

  useEffect(() => {
    if (todayLog) {
      setSelectedMood(todayLog.mood);
      setSelectedTags(todayLog.tags || []);
      setNote(todayLog.note || '');
      setSaved(true);
    }
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setSaved(false);
  };

  const saveMood = () => {
    if (!selectedMood) return;
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: selectedMood,
      tags: selectedTags,
      note,
    };
    const updated = [...logs.filter(l => new Date(l.date).toDateString() !== today), entry];
    setLogs(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setSaved(true);
  };

  const moodObj = MOODS.find(m => m.value === selectedMood);

  // Last 7 days for mini chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const log = logs.find(l => new Date(l.date).toDateString() === d.toDateString());
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), mood: log?.mood || null };
  });

  const inp = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid rgba(156,175,136,0.3)', background: '#FAFAF8',
    fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#487A7B',
    outline: 'none', resize: 'none', boxSizing: 'border-box',
    lineHeight: 1.55,
  };

  return (
    <div>
      <style>{`
        .mood-emoji-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 14px 10px; border-radius: 18px; border: 2px solid transparent;
          background: transparent; cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          flex: 1;
        }
        .mood-emoji-btn:hover { transform: translateY(-3px) scale(1.05); }
        .mood-emoji-btn.active { transform: translateY(-4px) scale(1.1); }
        .mood-tag {
          padding: 7px 14px; border-radius: 20px; border: 1.5px solid rgba(72,122,123,0.2);
          background: transparent; cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #487A7B; transition: all 0.18s;
        }
        .mood-tag:hover { background: rgba(72,122,123,0.06); border-color: rgba(72,122,123,0.35); }
        .mood-tag.active { background: rgba(72,122,123,0.1); border-color: #487A7B; font-weight: 500; }
        .mood-bar-day { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
        .mood-bar { border-radius: 6px; width: 100%; transition: all 0.4s; }
        .view-toggle-btn {
          padding: 8px 20px; border-radius: 30px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; transition: all 0.2s;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 className="serif" style={{ fontSize: '36px', fontWeight: 300, color: '#487A7B', marginBottom: '4px' }}>
            How are you feeling?
          </h2>
          <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', fontWeight: 300 }}>
            {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setView('log')} className="view-toggle-btn"
            style={{ background: view === 'log' ? '#487A7B' : '#F6F3EE', color: view === 'log' ? '#F6F3EE' : '#487A7B' }}>
            Today
          </button>
          <button onClick={() => setView('history')} className="view-toggle-btn"
            style={{ background: view === 'history' ? '#487A7B' : '#F6F3EE', color: view === 'history' ? '#F6F3EE' : '#487A7B' }}>
            History
          </button>
        </div>
      </div>

      {view === 'log' && (
        <>
          {/* Mood selector */}
          <div style={{ marginBottom: '24px' }}>
            <p className="sans" style={{ fontSize: '12px', color: '#9CAF88', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Select your mood
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {MOODS.map(m => (
                <button
                  key={m.value}
                  className={`mood-emoji-btn ${selectedMood === m.value ? 'active' : ''}`}
                  onClick={() => { setSelectedMood(m.value); setSaved(false); }}
                  style={{
                    background: selectedMood === m.value ? m.bg : 'transparent',
                    borderColor: selectedMood === m.value ? m.color : 'transparent',
                  }}
                >
                  <span style={{ fontSize: '32px', lineHeight: 1 }}>{m.emoji}</span>
                  <span className="sans" style={{ fontSize: '11px', color: selectedMood === m.value ? m.color : '#9CAF88', fontWeight: selectedMood === m.value ? 600 : 400 }}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood selected banner */}
          {moodObj && (
            <div style={{ padding: '14px 18px', borderRadius: '16px', background: moodObj.bg, border: `1.5px solid ${moodObj.color}30`, marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{moodObj.emoji}</span>
              <div>
                <div className="sans" style={{ color: moodObj.color, fontSize: '15px', fontWeight: 600 }}>Feeling {moodObj.label}</div>
                <div className="sans" style={{ color: '#9CAF88', fontSize: '12px', fontWeight: 300 }}>
                  {moodObj.value >= 4 ? 'That is wonderful to hear. Keep nurturing yourself.' :
                   moodObj.value === 3 ? 'Some days are just okay — that is perfectly fine.' :
                   'Rough days are part of the journey. You are doing great.'}
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div style={{ marginBottom: '22px' }}>
            <p className="sans" style={{ fontSize: '12px', color: '#9CAF88', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '12px' }}>
              What best describes today?
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className={`mood-tag ${selectedTags.includes(tag) ? 'active' : ''}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div style={{ marginBottom: '24px' }}>
            <p className="sans" style={{ fontSize: '12px', color: '#9CAF88', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Add a note — optional
            </p>
            <textarea
              style={inp} rows={3}
              placeholder="How was your day? Any thoughts you want to remember..."
              value={note}
              onChange={e => { setNote(e.target.value); setSaved(false); }}
            />
          </div>

          {/* Save button */}
          <button
            onClick={saveMood}
            disabled={!selectedMood}
            style={{
              width: '100%', padding: '15px', borderRadius: '16px', border: 'none',
              background: saved ? 'rgba(156,175,136,0.2)' : selectedMood ? '#487A7B' : '#C5D3D3',
              color: saved ? '#4a6b3a' : '#F6F3EE',
              fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 500,
              cursor: selectedMood ? 'pointer' : 'not-allowed',
              transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {saved ? '✓ Mood saved for today' : 'Save Check-in'}
          </button>

          {/* Mini weekly chart */}
          {logs.length > 0 && (
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(72,122,123,0.1)' }}>
              <p className="sans" style={{ fontSize: '12px', color: '#9CAF88', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
                This week
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' }}>
                {last7.map((d, i) => {
                  const mObj = MOODS.find(m => m.value === d.mood);
                  const h = d.mood ? `${(d.mood / 5) * 60 + 16}px` : '8px';
                  return (
                    <div key={i} className="mood-bar-day">
                      <div className="mood-bar" style={{
                        height: h,
                        background: mObj ? mObj.color : 'rgba(72,122,123,0.1)',
                        opacity: d.mood ? 1 : 0.4,
                      }} title={mObj ? `${d.day}: ${mObj.label}` : d.day} />
                      <span className="sans" style={{ fontSize: '11px', color: '#9CAF88' }}>{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'history' && (
        <div>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#C5D3D3' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
              <p className="sans" style={{ fontSize: '15px', fontWeight: 300 }}>No mood logs yet. Start checking in daily!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[...logs].reverse().map(log => {
                const mObj = MOODS.find(m => m.value === log.mood);
                return (
                  <div key={log.id} style={{ padding: '16px 20px', borderRadius: '18px', background: mObj?.bg || '#F6F3EE', border: `1px solid ${mObj?.color || '#9CAF88'}25` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: log.tags?.length || log.note ? '10px' : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{mObj?.emoji}</span>
                        <div>
                          <div className="sans" style={{ fontSize: '14px', fontWeight: 600, color: mObj?.color }}>{mObj?.label}</div>
                          <div className="sans" style={{ fontSize: '12px', color: '#9CAF88', fontWeight: 300 }}>
                            {new Date(log.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>
                    {log.tags?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: log.note ? '8px' : 0 }}>
                        {log.tags.map(tag => (
                          <span key={tag} style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', fontSize: '12px', color: '#487A7B', fontFamily: 'DM Sans, sans-serif' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {log.note && (
                      <p className="sans" style={{ fontSize: '13px', color: '#487A7B', fontWeight: 300, fontStyle: 'italic', margin: 0, lineHeight: 1.55 }}>
                        "{log.note}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────
const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [lastGesture,        setLastGesture]        = useState(null);
  const [logs,               setLogs]               = useState([]);
  const [showHelp,           setShowHelp]           = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [activeTab,          setActiveTab]          = useState('gesture');
  const [emergencyContact,   setEmergencyContact]   = useState('');
  const [emergencyInput,     setEmergencyInput]     = useState('');

  const [feedingActive,   setFeedingActive]   = useState(false);
  const [feedingDuration, setFeedingDuration] = useState(0);
  const feedingIntervalRef = useRef(null);

  const [sleepActive,   setSleepActive]   = useState(false);
  const [sleepDuration, setSleepDuration] = useState(0);
  const sleepIntervalRef = useRef(null);

  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [symName,          setSymName]          = useState('');
  const [symTemp,          setSymTemp]          = useState('');
  const [symNotes,         setSymNotes]         = useState('');
  const [symResolved,      setSymResolved]      = useState(false);

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

  const handleFeedingToggle = () => {
    if (feedingIntervalRef.current) {
      clearInterval(feedingIntervalRef.current);
      feedingIntervalRef.current = null;
      setFeedingActive(false);
      const duration = feedingDuration;
      addLog(`Feeding done — ${formatTime(duration)}`);
      const history = JSON.parse(localStorage.getItem('feedingHistory') || '[]');
      localStorage.setItem('feedingHistory', JSON.stringify([
        ...history, { id: Date.now(), duration, time: new Date().toLocaleTimeString() }
      ]));
      setFeedingDuration(0);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else {
      feedingIntervalRef.current = setInterval(() => setFeedingDuration(p => p + 1), 1000);
      setFeedingActive(true);
      addLog('Feeding started', 'feeding-start');
      if (navigator.vibrate) navigator.vibrate(100);
    }
  };

  const handleSleepToggle = () => {
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
      sleepIntervalRef.current = null;
      setSleepActive(false);
      const duration = sleepDuration;
      addLog(`Baby slept for ${formatTime(duration)}`, 'sleep-end');
      const history = JSON.parse(localStorage.getItem('sleepHistory') || '[]');
      localStorage.setItem('sleepHistory', JSON.stringify([
        ...history, { id: Date.now(), duration, time: new Date().toLocaleTimeString() }
      ]));
      setSleepDuration(0);
    } else {
      sleepIntervalRef.current = setInterval(() => setSleepDuration(p => p + 1), 1000);
      setSleepActive(true);
      addLog('Baby sleeping', 'sleep-start');
    }
  };

  const saveSymptom = () => {
    if (!symName) return;
    const existing = JSON.parse(localStorage.getItem('symptoms') || '[]');
    const entry = { id: Date.now(), date: Date.now(), symptom: symName, temperature: symTemp || null, notes: symNotes, resolved: symResolved, actionTaken: '' };
    localStorage.setItem('symptoms', JSON.stringify([...existing, entry]));
    addLog(`Symptom logged: ${symName}`, 'tip');
    setShowSymptomModal(false);
    setSymName(''); setSymTemp(''); setSymNotes(''); setSymResolved(false);
  };

  const saveMedication = () => {
    if (!medName) return;
    const existing = JSON.parse(localStorage.getItem('medications') || '[]');
    const entry = { id: Date.now(), name: medName, dosage: medDose, frequency: medFreq, startDate: Date.now(), ongoing: medOngoing, notes: medNotes };
    localStorage.setItem('medications', JSON.stringify([...existing, entry]));
    addLog(`Medication logged: ${medName}`, 'tip');
    setShowMedModal(false);
    setMedName(''); setMedDose(''); setMedFreq(''); setMedNotes(''); setMedOngoing(true);
  };

  const handleGesture = (gesture) => {
    setLastGesture(gesture);
    if (navigator.vibrate) navigator.vibrate(50);
    if (gesture === 'OPEN_PALM') setShowHelp(true);
  };

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
    addLog('Emergency contact saved', 'tip');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const logBg = (type) => {
    if (type === 'tip') return 'rgba(156,175,136,0.12)';
    if (type === 'feeding-start' || type === 'sleep-start') return 'rgba(72,122,123,0.08)';
    return '#F6F3EE';
  };

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

      {/* Header */}
      <header className="sans" style={{ background:'#FFFFFF', borderBottom:'1px solid rgba(212,165,165,0.25)', padding:'16px 32px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
            <img src={Logo} alt="MediMom" style={{ height: '36px', objectFit: 'contain' }} /><span className="serif" style={{ fontSize:'20px', color:'#487A7B', fontWeight:400 }}>MediMom</span>
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <span className="sans" style={{ color:'#487A7B', fontSize:'14px', fontWeight:300 }}>
              Hi, {currentUser?.email?.split('@')[0] || 'Mama'}
            </span>
            <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 20px', borderRadius:'40px', border:'1.5px solid rgba(72,122,123,0.3)', background:'transparent', color:'#487A7B', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:'13px', transition:'all 0.2s' }}>
              <FaSignOutAlt style={{ fontSize:'12px' }} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth:'900px', margin:'0 auto', padding:'36px 24px 120px' }}>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'28px', overflowX:'auto', paddingBottom:'4px' }}>
          {[
            { id:'gesture', icon:<FaHandPaper style={{fontSize:'13px'}}/>, label:'Gesture Logger' },
            { id:'baby',    icon:<FaBaby      style={{fontSize:'13px'}}/>, label:'Baby Tracker'   },
            { id:'mood',    icon:<FaHeart     style={{fontSize:'13px'}}/>, label:'Mood'           },
            { id:'growth',  icon:<FaLeaf      style={{fontSize:'13px'}}/>, label:'Growth & Milestones' },
          ].map(tab => (
            <button key={tab.id} onClick={() => {
              if (tab.id === 'growth') { navigate('/growth'); return; }
              setActiveTab(tab.id);
            }}
              className={`tab-btn ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <div style={{ background:'#FFFFFF', borderRadius:'28px', padding:'40px', boxShadow:'0 4px 40px rgba(72,122,123,0.08)', border:'1px solid rgba(212,165,165,0.1)' }}>

          {/* Gesture Logger tab */}
          {activeTab === 'gesture' && (
            <div>
              <h2 className="serif" style={{ fontSize:'36px', fontWeight:300, color:'#487A7B', marginBottom:'6px' }}>Smart Gesture Logger</h2>
              <p className="sans" style={{ color:'#9CAF88', fontSize:'14px', fontWeight:300, marginBottom:'28px' }}>Show an open palm to trigger emergency help</p>

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

              <div style={{ display:'flex', gap:'10px', marginBottom:'24px', flexWrap:'wrap' }}>
                <button className="logger-quick" onClick={() => setShowSymptomModal(true)}
                  style={{ background:'rgba(212,165,165,0.08)', color:'#8B5E5E', border:'1px solid rgba(212,165,165,0.2)' }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(212,165,165,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>🌡️</div>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontSize:'13px', fontWeight:500 }}>Log Symptom</div>
                    <div style={{ fontSize:'11px', color:'#C5D3D3', fontWeight:300 }}>Fever, colic, rash</div>
                  </div>
                </button>
                <button className="logger-quick" onClick={() => setShowMedModal(true)}
                  style={{ background:'rgba(100,130,180,0.06)', color:'#4a5a8a', border:'1px solid rgba(100,130,180,0.15)' }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(100,130,180,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>💊</div>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontSize:'13px', fontWeight:500 }}>Log Medication</div>
                    <div style={{ fontSize:'11px', color:'#C5D3D3', fontWeight:300 }}>Vitamins, prescriptions</div>
                  </div>
                </button>
              </div>

              <div style={{ padding:'16px 20px', borderRadius:'18px', background:'rgba(72,122,123,0.06)', border:'1px solid rgba(72,122,123,0.12)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ fontSize:'36px' }}>✋</div>
                <div>
                  <div className="sans" style={{ color:'#487A7B', fontSize:'14px', fontWeight:500 }}>Open Palm — Emergency Help</div>
                  <div className="sans" style={{ color:'#9CAF88', fontSize:'12px', fontWeight:300, marginTop:'2px' }}>Show your open palm to the camera to instantly open the emergency panel</div>
                </div>
              </div>

              <div style={{ marginBottom:'24px' }}>
                <CameraComponent onGestureDetected={handleGesture} />
              </div>

              {lastGesture && (
                <div style={{ marginBottom:'20px', padding:'12px 18px', borderRadius:'14px', background:'rgba(212,165,165,0.12)', border:'1px solid rgba(212,165,165,0.25)', textAlign:'center' }}>
                  <span className="sans" style={{ color:'#487A7B', fontSize:'14px' }}>
                    Detected: <strong>{lastGesture === 'OPEN_PALM' ? 'Open Palm — Emergency opened' : lastGesture}</strong>
                  </span>
                </div>
              )}

              <h3 className="sans" style={{ color:'#487A7B', fontSize:'12px', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'14px' }}>Recent Activity</h3>
              {logs.length === 0 ? (
                <div style={{ textAlign:'center', padding:'36px', color:'#C5D3D3', fontFamily:'DM Sans,sans-serif', fontSize:'14px', fontWeight:300 }}>
                  No logs yet — use the buttons above to begin
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

          {/* Baby Tracker tab */}
          {activeTab === 'baby' && (
            <BabyTracker
              onStartFeed={()=>{ setActiveTab('gesture'); setTimeout(handleFeedingToggle, 100); }}
              onStartSleep={()=>{ setActiveTab('gesture'); setTimeout(handleSleepToggle, 100); }}
            />
          )}

          {/* Mood tab — full implementation */}
          {activeTab === 'mood' && <MoodTracker />}

        </div>
      </main>

      {/* FABs */}
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

      {/* Symptom Modal */}
      {showSymptomModal && (
        <div className="modal-back" onClick={e => { if (e.target === e.currentTarget) setShowSymptomModal(false); }}>
          <div className="modal-sheet">
            <h3 className="serif" style={{ fontSize:'28px', fontWeight:300, color:'#487A7B', marginBottom:'6px' }}>Log a Symptom</h3>
            <p className="sans" style={{ color:'#9CAF88', fontSize:'13px', marginBottom:'22px' }}>Note what you have observed — visible in Baby Tracker</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'20px' }}>
              <div>
                <label className="modal-label">Symptom *</label>
                <input style={inp} type="text" placeholder="e.g. Mild fever, Colic, Diaper rash" value={symName} onChange={e => setSymName(e.target.value)} />
              </div>
              <div>
                <label className="modal-label">Temperature °F — optional</label>
                <input style={{...inp, width:'120px'}} type="number" placeholder="98.6" value={symTemp} onChange={e => setSymTemp(e.target.value)} />
              </div>
              <div>
                <label className="modal-label">Notes — optional</label>
                <textarea style={{...inp, resize:'none', fontFamily:'DM Sans,sans-serif'}} rows={3} placeholder="Any additional observations" value={symNotes} onChange={e => setSymNotes(e.target.value)} />
              </div>
              <button className="check-toggle" onClick={() => setSymResolved(!symResolved)}
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
                Save Symptom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medication Modal */}
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
              <button className="check-toggle" onClick={() => setMedOngoing(!medOngoing)}
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
                Save Medication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div style={{ position:'fixed', inset:0, background:'rgba(60,75,75,0.45)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', zIndex:100 }}>
          <div style={{ background:'#FFFFFF', borderRadius:'28px', padding:'36px', maxWidth:'460px', width:'100%', boxShadow:'0 24px 80px rgba(0,0,0,0.15)', maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
            <button className="close-btn" onClick={() => setShowHelp(false)}><FaTimes /></button>
            <h2 className="serif" style={{ fontSize:'32px', fontWeight:300, color:'#487A7B', marginBottom:'6px' }}>Emergency Help</h2>
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
              {emergencyContact ? `Contact: ${emergencyContact}` : '+ Set emergency contact'}
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

      {/* Emergency Contact Modal */}
      {showEmergencyModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(60,75,75,0.45)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', zIndex:100 }}>
          <div style={{ background:'#FFFFFF', borderRadius:'28px', padding:'36px', maxWidth:'420px', width:'100%', boxShadow:'0 24px 80px rgba(0,0,0,0.15)', position:'relative' }}>
            <button className="close-btn" onClick={() => setShowEmergencyModal(false)}><FaTimes /></button>
            <h2 className="serif" style={{ fontSize:'28px', fontWeight:300, color:'#487A7B', marginBottom:'8px' }}>Emergency Contact</h2>
            <p className="sans" style={{ color:'#9CAF88', fontSize:'14px', fontWeight:300, marginBottom:'24px' }}>Saved locally on your device</p>
            <input type="tel" placeholder="Enter phone number" value={emergencyInput} onChange={e => setEmergencyInput(e.target.value)} style={{ ...inp, marginBottom:'16px' }} />
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