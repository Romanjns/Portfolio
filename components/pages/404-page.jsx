import React from 'react';
import { createRoot } from 'react-dom/client';
import { PALETTE, useViewport } from '../shared/hero-shared.jsx';
import { PageShell } from '../shared/shared-chrome.jsx';
import { useTweaks } from '../shared/use-tweaks.jsx';

(function () {
  if (document.getElementById('rj-404-kf')) return;
  const s = document.createElement('style');
  s.id = 'rj-404-kf';
  s.textContent = `
    @keyframes float404 {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-10px); }
    }
    @keyframes glitchShake {
      0%        { transform: translateY(0) translateX(0)   skewX(0deg); }
      10%       { transform: translateY(-2px) translateX(-5px) skewX(-1.5deg); }
      20%       { transform: translateY(2px)  translateX(5px)  skewX(1.5deg);  }
      30%       { transform: translateY(-1px) translateX(-7px) skewX(0.8deg);  }
      40%       { transform: translateY(1px)  translateX(7px)  skewX(-0.8deg); }
      50%       { transform: translateY(-3px) translateX(-3px) skewX(2deg);    }
      60%       { transform: translateY(3px)  translateX(3px)  skewX(-2deg);   }
      70%       { transform: translateY(-1px) translateX(-4px) skewX(0deg);    }
      80%       { transform: translateY(1px)  translateX(4px)  skewX(0.5deg);  }
      90%       { transform: translateY(0)    translateX(0)    skewX(0deg);    }
      100%      { transform: translateY(0)    translateX(0)    skewX(0deg);    }
    }
    .rj-404-num.glitching {
      animation: glitchShake 0.5s ease-in-out !important;
    }
  `;
  document.head.appendChild(s);
})();

const SCRAMBLE = '0123456789#@!%&?$X';
const TARGET   = ['4', '0', '4'];

function Glitch404({ accent, isMobile }) {
  const [chars,     setChars]     = React.useState(TARGET);
  const [glitching, setGlitching] = React.useState(false);
  const timerRef = React.useRef(null);

  const trigger = React.useCallback(() => {
    if (glitching) return;
    setGlitching(true);
    let tick = 0;
    const total = 20;
    timerRef.current = setInterval(() => {
      const progress = tick / total;
      setChars(TARGET.map(c =>
        Math.random() > progress
          ? SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
          : c
      ));
      tick++;
      if (tick > total) {
        clearInterval(timerRef.current);
        setChars(TARGET);
        setGlitching(false);
      }
    }, 45);
  }, [glitching]);

  React.useEffect(() => () => clearInterval(timerRef.current), []);

  const shadow = glitching
    ? `-5px 0 rgba(255,0,80,0.9), 5px 0 rgba(0,220,255,0.9), 0 0 48px ${accent}66`
    : `0 0 56px ${accent}22`;

  return (
    <div
      className={`rj-404-num${glitching ? ' glitching' : ''}`}
      onMouseEnter={trigger}
      style={{
        fontFamily:   '"Space Grotesk", sans-serif',
        fontSize:     isMobile ? 114 : 192,
        fontWeight:   700,
        lineHeight:   1,
        letterSpacing: isMobile ? -4 : -10,
        color:        accent,
        textShadow:   shadow,
        userSelect:   'none',
        cursor:       'default',
        marginBottom: 8,
        animation:    glitching ? undefined : 'float404 4s ease-in-out infinite',
        transition:   'text-shadow 0.07s',
      }}
    >
      {chars.join('')}
    </div>
  );
}

function QuickLink({ href, label, dark, accent, subtle }) {
  const [hovered, setHovered] = React.useState(false);
  const border = dark ? 'rgba(248,252,253,0.13)' : 'rgba(31,34,36,0.13)';
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
        fontSize:       13,
        fontWeight:     500,
        fontFamily:     '"Manrope", sans-serif',
        padding:        '8px 20px',
        borderRadius:   6,
        border:         `1px solid ${hovered ? accent : border}`,
        color:          hovered ? accent : subtle,
        background:     'transparent',
        transition:     'color .15s, border-color .15s',
      }}
    >
      {label}
    </a>
  );
}

function NotFoundPage() {
  const { tw, setTw } = useTweaks();
  const { isMobile }  = useViewport();
  const { dark, accent } = tw;
  const fg     = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.58)' : 'rgba(31,34,36,0.60)';

  return (
    <PageShell current="404" tw={tw} setTw={setTw}>
      <div style={{
        minHeight:      '72vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        isMobile ? '60px 5vw 80px' : '80px 6vw 100px',
        textAlign:      'center',
        fontFamily:     '"Manrope", sans-serif',
      }}>
        <Glitch404 accent={accent} isMobile={isMobile} />

        <h1 style={{
          fontFamily:    '"Space Grotesk", sans-serif',
          fontSize:      isMobile ? 20 : 28,
          fontWeight:    600,
          color:         fg,
          margin:        '0 0 12px',
          letterSpacing: -0.3,
        }}>
          Page Not Found
        </h1>

        <p style={{
          color:      subtle,
          fontSize:   isMobile ? 14 : 15,
          maxWidth:   380,
          lineHeight: 1.7,
          margin:     '0 0 36px',
        }}>
          This page doesn't exist. It may have been moved, or you might have typed the wrong address.
        </p>

        <a
          href="/"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            8,
            background:     accent,
            color:          '#fff',
            textDecoration: 'none',
            fontWeight:     600,
            fontSize:       14,
            padding:        '12px 28px',
            borderRadius:   8,
            marginBottom:   36,
            transition:     'opacity .15s, transform .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'none'; }}
        >
          ← Back to Home
        </a>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['/about','/internship', '/projects', '/contact'].map(href => (
            <QuickLink
              key={href}
              href={href}
              label={href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
              dark={dark}
              accent={accent}
              subtle={subtle}
            />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<NotFoundPage />);
