import { useEffect, useRef, useState } from 'react';
import { useSwipe } from '../hooks/useSwipe';

const days = [
  {
    label: 'Today', visitors: 34, avgStay: '1m 42s', longStay: '18m 03s', youStay: '4m 10s',
    b: [23, 6, 2, 3, 1, 8], you: [false, true, true, false, false, false],
    nearby: 12, sinceStay: 9, changeDir: 'neg', changePct: '23% fewer', vsVals: '34 → 26',
    curve: [0, 0, 1, 2, 1, 0, 3, 8, 5, 2, 4, 6, 3, 1, 0, 2, 5, 4, 2, 1, 0, 0, 0, 0],
    youCurve: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    label: 'Yesterday', visitors: 28, avgStay: '2m 05s', longStay: '12m 44s', youStay: '—',
    b: [19, 5, 1, 2, 2, 5], you: [false, false, false, false, false, false],
    nearby: 9, sinceStay: 8, changeDir: 'neg', changePct: '31% fewer', vsVals: '28 → 19',
    curve: [0, 0, 0, 1, 2, 1, 2, 7, 4, 1, 3, 5, 2, 1, 0, 1, 4, 3, 1, 0, 0, 0, 0, 0],
    youCurve: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    label: '2 days ago', visitors: 41, avgStay: '1m 28s', longStay: '22m 10s', youStay: '6m 52s',
    b: [30, 7, 3, 4, 1, 11], you: [false, true, true, true, false, false],
    nearby: 14, sinceStay: 7, changeDir: 'pos', changePct: '2% more', vsVals: '41 → 42',
    curve: [0, 0, 1, 3, 2, 1, 4, 9, 6, 3, 5, 7, 4, 2, 1, 3, 6, 5, 3, 2, 1, 0, 0, 0],
    youCurve: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  },
  {
    label: '3 days ago', visitors: 19, avgStay: '0m 58s', longStay: '5m 20s', youStay: '—',
    b: [15, 3, 0, 1, 0, 3], you: [false, false, false, false, false, false],
    nearby: 6, sinceStay: 6, changeDir: 'neg', changePct: '52% fewer', vsVals: '19 → 9',
    curve: [0, 0, 0, 0, 1, 0, 1, 4, 2, 0, 2, 3, 1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0],
    youCurve: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

function drawCurve(canvas, curve, youCurve, o1) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...curve, 1);
  const pad = 4;
  const uw = (w - pad * 2) / (curve.length - 1);
  const pts = curve.map((v, i) => [pad + i * uw, h - pad - (v / max) * (h - pad * 2)]);
  ctx.beginPath();
  ctx.moveTo(pts[0][0], h);
  pts.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.lineTo(pts[pts.length - 1][0], h);
  ctx.closePath();
  ctx.fillStyle = o1 + '22';
  ctx.fill();
  ctx.beginPath();
  pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ctx.strokeStyle = o1 + '88';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  youCurve.forEach((v, i) => {
    if (v > 0) {
      ctx.beginPath();
      ctx.arc(pts[i][0], pts[i][1], 3.5, 0, Math.PI * 2);
      ctx.fillStyle = o1;
      ctx.fill();
    }
  });
}

export default function Traces({ mood, onGoUp }) {
  const [idx, setIdx] = useState(0);
  const canvasRef = useRef(null);
  const scrollRef = useRef(null);
  const handleSwipeUp = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 2) onGoUp();
  };
  const swipe = useSwipe({ onSwipeUp: handleSwipeUp });

  const d = days[idx];

  useEffect(() => {
    if (canvasRef.current) drawCurve(canvasRef.current, d.curve, d.youCurve, mood.o1);
  }, [idx]);

  const behaviorIcons = [
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9h14" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" /><path d="M12 6l3 3-3 3" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="3" stroke="rgba(255,255,255,0.35)" strokeWidth="1" /><path d="M9 3v2M9 13v2M3 9h2M13 9h2" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" /></svg>,
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="2.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" /><path d="M5 16c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" /></svg>,
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9c1.5-4 3.5-6 7-6s5.5 2 7 6c-1.5 4-3.5 6-7 6s-5.5-2-7-6z" stroke="rgba(255,255,255,0.35)" strokeWidth="1" /><circle cx="9" cy="9" r="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1" /></svg>,
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="4" y="5" width="10" height="8" rx="1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" /><circle cx="9" cy="9" r="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1" /><rect x="7.5" y="4" width="3" height="1.5" rx="0.5" fill="rgba(255,255,255,0.25)" /></svg>,
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 13L6 7l3 4 2-2.5 3 4.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><circle cx="14" cy="5" r="2" stroke={mood.o1} strokeOpacity="0.7" strokeWidth="1" /></svg>,
  ];
  const behaviorNames = ['Passed through', 'Paused briefly', 'Stood still (30s+)', 'Looked up', 'Took a photo', 'Digital interactions'];

  const s = { color: 'rgba(255,255,255,0.2)', fontSize: 9, letterSpacing: '0.08em', fontFamily: 'sans-serif' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem', background: '#111', minHeight: '100svh', alignItems: 'center' }}>
      <div
        style={{
          width: 300, height: 640, borderRadius: 48, overflow: 'hidden',
          border: '1.5px solid rgba(255,255,255,0.12)',
          display: 'flex', flexDirection: 'column', background: '#0d0d12', fontFamily: 'sans-serif',
          userSelect: 'none',
        }}
        {...swipe}
      >
        {/* Status bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px 0', fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
          <span>9:41</span><span>· · ·</span>
        </div>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 10px', borderBottom: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Traces</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setIdx(i => Math.min(days.length - 1, i + 1))}
              disabled={idx >= days.length - 1}
              style={{ background: 'none', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 24, height: 24, color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: idx >= days.length - 1 ? 0.2 : 1 }}
            >‹</button>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', minWidth: 90, textAlign: 'center' }}>{d.label}</div>
            <button
              onClick={() => setIdx(i => Math.max(0, i - 1))}
              disabled={idx <= 0}
              style={{ background: 'none', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 24, height: 24, color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: idx <= 0 ? 0.2 : 1 }}
            >›</button>
          </div>
        </div>

        {/* Scroll area */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 16px 8px' }}>

          {/* Col headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px', gap: 4, marginBottom: 6, padding: '0 2px' }}>
            <div style={s}></div>
            <div style={{ ...s, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}>all</div>
            <div style={{ ...s, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em', color: mood.o1 + '99' }}>you</div>
          </div>

          {/* Presence block */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 14px 10px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 10 }}>
              <div style={{ fontSize: 42, color: '#fff', fontWeight: 300, lineHeight: 1 }}>{d.visitors}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: '0.04em' }}>visitors</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px', gap: 4, alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Ø stay duration</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>{d.avgStay}</div>
              <div style={{ fontSize: 13, color: mood.o1, textAlign: 'center', opacity: 0.9 }}>{d.youStay}</div>
              <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', gridColumn: '1/-1', margin: '8px 0' }}></div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Longest stay</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>{d.longStay}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>—</div>
            </div>
          </div>

          {/* Movement pattern */}
          <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '12px 2px 6px' }}>Movement pattern</div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '10px 10px 6px', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: mood.o1 + '66' }}></div>
                <span>all visitors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: mood.o1 }}></div>
                <span>you</span>
              </div>
            </div>
            <canvas ref={canvasRef} width="248" height="70" style={{ width: '100%', height: 70, display: 'block' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {['0h', '6h', '12h', '18h', '24h'].map(t => (
                <span key={t} style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* What happened */}
          <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '12px 2px 6px' }}>What happened</div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '10px 12px', marginBottom: 10 }}>
            {behaviorNames.map((name, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px', gap: 4, alignItems: 'center', padding: '6px 0', borderBottom: i < 5 ? '0.5px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{behaviorIcons[i]}</div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{name}</span>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>{d.b[i]}</div>
                <div style={{ fontSize: 13, color: mood.o1, textAlign: 'center', opacity: d.you[i] ? 0.9 : 0.3 }}>{d.you[i] ? '✓' : '—'}</div>
              </div>
            ))}
          </div>

          {/* Absence & proximity */}
          <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '12px 2px 6px' }}>Absence & proximity</div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '10px 12px', marginBottom: 10 }}>
            {[
              { label: "Nearby but didn't enter", val: `~${d.nearby}` },
              { label: 'Days since last long stay', val: `${d.sinceStay} days` },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{row.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.val}</div>
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center', padding: '6px 0' }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>Visits vs. last month</div>
                <div style={{ fontSize: 10, color: d.changeDir === 'pos' ? 'rgba(80,200,120,0.8)' : 'rgba(220,100,80,0.8)' }}>
                  {d.changeDir === 'pos' ? '▲ ' : '▼ '}{d.changePct}
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'right', whiteSpace: 'nowrap' }}>{d.vsVals}</div>
            </div>
          </div>

          <div style={{ height: 8 }}></div>
        </div>

        {/* Bottom nav */}
        <div style={{ flexShrink: 0, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em' }}>
          <span>↓ feed</span>
        </div>
      </div>
    </div>
  );
}
