import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  PALETTE,
  useViewport,
  globalNoiseTexture,
  getSectionBackgroundTone,
  SectionPattern,
} from '../shared/hero-shared.jsx';
import { PageShell } from '../shared/shared-chrome.jsx';
import { useTweaks } from '../shared/use-tweaks.jsx';

const EMAIL = 'roman.janssens.it@gmail.com';

const CONTACTS = [
  { label: 'GitHub',    href: 'https://github.com/Romanjns',                             hoverBg: '#24292e', key: 'github'    },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/roman-janssens-3652b2298/',   hoverBg: '#0072b1', key: 'linkedin'  },
  { label: 'Instagram', href: 'https://www.instagram.com/roman.janssens05/',             hoverBg: '#c13584', key: 'instagram' },
  { label: 'Email',     href: `mailto:${EMAIL}`,                                         hoverBg: '#d03b08', key: 'email'     },
];

function injectContactStyles() {
  if (typeof document === 'undefined' || document.getElementById('rj-contact-css')) return;
  const style = document.createElement('style');
  style.id = 'rj-contact-css';
  style.textContent = `
    @keyframes rjArcPulse {
      0%, 100% { opacity: .46; filter: drop-shadow(0 0 8px var(--arc-glow)); }
      50%       { opacity: 1;  filter: drop-shadow(0 0 18px var(--arc-glow)); }
    }
    @keyframes rjSlideInTop {
      0%   { transform: translateY(-34px); opacity: 0; }
      100% { transform: translateY(0);     opacity: 1; }
    }
    .rj-social-btn {
      width: 58px; height: 58px;
      border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; cursor: pointer; text-decoration: none;
      transition: transform 0.28s cubic-bezier(.2,.8,.2,1),
                  background-color 0.28s ease,
                  border-color 0.28s ease,
                  box-shadow 0.28s ease;
    }
    .rj-social-btn:hover  { transform: scale(1.15) translateY(-3px); }
    .rj-social-btn:active { transform: scale(0.92); transition-duration: 0.1s; }
    @media (prefers-reduced-motion: reduce) {
      .rj-social-btn { animation: none !important; transition: none !important; }
    }
  `;
  document.head.appendChild(style);
}

function colors(dark, accent) {
  return {
    fg:          dark ? PALETTE.white  : PALETTE.indigo,
    subtle:      dark ? 'rgba(248,252,253,0.70)' : 'rgba(31,34,36,0.68)',
    muted:       dark ? 'rgba(248,252,253,0.48)' : 'rgba(31,34,36,0.50)',
    faint:       dark ? 'rgba(248,252,253,0.08)' : 'rgba(31,34,36,0.08)',
    border:      dark ? 'rgba(248,252,253,0.12)' : 'rgba(31,34,36,0.13)',
    borderStrong:dark ? 'rgba(208,59,8,0.42)'    : 'rgba(208,59,8,0.38)',
    primary:     accent,
    secondary:   PALETTE.blueDk,
    glow:        dark ? 'rgba(208,59,8,0.22)' : 'rgba(208,59,8,0.12)',
    shadow:      dark ? 'rgba(0,0,0,0.50)'    : 'rgba(31,34,36,0.18)',
  };
}

/* ── SVG icons ─────────────────────────────────────────────────── */
function SocialIcon({ id }) {
  if (id === 'github') return (
    <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true">
      <path fill="white" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
  if (id === 'linkedin') return (
    <svg viewBox="0 0 448 512" width="20" height="22" aria-hidden="true">
      <path fill="white" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
    </svg>
  );
  if (id === 'email') return (
    <svg viewBox="0 0 24 24" width="23" height="23" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="white" strokeWidth="2"/>
      <path d="M4 8l8 6 8-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true">
      <path fill="white" d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
    </svg>
  );
}

function EnvelopeIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.8"/>
      <path d="M2 8l10 7 10-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" aria-hidden="true">
      <path d="M5.2 3.2h6.1v6.1M11 3.5 3.8 10.7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CopyIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" stroke={color} strokeWidth="1.8"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function CheckIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Social pill button ─────────────────────────────────────────── */
function ContactSocialCard({ item, tone, dark, isMobile }) {
  const [hovered, setHovered] = React.useState(false);
  const baseBg     = dark ? PALETTE.blueDk          : 'rgba(208,59,8,0.10)';
  const baseBorder = dark ? 'rgba(248,252,253,0.14)' : 'rgba(208,59,8,0.22)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 7 : 9 }}>
      <a
        href={item.href}
        target={item.href.startsWith('mailto:') ? undefined : '_blank'}
        rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        className="rj-social-btn"
        aria-label={item.label}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: hovered ? item.hoverBg : baseBg,
          border: `1px solid ${hovered ? 'transparent' : baseBorder}`,
          boxShadow: hovered ? `0 14px 34px -14px ${item.hoverBg}99` : 'none',
        }}
      >
        <span
          key={`icon-${hovered}`}
          style={{ display: 'flex', animation: hovered ? 'rjSlideInTop 0.28s both' : 'none' }}
        >
          <SocialIcon id={item.key} />
        </span>
      </a>
      <span style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: isMobile ? 11.5 : 12.5,
        fontWeight: 600,
        color: hovered ? tone.primary : tone.muted,
        letterSpacing: 0.3,
        transition: 'color 0.2s ease',
      }}>{item.label}</span>
    </div>
  );
}

/* ── Professional email card ─────────────────────────────────────── */
function EmailCard({ tone, dark, accent, isMobile, copied, onCopy }) {
  const [btnHovered,  setBtnHovered]  = React.useState(false);
  const [copyHovered, setCopyHovered] = React.useState(false);

  return (
    <div style={{
      maxWidth: 520,
      margin: isMobile ? '24px auto 0' : '32px auto 0',
      borderRadius: 16,
      overflow: 'hidden',
      border: `1px solid ${tone.border}`,
      background: dark
        ? 'linear-gradient(145deg, rgba(30,58,66,0.52) 0%, rgba(31,34,36,0.94) 100%)'
        : 'linear-gradient(145deg, rgba(255,255,255,0.94) 0%, rgba(236,247,244,0.82) 100%)',
      boxShadow: dark
        ? `0 36px 80px -44px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)`
        : `0 18px 56px -28px rgba(208,59,8,0.16), inset 0 1px 0 rgba(255,255,255,0.9)`,
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    }}>
      {/* Accent bar */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg, transparent 0%, ${accent} 35%, ${PALETTE.blueDk} 100%)`,
      }} />

      <div style={{ padding: isMobile ? '20px 18px 22px' : '26px 26px 28px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isMobile ? 18 : 22 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${accent}28 0%, ${accent}10 100%)`,
            border: `1px solid ${accent}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <EnvelopeIcon color={accent} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10.5,
              letterSpacing: 1.7,
              textTransform: 'uppercase',
              color: accent,
              fontWeight: 700,
              lineHeight: 1,
              marginBottom: 5,
            }}>Direct Email</div>
            <div style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              color: tone.muted,
              fontWeight: 500,
              lineHeight: 1,
            }}>Preferred contact channel</div>
          </div>
        </div>

        {/* Email address + inline copy */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: isMobile ? '12px 14px' : '14px 16px',
          borderRadius: 10,
          background: dark ? 'rgba(248,252,253,0.04)' : 'rgba(31,34,36,0.045)',
          border: `1px solid ${tone.border}`,
          marginBottom: isMobile ? 14 : 18,
        }}>
          <span style={{
            flex: 1,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: isMobile ? 12.5 : 13.5,
            color: tone.fg,
            fontWeight: 500,
            overflowWrap: 'anywhere',
            lineHeight: 1.4,
            textAlign: 'left',
          }}>{EMAIL}</span>
          <button
            type="button"
            onClick={onCopy}
            onMouseEnter={() => setCopyHovered(true)}
            onMouseLeave={() => setCopyHovered(false)}
            title={copied ? 'Copied!' : 'Copy email address'}
            style={{
              flexShrink: 0,
              width: 34,
              height: 34,
              borderRadius: 8,
              border: `1px solid ${copied ? `${accent}44` : tone.border}`,
              background: copied
                ? `${accent}18`
                : copyHovered
                  ? (dark ? 'rgba(248,252,253,0.08)' : 'rgba(31,34,36,0.06)')
                  : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.18s ease, border-color 0.18s ease',
            }}
          >
            {copied
              ? <CheckIcon color={accent} />
              : <CopyIcon  color={copyHovered ? tone.fg : tone.muted} />
            }
          </button>
        </div>

        {/* CTA */}
        <a
          href={`mailto:${EMAIL}`}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            width: '100%',
            minHeight: isMobile ? 42 : 46,
            borderRadius: 10,
            textDecoration: 'none',
            background: btnHovered
              ? `linear-gradient(90deg, ${accent} 0%, ${PALETTE.blueDk} 100%)`
              : accent,
            color: PALETTE.white,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: isMobile ? 13 : 14,
            fontWeight: 600,
            letterSpacing: 0.3,
            boxShadow: btnHovered
              ? `0 14px 38px -16px ${accent}cc`
              : `0 8px 28px -14px ${accent}88`,
            transform: btnHovered ? 'translateY(-2px)' : 'none',
            transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.24s ease',
          }}
        >
          Open in mail client
          <ArrowIcon color={PALETTE.white} />
        </a>
      </div>
    </div>
  );
}

/* ── Arc separator ───────────────────────────────────────────────── */
function RouteSeparator({ tone, isMobile }) {
  return (
    <div
      className="rj-fadeup"
      aria-hidden="true"
      style={{
        width: '100vw',
        height: isMobile ? 54 : 96,
        margin: isMobile ? '12px 0 10px' : '24px 0 20px',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
        position: 'relative',
        animationDelay: '0.2s',
      }}
    >
      <svg
        viewBox="0 0 820 126"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="rjRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={tone.primary}   stopOpacity="0"    />
            <stop offset="26%"  stopColor={tone.secondary} stopOpacity="0.26" />
            <stop offset="50%"  stopColor={tone.primary}   stopOpacity="0.74" />
            <stop offset="74%"  stopColor={tone.secondary} stopOpacity="0.26" />
            <stop offset="100%" stopColor={tone.primary}   stopOpacity="0"    />
          </linearGradient>
          <filter id="rjRouteGlow" x="-12%" y="-80%" width="124%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M0 84 C 205 18, 615 18, 820 84" fill="none" stroke={tone.faint} strokeWidth="1"/>
        <path
          d="M0 84 C 205 18, 615 18, 820 84"
          fill="none"
          stroke="url(#rjRouteGradient)"
          strokeWidth="1.8"
          strokeLinecap="round"
          filter="url(#rjRouteGlow)"
          style={{ '--arc-glow': tone.primary, animation: 'rjArcPulse 3.4s ease-in-out infinite' }}
        />
      </svg>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
function ContactPage() {
  const { tw, setTw } = useTweaks();
  const { isMobile, isTablet } = useViewport();
  const tone = colors(tw.dark, tw.accent);

  React.useEffect(injectContactStyles, []);

  return (
    <PageShell current="contact" tw={tw} setTw={setTw} headerOverlay={true}>
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '74px 5vw 30px' : isTablet ? '92px 5vw 48px' : '96px 6vw 64px',
        background: getSectionBackgroundTone(0, tw.dark),
        ...globalNoiseTexture(tw.dark),
      }}>
        <SectionPattern dark={tw.dark} accent={tone.primary} variant="grid" opacity={tw.dark ? 0.44 : 0.36} />

        <div style={{ width: '100%', maxWidth: 1020, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>

          {/* Badge */}
          <div className="rj-fadeup" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? 26 : 30,
            padding: isMobile ? '0 10px' : '0 12px',
            borderRadius: 999,
            border: `1px solid ${tone.border}`,
            background: tw.dark ? 'rgba(248,252,253,0.035)' : 'rgba(255,255,255,0.48)',
            color: tone.primary,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: isMobile ? 10 : 11,
            lineHeight: 1,
            letterSpacing: 1.6,
            fontWeight: 800,
            textTransform: 'uppercase',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}>01 / Contact</div>

          <h1 className="rj-fadeup" style={{
            maxWidth: 820,
            margin: isMobile ? '12px auto 8px' : '20px auto 14px',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: isMobile ? 32 : isTablet ? 54 : 68,
            lineHeight: 1.02,
            fontWeight: 700,
            color: tone.fg,
            animationDelay: '0.08s',
          }}>
            Let's build something meaningful.
          </h1>

          <p className="rj-fadeup" style={{
            maxWidth: 660,
            margin: '0 auto',
            fontSize: isMobile ? 13.5 : 16.5,
            lineHeight: isMobile ? 1.48 : 1.62,
            color: tone.subtle,
            animationDelay: '0.16s',
          }}>
            Whether it's infrastructure, security, or an interesting idea, I'm always open to good conversations.
          </p>

          <RouteSeparator tone={tone} isMobile={isMobile} />

          {/* Social label */}
          <div className="rj-fadeup" style={{ marginBottom: isMobile ? 14 : 18, animationDelay: '0.22s' }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: 1.8,
              textTransform: 'uppercase',
              color: tone.muted,
              fontWeight: 700,
            }}>Find me online</span>
          </div>

          {/* Social pill buttons */}
          <div className="rj-fadeup" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: isMobile ? 24 : 36,
            animationDelay: '0.28s',
          }}>
            {CONTACTS.map(item => (
              <ContactSocialCard
                key={item.key}
                item={item}
                tone={tone}
                dark={tw.dark}
                isMobile={isMobile}
              />
            ))}
          </div>

        </div>
      </section>
    </PageShell>
  );
}

createRoot(document.getElementById('root')).render(<ContactPage />);
