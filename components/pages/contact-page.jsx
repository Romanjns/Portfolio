// Contact page
function ContactPage() {
  const { tw, setTw } = useTweaks();
  const { isMobile, isTablet } = useViewport();
  const { dark, accent } = tw;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.68)' : 'rgba(31,34,36,0.70)';
  const border = dark ? 'rgba(248,252,253,0.11)' : 'rgba(31,34,36,0.13)';
  const cardBg = dark ? 'rgba(248,252,253,0.05)' : 'rgba(248,252,253,0.65)';

  const [copied, setCopied] = React.useState(false);
  const EMAIL = 'khaiboulinr@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const socials = [
    {
      label: 'LinkedIn',
      handle: 'roman-janssens',
      href: 'https://www.linkedin.com/in/roman-janssens-47aa40339/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="16" height="16" rx="3"/>
          <path d="M6 9v5M6 6.5v.01M10 14v-2.5a2.5 2.5 0 015 0V14M10 9v5"/>
        </svg>
      ),
    },
    {
      label: 'GitHub',
      handle: 'RomanJanssens',
      href: 'https://github.com/RomanJanssens',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.48-2.7-1.07-2.7-1.07a2.12 2.12 0 00-.89-1.17c-.73-.5.06-.49.06-.49a1.68 1.68 0 011.23.82 1.7 1.7 0 002.33.67 1.7 1.7 0 01.5-1.07c-1.78-.2-3.64-.89-3.64-3.95a3.1 3.1 0 01.82-2.14 2.87 2.87 0 01.08-2.11s.67-.22 2.2.82a7.57 7.57 0 014 0c1.53-1.04 2.2-.82 2.2-.82a2.87 2.87 0 01.08 2.11 3.1 3.1 0 01.82 2.14c0 3.07-1.87 3.75-3.65 3.95a1.9 1.9 0 01.54 1.48v2.2c0 .21.14.46.55.38A8 8 0 0010 2z"/>
        </svg>
      ),
    },
  ];

  const SocialCard = ({ social }) => {
    const [hovered, setHovered] = React.useState(false);
    return (
      <a
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display:'flex', alignItems:'center', gap: 14,
          padding: isMobile ? '14px 16px' : '16px 18px',
          borderRadius: 12,
          border: `1px solid ${hovered ? accent : border}`,
          background: hovered ? `${accent}08` : 'transparent',
          textDecoration:'none', color:'inherit',
          transition:'border-color .2s, background .2s, box-shadow .2s',
          boxShadow: hovered ? `0 4px 16px -8px ${accent}44` : 'none',
          flex: 1,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: `${accent}1a`, border: `1px solid ${accent}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
          color: accent,
        }}>
          {social.icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily:'"JetBrains Mono", monospace',
            fontSize: 10, letterSpacing: 1.5, fontWeight: 600,
            textTransform:'uppercase', color: subtle, marginBottom: 4,
          }}>{social.label}</div>
          <div style={{
            fontFamily:'"Space Grotesk", sans-serif',
            fontSize: 15, fontWeight: 600, color: fg,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{social.handle}</div>
        </div>
        <svg style={{ marginLeft:'auto', flexShrink: 0, color: hovered ? accent : subtle, transition:'color .2s' }} width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5h8M8 3.5l3 3-3 3"/></svg>
      </a>
    );
  };

  return (
    <PageShell current="contact" tw={tw} setTw={setTw}>
      <section style={{
        position:'relative', overflow:'hidden',
        padding: isMobile ? '36px 5vw 64px' : isTablet ? '48px 5vw 72px' : '40px 6vw 80px',
        maxWidth: 1400, margin:'0 auto',
      }}>
        <SectionPattern dark={dark} accent={accent} variant="hero" opacity={isMobile ? 0.32 : 0.44} />
        <div style={{ position:'relative', zIndex: 1 }}>

          <div className="rj-fadeup" style={{
            fontFamily:'"JetBrains Mono", monospace',
            fontSize: 11, letterSpacing: 2, fontWeight: 600,
            textTransform:'uppercase', color: accent, marginBottom: 20,
          }}>01 / Contact</div>

          <h1 className="rj-fadeup" style={{
            fontFamily:'"Space Grotesk", sans-serif',
            fontSize: isMobile ? 44 : isTablet ? 72 : 96,
            fontWeight: 700, lineHeight: 1.0,
            color: fg, margin:'0 0 56px', maxWidth: 1100,
            animationDelay:'0.1s',
          }}>
            Let's build<br/>something secure.
          </h1>

          <div style={{
            display:'grid',
            gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1.2fr',
            gap: isMobile ? 28 : 40,
            alignItems: isMobile || isTablet ? 'start' : 'stretch',
          }}>

            {/* Left: Email + socials */}
            <div className="rj-fadeup" style={{ animationDelay:'0.25s', display:'flex', flexDirection:'column', gap: 14 }}>
              {/* Combined email + socials card */}
              <div style={{
                padding: isMobile ? '28px 24px' : '32px',
                borderRadius: 16,
                border: `1px solid ${border}`,
                background: cardBg,
                backdropFilter:'blur(14px) saturate(140%)',
                boxShadow: dark ? '0 8px 40px -16px rgba(0,0,0,0.5)' : '0 8px 40px -16px rgba(31,34,36,0.14)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${accent}1a`, border: `1px solid ${accent}33`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: accent, marginBottom: 20,
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="16" height="12" rx="2"/>
                    <path d="M2 6l8 5.5L18 6"/>
                  </svg>
                </div>
                <div style={{
                  fontFamily:'"JetBrains Mono", monospace',
                  fontSize: 10.5, letterSpacing: 1.5, fontWeight: 600,
                  textTransform:'uppercase', color: subtle, marginBottom: 10,
                }}>Email</div>
                <div style={{
                  fontFamily:'"Space Grotesk", sans-serif',
                  fontSize: isMobile ? 17 : 20, fontWeight: 700,
                  color: fg, wordBreak:'break-all', lineHeight: 1.2,
                }}>{EMAIL}</div>
                <a href={`mailto:${EMAIL}`} style={{
                  marginTop: 16, display:'inline-flex', alignItems:'center', gap: 6,
                  fontSize: 13, color: accent, fontWeight: 500, textDecoration:'none',
                }}>
                  Send email
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5h8M8 3.5l3 3-3 3"/></svg>
                </a>

                {/* Divider */}
                <div style={{ margin: '24px 0', height: 1, background: border }} />

                {/* Socials */}
                <div style={{
                  fontFamily:'"JetBrains Mono", monospace',
                  fontSize: 10.5, letterSpacing: 1.5, fontWeight: 600,
                  textTransform:'uppercase', color: subtle, marginBottom: 12,
                }}>Socials</div>
                <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
                  {socials.map(s => <SocialCard key={s.label} social={s} />)}
                </div>
              </div>

              {/* Copy button */}
              <button onClick={handleCopy} style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
                padding:'13px', borderRadius: 12,
                border: `1px solid ${copied ? accent + '55' : border}`,
                background: copied ? accent + '0e' : 'transparent',
                color: copied ? accent : subtle,
                fontSize: 13, fontFamily:'"JetBrains Mono", monospace',
                fontWeight: 600, cursor:'pointer',
                transition:'all .2s',
                letterSpacing: 0.5,
              }}>
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l3.5 3.5L12 3"/></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="8" height="8" rx="1.5"/><path d="M2 10V3a1 1 0 011-1h7"/></svg>
                    Copy email address
                  </>
                )}
              </button>
            </div>

            {/* Google Maps embed */}
            <div className="rj-fadeup" style={{ animationDelay:'0.4s', height: isMobile || isTablet ? 'auto' : '100%' }}>
              <div style={{
                borderRadius: 16, overflow:'hidden',
                border: `1px solid ${border}`,
                boxShadow: dark ? '0 8px 40px -16px rgba(0,0,0,0.5)' : '0 8px 40px -16px rgba(31,34,36,0.14)',
                height: isMobile ? 240 : isTablet ? 300 : '100%',
                minHeight: isMobile || isTablet ? 0 : 320,
                position:'relative',
              }}>
                <iframe
                  title="Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display:'block', filter: dark ? 'invert(90%) hue-rotate(180deg) brightness(0.88) contrast(0.9)' : 'none' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Smissestraat+33,+Vorst,+Laakdal,+Belgium&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
                {/* Location label overlay */}
                <div style={{
                  position:'absolute', bottom: 14, left: 14,
                  padding:'8px 14px', borderRadius: 8,
                  background: dark ? 'rgba(31,34,36,0.92)' : 'rgba(248,252,253,0.92)',
                  backdropFilter:'blur(10px)',
                  border: `1px solid ${border}`,
                  display:'flex', alignItems:'center', gap: 8,
                }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.5 1a3.5 3.5 0 013.5 3.5c0 3-3.5 7.5-3.5 7.5S3 7.5 3 4.5A3.5 3.5 0 016.5 1z"/>
                    <circle cx="6.5" cy="4.5" r="1.2"/>
                  </svg>
                  <span style={{
                    fontFamily:'"JetBrains Mono", monospace',
                    fontSize: 11, fontWeight: 600, color: fg, letterSpacing: 0.3,
                  }}>Smissestraat 33, Vorst · Laakdal, BE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </PageShell>
  );
}

function scramble(text) {
  return text.split('').map(c => c === ' ' ? ' ' : randChar()).join('');
}

ReactDOM.createRoot(document.getElementById('root')).render(<ContactPage />);
