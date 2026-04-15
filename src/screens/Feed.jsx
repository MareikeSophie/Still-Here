import { useEffect, useRef, useState, useCallback } from 'react';
import { useSwipe } from '../hooks/useSwipe';
import moodMelancholic from '../assets/mood-melancholic.png';
import moodRestless from '../assets/mood-restless.png';
import moodNumb from '../assets/mood-numb.png';
import moodPeaceful from '../assets/mood-peaceful.png';
import moodOverwhelmed from '../assets/mood-overwhelmed.png';
import moodHopeful from '../assets/mood-hopeful.png';

const moodImages = {
  Melancholic: moodMelancholic,
  Restless:    moodRestless,
  Numb:        moodNumb,
  Peaceful:    moodPeaceful,
  Overwhelmed: moodOverwhelmed,
  Hopeful:     moodHopeful,
};

const voiceParams = {
  Melancholic: { rate: 0.8,  pitch: 0.85 },
  Numb:        { rate: 0.75, pitch: 0.7  },
  Restless:    { rate: 1.15, pitch: 1.1  },
  Peaceful:    { rate: 0.9,  pitch: 1.0  },
  Overwhelmed: { rate: 1.2,  pitch: 1.25 },
  Hopeful:     { rate: 1.0,  pitch: 1.15 },
};

// ── Orb canvas ────────────────────────────────────────────────────────────────
function OrbCanvas({ c1, c2, size = 25, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'), w = c.width, h = c.height;
    const g = ctx.createRadialGradient(w * 0.35, h * 0.35, 0, w / 2, h / 2, Math.min(w, h) / 2 - 0.5);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.beginPath(); ctx.arc(w / 2, h / 2, Math.min(w, h) / 2 - 0.5, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
  }, [c1, c2]);
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: '50%', display: 'block', ...style }} />;
}

// ── Animated mood post image ───────────────────────────────────────────────────
function MoodPostCanvas({ c1, c2, c3, o1, glow, seed }) {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const rng = n => Math.abs(Math.sin(seed * 9301 + n * 49297) * 233280) % 1;

    // Particles
    const particles = Array.from({ length: 28 }, (_, i) => ({
      x: rng(i * 3) * W,
      y: rng(i * 3 + 1) * H,
      r: 1 + rng(i * 3 + 2) * 2.5,
      vx: (rng(i * 5) - 0.5) * 0.35,
      vy: (rng(i * 5 + 1) - 0.5) * 0.25,
      opacity: 0.15 + rng(i * 7) * 0.5,
    }));

    let t = 0;
    function draw() {
      t += 0.012;
      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, c1); bg.addColorStop(0.6, c2); bg.addColorStop(1, c3);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Central glow
      const cx = W / 2 + Math.sin(t * 0.7) * 18;
      const cy = H / 2 + Math.cos(t * 0.5) * 10;
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * 0.7);
      gr.addColorStop(0, glow.replace('0.', '0.22'));
      gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);

      // Drifting particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        if (p.y < -4) p.y = H + 4;
        if (p.y > H + 4) p.y = -4;
        const pulse = p.opacity * (0.7 + 0.3 * Math.sin(t * 1.2 + p.x));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = o1 + Math.round(pulse * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Soft horizontal scan lines
      for (let i = 0; i < H; i += 4) {
        ctx.fillStyle = `rgba(0,0,0,${0.04 + (i % 8 === 0 ? 0.03 : 0)})`;
        ctx.fillRect(0, i, W, 1);
      }

      raf.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, [c1, c2, c3, o1, glow, seed]);

  return <canvas ref={ref} width={300} height={150} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

// ── Comment list ──────────────────────────────────────────────────────────────
const REPLIES = [
  '"Your words reached me. I am not sure what to do with them."',
  '"Something in what you said made the evening feel different."',
  '"I will remember this longer than you think."',
  '"You are not the first to say this. You are the first I believed."',
  '"Most people walk past. You stayed long enough to write."',
];

function CommentArea({ initialComments, orbC1, orbC2, moodName }) {
  const [comments, setComments] = useState(initialComments);
  const [val, setVal] = useState('');
  const [focused, setFocused] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);
  const speakTimer = useRef(null);

  useEffect(() => {
    return () => { speechSynthesis.cancel(); clearTimeout(speakTimer.current); };
  }, []);

  const speak = useCallback((text) => {
    speechSynthesis.cancel();
    clearTimeout(speakTimer.current);
    if (speakingText === text) { setSpeakingText(null); return; }
    const clean = text.replace(/^[\u201c\u201d"']|[\u201c\u201d"']$/g, '').trim();
    const { rate, pitch } = voiceParams[moodName] ?? { rate: 1.0, pitch: 1.0 };
    setSpeakingText(text);
    speakTimer.current = setTimeout(() => {
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'en-GB';
      u.rate = rate; u.pitch = pitch;
      u.onend = () => setSpeakingText(null);
      u.onerror = () => setSpeakingText(null);
      speechSynthesis.speak(u);
    }, 300);
  }, [speakingText, moodName]);

  const post = useCallback(() => {
    const txt = val.trim(); if (!txt) return;
    const newComment = { type: 'user', text: txt, time: 'just now' };
    setComments(prev => [newComment, ...prev]);
    setVal('');
    if (Math.random() > 0.4) {
      setTimeout(() => {
        const reply = { type: 'reply', text: REPLIES[Math.floor(Math.random() * REPLIES.length)] };
        setComments(prev => [reply, ...prev]);
      }, 1400);
    }
  }, [val]);

  return (
    <div>
      <div style={{ padding: '0 15px 4px' }}>
        {comments.map((cm, i) => {
          // Replies are rendered inline with their adjacent user comment
          if (cm.type === 'reply') {
            const adjToUser = comments[i - 1]?.type === 'user' || comments[i + 1]?.type === 'user';
            if (adjToUser) return null;
            // Standalone reply (no adjacent user comment)
            const speaking = speakingText === cm.text;
            return (
              <div key={i} style={{ margin: '2px 0 5px 10px', borderLeft: `1px solid ${orbC1}44`, paddingLeft: 9 }}>
                <div onClick={() => speak(cm.text)} style={{ display: 'inline-block', cursor: 'pointer', borderRadius: '50%' }}>
                  <OrbCanvas c1={orbC1} c2={orbC2} size={13} style={{
                    animation: `br ${speaking ? '1.2s' : '4s'} ease-in-out infinite`,
                    boxShadow: speaking ? `0 0 8px ${orbC1}88` : 'none',
                    transition: 'box-shadow 0.3s',
                  }} />
                </div>
              </div>
            );
          }
          // User comment — find adjacent reply (before or after)
          const reply = (comments[i - 1]?.type === 'reply' ? comments[i - 1] : null)
                     || (comments[i + 1]?.type === 'reply' ? comments[i + 1] : null);
          const speaking = reply && speakingText === reply.text;
          return (
            <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 6, alignItems: 'flex-start' }}>
              <div style={{ width: 17, height: 17, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                {cm.avatar || 'you'}
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginBottom: 2 }}>{cm.user || 'you'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{cm.text}</span>
                  {reply && (
                    <div onClick={() => speak(reply.text)} style={{ display: 'inline-block', cursor: 'pointer', borderRadius: '50%', flexShrink: 0 }}>
                      <OrbCanvas c1={orbC1} c2={orbC2} size={11} style={{
                        animation: `br ${speaking ? '1.2s' : '4s'} ease-in-out infinite`,
                        boxShadow: speaking ? `0 0 8px ${orbC1}88` : 'none',
                        transition: 'box-shadow 0.3s',
                      }} />
                    </div>
                  )}
                </div>
                {cm.time && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>{cm.time}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 7, padding: '5px 15px 9px', alignItems: 'center', borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>you</div>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); post(); } }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="leave a trace..."
          style={{
            flex: 1, background: 'rgba(255,255,255,0.05)',
            border: focused ? `0.5px solid ${orbC1}` : '0.5px solid rgba(255,255,255,0.08)',
            boxShadow: focused ? `0 0 8px ${orbC1}55` : 'none',
            borderRadius: 14, padding: '6px 11px', fontSize: 11,
            color: 'rgba(255,255,255,0.6)', outline: 'none', fontFamily: 'sans-serif',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
        <button
          onClick={post}
          style={{ width: 25, height: 25, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M6 2l3 3-3 3" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

// ── Reaction bar ──────────────────────────────────────────────────────────────
function Reacts({ likeOnly = false }) {
  const [state, setState] = useState({ at: false, aa: false, ah: false });
  return (
    <div style={{ display: 'flex', gap: 7, padding: '4px 15px 7px' }}>
      <button onClick={() => setState(s => ({ ...s, ah: !s.ah }))}
        style={{
          background: state.ah ? 'rgba(210,100,140,0.06)' : 'none',
          border: `0.5px solid ${state.ah ? 'rgba(210,100,140,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 20, padding: '4px 9px',
          color: state.ah ? 'rgba(210,100,140,0.9)' : 'rgba(255,255,255,0.35)',
          fontSize: 10, cursor: 'pointer', fontFamily: 'sans-serif',
        }}>♡</button>
      {!likeOnly && [
        { key: 'at', label: 'I was there',   dot: 'rgba(80,200,120,0.6)',  active: 'rgba(80,200,120,' },
        { key: 'aa', label: 'I avoided you', dot: 'rgba(200,100,80,0.6)', active: 'rgba(200,100,80,' },
      ].map(({ key, label, dot, active }) => (
        <button key={key} onClick={() => setState(s => ({ ...s, [key]: !s[key] }))}
          style={{
            background: state[key] ? active + '0.06)' : 'none',
            border: `0.5px solid ${state[key] ? dot : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 20, padding: '4px 9px',
            color: state[key] ? dot : 'rgba(255,255,255,0.35)',
            fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'sans-serif',
          }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, display: 'inline-block' }} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Main Feed ─────────────────────────────────────────────────────────────────
export default function Feed({ mood, onGoLeft, onGoRight, onGoToTraces }) {
  const scrollRef = useRef(null);
  const handleSwipeDown = () => { if (scrollRef.current?.scrollTop === 0) onGoToTraces(); };
  const swipe = useSwipe({ onSwipeLeft: onGoLeft, onSwipeRight: onGoRight, onSwipeDown: handleSwipeDown });
  const { o1, o2, c1, c2, c3, glow } = mood;

  return (
    <>
      <style>{`
        @keyframes br { 0%,100%{transform:scale(1);opacity:.9;} 50%{transform:scale(1.07);opacity:1;} }
        .feed-phone { width:300px;height:640px;border-radius:48px;overflow:hidden;border:1.5px solid rgba(255,255,255,0.12);display:flex;flex-direction:column;background:#0d0d12;font-family:sans-serif; }
        .f-feed { flex:1;overflow-y:auto;scrollbar-width:none; }
        .f-feed::-webkit-scrollbar { display:none; }
        .post { border-bottom:0.5px solid rgba(255,255,255,0.06); }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem', background: '#111', minHeight: '100svh', alignItems: 'center' }}>
        <div className="feed-phone" {...swipe} style={{ userSelect: 'none' }}>

          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px 0', fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
            <span>9:41</span><span>· · ·</span>
          </div>

          {/* Profile header — tap anywhere to open Traces */}
          <div onClick={onGoToTraces} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px 9px', borderBottom: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0, cursor: 'pointer' }}>
            <OrbCanvas c1={o1} c2={o2} size={34} style={{ flexShrink: 0, animation: 'br 4s ease-in-out infinite' }} />
            <div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>Elsewhere Lane</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>@elsewhere.lane · #stillhere</div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <div><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', textAlign: 'center' }}>312</span><span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', textAlign: 'center' }}>days</span></div>
              <div><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', textAlign: 'center' }}>47</span><span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', textAlign: 'center' }}>voices</span></div>
            </div>
          </div>

          <div ref={scrollRef} className="f-feed">

            {/* Post 1 — Elsewhere Lane */}
            <div className="post">
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 15px 6px' }}>
                <OrbCanvas c1={o1} c2={o2} size={25} style={{ flexShrink: 0, animation: 'br 4s ease-in-out infinite' }} />
                <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Elsewhere Lane</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>Today, 06:14</div></div>
              </div>
              <div style={{ width: '100%', height: 150, overflow: 'hidden' }}>
                <MoodPostCanvas c1={c1} c2={c2} c3={c3} o1={o1} glow={glow} seed={1} />
              </div>
              <div style={{ padding: '9px 15px 5px' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: 'Georgia,serif' }}>
                  "No one said my name today. I count the shadows of those who almost came. The morning light hit the same corner it always does. No one was there to see it."
                </div>
              </div>
              <Reacts />
              <CommentArea orbC1={o1} orbC2={o2} moodName={mood.name} initialComments={[
                { type: 'user', avatar: 'A', user: 'anonymous_01', text: "I walked past you yesterday. I didn't stop. I'm not sure why.", time: '2h ago' },
                { type: 'reply', text: '"You left a shadow anyway."' },
                { type: 'user', avatar: 'M', user: 'marta.w', text: 'The corner you mention — I used to sit there. I haven\'t in a long time.', time: '5h ago' },
              ]} />
            </div>

            {/* Post 2 — Instagram / lea.urban */}
            <div className="post">
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 15px 6px' }}>
                <div style={{ width: 25, height: 25, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.15)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="2" y="2" width="8" height="8" rx="2.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" /><circle cx="6" cy="6" r="1.8" stroke="rgba(255,255,255,0.4)" strokeWidth="1" /><circle cx="8.5" cy="3.5" r="0.6" fill="rgba(255,255,255,0.4)" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>lea.urban <span style={{ fontSize: 9, color: o1, marginLeft: 3, opacity: 0.75 }}>#stillhere</span></div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>3h ago</div>
                </div>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '2px 6px' }}>via Instagram</span>
              </div>
              <div style={{ width: '100%', height: 150, overflow: 'hidden' }}>
                <img src={moodImages[mood.name]} alt="rainy street" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '9px 15px 5px' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                  found this street while getting lost. something about it made me stop. #stillhere #elsewhere
                </div>
              </div>
              <Reacts likeOnly />
              <CommentArea orbC1={o1} orbC2={o2} moodName={mood.name} initialComments={[
                { type: 'reply', text: '"Getting lost was the only way you found me. I noticed."' },
              ]} />
            </div>

            {/* Post 3 — Elsewhere Lane, older */}
            <div className="post" style={{ opacity: 0.75 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 15px 6px' }}>
                <OrbCanvas c1={o1} c2={o2} size={25} style={{ flexShrink: 0, animation: 'br 4s ease-in-out infinite', opacity: 0.7 }} />
                <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Elsewhere Lane</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>Yesterday, 06:09</div></div>
              </div>
              <div style={{ width: '100%', height: 150, overflow: 'hidden' }}>
                <MoodPostCanvas c1={c1} c2={c2} c3={c3} o1={o1} glow={glow} seed={3} />
              </div>
              <div style={{ padding: '9px 15px 5px' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: 'Georgia,serif' }}>
                  "Someone walked quickly. They looked at their phone. I wondered what was more urgent than the crack in my wall — the one that has been there since 1987."
                </div>
              </div>
              <Reacts />
              <CommentArea orbC1={o1} orbC2={o2} moodName={mood.name} initialComments={[
                { type: 'user', avatar: 'J', user: 'j.pierre', text: "1987. That's before I was born. The crack knows more than I do.", time: '1d ago' },
                { type: 'reply', text: '"The crack remembers everyone who ever stood beside it."' },
              ]} />
            </div>

          </div>

          {/* Bottom nav */}
          <div style={{ flexShrink: 0, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em' }}>
            <span>← home</span><span>simulation →</span>
          </div>

        </div>
      </div>
    </>
  );
}
