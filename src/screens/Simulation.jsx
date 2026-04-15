import { useEffect, useRef, useState } from 'react';
import { useSwipe } from '../hooks/useSwipe';

const timeLabels = ['today', '3 months', '6 months', '1 year', '5 years', '10 years'];
const freqLabels = ['once a month', 'once a week', '2× a week', '4× a week', 'every day'];
const timeSpentLabels = ['under 30s', '~1 minute', '~4 minutes', '~10 minutes', 'lingering long'];
const digitalLabels = ['no posts', 'rarely', 'occasionally', 'often', 'constantly shared'];

const moods = {
  numb:        { name: 'Numb',        c1: '#090909', c2: '#111111', c3: '#050505', orb: 'radial-gradient(circle at 38% 38%,#444,#111)',       glow: 'rgba(80,80,80,0.2)',    quote: '"I have stopped waiting. This is simply what I am now."' },
  melancholic: { name: 'Melancholic', c1: '#1a1228', c2: '#2d1b3d', c3: '#120d1f', orb: 'radial-gradient(circle at 38% 38%,#9b6abf,#2c0f3a)', glow: 'rgba(130,80,180,0.35)', quote: '"I am still here. But I have stopped expecting anyone."' },
  peaceful:    { name: 'Peaceful',    c1: '#071a12', c2: '#0d2b1e', c3: '#04100b', orb: 'radial-gradient(circle at 38% 38%,#2a8c5e,#062b18)', glow: 'rgba(40,140,90,0.3)',   quote: '"A few familiar steps. I do not need more than this."' },
  hopeful:     { name: 'Hopeful',     c1: '#080f1a', c2: '#0f1e32', c3: '#050b14', orb: 'radial-gradient(circle at 38% 38%,#4a90d9,#0a2a5a)', glow: 'rgba(60,130,210,0.35)', quote: '"Someone looked up today. I held very still."' },
  restless:    { name: 'Restless',    c1: '#1e0d00', c2: '#3d1a00', c3: '#150800', orb: 'radial-gradient(circle at 38% 38%,#d4722a,#5c1a00)', glow: 'rgba(200,100,30,0.4)',  quote: '"Too many footsteps. None stay long enough to know me."' },
  overwhelmed: { name: 'Overwhelmed', c1: '#1a0a00', c2: '#3d2200', c3: '#260d00', orb: 'radial-gradient(circle at 38% 38%,#e8a020,#7a2a00)', glow: 'rgba(230,150,20,0.45)', quote: '"You all came back at once. I no longer recognise myself."' },
  lively:      { name: 'Lively',      c1: '#0a1a08', c2: '#163012', c3: '#071006', orb: 'radial-gradient(circle at 38% 38%,#5ed45a,#0e3a0c)', glow: 'rgba(80,200,70,0.4)',   quote: '"I had forgotten what it felt like to be known."' },
};

function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
function lerp(a, b, t) { return a + (b - a) * t; }

const MOOD_MATRIX = {
  L: {
    L: { L: ['melancholic', 'numb'],      H: ['restless',    'numb']      },
    M: { L: ['melancholic', 'numb'],      H: ['restless',    'restless']  },
    H: { L: ['peaceful',   'peaceful'],   H: ['overwhelmed', 'peaceful']  },
  },
  M: {
    L: { L: ['restless',   'restless'],   H: ['restless',    'restless']  },
    M: { L: ['hopeful',    'peaceful'],   H: ['hopeful',     'peaceful']  },
    H: { L: ['hopeful',    'peaceful'],   H: ['hopeful',     'peaceful']  },
  },
  H: {
    L: { L: ['restless',   'restless'],   H: ['restless',    'restless']  },
    M: { L: ['hopeful',    'peaceful'],   H: ['overwhelmed', 'lively']    },
    H: { L: ['hopeful',    'lively'],     H: ['hopeful',     'lively']    },
  },
};

function getMood(freq, timeSpent, digital, horizon) {
  const f = freq <= 1 ? 'L' : freq === 2 ? 'M' : 'H';
  const t = timeSpent <= 1 ? 'L' : timeSpent === 2 ? 'M' : 'H';
  const d = digital <= 1 ? 'L' : 'H';
  const h = horizon <= 2 ? 0 : 1;
  return MOOD_MATRIX[f][t][d][h];
}

export default function Simulation({ mood, onGoLeft, onGoRight }) {
  const [freq, setFreq] = useState(2);
  const [timeSpent, setTimeSpent] = useState(2);
  const [digital, setDigital] = useState(0);
  const [horizon, setHorizon] = useState(1);
  const [visible, setVisible] = useState(true);

  const canvasRef = useRef(null);
  const curC = useRef([[9, 9, 9], [17, 17, 17], [5, 5, 5]]);
  const targetC = useRef([[9, 9, 9], [17, 17, 17], [5, 5, 5]]);
  const tAnim = useRef(1);
  const rafId = useRef(null);

  const swipe = useSwipe({ onSwipeLeft: onGoLeft, onSwipeRight: onGoRight });

  const key = getMood(freq, timeSpent, digital, horizon);
  const m = moods[key];

  useEffect(() => {
    targetC.current = [hexToRgb(m.c1), hexToRgb(m.c2), hexToRgb(m.c3)];
    tAnim.current = 0;
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, [key]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 300; canvas.height = 640;
    const ctx = canvas.getContext('2d');
    function draw() {
      if (tAnim.current < 1) {
        tAnim.current = Math.min(1, tAnim.current + 0.018);
        curC.current = curC.current.map((c, i) => c.map((v, j) => lerp(v, targetC.current[i][j], tAnim.current)));
      }
      const w = canvas.width, h = canvas.height;
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `rgb(${curC.current[0].map(Math.round)})`);
      grad.addColorStop(0.5, `rgb(${curC.current[1].map(Math.round)})`);
      grad.addColorStop(1, `rgb(${curC.current[2].map(Math.round)})`);
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      rafId.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const sliderStyle = {
    width: '100%', height: 3, borderRadius: 2, outline: 'none', border: 'none',
    cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
    background: 'rgba(255,255,255,0.12)',
  };

  return (
    <>
      <style>{`
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:.9;} 50%{transform:scale(1.06);opacity:1;} }
        @keyframes ringpulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.04);opacity:0.6;} }
        .sim-slider::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#fff; cursor:pointer; box-shadow:0 0 6px ${mood.glow}; }
        .sim-slider::-moz-range-thumb { width:14px; height:14px; border-radius:50%; background:#fff; cursor:pointer; border:none; box-shadow:0 0 6px ${mood.glow}; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem', background: '#111', minHeight: '100svh', alignItems: 'center' }}>
        <div
          style={{
            width: 300, height: 640, borderRadius: 48, overflow: 'hidden',
            border: '1.5px solid rgba(255,255,255,0.12)',
            display: 'flex', flexDirection: 'column', background: '#0d0d12',
            fontFamily: 'sans-serif', position: 'relative', userSelect: 'none',
          }}
          {...swipe}
        >
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Status bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px 0', fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
              <span>9:41</span><span>· · ·</span>
            </div>

            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px 8px', borderBottom: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Simulation</div>
            </div>

            {/* Scroll area */}
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: 8 }}>

              {/* Orb section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 16px' }}>
                <div style={{ position: 'relative', width: 110, height: 110, marginBottom: 12 }}>
                  <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.04)', animation: 'ringpulse 4s ease-in-out infinite 0.5s' }} />
                  <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.08)', animation: 'ringpulse 4s ease-in-out infinite' }} />
                  <div style={{
                    width: 110, height: 110, borderRadius: '50%',
                    background: m.orb, boxShadow: `0 0 32px ${m.glow}`,
                    animation: 'breathe 4s ease-in-out infinite',
                    transition: 'background 2s ease, box-shadow 2s ease',
                  }} />
                </div>
                <div style={{ fontSize: 18, color: '#fff', fontWeight: 300, letterSpacing: '0.06em', marginBottom: 4, opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
                  {m.name}
                </div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.6, padding: '0 24px', opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
                  {m.quote}
                </div>
              </div>

              {/* Time slider */}
              <div style={{ padding: '0 20px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Time horizon</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{timeLabels[horizon]}</span>
                </div>
                <input className="sim-slider" type="range" min="0" max="5" step="1" value={horizon} onChange={e => setHorizon(+e.target.value)} style={sliderStyle} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>today</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>10 years</span>
                </div>
              </div>

              <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '0 20px 16px' }} />

              {/* Behavior sliders */}
              <div style={{ padding: '0 20px' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 14 }}>
                  If everyone behaved like
                  <span style={{ display: 'inline-block', fontSize: 8, color: mood.o1, border: `0.5px solid ${mood.o1}55`, borderRadius: 6, padding: '1px 5px', marginLeft: 6, letterSpacing: '0.06em', opacity: 0.8 }}>you</span>
                </div>

                {[
                  { label: 'Visit frequency', val: freqLabels[freq], setter: setFreq, value: freq, poles: ['once a month', 'every day'] },
                  { label: 'Time spent', val: timeSpentLabels[timeSpent], setter: setTimeSpent, value: timeSpent, poles: ['passing through', 'lingering long'] },
                  { label: 'Digital presence', val: digitalLabels[digital], setter: setDigital, value: digital, poles: ['invisible online', 'constantly shared'] },
                ].map(({ label, val, setter, value, poles }) => (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                      <span style={{ fontSize: 10, color: mood.o1, opacity: 0.85 }}>{val}</span>
                    </div>
                    <input className="sim-slider" type="range" min="0" max="4" step="1" value={value} onChange={e => setter(+e.target.value)} style={sliderStyle} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', maxWidth: '45%', lineHeight: 1.3 }}>{poles[0]}</span>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', maxWidth: '45%', lineHeight: 1.3, textAlign: 'right' }}>{poles[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ height: 8 }} />
            </div>

            {/* Bottom nav */}
            <div style={{ flexShrink: 0, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em' }}>
              <span>← feed</span><span>home →</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
