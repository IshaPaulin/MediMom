// src/components/BabyTracker.jsx

import { useState, useEffect } from 'react';

// ── Helpers ────────────────────────────────────────────────────────
const fmtDur = (s) => {
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sc = s%60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${String(sc).padStart(2,'0')}s`;
  return `${sc}s`;
};
const fmtTime = (ts) => new Date(ts).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true});
const fmtDate = (ts) => new Date(ts).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const fmtDateShort = (ts) => {
  const d=new Date(ts), today=new Date(); today.setHours(0,0,0,0);
  const yesterday=new Date(today); yesterday.setDate(today.getDate()-1);
  if(d>=today) return 'Today';
  if(d>=yesterday) return 'Yesterday';
  return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short'});
};

const FEED_GAP  = 3;
const SLEEP_GAP = 4;
const DISMISS_KEY = 'catchup_dismissed_until';

// ── Shared styles ──────────────────────────────────────────────────
const STYLES = `
  .bt-sans  { font-family:'DM Sans',sans-serif; }
  .bt-serif { font-family:'Cormorant Garamond',Georgia,serif; }
  .pill { padding:11px 20px; border-radius:40px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:400; display:flex; align-items:center; gap:8px; transition:all 0.2s; white-space:nowrap; }
  .pill:hover { transform:translateY(-1px); filter:brightness(1.05); }
  .section-tab { padding:8px 18px; border-radius:30px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; transition:all 0.2s; white-space:nowrap; }
  .tl-row { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:14px; margin-bottom:5px; transition:background 0.15s; }
  .day-lbl { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; color:#B8C9C9; letter-spacing:0.1em; text-transform:uppercase; margin:16px 0 6px; }
  .card { padding:18px 20px; border-radius:18px; margin-bottom:10px; }
  .modal-back { position:fixed; inset:0; background:rgba(60,75,75,0.5); backdrop-filter:blur(6px); display:flex; align-items:flex-end; justify-content:center; z-index:200; }
  .modal-sheet { background:#FFFFFF; border-radius:28px 28px 0 0; padding:32px 28px 44px; width:100%; max-width:520px; box-shadow:0 -12px 60px rgba(0,0,0,0.15); max-height:85vh; overflow-y:auto; }
  .step-prog { height:3px; flex:1; border-radius:2px; transition:background 0.3s; }
  .kind-btn { flex:1; padding:14px; border-radius:14px; border:1.5px solid rgba(72,122,123,0.2); background:#FAFAF8; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; color:#487A7B; transition:all 0.2s; }
  .kind-btn.active { background:rgba(72,122,123,0.1); border-color:#487A7B; font-weight:500; }
  .t-inp { padding:12px 14px; border-radius:12px; border:1.5px solid rgba(156,175,136,0.4); background:#FAFAF8; font-family:'DM Sans',sans-serif; font-size:15px; color:#487A7B; outline:none; text-align:center; transition:all 0.2s; box-sizing:border-box; }
  .t-inp:focus { border-color:#487A7B; box-shadow:0 0 0 3px rgba(72,122,123,0.08); }
  .t-inp::placeholder { color:#C5D3D3; }
  .save-btn { width:100%; padding:14px; border-radius:14px; border:none; background:#487A7B; color:#F6F3EE; font-family:'DM Sans',sans-serif; font-size:15px; cursor:pointer; transition:all 0.2s; }
  .back-btn { flex:1; padding:13px; border-radius:14px; border:1.5px solid rgba(72,122,123,0.2); background:transparent; color:#487A7B; font-family:'DM Sans',sans-serif; font-size:14px; cursor:pointer; }
`;

export default function BabyTracker({ onStartFeed, onStartSleep }) {
  // ── Data state ─────────────────────────────────────────────────
  const [feedings,    setFeedings]    = useState([]);
  const [sleeps,      setSleeps]      = useState([]);
  const [symptoms,    setSymptoms]    = useState([]);
  const [medications, setMedications] = useState([]);
  const [visits,      setVisits]      = useState([]);
  const [babyProfile, setBabyProfile] = useState(null);

  // ── UI state ───────────────────────────────────────────────────
  const [reminder,   setReminder]   = useState(null);
  const [section,    setSection]    = useState('timeline'); // timeline | meds | visits | vaccines
  const [exporting,  setExporting]  = useState(false);

  // ── Past entry modal ───────────────────────────────────────────
  const [showPast,   setShowPast]   = useState(false);
  const [pastStep,   setPastStep]   = useState(1);
  const [pastKind,   setPastKind]   = useState('feeding');
  const [pastH,      setPastH]      = useState('');
  const [pastM,      setPastM]      = useState('');
  const [pastAmPm,   setPastAmPm]   = useState('AM');
  const [pastDur,    setPastDur]    = useState('');

  // ── Symptom log modal ──────────────────────────────────────────
  const [showSymptom,  setShowSymptom]  = useState(false);
  const [symName,      setSymName]      = useState('');
  const [symTemp,      setSymTemp]      = useState('');
  const [symNotes,     setSymNotes]     = useState('');
  const [symResolved,  setSymResolved]  = useState(false);

  // ── Med log modal ──────────────────────────────────────────────
  const [showMed,    setShowMed]    = useState(false);
  const [medName,    setMedName]    = useState('');
  const [medDose,    setMedDose]    = useState('');
  const [medFreq,    setMedFreq]    = useState('');
  const [medNotes,   setMedNotes]   = useState('');
  const [medOngoing, setMedOngoing] = useState(true);

  // ── Load ───────────────────────────────────────────────────────
  const load = () => {
    const f = JSON.parse(localStorage.getItem('feedingHistory')  || '[]').sort((a,b)=>b.id-a.id);
    const s = JSON.parse(localStorage.getItem('sleepHistory')    || '[]').sort((a,b)=>b.id-a.id);
    const sy= JSON.parse(localStorage.getItem('symptoms')        || '[]').sort((a,b)=>b.id-a.id);
    const m = JSON.parse(localStorage.getItem('medications')     || '[]');
    const v = JSON.parse(localStorage.getItem('doctorVisits')    || '[]').sort((a,b)=>b.date-a.date);
    const p = JSON.parse(localStorage.getItem('babyProfile')     || 'null');
    setFeedings(f); setSleeps(s); setSymptoms(sy);
    setMedications(m); setVisits(v); setBabyProfile(p);
    checkReminder(f, s);
  };
  useEffect(() => { load(); }, []);

  // ── Catch-up reminder ──────────────────────────────────────────
  const checkReminder = (f, s) => {
    const until = parseInt(localStorage.getItem(DISMISS_KEY)||'0');
    if (Date.now() < until) { setReminder(null); return; }
    const now = Date.now();
    const feedGap  = f[0] ? (now - f[0].id)/3600000 : 0;
    const sleepGap = s[0] ? (now - s[0].id)/3600000 : 0;
    if (feedGap  > FEED_GAP  && f[0]) setReminder({ type:'feeding', message:"Let's keep the timeline complete — want to log a feed?" });
    else if (sleepGap > SLEEP_GAP && s[0]) setReminder({ type:'sleep',   message:"Want to update today's timeline with a sleep entry?" });
    else setReminder(null);
  };
  const dismiss = () => { localStorage.setItem(DISMISS_KEY, String(Date.now()+86400000)); setReminder(null); };

  // ── Save past entry ────────────────────────────────────────────
  const savePast = () => {
    let h = parseInt(pastH);
    if (pastAmPm==='PM' && h!==12) h+=12;
    if (pastAmPm==='AM' && h===12) h=0;
    const d = new Date(); d.setHours(h, parseInt(pastM), 0, 0);
    const ts = d.getTime();
    const dur = parseInt(pastDur||0)*60 || (pastKind==='feeding'?600:3600);
    const key = pastKind==='feeding'?'feedingHistory':'sleepHistory';
    const hist = JSON.parse(localStorage.getItem(key)||'[]');
    localStorage.setItem(key, JSON.stringify([...hist,{id:ts,duration:dur,time:fmtTime(ts)}]));
    setShowPast(false); setPastStep(1); setPastH(''); setPastM(''); setPastDur('');
    load();
  };

  // ── Save symptom ───────────────────────────────────────────────
  const saveSymptom = () => {
    if (!symName) return;
    const existing = JSON.parse(localStorage.getItem('symptoms')||'[]');
    const entry = { id: Date.now(), date: Date.now(), symptom: symName, temperature: symTemp||null, notes: symNotes, resolved: symResolved, actionTaken: '' };
    localStorage.setItem('symptoms', JSON.stringify([...existing, entry]));
    setShowSymptom(false); setSymName(''); setSymTemp(''); setSymNotes(''); setSymResolved(false);
    load();
  };

  // ── Save medication ────────────────────────────────────────────
  const saveMed = () => {
    if (!medName) return;
    const existing = JSON.parse(localStorage.getItem('medications')||'[]');
    const entry = { id: Date.now(), name: medName, dosage: medDose, frequency: medFreq, startDate: Date.now(), ongoing: medOngoing, notes: medNotes };
    localStorage.setItem('medications', JSON.stringify([...existing, entry]));
    setShowMed(false); setMedName(''); setMedDose(''); setMedFreq(''); setMedNotes(''); setMedOngoing(true);
    load();
  };

  // ── Toggle symptom resolved ────────────────────────────────────
  const toggleResolved = (id) => {
    const updated = symptoms.map(s => s.id===id ? {...s, resolved:!s.resolved} : s);
    localStorage.setItem('symptoms', JSON.stringify(updated));
    setSymptoms(updated);
  };

  // ── PDF ────────────────────────────────────────────────────────
  const exportPDF = async () => {
    setExporting(true);
    if (!window.jspdf) {
      await new Promise((res,rej) => {
        const s=document.createElement('script');
        s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload=res; s.onerror=rej; document.head.appendChild(s);
      });
    }
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const W=210, mg=18;
    let y=0;

    const teal=[72,122,123], rose=[212,165,165], cream=[246,243,238], grey=[140,168,169], green=[156,175,136];

    const addPage = () => { doc.addPage(); y=18; };
    const checkY = (need=20) => { if(y+need>275) addPage(); };

    const sectionHeader = (title, color=teal) => {
      checkY(14);
      doc.setFillColor(...color);
      doc.roundedRect(mg, y, W-mg*2, 10, 2, 2, 'F');
      doc.setTextColor(246,243,238); doc.setFontSize(9); doc.setFont('helvetica','bold');
      doc.text(title.toUpperCase(), mg+5, y+6.5);
      y += 14;
    };

    // ── Cover header ──────────────────────────────────────────
    doc.setFillColor(...teal);
    doc.rect(0,0,W,40,'F');
    doc.setTextColor(...cream); doc.setFontSize(22); doc.setFont('helvetica','bold');
    doc.text('MediMom', mg, 16);
    doc.setFontSize(11); doc.setFont('helvetica','normal');
    doc.text('Baby Health Report for Doctor', mg, 24);
    doc.setFontSize(8); doc.setTextColor(190,215,215);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, mg, 32);
    if (babyProfile) {
      doc.setTextColor(...cream); doc.setFontSize(10);
      doc.text(`${babyProfile.name || 'Baby'} · ${babyProfile.ageWeeks}w old · ${babyProfile.currentWeight}kg`, W-mg, 24, {align:'right'});
    }
    y = 50;

    // ── Baby profile ──────────────────────────────────────────
    if (babyProfile) {
      sectionHeader('Baby Profile');
      const cols = [
        [`Age`, `${babyProfile.ageWeeks} weeks`],
        [`Current Weight`, `${babyProfile.currentWeight} kg`],
        [`Current Length`, `${babyProfile.currentLength} cm`],
        [`Head Circumference`, `${babyProfile.headCircumference} cm`],
        [`Birth Weight`, `${babyProfile.birthWeight} kg`],
      ];
      cols.forEach(([label, val], i) => {
        const x = i%2===0 ? mg : mg+90;
        if (i%2===0) { checkY(8); doc.setFillColor(i%4===0?252:246, i%4===0?252:243, i%4===0?250:238); doc.rect(mg,y,W-mg*2,7,'F'); }
        doc.setTextColor(100,130,130); doc.setFontSize(8); doc.setFont('helvetica','normal');
        doc.text(label, x+2, y+5);
        doc.setTextColor(60,80,80); doc.setFont('helvetica','bold');
        doc.text(val, x+60, y+5);
        if (i%2===1) y+=7;
      });
      if (cols.length%2!==0) y+=7;
      y+=6;
    }

    // ── Symptoms ──────────────────────────────────────────────
    if (symptoms.length > 0) {
      sectionHeader('Symptoms & Concerns', [180,100,100]);
      symptoms.forEach((s, i) => {
        checkY(18);
        doc.setFillColor(i%2===0?252:248, i%2===0?248:244, i%2===0?248:244);
        doc.rect(mg, y, W-mg*2, 16, 'F');
        doc.setFillColor(...(s.resolved ? green : rose));
        doc.rect(mg, y, 3, 16, 'F');
        doc.setTextColor(60,80,80); doc.setFontSize(9); doc.setFont('helvetica','bold');
        doc.text(s.symptom, mg+6, y+6);
        doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(100,130,130);
        doc.text(fmtDate(s.date), mg+6, y+12);
        if (s.temperature) doc.text(`Temp: ${s.temperature}°F`, mg+60, y+12);
        if (s.notes) doc.text(s.notes.slice(0,60), mg+100, y+12);
        doc.setTextColor(s.resolved ? 80:180, s.resolved?130:80, s.resolved?80:80);
        doc.text(s.resolved?'Resolved':'Active', W-mg-20, y+8);
        y += 18;
      });
      y += 4;
    }

    // ── Medications ───────────────────────────────────────────
    if (medications.length > 0) {
      sectionHeader('Medications & Supplements', [100,130,180]);
      medications.forEach((m, i) => {
        checkY(16);
        doc.setFillColor(i%2===0?250:246, i%2===0?252:248, i%2===0?255:252);
        doc.rect(mg, y, W-mg*2, 14, 'F');
        doc.setTextColor(60,80,80); doc.setFontSize(9); doc.setFont('helvetica','bold');
        doc.text(m.name, mg+4, y+6);
        doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(100,130,130);
        const detail = [m.dosage, m.frequency, m.notes].filter(Boolean).join(' · ');
        doc.text(detail.slice(0,80), mg+4, y+11);
        doc.setTextColor(...(m.ongoing ? green : grey));
        doc.text(m.ongoing?'Ongoing':'Completed', W-mg-22, y+6);
        doc.setTextColor(...grey); doc.text(`Started: ${fmtDate(m.startDate)}`, W-mg-38, y+11);
        y += 16;
      });
      y += 4;
    }

    // ── Doctor visits ─────────────────────────────────────────
    if (visits.length > 0) {
      sectionHeader('Doctor Visits', [130,100,170]);
      visits.forEach((v, i) => {
        checkY(18);
        doc.setFillColor(i%2===0?252:248, i%2===0?250:246, i%2===0?255:252);
        doc.rect(mg, y, W-mg*2, 16, 'F');
        doc.setTextColor(60,80,80); doc.setFontSize(9); doc.setFont('helvetica','bold');
        doc.text(v.visitType||'Visit', mg+4, y+6);
        doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(100,130,130);
        doc.text(fmtDate(v.date), mg+4, y+12);
        if (v.doctor) doc.text(v.doctor, mg+40, y+12);
        if (v.findings) doc.text(v.findings.slice(0,60), mg+4, y+16);
        y += 18;
      });
      y += 4;
    }

    // ── Vaccines ──────────────────────────────────────────────
    if (babyProfile?.vaccinesGiven?.length) {
      sectionHeader('Immunisation', [80,150,130]);
      checkY(10);
      doc.setTextColor(60,80,80); doc.setFontSize(9); doc.setFont('helvetica','bold');
      doc.text('Given:', mg+2, y+6);
      doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(100,130,130);
      doc.text(babyProfile.vaccinesGiven.join(', '), mg+20, y+6);
      y += 10;
      if (babyProfile.nextVaccine) {
        checkY(10);
        doc.setTextColor(180,100,80); doc.setFontSize(9); doc.setFont('helvetica','bold');
        doc.text('Due Next:', mg+2, y+6);
        doc.setFont('helvetica','normal');
        doc.text(`${babyProfile.nextVaccine} — ${fmtDate(babyProfile.nextVaccineDate)}`, mg+24, y+6);
        y += 12;
      }
    }

    // ── Feed/sleep summary ────────────────────────────────────
    const weekAgo = Date.now()-7*86400000;
    const wf = feedings.filter(f=>f.id>=weekAgo);
    const ws = sleeps.filter(s=>s.id>=weekAgo);
    sectionHeader('Feeding & Sleep — Last 7 Days');
    checkY(12);
    doc.setFillColor(...cream); doc.roundedRect(mg,y,W-mg*2,10,2,2,'F');
    doc.setTextColor(...teal); doc.setFontSize(8); doc.setFont('helvetica','normal');
    doc.text(`${wf.length} feeds · avg ${(wf.length/7).toFixed(1)}/day · avg duration ${wf.length?fmtDur(Math.round(wf.reduce((a,f)=>a+f.duration,0)/wf.length)):'—'}`, mg+4, y+6.5);
    doc.text(`${ws.length} sleep sessions · avg ${(ws.reduce((a,s)=>a+s.duration,0)/7/3600).toFixed(1)}h sleep/day`, mg+4, y+10.5);
    y += 16;

    // ── Footer all pages ──────────────────────────────────────
    const pages = doc.getNumberOfPages();
    for (let i=1;i<=pages;i++) {
      doc.setPage(i);
      doc.setFillColor(...teal); doc.rect(0,287,W,10,'F');
      doc.setTextColor(190,215,215); doc.setFontSize(7);
      doc.text('MediMom — Not a diagnostic tool. Always consult your healthcare provider.', mg, 293);
      doc.text(`Page ${i} of ${pages}`, W-mg, 293, {align:'right'});
    }

    doc.save(`MediMom_DoctorReport_${new Date().toISOString().slice(0,10)}.pdf`);
    setExporting(false);
  };

  // ── Timeline ───────────────────────────────────────────────────
  const timeline = [
    ...feedings.map(f=>({...f,kind:'feeding'})),
    ...sleeps.map(s=>({...s,kind:'sleep'})),
  ].sort((a,b)=>b.id-a.id);

  const grouped = timeline.reduce((acc,e) => {
    const lbl = fmtDateShort(e.id);
    if (!acc[lbl]) acc[lbl]=[];
    acc[lbl].push(e);
    return acc;
  }, {});

  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const todayFeeds = feedings.filter(f=>f.id>=todayStart.getTime());
  const todaySleeps= sleeps.filter(s=>s.id>=todayStart.getTime());

  const activeSymptoms = symptoms.filter(s=>!s.resolved);
  const nextVaccine = babyProfile?.nextVaccine;
  const nextVaccineDate = babyProfile?.nextVaccineDate;
  const daysToVaccine = nextVaccineDate ? Math.ceil((nextVaccineDate-Date.now())/86400000) : null;

  const SECTIONS = [
    { id:'timeline',  label:'Timeline' },
    { id:'meds',      label:'Medications' },
    { id:'visits',    label:'Doctor Visits' },
    { id:'vaccines',  label:'Vaccines' },
  ];

  return (
    <div>
      <style>{STYLES}</style>

      {/* ── Heading ──────────────────────────────────────────── */}
      <div style={{marginBottom:'20px'}}>
        <h2 className="bt-serif" style={{fontSize:'36px',fontWeight:300,color:'#487A7B',marginBottom:'4px'}}>Baby Tracker</h2>
        <p className="bt-sans" style={{color:'#9CAF88',fontSize:'14px',fontWeight:300}}>Feeds · Sleep · Health</p>
      </div>

      {/* ── Layer 1: Catch-Up Card ────────────────────────────── */}
      {reminder && (
        <div style={{padding:'16px 20px',borderRadius:'18px',background:'rgba(255,220,100,0.12)',border:'1px solid rgba(255,200,50,0.3)',display:'flex',alignItems:'flex-start',gap:'14px',marginBottom:'20px'}}>
          <span style={{fontSize:'20px',flexShrink:0}}>💛</span>
          <div style={{flex:1}}>
            <div className="bt-sans" style={{color:'#7a6010',fontSize:'13px',fontWeight:500,marginBottom:'4px'}}>Catch Up</div>
            <div className="bt-sans" style={{color:'#8a7020',fontSize:'13px',fontWeight:300,lineHeight:1.5,marginBottom:'10px'}}>{reminder.message}</div>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={()=>{setShowPast(true);setPastKind(reminder.type);dismiss();}} style={{padding:'6px 14px',borderRadius:'20px',border:'none',background:'rgba(180,140,20,0.2)',color:'#7a6010',fontFamily:'DM Sans,sans-serif',fontSize:'12px',fontWeight:500,cursor:'pointer'}}>Log Now</button>
              <button onClick={dismiss} style={{padding:'6px 14px',borderRadius:'20px',border:'1px solid rgba(180,140,20,0.25)',background:'transparent',color:'#aaa090',fontFamily:'DM Sans,sans-serif',fontSize:'12px',cursor:'pointer'}}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Active symptom alert ──────────────────────────────── */}
      {activeSymptoms.length > 0 && (
        <div style={{padding:'14px 18px',borderRadius:'16px',background:'rgba(212,165,165,0.1)',border:'1px solid rgba(212,165,165,0.3)',display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
          <span style={{fontSize:'18px'}}>🌡️</span>
          <div style={{flex:1}}>
            <div className="bt-sans" style={{color:'#8B5E5E',fontSize:'13px',fontWeight:500}}>{activeSymptoms.length} active symptom{activeSymptoms.length>1?'s':''}</div>
            <div className="bt-sans" style={{color:'#B8C9C9',fontSize:'12px',fontWeight:300}}>{activeSymptoms.map(s=>s.symptom).join(' · ')}</div>
          </div>
          <button onClick={()=>setSection('visits')} style={{padding:'6px 12px',borderRadius:'12px',border:'1px solid rgba(212,165,165,0.4)',background:'transparent',color:'#8B5E5E',fontFamily:'DM Sans,sans-serif',fontSize:'12px',cursor:'pointer'}}>View</button>
        </div>
      )}

      {/* ── Vaccine reminder ──────────────────────────────────── */}
      {daysToVaccine !== null && daysToVaccine <= 21 && daysToVaccine >= 0 && (
        <div style={{padding:'14px 18px',borderRadius:'16px',background:'rgba(156,175,136,0.1)',border:'1px solid rgba(156,175,136,0.3)',display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
          <span style={{fontSize:'18px'}}>💉</span>
          <div style={{flex:1}}>
            <div className="bt-sans" style={{color:'#4a6b3a',fontSize:'13px',fontWeight:500}}>{nextVaccine} due {daysToVaccine===0?'today':`in ${daysToVaccine} day${daysToVaccine!==1?'s':''}`}</div>
            <div className="bt-sans" style={{color:'#B8C9C9',fontSize:'12px',fontWeight:300}}>{fmtDate(nextVaccineDate)}</div>
          </div>
        </div>
      )}

      {/* ── Layer 2: Quick Add Row ────────────────────────────── */}
      <div style={{display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap'}}>
        <button className="pill" onClick={onStartFeed}  style={{background:'rgba(212,165,165,0.12)',color:'#8B5E5E',border:'1px solid rgba(212,165,165,0.3)'}}>🍼 Start Feed</button>
        <button className="pill" onClick={onStartSleep} style={{background:'rgba(156,175,136,0.12)',color:'#4a6b3a',border:'1px solid rgba(156,175,136,0.3)'}}>😴 Start Sleep</button>
        <button className="pill" onClick={()=>{setShowPast(true);setPastStep(1);}} style={{background:'rgba(72,122,123,0.08)',color:'#487A7B',border:'1px solid rgba(72,122,123,0.2)'}}>➕ Past Entry</button>
        <button className="pill" onClick={()=>setShowSymptom(true)} style={{background:'rgba(212,165,165,0.08)',color:'#8B5E5E',border:'1px solid rgba(212,165,165,0.2)'}}>🌡️ Symptom</button>
        <button className="pill" onClick={()=>setShowMed(true)} style={{background:'rgba(100,130,180,0.08)',color:'#4a5a8a',border:'1px solid rgba(100,130,180,0.2)'}}>💊 Medication</button>
      </div>

      {/* ── Section Tabs ─────────────────────────────────────── */}
      <div style={{display:'flex',gap:'6px',marginBottom:'20px',overflowX:'auto',paddingBottom:'4px'}}>
        {SECTIONS.map(s=>(
          <button key={s.id} className="section-tab" onClick={()=>setSection(s.id)}
            style={{background:section===s.id?'#487A7B':'#F6F3EE',color:section===s.id?'#F6F3EE':'#487A7B',border:section===s.id?'none':'1px solid rgba(72,122,123,0.15)'}}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Layer 3: Timeline ─────────────────────────────────── */}
      {section==='timeline' && (
        <>
          {/* Today stats */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'20px'}}>
            <div style={{padding:'16px',borderRadius:'16px',background:'rgba(212,165,165,0.08)',border:'1px solid rgba(212,165,165,0.2)'}}>
              <div className="bt-sans" style={{color:'#D4A5A5',fontSize:'11px',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'4px'}}>Today's Feeds</div>
              <div className="bt-serif" style={{color:'#8B5E5E',fontSize:'30px',fontWeight:300,lineHeight:1}}>{todayFeeds.length}</div>
              <div className="bt-sans" style={{color:'#C5D3D3',fontSize:'11px',fontWeight:300,marginTop:'3px'}}>{todayFeeds.length?`Total: ${fmtDur(todayFeeds.reduce((a,f)=>a+f.duration,0))}`:'None yet'}</div>
            </div>
            <div style={{padding:'16px',borderRadius:'16px',background:'rgba(156,175,136,0.08)',border:'1px solid rgba(156,175,136,0.2)'}}>
              <div className="bt-sans" style={{color:'#9CAF88',fontSize:'11px',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'4px'}}>Today's Sleep</div>
              <div className="bt-serif" style={{color:'#4a6b3a',fontSize:'30px',fontWeight:300,lineHeight:1}}>{todaySleeps.length}</div>
              <div className="bt-sans" style={{color:'#C5D3D3',fontSize:'11px',fontWeight:300,marginTop:'3px'}}>{todaySleeps.length?`Total: ${fmtDur(todaySleeps.reduce((a,s)=>a+s.duration,0))}`:'None yet'}</div>
            </div>
          </div>

          {timeline.length===0 ? (
            <div style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>📋</div>
              <p className="bt-sans" style={{color:'#C5D3D3',fontSize:'14px',fontWeight:300}}>No entries yet — use the buttons above to start</p>
            </div>
          ) : (
            <div style={{maxHeight:'340px',overflowY:'auto',paddingRight:'4px'}}>
              {Object.entries(grouped).map(([day,entries])=>(
                <div key={day}>
                  <div className="day-lbl">{day} · {entries.filter(e=>e.kind==='feeding').length}🍼 · {entries.filter(e=>e.kind==='sleep').length}😴</div>
                  {entries.map(e=>(
                    <div key={e.id} className="tl-row" style={{background:e.kind==='feeding'?'rgba(212,165,165,0.07)':'rgba(156,175,136,0.07)'}}>
                      <div style={{width:'34px',height:'34px',borderRadius:'10px',background:e.kind==='feeding'?'rgba(212,165,165,0.18)':'rgba(156,175,136,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',flexShrink:0}}>{e.kind==='feeding'?'🍼':'😴'}</div>
                      <div style={{flex:1}}>
                        <div className="bt-sans" style={{color:'#487A7B',fontSize:'13px',fontWeight:400}}>{e.kind==='feeding'?'Feeding':'Sleep'}</div>
                        <div className="bt-sans" style={{color:'#C5D3D3',fontSize:'11px',fontWeight:300}}>{fmtTime(e.id)}</div>
                      </div>
                      <div className="bt-serif" style={{color:e.kind==='feeding'?'#8B5E5E':'#4a6b3a',fontSize:'16px',fontWeight:400}}>{fmtDur(e.duration)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Medications section ───────────────────────────────── */}
      {section==='meds' && (
        <div>
          {medications.length===0 ? (
            <div style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>💊</div>
              <p className="bt-sans" style={{color:'#C5D3D3',fontSize:'14px',fontWeight:300}}>No medications logged yet</p>
            </div>
          ) : medications.map(m=>(
            <div key={m.id} className="card" style={{background:'rgba(100,130,180,0.06)',border:'1px solid rgba(100,130,180,0.15)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                <div className="bt-sans" style={{color:'#3a4a7a',fontSize:'14px',fontWeight:500}}>💊 {m.name}</div>
                <span style={{padding:'3px 10px',borderRadius:'12px',background:m.ongoing?'rgba(156,175,136,0.2)':'rgba(200,200,200,0.2)',color:m.ongoing?'#4a6b3a':'#9CAF88',fontFamily:'DM Sans,sans-serif',fontSize:'11px'}}>{m.ongoing?'Ongoing':'Completed'}</span>
              </div>
              <div className="bt-sans" style={{color:'#8BA8A9',fontSize:'13px',fontWeight:300}}>
                {[m.dosage,m.frequency].filter(Boolean).join(' · ')}
              </div>
              {m.notes && <div className="bt-sans" style={{color:'#B8C9C9',fontSize:'12px',marginTop:'4px'}}>{m.notes}</div>}
              <div className="bt-sans" style={{color:'#C5D3D3',fontSize:'11px',marginTop:'6px'}}>Started {fmtDate(m.startDate)}</div>
            </div>
          ))}

          {/* Symptom log */}
          {symptoms.length > 0 && (
            <>
              <div className="bt-sans" style={{color:'#B8C9C9',fontSize:'11px',fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',margin:'20px 0 10px'}}>Symptoms Log</div>
              {symptoms.map(s=>(
                <div key={s.id} className="card" style={{background:s.resolved?'rgba(156,175,136,0.06)':'rgba(212,165,165,0.08)',border:`1px solid ${s.resolved?'rgba(156,175,136,0.2)':'rgba(212,165,165,0.25)'}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'4px'}}>
                    <div className="bt-sans" style={{color:'#487A7B',fontSize:'14px',fontWeight:500}}>🌡️ {s.symptom}</div>
                    <button onClick={()=>toggleResolved(s.id)} style={{padding:'3px 10px',borderRadius:'12px',border:'none',background:s.resolved?'rgba(156,175,136,0.2)':'rgba(212,165,165,0.2)',color:s.resolved?'#4a6b3a':'#8B5E5E',fontFamily:'DM Sans,sans-serif',fontSize:'11px',cursor:'pointer'}}>{s.resolved?'Resolved':'Mark Resolved'}</button>
                  </div>
                  {s.temperature && <div className="bt-sans" style={{color:'#8BA8A9',fontSize:'13px'}}>Temp: {s.temperature}°F</div>}
                  {s.notes && <div className="bt-sans" style={{color:'#B8C9C9',fontSize:'12px',marginTop:'4px'}}>{s.notes}</div>}
                  <div className="bt-sans" style={{color:'#C5D3D3',fontSize:'11px',marginTop:'4px'}}>{fmtDate(s.date)}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Doctor Visits section ─────────────────────────────── */}
      {section==='visits' && (
        <div>
          {visits.length===0 ? (
            <div style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>🏥</div>
              <p className="bt-sans" style={{color:'#C5D3D3',fontSize:'14px',fontWeight:300}}>No doctor visits logged yet</p>
            </div>
          ) : visits.map(v=>(
            <div key={v.id||v.date} className="card" style={{background:'rgba(130,100,180,0.05)',border:'1px solid rgba(130,100,180,0.15)'}}>
              <div className="bt-sans" style={{color:'#6a4a9a',fontSize:'14px',fontWeight:500,marginBottom:'4px'}}>🏥 {v.visitType}</div>
              <div className="bt-sans" style={{color:'#8BA8A9',fontSize:'13px',marginBottom:'4px'}}>{v.doctor}</div>
              <div className="bt-sans" style={{color:'#487A7B',fontSize:'13px',fontWeight:300,lineHeight:1.6}}>{v.findings}</div>
              {v.vaccinations?.length>0 && <div className="bt-sans" style={{color:'#9CAF88',fontSize:'12px',marginTop:'4px'}}>💉 {v.vaccinations.join(', ')}</div>}
              {v.nextVisit && <div className="bt-sans" style={{color:'#B8C9C9',fontSize:'12px',marginTop:'6px'}}>Next visit: {fmtDate(v.nextVisit)}</div>}
              <div className="bt-sans" style={{color:'#C5D3D3',fontSize:'11px',marginTop:'4px'}}>{fmtDate(v.date)}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Vaccines section ──────────────────────────────────── */}
      {section==='vaccines' && (
        <div>
          {babyProfile?.vaccinesGiven?.length > 0 ? (
            <>
              <div className="bt-sans" style={{color:'#B8C9C9',fontSize:'11px',fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px'}}>Vaccines Given</div>
              {babyProfile.vaccinesGiven.map((v,i)=>(
                <div key={i} className="card" style={{background:'rgba(156,175,136,0.07)',border:'1px solid rgba(156,175,136,0.2)',display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px'}}>
                  <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'rgba(156,175,136,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>✓</div>
                  <div className="bt-sans" style={{color:'#4a6b3a',fontSize:'14px',fontWeight:400}}>💉 {v}</div>
                </div>
              ))}

              {babyProfile.nextVaccine && (
                <>
                  <div className="bt-sans" style={{color:'#B8C9C9',fontSize:'11px',fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',margin:'20px 0 12px'}}>Due Next</div>
                  <div className="card" style={{background:daysToVaccine<=7?'rgba(212,165,165,0.1)':'rgba(72,122,123,0.06)',border:`1px solid ${daysToVaccine<=7?'rgba(212,165,165,0.3)':'rgba(72,122,123,0.15)'}`,display:'flex',alignItems:'center',gap:'12px',padding:'16px 18px'}}>
                    <div style={{fontSize:'24px'}}>💉</div>
                    <div>
                      <div className="bt-sans" style={{color:'#487A7B',fontSize:'14px',fontWeight:500}}>{babyProfile.nextVaccine}</div>
                      <div className="bt-sans" style={{color:'#9CAF88',fontSize:'12px',fontWeight:300,marginTop:'2px'}}>{fmtDate(babyProfile.nextVaccineDate)} · {daysToVaccine===0?'Today':daysToVaccine>0?`In ${daysToVaccine} days`:'Overdue'}</div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>💉</div>
              <p className="bt-sans" style={{color:'#C5D3D3',fontSize:'14px',fontWeight:300}}>No vaccine data — add baby profile to localStorage</p>
            </div>
          )}
        </div>
      )}

      {/* ── Layer 4: Weekly Summary / PDF ────────────────────── */}
      <div style={{marginTop:'24px',padding:'18px 22px',borderRadius:'20px',background:'rgba(72,122,123,0.06)',border:'1px solid rgba(72,122,123,0.12)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap'}}>
        <div>
          <div className="bt-sans" style={{color:'#487A7B',fontSize:'13px',fontWeight:500,marginBottom:'3px'}}>📊 Doctor Report Ready</div>
          <div className="bt-sans" style={{color:'#9CAF88',fontSize:'12px',fontWeight:300}}>
            {feedings.length} feeds · {sleeps.length} sleeps · {symptoms.length} symptoms · {medications.length} meds
          </div>
        </div>
        <button onClick={exportPDF} disabled={exporting}
          style={{padding:'11px 22px',borderRadius:'40px',border:'none',background:'#487A7B',color:'#F6F3EE',fontFamily:'DM Sans,sans-serif',fontSize:'13px',cursor:'pointer',whiteSpace:'nowrap'}}>
          {exporting?'⏳ Generating…':'📄 Generate Doctor PDF'}
        </button>
      </div>

      {/* ══ Past Entry Modal ════════════════════════════════════ */}
      {showPast && (
        <div className="modal-back" onClick={e=>{if(e.target===e.currentTarget)setShowPast(false);}}>
          <div className="modal-sheet">
            <div style={{display:'flex',gap:'8px',marginBottom:'24px'}}>
              {[1,2,3].map(s=><div key={s} className="step-prog" style={{background:pastStep>=s?'#487A7B':'rgba(72,122,123,0.12)'}}/>)}
            </div>

            {pastStep===1 && (
              <div>
                <h3 className="bt-serif" style={{fontSize:'28px',fontWeight:300,color:'#487A7B',marginBottom:'6px'}}>What happened?</h3>
                <p className="bt-sans" style={{color:'#9CAF88',fontSize:'13px',marginBottom:'22px'}}>Select the type of entry</p>
                <div style={{display:'flex',gap:'10px',marginBottom:'24px'}}>
                  <button className={`kind-btn${pastKind==='feeding'?' active':''}`} onClick={()=>setPastKind('feeding')}>🍼 Feeding</button>
                  <button className={`kind-btn${pastKind==='sleep'?' active':''}`} onClick={()=>setPastKind('sleep')}>😴 Sleep</button>
                </div>
                <button className="save-btn" onClick={()=>setPastStep(2)}>Next →</button>
              </div>
            )}

            {pastStep===2 && (
              <div>
                <h3 className="bt-serif" style={{fontSize:'28px',fontWeight:300,color:'#487A7B',marginBottom:'6px'}}>When was it?</h3>
                <p className="bt-sans" style={{color:'#9CAF88',fontSize:'13px',marginBottom:'22px'}}>Enter the time it happened</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',marginBottom:'24px'}}>
                  <input className="t-inp" type="number" min="1" max="12" placeholder="HH" value={pastH} onChange={e=>setPastH(e.target.value)} style={{width:'64px'}}/>
                  <span className="bt-sans" style={{color:'#487A7B',fontSize:'22px',fontWeight:300}}>:</span>
                  <input className="t-inp" type="number" min="0" max="59" placeholder="MM" value={pastM} onChange={e=>setPastM(e.target.value)} style={{width:'64px'}}/>
                  <div style={{display:'flex',borderRadius:'12px',overflow:'hidden',border:'1.5px solid rgba(72,122,123,0.2)'}}>
                    {['AM','PM'].map(ap=><button key={ap} onClick={()=>setPastAmPm(ap)} style={{padding:'12px 16px',border:'none',background:pastAmPm===ap?'#487A7B':'#FAFAF8',color:pastAmPm===ap?'#F6F3EE':'#487A7B',fontFamily:'DM Sans,sans-serif',fontSize:'14px',cursor:'pointer',transition:'all 0.2s'}}>{ap}</button>)}
                  </div>
                </div>
                <div style={{display:'flex',gap:'10px'}}>
                  <button className="back-btn" onClick={()=>setPastStep(1)}>← Back</button>
                  <button className="save-btn" style={{flex:2,opacity:pastH&&pastM?1:0.5,cursor:pastH&&pastM?'pointer':'not-allowed'}} disabled={!pastH||!pastM} onClick={()=>setPastStep(3)}>Next →</button>
                </div>
              </div>
            )}

            {pastStep===3 && (
              <div>
                <h3 className="bt-serif" style={{fontSize:'28px',fontWeight:300,color:'#487A7B',marginBottom:'6px'}}>How long?</h3>
                <p className="bt-sans" style={{color:'#9CAF88',fontSize:'13px',marginBottom:'22px'}}>Duration in minutes — leave blank for default</p>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
                  <input className="t-inp" type="number" min="1" placeholder={pastKind==='feeding'?'10':'60'}
                    value={pastDur?Math.round(parseInt(pastDur)/60):''}
                    onChange={e=>setPastDur(String(parseInt(e.target.value||0)*60))} style={{width:'80px'}}/>
                  <span className="bt-sans" style={{color:'#9CAF88',fontSize:'14px',fontWeight:300}}>minutes</span>
                </div>
                <div style={{padding:'12px 16px',borderRadius:'14px',background:'#F6F3EE',marginBottom:'20px'}}>
                  <div className="bt-sans" style={{color:'#487A7B',fontSize:'13px'}}>{pastKind==='feeding'?'🍼 Feeding':'😴 Sleep'} at {pastH}:{(pastM||'00').padStart(2,'0')} {pastAmPm}{pastDur?` · ${fmtDur(parseInt(pastDur))}`:''}</div>
                </div>
                <div style={{display:'flex',gap:'10px'}}>
                  <button className="back-btn" onClick={()=>setPastStep(2)}>← Back</button>
                  <button className="save-btn" style={{flex:2}} onClick={savePast}>Save Entry ✓</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ Symptom Modal ═══════════════════════════════════════ */}
      {showSymptom && (
        <div className="modal-back" onClick={e=>{if(e.target===e.currentTarget)setShowSymptom(false);}}>
          <div className="modal-sheet">
            <h3 className="bt-serif" style={{fontSize:'28px',fontWeight:300,color:'#487A7B',marginBottom:'6px'}}>Log a Symptom</h3>
            <p className="bt-sans" style={{color:'#9CAF88',fontSize:'13px',marginBottom:'22px'}}>Note what you've observed</p>
            <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'20px'}}>
              <div>
                <label className="bt-sans" style={{display:'block',color:'#487A7B',fontSize:'12px',letterSpacing:'0.05em',marginBottom:'6px'}}>Symptom *</label>
                <input className="t-inp" type="text" placeholder="e.g. Mild fever, Colic, Rash…" value={symName} onChange={e=>setSymName(e.target.value)} style={{width:'100%',textAlign:'left'}}/>
              </div>
              <div>
                <label className="bt-sans" style={{display:'block',color:'#487A7B',fontSize:'12px',letterSpacing:'0.05em',marginBottom:'6px'}}>Temperature (°F) — optional</label>
                <input className="t-inp" type="number" placeholder="98.6" value={symTemp} onChange={e=>setSymTemp(e.target.value)} style={{width:'120px'}}/>
              </div>
              <div>
                <label className="bt-sans" style={{display:'block',color:'#487A7B',fontSize:'12px',letterSpacing:'0.05em',marginBottom:'6px'}}>Notes — optional</label>
                <textarea className="t-inp" placeholder="Any additional observations…" value={symNotes} onChange={e=>setSymNotes(e.target.value)} rows={3} style={{width:'100%',textAlign:'left',resize:'none',fontFamily:'DM Sans,sans-serif'}}/>
              </div>
              <button onClick={()=>setSymResolved(!symResolved)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 16px',borderRadius:'14px',border:`1.5px solid ${symResolved?'rgba(156,175,136,0.4)':'rgba(72,122,123,0.15)'}`,background:symResolved?'rgba(156,175,136,0.1)':'transparent',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:'14px',color:symResolved?'#4a6b3a':'#487A7B'}}>
                <div style={{width:'18px',height:'18px',borderRadius:'5px',border:`2px solid ${symResolved?'#9CAF88':'rgba(72,122,123,0.3)'}`,background:symResolved?'#9CAF88':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {symResolved && <span style={{color:'#fff',fontSize:'11px'}}>✓</span>}
                </div>
                Already resolved
              </button>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <button className="back-btn" onClick={()=>setShowSymptom(false)}>Cancel</button>
              <button className="save-btn" style={{flex:2,opacity:symName?1:0.5,cursor:symName?'pointer':'not-allowed'}} disabled={!symName} onClick={saveSymptom}>Save Symptom ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Medication Modal ════════════════════════════════════ */}
      {showMed && (
        <div className="modal-back" onClick={e=>{if(e.target===e.currentTarget)setShowMed(false);}}>
          <div className="modal-sheet">
            <h3 className="bt-serif" style={{fontSize:'28px',fontWeight:300,color:'#487A7B',marginBottom:'6px'}}>Log Medication</h3>
            <p className="bt-sans" style={{color:'#9CAF88',fontSize:'13px',marginBottom:'22px'}}>Supplements and prescribed medicines</p>
            <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'20px'}}>
              {[
                {label:'Medication name *', ph:'e.g. Vitamin D Drops', val:medName, set:setMedName},
                {label:'Dosage', ph:'e.g. 0.5 ml',             val:medDose, set:setMedDose},
                {label:'Frequency', ph:'e.g. Once daily',       val:medFreq, set:setMedFreq},
                {label:'Notes', ph:'e.g. Give with feed',       val:medNotes,set:setMedNotes},
              ].map(({label,ph,val,set})=>(
                <div key={label}>
                  <label className="bt-sans" style={{display:'block',color:'#487A7B',fontSize:'12px',letterSpacing:'0.05em',marginBottom:'6px'}}>{label}</label>
                  <input className="t-inp" type="text" placeholder={ph} value={val} onChange={e=>set(e.target.value)} style={{width:'100%',textAlign:'left'}}/>
                </div>
              ))}
              <button onClick={()=>setMedOngoing(!medOngoing)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 16px',borderRadius:'14px',border:`1.5px solid ${medOngoing?'rgba(156,175,136,0.4)':'rgba(72,122,123,0.15)'}`,background:medOngoing?'rgba(156,175,136,0.1)':'transparent',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:'14px',color:medOngoing?'#4a6b3a':'#487A7B'}}>
                <div style={{width:'18px',height:'18px',borderRadius:'5px',border:`2px solid ${medOngoing?'#9CAF88':'rgba(72,122,123,0.3)'}`,background:medOngoing?'#9CAF88':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {medOngoing && <span style={{color:'#fff',fontSize:'11px'}}>✓</span>}
                </div>
                Ongoing medication
              </button>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <button className="back-btn" onClick={()=>setShowMed(false)}>Cancel</button>
              <button className="save-btn" style={{flex:2,opacity:medName?1:0.5,cursor:medName?'pointer':'not-allowed'}} disabled={!medName} onClick={saveMed}>Save Medication ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}