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
    ? `rgba(48,88,93,${0.12 * opacity})`
    : `rgba(48,88,93,${0.10 * opacity})`;
  const patterns = {
    hero: {
      backgroundImage: `
        linear-gradient(90deg, ${baseLine} 1px, transparent 1px),
        linear-gradient(${baseLine} 1px, transparent 1px),
        linear-gradient(135deg, transparent 0%, ${accentLine} 52%, transparent 100%)
      `,
      backgroundSize: '42px 42px, 42px 42px, 100% 100%',
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
  // Cleaner, more minimal surface — reduces backdrop blur for modern premium look
  return {
    background: dark
      ? `linear-gradient(180deg, rgba(38,45,46,${0.66 * strength}), rgba(31,34,36,${0.94 * strength}))`
      : `linear-gradient(180deg, rgba(248,252,253,${0.96 * strength}), rgba(244,249,249,${0.92 * strength}))`,
    backdropFilter: strength > 0.8 ? 'blur(10px)' : 'blur(6px)',
    WebkitBackdropFilter: strength > 0.8 ? 'blur(10px)' : 'blur(6px)',
  };
}

// Alternating section backgrounds for visual separation without noise
// index: 0 = first section, 1 = second, etc.
function getSectionBackgroundTone(index, dark) {
  if (dark) {
    return index % 2 === 0
      ? 'linear-gradient(180deg, #1f2224 0%, #202729 100%)'
      : 'linear-gradient(180deg, #252b2d 0%, #202426 100%)';
  }

  return index % 2 === 0
    ? 'linear-gradient(180deg, #f8fcfd 0%, #f3f8f8 100%)'
    : 'linear-gradient(180deg, #eef7f5 0%, #e6f0ed 100%)';
}

// Subtle fade-out at section top and bottom for smooth transitions
function sectionFade(position = 'both', dark = false) {
  const edge = dark ? 'rgba(16,18,20,0.20)' : 'rgba(31,34,36,0.055)';
  const edgeStrong = dark ? 'rgba(16,18,20,0.34)' : 'rgba(31,34,36,0.075)';
  const gradients = {
    top: `linear-gradient(to bottom, ${edgeStrong}, transparent 56px)`,
    bottom: `linear-gradient(to top, ${edge}, transparent 56px)`,
    both: `
      linear-gradient(to bottom, ${edgeStrong}, transparent 64px),
      linear-gradient(to top, ${edge}, transparent 64px)
    `,
  };
  return {
    background: gradients[position],
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
  };
}

// Ultra-subtle global noise texture for premium feel
function globalNoiseTexture(dark = false) {
  return {
    backgroundImage: dark 
      ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' seed='2'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%231f2224' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E\")"
      : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' seed='2'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23f4f7f8' filter='url(%23n)' opacity='0.018'/%3E%3C/svg%3E\")",
    backgroundSize: '240px 240px',
    backgroundAttachment: 'fixed',
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



// ── Background dispatcher ────────────────────────────────────
// Simplified: only use matrix for hero, keep backgrounds clean elsewhere
function Background({ bg, accent, dark }) {
  const base = dark ? PALETTE.indigo : '#f8fcfd';
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', background: base }}>
      {bg === 'matrix' && <MatrixRain color={accent} opacity={dark ? 0.75 : 0.42} dark={dark} />}
      {/* subtle vignette — minimal on light mode to preserve clarity */}
      <div style={{
        position:'absolute', inset:0,
        background: dark
          ? 'linear-gradient(180deg, rgba(255,255,255,0.018), rgba(0,0,0,0.10))'
          : 'linear-gradient(180deg, rgba(48,88,93,0.035), rgba(208,59,8,0.025))',
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
    <h1 style={{...base, minHeight: base.lineHeight ? `${base.lineHeight}em` : 'auto' }}>
      <span style={{ display: 'inline-block', position: 'relative', whiteSpace: 'nowrap', minWidth: 0 }}>
        <span style={{ display: 'inline-block', minWidth: 0 }}>{display}</span>
        {effect === 'typewriter' && phase === 0 && !pending && (
          <span style={{
            position: 'absolute', right: 0, top: 0,
            width:'0.12em', height:'0.9em',
            background: accent, marginLeft:1,
            animation:'rjBlink 0.9s steps(2) infinite',
          }}/>
        )}
      </span>
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
    html { scrollbar-gutter: stable; }
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
    .rj-primary-action,
    .rj-secondary-action {
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
      will-change: transform, filter;
    }
    .rj-primary-action::before {
      content: "";
      position: absolute;
      inset: -1px auto -1px -55%;
      width: 42%;
      background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.26) 45%, rgba(255,255,255,0.58) 50%, rgba(255,255,255,0.20) 56%, transparent 100%);
      transform: skewX(-18deg) translateX(0);
      opacity: 0;
      pointer-events: none;
    }
    .rj-primary-action:hover::before {
      opacity: 1;
      animation: rjButtonShine 760ms cubic-bezier(.2,.8,.2,1);
    }
    @keyframes rjButtonShine {
      from { transform: skewX(-18deg) translateX(0); }
      to { transform: skewX(-18deg) translateX(360%); }
    }
    .rj-primary-action:hover {
      transform: translateY(-2px);
      filter: saturate(1.06);
    }
    .rj-secondary-action:hover {
      transform: translateY(-2px);
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

export { PALETTE, useViewport, useScrollReveal, SectionPattern, sectionSurface, sectionFade, globalNoiseTexture, getSectionBackgroundTone, MatrixRain, Background, BigName };
