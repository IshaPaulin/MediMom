// src/components/BabyTracker.jsx
// Reads feeding + sleep history from localStorage (saved by Dashboard)
// and renders a full history list with PDF export for the pediatrician.

import { useState, useEffect } from 'react';

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
  return `${s}s`;
};

const formatDate = (id) => {
  // id is a Date.now() timestamp
  return new Date(id).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

export default function BabyTracker({ babyName }) {
  const [feedings, setFeedings] = useState([]);
  const [sleeps,   setSleeps]   = useState([]);
  const [filter,   setFilter]   = useState('all'); // 'all' | 'today'
  const [exporting, setExporting] = useState(false);

  // ── Load from localStorage ──────────────────────────────────
  useEffect(() => {
    const f = JSON.parse(localStorage.getItem('feedingHistory') || '[]');
    const s = JSON.parse(localStorage.getItem('sleepHistory')   || '[]');
    // Sort newest first
    setFeedings(f.sort((a, b) => b.id - a.id));
    setSleeps(  s.sort((a, b) => b.id - a.id));
  }, []);

  // ── Merge + filter ──────────────────────────────────────────
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

  const allEntries = [
    ...feedings.map(f => ({ ...f, kind: 'feeding' })),
    ...sleeps.map(s   => ({ ...s, kind: 'sleep'   })),
  ].sort((a, b) => b.id - a.id);

  const entries = filter === 'today'
    ? allEntries.filter(e => e.id >= todayStart.getTime())
    : allEntries;

  // ── Summary stats ────────────────────────────────────────────
  const todayFeedings = feedings.filter(f => f.id >= todayStart.getTime());
  const todaySleeps   = sleeps.filter(s   => s.id >= todayStart.getTime());
  const totalFeedTime = todayFeedings.reduce((a, f) => a + f.duration, 0);
  const totalSleepTime = todaySleeps.reduce((a, s)  => a + s.duration, 0);

  // ── Clear all data ───────────────────────────────────────────
  const clearAll = () => {
    if (!window.confirm('Clear all history? This cannot be undone.')) return;
    localStorage.removeItem('feedingHistory');
    localStorage.removeItem('sleepHistory');
    setFeedings([]);
    setSleeps([]);
  };

  // ── PDF Export via jsPDF (loaded from CDN) ───────────────────
  const exportPDF = async () => {
    setExporting(true);

    // Dynamically load jsPDF if not already present
    if (!window.jspdf) {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const W = 210; // A4 width mm
    const margin = 20;
    let y = margin;

    const teal  = [72,  122, 123];
    const rose  = [212, 165, 165];
    const cream = [246, 243, 238];
    const grey  = [140, 168, 169];

    // ── Header band ─────────────────────────────────────────
    doc.setFillColor(...teal);
    doc.rect(0, 0, W, 38, 'F');

    doc.setTextColor(246, 243, 238);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MediMom', margin, 16);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Baby Health Report', margin, 24);

    doc.setFontSize(9);
    doc.setTextColor(200, 220, 220);
    const generated = new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });
    doc.text(`Generated: ${generated}`, margin, 32);

    if (babyName) {
      doc.setTextColor(246, 243, 238);
      doc.setFontSize(10);
      doc.text(`Baby: ${babyName}`, W - margin, 24, { align: 'right' });
    }

    y = 50;

    // ── Today's summary cards ───────────────────────────────
    doc.setTextColor(...teal);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text("Today's Summary", margin, y);
    y += 8;

    const cardW = (W - margin * 2 - 8) / 2;

    // Feeding card
    doc.setFillColor(...cream);
    doc.roundedRect(margin, y, cardW, 26, 3, 3, 'F');
    doc.setFillColor(...rose);
    doc.roundedRect(margin, y, 4, 26, 2, 2, 'F');
    doc.setTextColor(...rose);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('FEEDINGS', margin + 8, y + 8);
    doc.setTextColor(60, 80, 80);
    doc.setFontSize(16);
    doc.text(String(todayFeedings.length), margin + 8, y + 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grey);
    doc.text(`Total: ${formatTime(totalFeedTime)}`, margin + 8, y + 24);

    // Sleep card
    const sleepX = margin + cardW + 8;
    doc.setFillColor(...cream);
    doc.roundedRect(sleepX, y, cardW, 26, 3, 3, 'F');
    doc.setFillColor(156, 175, 136);
    doc.roundedRect(sleepX, y, 4, 26, 2, 2, 'F');
    doc.setTextColor(80, 120, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('SLEEP SESSIONS', sleepX + 8, y + 8);
    doc.setTextColor(60, 80, 80);
    doc.setFontSize(16);
    doc.text(String(todaySleeps.length), sleepX + 8, y + 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grey);
    doc.text(`Total: ${formatTime(totalSleepTime)}`, sleepX + 8, y + 24);

    y += 36;

    // ── Full history table ──────────────────────────────────
    doc.setTextColor(...teal);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Full History', margin, y);
    y += 8;

    // Table header
    doc.setFillColor(...teal);
    doc.rect(margin, y, W - margin * 2, 8, 'F');
    doc.setTextColor(246, 243, 238);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('TYPE',     margin + 3,      y + 5.5);
    doc.text('DATE & TIME', margin + 30,  y + 5.5);
    doc.text('DURATION', margin + 110,    y + 5.5);
    y += 8;

    // Table rows
    const rowData = allEntries.slice(0, 60); // cap at 60 to avoid overflow
    rowData.forEach((entry, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const isEven = i % 2 === 0;
      doc.setFillColor(isEven ? 250 : 246, isEven ? 250 : 243, isEven ? 248 : 238);
      doc.rect(margin, y, W - margin * 2, 7, 'F');

      // Colour dot
      if (entry.kind === 'feeding') {
        doc.setFillColor(...rose);
      } else {
        doc.setFillColor(156, 175, 136);
      }
      doc.circle(margin + 5, y + 3.5, 2, 'F');

      doc.setTextColor(60, 80, 80);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(entry.kind === 'feeding' ? 'Feeding' : 'Sleep', margin + 9, y + 5);
      doc.text(formatDate(entry.id), margin + 30, y + 5);
      doc.text(formatTime(entry.duration), margin + 110, y + 5);

      y += 7;
    });

    if (allEntries.length > 60) {
      doc.setTextColor(...grey);
      doc.setFontSize(8);
      doc.text(`... and ${allEntries.length - 60} more entries`, margin, y + 5);
      y += 10;
    }

    // ── Footer ───────────────────────────────────────────────
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...teal);
      doc.rect(0, 287, W, 10, 'F');
      doc.setTextColor(200, 220, 220);
      doc.setFontSize(7);
      doc.text('MediMom — Not a medical diagnostic tool. Always consult your healthcare provider.', margin, 293);
      doc.text(`Page ${i} of ${pageCount}`, W - margin, 293, { align: 'right' });
    }

    doc.save(`MediMom_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    setExporting(false);
  };

  return (
    <div>
      <style>{`
        .sans  { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .entry-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; margin-bottom: 6px; transition: background 0.15s; }
        .entry-row:hover { filter: brightness(0.97); }
        .filter-btn { padding: 7px 18px; border-radius: 30px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; transition: all 0.2s; }
      `}</style>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="serif" style={{ fontSize: '36px', fontWeight: 300, color: '#487A7B', marginBottom: '4px' }}>Baby Tracker</h2>
          <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', fontWeight: 300 }}>History pulled from your gesture logs</p>
        </div>
        <button
          onClick={exportPDF}
          disabled={exporting || allEntries.length === 0}
          style={{ padding: '12px 24px', borderRadius: '40px', border: 'none', background: allEntries.length > 0 ? '#487A7B' : '#C5D3D3', color: '#F6F3EE', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 400, cursor: allEntries.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
        >
          {exporting ? '⏳ Generating…' : '📄 Export PDF'}
        </button>
      </div>

      {/* Today's summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
        <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(212,165,165,0.1)', border: '1px solid rgba(212,165,165,0.25)' }}>
          <div className="sans" style={{ color: '#D4A5A5', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Today's Feedings</div>
          <div className="serif" style={{ color: '#8B5E5E', fontSize: '36px', fontWeight: 300, lineHeight: 1 }}>{todayFeedings.length}</div>
          <div className="sans" style={{ color: '#B8C9C9', fontSize: '12px', fontWeight: 300, marginTop: '4px' }}>
            {totalFeedTime > 0 ? `Total: ${formatTime(totalFeedTime)}` : 'No feeds logged today'}
          </div>
        </div>
        <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(156,175,136,0.1)', border: '1px solid rgba(156,175,136,0.25)' }}>
          <div className="sans" style={{ color: '#9CAF88', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Today's Sleep</div>
          <div className="serif" style={{ color: '#4a6b3a', fontSize: '36px', fontWeight: 300, lineHeight: 1 }}>{todaySleeps.length}</div>
          <div className="sans" style={{ color: '#B8C9C9', fontSize: '12px', fontWeight: 300, marginTop: '4px' }}>
            {totalSleepTime > 0 ? `Total: ${formatTime(totalSleepTime)}` : 'No sleep logged today'}
          </div>
        </div>
      </div>

      {/* Filter + clear */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="filter-btn" onClick={() => setFilter('all')}
            style={{ background: filter === 'all' ? '#487A7B' : '#F6F3EE', color: filter === 'all' ? '#F6F3EE' : '#487A7B' }}>
            All time
          </button>
          <button className="filter-btn" onClick={() => setFilter('today')}
            style={{ background: filter === 'today' ? '#487A7B' : '#F6F3EE', color: filter === 'today' ? '#F6F3EE' : '#487A7B' }}>
            Today
          </button>
        </div>
        {allEntries.length > 0 && (
          <button onClick={clearAll} className="sans" style={{ background: 'none', border: 'none', color: '#C5D3D3', fontSize: '12px', cursor: 'pointer', padding: '4px 8px' }}>
            Clear all
          </button>
        )}
      </div>

      {/* History list */}
      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
          <p className="sans" style={{ color: '#C5D3D3', fontSize: '14px', fontWeight: 300 }}>
            {filter === 'today' ? 'No logs today yet — use the gesture logger to start tracking' : 'No history yet — start logging with the gesture buttons'}
          </p>
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
          {entries.map((entry) => (
            <div key={entry.id} className="entry-row"
              style={{ background: entry.kind === 'feeding' ? 'rgba(212,165,165,0.08)' : 'rgba(156,175,136,0.08)' }}>
              {/* Icon */}
              <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: entry.kind === 'feeding' ? 'rgba(212,165,165,0.2)' : 'rgba(156,175,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                {entry.kind === 'feeding' ? '🍼' : '😴'}
              </div>
              {/* Info */}
              <div style={{ flex: 1 }}>
                <div className="sans" style={{ color: '#487A7B', fontSize: '14px', fontWeight: 400 }}>
                  {entry.kind === 'feeding' ? 'Feeding session' : 'Sleep session'}
                </div>
                <div className="sans" style={{ color: '#B8C9C9', fontSize: '12px', fontWeight: 300, marginTop: '2px' }}>
                  {formatDate(entry.id)}
                </div>
              </div>
              {/* Duration */}
              <div className="serif" style={{ color: entry.kind === 'feeding' ? '#8B5E5E' : '#4a6b3a', fontSize: '18px', fontWeight: 400, flexShrink: 0 }}>
                {formatTime(entry.duration)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}