import { useEffect, useRef } from 'react';

function drawOrb(canvas, c1, c2) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const r = Math.min(w, h) / 2 - 1;
  const g = ctx.createRadialGradient(w * 0.38, h * 0.38, 0, w / 2, h / 2, r);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
}

function drawIconBg(canvas, c1, c2) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

export default function Launcher({ mood, onOpen }) {
  const bgRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    if (bgRef.current) drawIconBg(bgRef.current, mood.c1, mood.c2);
    if (orbRef.current) drawOrb(orbRef.current, mood.o1, mood.o2);
  }, [mood]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '100svh',
      background: '#111',
    }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
        tap to open
      </div>

      <div
        onClick={onOpen}
        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
      >
        {/* App icon */}
        <div style={{
          width: 80, height: 80, borderRadius: 20, position: 'relative', overflow: 'hidden',
          boxShadow: `0 0 24px ${mood.glow}`,
        }}>
          <canvas ref={bgRef} width={80} height={80} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          <canvas
            ref={orbRef}
            width={80}
            height={80}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              borderRadius: 20,
              animation: 'breathe 4s ease-in-out infinite',
            }}
          />
        </div>

        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
          Still Here
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%,100% { transform: scale(1); opacity: .88; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
