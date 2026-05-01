import React from 'react';

// Shared pieces: Matrix rain canvas, name with swappable type-effects,
// palette tokens. Everything receives `tw` (the live tweak values) so both
// variations update together.

const PALETTE = {
  white:  '#f8fcfd',      // light background & dark-mode text
  indigo: '#1f2224',      // dark background & light-mode text
  blue:   '#d03b08',      // primary accent (orange)
  blueDk: '#30585d',      // secondary accent (teal)
};

function useViewport() {
  const getWidth = () => (typeof window === 'undefined' ? 1440 : window.innerWidth);
  const [width, setWidth] = React.useState(getWidth);

  React.useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(getWidth()));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return {
    width,
    isMobile: width < 720,
    isTablet: width >= 720 && width < 1100,
    isDesktop: width >= 1100,
  };
}

function SectionPattern({ dark, accent, variant = 'grid', opacity = 1 }) {
  const baseLine = dark
    ? `rgba(248,252,253,${0.055 * opacity})`
    : `rgba(31,34,36,${0.055 * opacity})`;
  const accentLine = dark
    ? `rgba(208,59,8,${0.11 * opacity})`
    : `rgba(48,88,93,${0.11 * opacity})`;
  const glow = dark
    ? `rgba(208,59,8,${0.08 * opacity})`
    : `rgba(48,88,93,${0.08 * opacity})`;

  const patterns = {
    hero: {
      backgroundImage: `
        linear-gradient(90deg, ${baseLine} 1px, transparent 1px),
        linear-gradient(${baseLine} 1px, transparent 1px),
        radial-gradient(circle at 18% 22%, ${glow}, transparent 34%),
        radial-gradient(circle at 78% 68%, ${accentLine}, transparent 30%)
      `,
      backgroundSize: '42px 42px, 42px 42px, 100% 100%, 100% 100%',
    },
    grid: {
      backgroundImage: `
        linear-gradient(90deg, ${baseLine} 1px, transparent 1px),
        linear-gradient(${baseLine} 1px, transparent 1px)
      `,
      backgroundSize: '34px 34px',
    },
    diagonal: {
      backgroundImage: `repeating-linear-gradient(135deg, ${baseLine} 0 1px, transparent 1px 18px)`,
    },
    dots: {
      backgroundImage: `radial-gradient(circle, ${accentLine} 1px, transparent 1.4px)`,
      backgroundSize: '22px 22px',
    },
  };

  return (
    <div style={{
      position:'absolute',
      inset:0,
      zIndex:0,
      pointerEvents:'none',
      opacity,
      ...patterns[variant],
    }}/>
  );
}

function sectionSurface(dark, strength = 1) {
  return {
    background: dark
      ? `rgba(31,34,36,${0.48 * strength})`
      : `rgba(248,252,253,${0.66 * strength})`,
    borderTop: `1px solid ${dark ? 'rgba(248,252,253,0.08)' : 'rgba(31,34,36,0.08)'}`,
    backdropFilter:'blur(10px) saturate(120%)',
    WebkitBackdropFilter:'blur(10px) saturate(120%)',
  };
}

function useScrollReveal() {
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const reveal = (el) => el.classList.add('rj-visible');
    const nodes = () => Array.from(document.querySelectorAll('[data-rj-reveal]'));

    if (!('IntersectionObserver' in window)) {
      nodes().forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    const watch = () => {
      nodes().forEach((el) => {
        if (el.classList.contains('rj-visible')) return;
        observer.observe(el);
      });
    };

    watch();
    const mutationObserver = new MutationObserver(watch);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}

// ── Matrix rain ──────────────────────────────────────────────
// Katakana + digits, narrow column width, gentle speed. Alpha fade per frame
// leaves a receding trail. Head glyph is brighter than tail.
function MatrixRain({ color = PALETTE.blue, opacity = 0.55, density = 1, dark = false }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0, drops = [], raf = 0, w = 0, h = 0;
    const glyphs = 'アァカサタナハマヤラワイィキシチニヒミリヰウゥクスツヌフムユルエェケセテネヘメレヱオォコソトノホモヨロヲ0123456789ABCDEFZX<>/#$%*+-';

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const size = 16;
      cols = Math.ceil(w / size);
      drops = Array.from({ length: cols }, () => Math.random() * -50);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const fadeStyle = dark
      ? 'rgba(31, 34, 36, 0.12)'
      : 'rgba(248, 252, 253, 0.16)';
    const tick = () => {
      // fade-out overlay — theme-matched so trails recede into the actual
      // background color instead of accumulating into black.
      ctx.fillStyle = fadeStyle;
      ctx.fillRect(0, 0, w, h);

      ctx.font = '600 14px "JetBrains Mono", monospace';
      const size = 16;
      for (let i = 0; i < cols; i++) {
        if (Math.random() > density * 0.98) continue;
        const ch = glyphs[(Math.random() * glyphs.length) | 0];
        const x = i * size;
        const y = drops[i] * size;
        // head
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.min(1, opacity + 0.25);
        ctx.fillText(ch, x, y);
        // tail
        ctx.globalAlpha = opacity * 0.55;
        ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], x, y - size);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [color, opacity, density, dark]);

  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block' }} />;
}

// ── Mesh / gradient background ───────────────────────────────
// Interactive: orbs drift slowly, plus parallax-follow the cursor.
// Static animation config lives outside the component so the rAF loop
// closes over a stable reference — no React re-renders on each frame.
const MESH_ORB_ANIM = [
  { px: 8,  py: 6,  sx: 0.35, sy: 0.28, ph: 0 },
  { px: 14, py: 10, sx: 0.27, sy: 0.32, ph: 0 },
  { px: 20, py: 14, sx: 0.22, sy: 0.24, ph: 1 },
];

function MeshBG({ accent, dark }) {
  const base = dark ? PALETTE.indigo : PALETTE.white;
  const containerRef = React.useRef(null);
  const orbRefs = React.useRef([]);
  const pos = React.useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      pos.current.tx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      pos.current.ty = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    let raf = 0;
    const t0 = performance.now();
    const loop = (now) => {
      const t = (now - t0) * 0.001;
      pos.current.x += (pos.current.tx - pos.current.x) * 0.06;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.06;
      MESH_ORB_ANIM.forEach((o, i) => {
        const orbEl = orbRefs.current[i];
        if (!orbEl) return;
        const dx = Math.sin(t * o.sx + o.ph) * 6;
        const dy = Math.cos(t * o.sy + o.ph) * 5;
        orbEl.style.transform = `translate(calc(${dx + pos.current.x * o.px}%), calc(${dy + pos.current.y * o.py}%))`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); };
  }, []);

  const orbs = [
    { hue: accent,         size: 620, bx: 18, by: 25, a: dark ? 0.75 : 0.55 },
    { hue: PALETTE.blueDk, size: 540, bx: 82, by: 72, a: dark ? 0.70 : 0.50 },
    { hue: PALETTE.blueDk, size: 460, bx: 58, by: 12, a: dark ? 0.60 : 0.38 },
  ];

  return (
    <div ref={containerRef} style={{ position:'absolute', inset:0, background: base, overflow:'hidden' }}>
      {orbs.map((o, i) => (
        <div key={i} ref={el => { orbRefs.current[i] = el; }} style={{
          position:'absolute',
          width: o.size, height: o.size,
          left: `calc(${o.bx}% - ${o.size/2}px)`,
          top:  `calc(${o.by}% - ${o.size/2}px)`,
          borderRadius:'50%',
          background: `radial-gradient(circle, ${o.hue} 0%, transparent 62%)`,
          filter:'blur(48px)',
          opacity: o.a,
          pointerEvents:'none',
          willChange:'transform',
        }}/>
      ))}
      {dark && <div style={{
        position:'absolute', inset:0, opacity: 0.25, mixBlendMode:'overlay',
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        pointerEvents:'none',
      }}/>}
    </div>
  );
}

// ── Background dispatcher ────────────────────────────────────
function Background({ bg, accent, dark }) {
  const base = dark ? PALETTE.indigo : PALETTE.white;
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', background: base }}>
      {bg === 'matrix' && <MatrixRain color={accent} opacity={dark ? 0.75 : 0.42} dark={dark} />}
      {bg === 'mesh'   && <MeshBG accent={accent} dark={dark} />}
      {/* subtle vignette */}
      <div style={{
        position:'absolute', inset:0,
        background: dark
          ? 'radial-gradient(ellipse 90% 60% at 50% 50%, transparent 40%, rgba(31,34,36,0.65) 100%)'
          : 'radial-gradient(ellipse 90% 60% at 50% 50%, transparent 40%, rgba(248,252,253,0.12) 100%)',
        pointerEvents:'none',
      }}/>
    </div>
  );
}
function BigName({ text, effect = 'decrypt', accent, dark, seed = 0, startDelay = 0 }) {
  const cleanupRef = React.useRef(null);
  const [display, setDisplay] = React.useState(
    effect === 'decrypt' ? scramble(text) :
    effect === 'typewriter' ? '' : text
  );
  // typewriter pauses at empty during startDelay — no caret shown yet
  const [pending, setPending] = React.useState(effect === 'typewriter' && startDelay > 0);
  const [phase, setPhase] = React.useState(0); // 0 = animating in, 1 = done

  React.useEffect(() => {
    setPhase(0);
    if (effect === 'decrypt') {
      const chars = text.split('');
      const resolved = chars.map(() => false);
      // resolve each character at a staggered time
      const timers = chars.map((_, i) => {
        const delay = 120 + i * 55 + Math.random() * 120;
        return setTimeout(() => { resolved[i] = true; }, delay);
      });
      let raf = 0;
      const tick = () => {
        setDisplay(chars.map((c, i) => resolved[i] ? c : (c === ' ' ? ' ' : randChar())).join(''));
        if (resolved.every(Boolean)) { setPhase(1); return; }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
    }
    if (effect === 'typewriter') {
      setDisplay('');
      setPending(startDelay > 0);
      const startAfter = setTimeout(() => {
        setPending(false);
        let i = 0;
        const t = setInterval(() => {
          i++;
          setDisplay(text.slice(0, i));
          if (i >= text.length) { clearInterval(t); setPhase(1); }
        }, 90);
        cleanupRef.current = () => clearInterval(t);
      }, startDelay);
      return () => { clearTimeout(startAfter); if (cleanupRef.current) cleanupRef.current(); };
    }
    // stagger / shimmer / outline — render full text, CSS handles the rest
    setDisplay(text);
    const t = setTimeout(() => setPhase(1), 1400);
    return () => clearTimeout(t);
  }, [text, effect, seed]);

  const base = {
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 700,
    fontSize: 'inherit',
    letterSpacing: 0,
    lineHeight: 0.92,
    color: dark ? PALETTE.white : PALETTE.indigo,
    margin: 0,
    display: 'block',
  };

  if (effect === 'stagger') {
    return (
      <h1 style={base} aria-label={text}>
        {text.split('').map((c, i) => (
          <span key={i} style={{
            display:'inline-block',
            opacity: 0, transform:'translateY(28px)',
            animation: `rjStagger 0.7s cubic-bezier(.2,.8,.2,1) ${i * 45}ms forwards`,
            whiteSpace: c === ' ' ? 'pre' : 'normal',
          }}>{c}</span>
        ))}
      </h1>
    );
  }
  if (effect === 'shimmer') {
    return (
      <h1 style={{
        ...base,
        background: `linear-gradient(100deg, ${dark ? PALETTE.white : PALETTE.indigo} 25%, ${accent} 45%, ${dark ? PALETTE.white : PALETTE.indigo} 65%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent',
        animation:'rjShimmer 2.6s ease-in-out infinite',
      }}>{text}</h1>
    );
  }
  if (effect === 'outline') {
    return (
      <h1 style={{
        ...base,
        color: 'transparent',
        WebkitTextStroke: `1.5px ${dark ? PALETTE.white : PALETTE.indigo}`,
        animation: 'rjOutline 1.4s ease-out forwards',
      }}>{text}</h1>
    );
  }
  // decrypt / typewriter / default
  return (
    <h1 style={base}>
      <span>{display}</span>
      {effect === 'typewriter' && phase === 0 && !pending && (
        <span style={{ display:'inline-block', width:'0.12em', height:'0.9em',
          background: accent, marginLeft:4, verticalAlign:'-0.05em',
          animation:'rjBlink 0.9s steps(2) infinite' }}/>
      )}
    </h1>
  );
}

function scramble(text) {
  return text.split('').map(c => c === ' ' ? ' ' : randChar()).join('');
}
function randChar() {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/#$%*+-';
  return pool[(Math.random() * pool.length) | 0];
}

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('rj-keyframes')) {
  const s = document.createElement('style');
  s.id = 'rj-keyframes';
  s.textContent = `
    @keyframes rjStagger { to { opacity:1; transform:translateY(0); } }
    @keyframes rjShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @keyframes rjOutline { 0% { color: transparent; } 100% { color: inherit; } }
    @keyframes rjBlink   { 50% { opacity: 0; } }
    @keyframes rjFadeUp  { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform:none; } }
    @keyframes rjPulse   { 0%,100% { opacity:1; } 50% { opacity:.4; } }
    .rj-fadeup { animation: rjFadeUp 0.7s cubic-bezier(.2,.8,.2,1) both; }
    [data-rj-reveal] {
      opacity: 0;
      transform: translateY(26px);
      transition:
        opacity 760ms cubic-bezier(.2,.8,.2,1),
        transform 760ms cubic-bezier(.2,.8,.2,1);
      transition-delay: var(--rj-delay, 0ms);
      will-change: opacity, transform;
    }
    [data-rj-reveal="left"] { transform: translateX(-26px); }
    [data-rj-reveal="right"] { transform: translateX(26px); }
    [data-rj-reveal].rj-visible {
      opacity: 1;
      transform: translate(0, 0);
    }
    @media (prefers-reduced-motion: reduce) {
      .rj-fadeup {
        animation: none !important;
      }
      [data-rj-reveal] {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(s);
}

export { PALETTE, MESH_ORB_ANIM, useViewport, useScrollReveal, SectionPattern, sectionSurface, MatrixRain, Background, BigName };
