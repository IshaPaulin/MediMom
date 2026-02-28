import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaSignOutAlt } from 'react-icons/fa';
import Logo from '../assets/logo/MediMom_logo.svg';

// ── Milestone data ────────────────────────────────────────────────────────────
const DATA = {
  0: {
    size: 'Cantaloupe 🍈', weight: '3–4 kg', length: '48–53 cm',
    sleepRange: '14–17',
    zones: {
      brain:  { label: 'Brain & Senses', emoji: '🧠', color: '#D4A5A5', facts: ['Responds to familiar voices immediately', 'Sensitive to light and touch', 'Smell recognises caregiver within days'] },
      eyes:   { label: 'Vision',         emoji: '👀', color: '#9CAF88', facts: ['Focuses 20–30 cm — perfect for feeding distance', 'Prefers faces over all other objects', 'Detects high-contrast black & white patterns'] },
      ears:   { label: 'Hearing',        emoji: '👂', color: '#487A7B', facts: ['Startles at sudden sounds', 'Calms instantly to a known voice', 'Turns head slowly toward sound'] },
      arms:   { label: 'Arms & Hands',   emoji: '💪', color: '#B8C9C9', facts: ['Palmar grasp reflex — fingers curl around yours', 'Fists mostly closed at rest', 'Random, uncoordinated arm movements'] },
      legs:   { label: 'Legs & Feet',    emoji: '🦵', color: '#9CAF88', facts: ['Stepping reflex — lifts legs when feet touch surface', 'Knees remain bent and curled', 'Kicking strengthens hip flexors'] },
      heart:  { label: 'Growth',         emoji: '❤️', color: '#D4A5A5', facts: ['May lose 5–7% birth weight in week 1 — normal', 'Regains birth weight by ~day 14', 'Grows ~2.5 cm per month on average'] },
    },
    milestones: ['Rooting & sucking reflexes active', 'Crying is primary communication', 'Sleeps 14–17 hrs/day in short bursts', 'Recognises caregiver scent'],
  },
  1: {
    size: 'Papaya 🍑', weight: '4.5–5.5 kg', length: '54–58 cm',
    sleepRange: '14–17',
    zones: {
      brain:  { label: 'Brain & Senses', emoji: '🧠', color: '#D4A5A5', facts: ['Social smiling begins — the first real reward', 'Starts associating routines with outcomes', 'Responds to gentle cooing and singing'] },
      eyes:   { label: 'Vision',         emoji: '👀', color: '#9CAF88', facts: ['Tracks slow-moving objects side to side', 'Colour vision developing — prefers red & yellow', 'Holds eye contact for several seconds'] },
      ears:   { label: 'Hearing',        emoji: '👂', color: '#487A7B', facts: ["Recognises mother's voice distinctly", 'Quiets to familiar music or white noise', 'Begins making soft cooing sounds in response'] },
      arms:   { label: 'Arms & Hands',   emoji: '💪', color: '#B8C9C9', facts: ['Hands open more frequently at rest', 'Accidental batting at hanging objects', 'Tummy time: holds head briefly at 45°'] },
      legs:   { label: 'Legs & Feet',    emoji: '🦵', color: '#9CAF88', facts: ['Kicks more vigorously and intentionally', 'Enjoys gentle bicycle leg movements', 'Begins bearing slight weight when held upright'] },
      heart:  { label: 'Growth',         emoji: '❤️', color: '#D4A5A5', facts: ['Gains ~150–200 g per week', 'Head circumference increases ~2 cm/month', 'Fat stores rounding out cheeks and limbs'] },
    },
    milestones: ['First social smile 😊', 'Better head control on tummy time', 'Cooing and vowel sounds begin', 'Sleep stretches slightly longer at night'],
  },
  2: {
    size: 'Coconut 🥥', weight: '5.5–6.5 kg', length: '58–62 cm',
    sleepRange: '14–16',
    zones: {
      brain:  { label: 'Brain & Senses', emoji: '🧠', color: '#D4A5A5', facts: ['Anticipates feeding by sight of bottle/breast', 'Recognises own name', 'More alert and curious about surroundings'] },
      eyes:   { label: 'Vision',         emoji: '👀', color: '#9CAF88', facts: ['Tracks objects across full 180° field', 'Distinguishes between caregiver faces', 'Fascinated by mirrors — discovers own reflection'] },
      ears:   { label: 'Hearing',        emoji: '👂', color: '#487A7B', facts: ['Laughs and squeals begin', 'Turns head toward voices across the room', 'Responds to own name consistently'] },
      arms:   { label: 'Arms & Hands',   emoji: '💪', color: '#B8C9C9', facts: ['Reaches and bats at toys intentionally', 'Hands brought together at midline', 'Begins grasping objects when placed in palm'] },
      legs:   { label: 'Legs & Feet',    emoji: '🦵', color: '#9CAF88', facts: ['Pushes up on forearms during tummy time', 'Rolls from tummy to back (some babies)', 'Enjoys standing supported and bouncing'] },
      heart:  { label: 'Growth',         emoji: '❤️', color: '#D4A5A5', facts: ['Double birth weight expected around month 4–5', 'Growth spurts common — may feed more frequently', 'Sleeping longer 4–6 hr stretches at night'] },
    },
    milestones: ['Laughing out loud 😂', 'Rolls tummy to back', 'Reaches for objects deliberately', 'First longer night sleep stretches'],
  },
  3: {
    size: 'Pineapple 🍍', weight: '6.5–7.5 kg', length: '62–66 cm',
    sleepRange: '12–16',
    zones: {
      brain:  { label: 'Brain & Senses', emoji: '🧠', color: '#D4A5A5', facts: ['Object permanence beginning to form', 'Stranger anxiety may start appearing', 'Imitates facial expressions and sounds'] },
      eyes:   { label: 'Vision',         emoji: '👀', color: '#9CAF88', facts: ['Near-adult colour vision established', 'Depth perception developing', 'Fascinated by small details and textures'] },
      ears:   { label: 'Hearing',        emoji: '👂', color: '#487A7B', facts: ['Babbling — consonant + vowel combinations (ba, da)', 'Turns toward name reliably', 'Responds to different emotional tones of voice'] },
      arms:   { label: 'Arms & Hands',   emoji: '💪', color: '#B8C9C9', facts: ['Transfers objects hand to hand', 'Raking grasp developing', 'Brings everything to mouth to explore'] },
      legs:   { label: 'Legs & Feet',    emoji: '🦵', color: '#9CAF88', facts: ['Sits with minimal support', 'Rolls both directions', 'May begin army crawl or creeping'] },
      heart:  { label: 'Growth',         emoji: '❤️', color: '#D4A5A5', facts: ['Ready for solid foods (4–6 month window)', 'Weight gain slows slightly to ~100 g/week', 'First teeth may begin erupting'] },
    },
    milestones: ['Sits with support 🪑', 'Babbling begins (ba, da, ma)', 'Transfers objects between hands', 'Solid foods window opens'],
  },
  4: {
    size: 'Butternut squash 🎃', weight: '7–8.5 kg', length: '65–70 cm',
    sleepRange: '12–15',
    zones: {
      brain:  { label: 'Brain & Senses', emoji: '🧠', color: '#D4A5A5', facts: ['Understands cause and effect', 'Enjoys peek-a-boo — grasps object permanence', 'Shows clear preferences for toys and people'] },
      eyes:   { label: 'Vision',         emoji: '👀', color: '#9CAF88', facts: ['Tracks fast-moving objects easily', 'Looks for dropped objects — memory forming', 'Reaches accurately for small objects'] },
      ears:   { label: 'Hearing',        emoji: '👂', color: '#487A7B', facts: ['Responds to own name across the room', 'Understands "no" tone even without words', 'Mimics sounds and intonation patterns'] },
      arms:   { label: 'Arms & Hands',   emoji: '💪', color: '#B8C9C9', facts: ['Pincer grasp developing (finger + thumb)', 'Bangs objects on surfaces', 'Points at things of interest'] },
      legs:   { label: 'Legs & Feet',    emoji: '🦵', color: '#9CAF88', facts: ['Crawling — some babies pull to stand', 'Cruising along furniture begins', 'First steps may appear late this month'] },
      heart:  { label: 'Growth',         emoji: '❤️', color: '#D4A5A5', facts: ['Eating solids 2–3 times daily', 'Gaining ~85 g/week', 'Separation anxiety peaks around now'] },
    },
    milestones: ['Crawling independently 🐛', 'Pulls to standing', 'Pincer grasp emerging', 'Understands cause & effect'],
  },
  5: {
    size: 'Honeydew melon 🍈', weight: '8–9.5 kg', length: '68–73 cm',
    sleepRange: '11–14',
    zones: {
      brain:  { label: 'Brain & Senses', emoji: '🧠', color: '#D4A5A5', facts: ['First words possible (mama, dada with meaning)', 'Waves bye-bye on cue', 'Follows two-step simple instructions'] },
      eyes:   { label: 'Vision',         emoji: '👀', color: '#9CAF88', facts: ['Adult-level visual acuity nearly reached', 'Loves picture books — points at images', 'Imitates actions seen in others'] },
      ears:   { label: 'Hearing',        emoji: '👂', color: '#487A7B', facts: ['Jargon babbling sounds like real speech', 'Understands ~20–50 words', 'Enjoys songs and rhymes with repetition'] },
      arms:   { label: 'Arms & Hands',   emoji: '💪', color: '#B8C9C9', facts: ['Stacks 2 blocks', 'Turns pages of board books', 'Scribbles with crayons when given one'] },
      legs:   { label: 'Legs & Feet',    emoji: '🦵', color: '#9CAF88', facts: ['First independent steps (some babies)', 'Cruises confidently along furniture', 'Bends to pick up objects without falling'] },
      heart:  { label: 'Growth',         emoji: '❤️', color: '#D4A5A5', facts: ['3x birth weight by 12 months on average', 'Eating a wide variety of soft table foods', 'Transition away from bottles beginning'] },
    },
    milestones: ['First words with meaning 🗣️', 'Standing independently', 'Waves and claps on cue', 'Drinking from sippy cup'],
  },
};

const ZONE_POSITIONS = {
  brain: { top: '2%',  left: '50%', transform: 'translate(-50%, 0)' },
  eyes:  { top: '15%', left: '36%', transform: 'translate(-50%, 0)' },
  ears:  { top: '15%', left: '64%', transform: 'translate(-50%, 0)' },
  arms:  { top: '44%', left: '20%', transform: 'translate(-50%, 0)' },
  legs:  { top: '72%', left: '50%', transform: 'translate(-50%, 0)' },
  heart: { top: '40%', left: '50%', transform: 'translate(-50%, 0)' },
};

// ── Baby SVG ──────────────────────────────────────────────────────────────────
const BabySVG = ({ activeZone, onZoneClick }) => {
  const pulse = (zone) => ({
    cursor: 'pointer',
    transition: 'filter 0.3s',
    filter: activeZone === zone
      ? 'drop-shadow(0 0 10px rgba(212,165,165,0.9))'
      : 'drop-shadow(0 0 0px transparent)',
  });
  return (
    <svg viewBox="0 0 160 340" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', maxHeight: '340px' }}>
      {/* Body / onesie */}
      <path d="M 50 160 L 48 244 Q 80 254 112 244 L 110 160 Q 80 172 50 160Z"
        fill="#AECBCB" opacity="0.75"
        style={pulse('heart')} onClick={() => onZoneClick('heart')} />
      <path d="M 50 160 Q 65 152 80 155 Q 95 152 110 160 L 100 175 Q 80 168 60 175Z"
        fill="#87B5B5" opacity="0.85"
        style={pulse('heart')} onClick={() => onZoneClick('heart')} />
      {/* Torso skin */}
      <ellipse cx="80" cy="200" rx="30" ry="40" fill="#F9E8DC"
        style={pulse('heart')} onClick={() => onZoneClick('heart')} />
      {/* Neck */}
      <rect x="73" y="102" width="14" height="14" rx="4" fill="#F9E8DC" />
      {/* Head */}
      <ellipse cx="80" cy="68" rx="34" ry="38" fill="#F9E8DC"
        style={pulse('brain')} onClick={() => onZoneClick('brain')} />
      {/* Hair */}
      <ellipse cx="80" cy="36" rx="30" ry="14" fill="#C4956A" />
      <ellipse cx="80" cy="32" rx="26" ry="10" fill="#B07D50" />
      {/* Ears */}
      <g style={pulse('ears')} onClick={() => onZoneClick('ears')}>
        <ellipse cx="46" cy="68" rx="7" ry="9" fill="#F0C9AD" />
        <ellipse cx="114" cy="68" rx="7" ry="9" fill="#F0C9AD" />
      </g>
      {/* Eyes */}
      <g style={pulse('eyes')} onClick={() => onZoneClick('eyes')}>
        <ellipse cx="67" cy="63" rx="5.5" ry="6" fill="#fff" />
        <circle cx="68" cy="64" r="3.2" fill="#3a2a1a" />
        <circle cx="69.2" cy="62.8" r="1" fill="#fff" />
        <ellipse cx="93" cy="63" rx="5.5" ry="6" fill="#fff" />
        <circle cx="92" cy="64" r="3.2" fill="#3a2a1a" />
        <circle cx="93.2" cy="62.8" r="1" fill="#fff" />
      </g>
      {/* Nose */}
      <ellipse cx="80" cy="74" rx="3" ry="2.2" fill="#E8B899" />
      {/* Mouth */}
      <path d="M 73 82 Q 80 89 87 82" stroke="#C4806A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <ellipse cx="60" cy="76" rx="7" ry="4" fill="rgba(212,165,165,0.4)" />
      <ellipse cx="100" cy="76" rx="7" ry="4" fill="rgba(212,165,165,0.4)" />
      {/* Left arm */}
      <g style={pulse('arms')} onClick={() => onZoneClick('arms')}>
        <path d="M 50 165 C 32 155 23 178 27 196 C 31 210 43 213 49 206 C 55 198 52 184 50 165Z" fill="#F9E8DC" />
        <ellipse cx="35" cy="197" rx="9" ry="7" fill="#F0C9AD" />
        {/* Right arm */}
        <path d="M 110 165 C 128 155 137 178 133 196 C 129 210 117 213 111 206 C 105 198 108 184 110 165Z" fill="#F9E8DC" />
        <ellipse cx="125" cy="197" rx="9" ry="7" fill="#F0C9AD" />
      </g>
      {/* Left leg */}
      <g style={pulse('legs')} onClick={() => onZoneClick('legs')}>
        <path d="M 58 244 C 52 265 50 288 54 308 C 56 318 67 320 71 312 C 75 302 73 278 68 255Z" fill="#F9E8DC" />
        <ellipse cx="62" cy="312" rx="10" ry="6.5" fill="#D4A5A5" opacity="0.7" />
        {/* Right leg */}
        <path d="M 102 244 C 108 265 110 288 106 308 C 104 318 93 320 89 312 C 85 302 87 278 92 255Z" fill="#F9E8DC" />
        <ellipse cx="98" cy="312" rx="10" ry="6.5" fill="#D4A5A5" opacity="0.7" />
      </g>
    </svg>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const GrowthMilestones = () => {
  const { logout } = useAuth();
  const [monthIndex, setMonthIndex] = useState(0);
  const [activeZone, setActiveZone] = useState(null);
  const [babyDOB, setBabyDOB] = useState(() => localStorage.getItem('babyDOB') || '');
  const [showDOBModal, setShowDOBModal] = useState(false);
  const [dobInput, setDobInput] = useState('');

  const computedAge = (() => {
    if (!babyDOB) return null;
    const diffDays = Math.floor((Date.now() - new Date(babyDOB)) / 86400000);
    const months = Math.floor(diffDays / 30);
    const weeks  = Math.floor((diffDays % 30) / 7);
    return { months: Math.min(months, 5), weeks };
  })();

  useEffect(() => {
    if (computedAge) setMonthIndex(computedAge.months);
  }, [babyDOB]);

  const avgSleep = (() => {
    try {
      const h = JSON.parse(localStorage.getItem('sleepHistory') || '[]').slice(-7);
      if (!h.length) return null;
      return (h.reduce((s, e) => s + e.duration, 0) / h.length / 3600).toFixed(1);
    } catch { return null; }
  })();

  const feedCount = (() => {
    try { return JSON.parse(localStorage.getItem('feedingHistory') || '[]').slice(-7).length; }
    catch { return null; }
  })();

  const data = DATA[monthIndex];
  const MONTH_LABELS = ['Newborn', '1 Month', '2 Months', '3 Months', '4 Months', '5 Months'];
  const activeInfo = activeZone ? data.zones[activeZone] : null;

  const inp = { padding:'12px 16px', borderRadius:'12px', border:'1.5px solid rgba(156,175,136,0.35)', background:'#FAFAF8', fontFamily:'DM Sans,sans-serif', fontSize:'14px', color:'#487A7B', outline:'none', width:'100%', boxSizing:'border-box' };

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F6F3EE' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .serif { font-family:'Cormorant Garamond',Georgia,serif; }
        .sans  { font-family:'DM Sans',system-ui,sans-serif; }
        .mpill { padding:8px 18px; border-radius:40px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; transition:all 0.2s; white-space:nowrap; }
        .mpill-on  { background:#487A7B; color:#F6F3EE; box-shadow:0 4px 12px rgba(72,122,123,0.3); }
        .mpill-off { background:#fff; color:#487A7B; border:1px solid rgba(72,122,123,0.2); }
        .mpill-off:hover { background:rgba(72,122,123,0.06); }
        .zdot { position:absolute; width:30px; height:30px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:13px; transition:all 0.25s; z-index:10; }
        .zdot:hover { transform:scale(1.18); }
        .fade-in { animation:fi 0.3s ease; }
        @keyframes fi { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Header */}
      <header className="sans" style={{ background:'#fff', borderBottom:'1px solid rgba(212,165,165,0.25)', padding:'16px 32px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:'960px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
            <img src={Logo} alt="MediMom" style={{ height: '36px', objectFit: 'contain' }} />
            <span className="serif" style={{ fontSize:'20px', color:'#487A7B', fontWeight:400 }}>MediMom</span>
          </Link>
          <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
            <Link to="/dashboard" style={{ color:'#487A7B', fontFamily:'DM Sans,sans-serif', fontSize:'14px', textDecoration:'none', fontWeight:300 }}>← Dashboard</Link>
            <button onClick={logout} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 20px', borderRadius:'40px', border:'1.5px solid rgba(72,122,123,0.3)', background:'transparent', color:'#487A7B', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:'13px' }}>
              <FaSignOutAlt style={{ fontSize:'12px' }} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth:'960px', margin:'0 auto', padding:'40px 24px 100px' }}>

        {/* Title row */}
        <div style={{ marginBottom:'32px' }}>
          <h1 className="serif" style={{ fontSize:'clamp(36px,5vw,58px)', fontWeight:300, color:'#487A7B', lineHeight:1.1, marginBottom:'10px' }}>
            🌱 Growth &<span style={{ color:'#D4A5A5', fontStyle:'italic' }}> Milestones</span>
          </h1>
          {computedAge ? (
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ padding:'8px 18px', borderRadius:'40px', background:'rgba(156,175,136,0.15)', border:'1px solid rgba(156,175,136,0.3)' }}>
                <span className="sans" style={{ color:'#4a6b3a', fontSize:'14px' }}>
                  Your baby is <strong>{computedAge.months}m {computedAge.weeks}w old</strong>
                </span>
              </div>
              <button onClick={() => setShowDOBModal(true)} style={{ background:'transparent', border:'none', color:'#9CAF88', fontFamily:'DM Sans,sans-serif', fontSize:'13px', cursor:'pointer', textDecoration:'underline' }}>Change</button>
            </div>
          ) : (
            <button onClick={() => setShowDOBModal(true)} style={{ padding:'9px 22px', borderRadius:'40px', background:'rgba(72,122,123,0.1)', border:'1px solid rgba(72,122,123,0.2)', color:'#487A7B', fontFamily:'DM Sans,sans-serif', fontSize:'14px', cursor:'pointer' }}>
              + Enter baby's birth date for personalised view
            </button>
          )}
        </div>

        {/* Month pills */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'28px', overflowX:'auto', paddingBottom:'4px' }}>
          {[0,1,2,3,4,5].map(m => (
            <button key={m} onClick={() => { setMonthIndex(m); setActiveZone(null); }}
              className={`mpill ${monthIndex === m ? 'mpill-on' : 'mpill-off'}`}>
              {MONTH_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Size banner */}
        <div style={{ background:'linear-gradient(135deg, rgba(212,165,165,0.18) 0%, rgba(72,122,123,0.1) 100%)', borderRadius:'24px', padding:'20px 28px', marginBottom:'24px', border:'1px solid rgba(212,165,165,0.2)', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
          <div style={{ fontSize:'50px' }}>{data.size.split(' ').slice(-1)[0]}</div>
          <div>
            <div className="sans" style={{ color:'#9CAF88', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'4px' }}>Size comparison</div>
            <div className="serif" style={{ fontSize:'26px', color:'#487A7B', fontWeight:300, lineHeight:1.2 }}>
              About the size of a {data.size.split(' ').slice(0, -1).join(' ')}
            </div>
            <div className="sans" style={{ color:'#8BA8A9', fontSize:'13px', marginTop:'4px', fontWeight:300 }}>
              Weight: <strong>{data.weight}</strong> · Length: <strong>{data.length}</strong>
            </div>
          </div>
        </div>

        {/* Smart stats from logged data */}
        {(avgSleep || feedCount !== null) && (
          <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
            {avgSleep && (
              <div style={{ flex:1, minWidth:'200px', borderRadius:'18px', padding:'16px 20px', background:'rgba(156,175,136,0.12)', border:'1px solid rgba(156,175,136,0.25)' }}>
                <div className="sans" style={{ color:'#4a6b3a', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' }}>Avg sleep logged (last 7 sessions)</div>
                <div className="serif" style={{ fontSize:'28px', color:'#4a6b3a', fontWeight:300 }}>{avgSleep} hrs</div>
                <div className="sans" style={{ color:'#9CAF88', fontSize:'12px', marginTop:'4px' }}>Typical for this age: <strong>{data.sleepRange} hrs</strong></div>
                <div style={{ marginTop:'8px', height:'4px', borderRadius:'4px', background:'rgba(156,175,136,0.2)', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:'4px', background:'#9CAF88', width:`${Math.min(100, (parseFloat(avgSleep) / parseFloat(data.sleepRange.split('–')[1])) * 100)}%`, transition:'width 0.6s ease' }} />
                </div>
              </div>
            )}
            {feedCount !== null && feedCount > 0 && (
              <div style={{ flex:1, minWidth:'200px', borderRadius:'18px', padding:'16px 20px', background:'rgba(212,165,165,0.1)', border:'1px solid rgba(212,165,165,0.2)' }}>
                <div className="sans" style={{ color:'#8B5E5E', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' }}>Feeding sessions (last 7 logged)</div>
                <div className="serif" style={{ fontSize:'28px', color:'#8B5E5E', fontWeight:300 }}>{feedCount} sessions</div>
                <div className="sans" style={{ color:'#9CAF88', fontSize:'12px', marginTop:'4px' }}>Typical: 8–12 per day for this age</div>
              </div>
            )}
          </div>
        )}

        {/* Interactive area */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1.6fr)', gap:'20px', marginBottom:'24px', alignItems:'start' }}>

          {/* Baby + zone dots */}
          <div style={{ background:'#fff', borderRadius:'28px', padding:'24px 20px', boxShadow:'0 4px 40px rgba(72,122,123,0.07)', border:'1px solid rgba(212,165,165,0.1)' }}>
            <div className="sans" style={{ color:'#9CAF88', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'12px', textAlign:'center' }}>Tap a zone to explore</div>
            <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
              <div style={{ width:'160px', height:'340px', position:'relative' }}>
                <BabySVG activeZone={activeZone} onZoneClick={setActiveZone} />
                {Object.entries(ZONE_POSITIONS).map(([zone, pos]) => (
                  <button key={zone}
                    onClick={() => setActiveZone(activeZone === zone ? null : zone)}
                    className="zdot"
                    style={{
                      ...pos,
                      background: activeZone === zone ? data.zones[zone].color : 'rgba(255,255,255,0.92)',
                      border: `2px solid ${data.zones[zone].color}`,
                      boxShadow: activeZone === zone
                        ? `0 0 0 5px ${data.zones[zone].color}35, 0 2px 10px rgba(0,0,0,0.1)`
                        : '0 2px 8px rgba(0,0,0,0.1)',
                    }}>
                    {data.zones[zone].emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {activeInfo ? (
              <div className="fade-in" style={{ background:'#fff', borderRadius:'24px', padding:'26px', boxShadow:'0 4px 40px rgba(72,122,123,0.08)', border:`1.5px solid ${activeInfo.color}50` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'18px' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:`${activeInfo.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>
                    {activeInfo.emoji}
                  </div>
                  <div>
                    <div className="sans" style={{ color:'#9CAF88', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase' }}>Development focus</div>
                    <div className="serif" style={{ fontSize:'22px', color:'#487A7B', fontWeight:300 }}>{activeInfo.label}</div>
                  </div>
                </div>
                {activeInfo.facts.map((f, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'10px 0', borderBottom: i < activeInfo.facts.length - 1 ? '1px solid rgba(72,122,123,0.08)' : 'none' }}>
                    <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:activeInfo.color, flexShrink:0, marginTop:'6px' }} />
                    <span className="sans" style={{ color:'#6B8C8C', fontSize:'14px', lineHeight:1.65, fontWeight:300 }}>{f}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background:'#fff', borderRadius:'24px', padding:'32px', boxShadow:'0 4px 40px rgba(72,122,123,0.07)', border:'1px solid rgba(212,165,165,0.1)', textAlign:'center' }}>
                <div style={{ fontSize:'38px', marginBottom:'10px' }}>👆</div>
                <div className="serif" style={{ fontSize:'22px', color:'#487A7B', fontWeight:300, marginBottom:'6px' }}>Tap a zone</div>
                <div className="sans" style={{ color:'#9CAF88', fontSize:'13px', fontWeight:300, lineHeight:1.65 }}>
                  Select a body zone on the illustration — or use the chips below — to see what's developing this month
                </div>
              </div>
            )}

            {/* Zone chips */}
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {Object.entries(data.zones).map(([zone, info]) => (
                <button key={zone}
                  onClick={() => setActiveZone(activeZone === zone ? null : zone)}
                  style={{
                    padding:'7px 14px', borderRadius:'40px',
                    border:`1.5px solid ${info.color}60`,
                    background: activeZone === zone ? `${info.color}22` : 'transparent',
                    color:'#487A7B', fontFamily:'DM Sans,sans-serif', fontSize:'12px',
                    cursor:'pointer', transition:'all 0.2s',
                  }}>
                  {info.emoji} {info.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div style={{ background:'#fff', borderRadius:'24px', padding:'32px', boxShadow:'0 4px 40px rgba(72,122,123,0.07)', border:'1px solid rgba(212,165,165,0.1)' }}>
          <h3 className="serif" style={{ fontSize:'26px', fontWeight:300, color:'#487A7B', marginBottom:'4px' }}>Key Milestones</h3>
          <p className="sans" style={{ color:'#9CAF88', fontSize:'13px', fontWeight:300, marginBottom:'20px' }}>
            {MONTH_LABELS[monthIndex]} — what to look for and celebrate 🎉
          </p>
          {data.milestones.map((m, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px', padding:'12px 0', borderBottom: i < data.milestones.length - 1 ? '1px solid rgba(72,122,123,0.08)' : 'none' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'rgba(212,165,165,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>
                {['🎯','✨','💪','🌟','🎉','🥳'][i % 6]}
              </div>
              <span className="sans" style={{ color:'#6B8C8C', fontSize:'14px', lineHeight:1.65, fontWeight:300, paddingTop:'4px' }}>{m}</span>
            </div>
          ))}
        </div>
      </main>

      {/* DOB modal */}
      {showDOBModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(60,75,75,0.45)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', zIndex:100 }}>
          <div style={{ background:'#fff', borderRadius:'28px', padding:'36px', maxWidth:'360px', width:'100%', boxShadow:'0 24px 80px rgba(0,0,0,0.15)' }}>
            <h3 className="serif" style={{ fontSize:'28px', fontWeight:300, color:'#487A7B', marginBottom:'6px' }}>Baby's Birth Date</h3>
            <p className="sans" style={{ color:'#9CAF88', fontSize:'13px', marginBottom:'22px', fontWeight:300 }}>We'll auto-select the right milestone stage</p>
            <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:'12px', color:'#487A7B', letterSpacing:'0.05em', marginBottom:'8px' }}>DATE OF BIRTH</label>
            <input type="date" style={{ ...inp, marginBottom:'20px' }} value={dobInput} onChange={e => setDobInput(e.target.value)} max={new Date().toISOString().split('T')[0]} />
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setShowDOBModal(false)} style={{ flex:1, padding:'13px', borderRadius:'14px', border:'1.5px solid rgba(72,122,123,0.2)', background:'transparent', color:'#487A7B', fontFamily:'DM Sans,sans-serif', fontSize:'14px', cursor:'pointer' }}>Cancel</button>
              <button onClick={() => { if (dobInput) { localStorage.setItem('babyDOB', dobInput); setBabyDOB(dobInput); setShowDOBModal(false); } }}
                disabled={!dobInput}
                style={{ flex:2, padding:'13px', borderRadius:'14px', border:'none', background:dobInput?'#487A7B':'#C5D3D3', color:'#F6F3EE', fontFamily:'DM Sans,sans-serif', fontSize:'15px', cursor:dobInput?'pointer':'not-allowed' }}>
                Save ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthMilestones;