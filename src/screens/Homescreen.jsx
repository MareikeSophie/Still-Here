import { useEffect, useRef } from 'react';
import { useSwipe } from '../hooks/useSwipe';

function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
function lerp(a, b, t) { return a + (b - a) * t; }

export default function Homescreen({ mood, onGoLeft, onGoRight, onGoTraces }) {
  const canvasRef = useRef(null);
  const curC = useRef({ c1: hexToRgb(mood.c1), c2: hexToRgb(mood.c2), c3: hexToRgb(mood.c3) });
  const targetC = useRef({ c1: hexToRgb(mood.c1), c2: hexToRgb(mood.c2), c3: hexToRgb(mood.c3) });
  const tAnim = useRef(1);
  const rafId = useRef(null);

  const swipe = useSwipe({ onSwipeLeft: onGoLeft, onSwipeRight: onGoRight });

  useEffect(() => {
    targetC.current = { c1: hexToRgb(mood.c1), c2: hexToRgb(mood.c2), c3: hexToRgb(mood.c3) };
    tAnim.current = 0;
  }, [mood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 300;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    function draw() {
      if (tAnim.current < 1) {
        tAnim.current = Math.min(1, tAnim.current + 0.022);
        const cc = curC.current;
        const tc = targetC.current;
        cc.c1 = cc.c1.map((v, i) => lerp(v, tc.c1[i], tAnim.current));
        cc.c2 = cc.c2.map((v, i) => lerp(v, tc.c2[i], tAnim.current));
        cc.c3 = cc.c3.map((v, i) => lerp(v, tc.c3[i], tAnim.current));
      }
      const w = canvas.width, h = canvas.height;
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `rgb(${curC.current.c1.map(Math.round)})`);
      grad.addColorStop(0.5, `rgb(${curC.current.c2.map(Math.round)})`);
      grad.addColorStop(1, `rgb(${curC.current.c3.map(Math.round)})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      rafId.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem', background: '#111', minHeight: '100svh', alignItems: 'center' }}>
      <div
        style={{
          width: 300, height: 640, borderRadius: 48, overflow: 'hidden',
          position: 'relative', border: '1.5px solid rgba(255,255,255,0.12)',
          display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif',
          userSelect: 'none',
        }}
        {...swipe}
      >
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px 0', fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
            <span>9:41</span><span>· · ·</span>
          </div>

          {/* Top */}
          <div style={{ padding: '16px 24px 0', flexShrink: 0 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 6 }}>Still Here</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: '#fff', lineHeight: 1.05, fontStyle: 'italic', fontWeight: 400 }}>Elsewhere<br />Lane</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 5 }}>Monday, April 6, 2026</div>
          </div>

          {/* Center */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>

            {/* Orb — centered */}
            <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0, marginBottom: 24 }}>
              <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.05)', animation: 'rp 4s ease-in-out infinite 0.5s' }} />
              <div style={{ position: 'absolute', inset: -7, borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.09)', animation: 'rp 4s ease-in-out infinite' }} />
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                background: mood.orb,
                boxShadow: `0 0 28px ${mood.glow}`,
                animation: 'breathe 4s ease-in-out infinite',
                transition: 'background 1.8s ease, box-shadow 1.8s ease',
              }} />
            </div>

            {/* Mood name */}
            <div style={{ fontSize: 15, color: '#fff', fontWeight: 300, letterSpacing: '0.06em', textAlign: 'center', marginBottom: 16 }}>
              {mood.name}
            </div>

            {/* Quote */}
            <div style={{ padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.14)' }}>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: 1.7, textAlign: 'left' }}>
                {mood.quote}
              </div>
            </div>

          </div>

          {/* Last trace pill */}
          <div style={{ flexShrink: 0, padding: '0 24px 12px' }}>
            <div
              onClick={onGoTraces}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.09)',
                borderRadius: 20, padding: '10px 16px', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <span style={{ fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Last trace</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>{mood.trace}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
                <circle cx="7" cy="7" r="2" fill="rgba(255,255,255,0.3)" />
              </svg>
            </div>
          </div>

          {/* Bottom nav hints — same style as all other screens */}
          <div style={{ flexShrink: 0, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em' }}>
            <span>← simulation</span><span>feed →</span>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:.88;} 50%{transform:scale(1.07);opacity:1;} }
        @keyframes rp { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.04);opacity:0.5;} }
      `}</style>
    </div>
  );
}
