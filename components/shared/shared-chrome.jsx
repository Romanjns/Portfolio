import React from 'react';
import { PALETTE, useViewport, Background, SectionPattern, useScrollReveal, sectionSurface } from './hero-shared.jsx';

// Shared Nav + Footer used across every page.

// Inject menu keyframes once at module load
(function() {
  if (document.getElementById('rj-menu-kf')) return;
  const s = document.createElement('style');
  s.id = 'rj-menu-kf';
  s.textContent = `
    @keyframes slideDown { from { transform:translateY(-20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  `;
  document.head.appendChild(s);
})();

// Inject hamburger CSS once at module load
(function() {
  if (document.getElementById('rj-hamburger-css')) return;
  const s = document.createElement('style');
  s.id = 'rj-hamburger-css';
  s.textContent = `
    .toggle {
      position: relative;
      width: 32px;
      cursor: pointer;
      display: block;
      height: calc(3px * 3 + 8px * 2);
      flex: 0 0 auto;
    }
    .bar {
      position: absolute;
      left: 0;
      right: 0;
      height: 3px;
      border-radius: 2px;
      opacity: 1;
      transition: none 0.35s cubic-bezier(.5,-0.35,.35,1.5) 0s;
    }
    .bar--top {
      bottom: calc(50% + 8px + 3px/ 2);
      transition-property: bottom,transform;
      transition-delay: calc(0s + 0.35s),0s;
    }
    .bar--middle {
      top: calc(50% - 3px/ 2);
      transition-property: opacity;
      transition-delay: calc(0s + 0.35s);
    }
    .bar--bottom {
      top: calc(50% + 8px + 3px/ 2);
      transition-property: top,transform;
      transition-delay: calc(0s + 0.35s),0s;
    }
    #hamburger-checkbox:checked + .toggle .bar--top {
      bottom: calc(50% - 4px/ 2);
      transform: rotate(135deg);
      transition-delay: 0s,calc(0s + 0.35s);
    }
    #hamburger-checkbox:checked + .toggle .bar--middle {
      opacity: 0;
      transition-duration: 0s;
      transition-delay: calc(0s + 0.35s);
    }
    #hamburger-checkbox:checked + .toggle .bar--bottom {
      top: calc(50% - 4px/ 2);
      transform: rotate(225deg);
      transition-delay: 0s,calc(0s + 0.35s);
    }
  `;
  document.head.appendChild(s);
})();

function Nav({ current, dark, accent, onToggleDark }) {
  const { isMobile, isTablet } = useViewport();
  const subtle = dark ? 'rgba(248,252,253,0.65)' : 'rgba(31,34,36,0.70)';
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const navRef = React.useRef(null);
  const linkRefs = React.useRef({});
  const [indicator, setIndicator] = React.useState(null);
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pages = [
    ['index.html', 'Home'],
    ['about.html', 'About'],
    ['projects.html', 'Projects'],
    ['contact.html', 'Contact'],
  ];

  const measureIndicator = React.useCallback((animateFromPrevious = false) => {
    const nav = navRef.current;
    const active = linkRefs.current[current];
    if (!nav || !active) return;

    const navRect = nav.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const next = {
      left: activeRect.left - navRect.left,
      width: activeRect.width,
      animate: !animateFromPrevious,
    };

    if (animateFromPrevious && typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(sessionStorage.getItem('rj-nav-line') || 'null');
        sessionStorage.removeItem('rj-nav-line');
        if (saved && saved.width) {
          setIndicator({
            left: saved.left - navRect.left,
            width: saved.width,
            animate: false,
          });
          requestAnimationFrame(() => requestAnimationFrame(() => setIndicator({ ...next, animate: true })));
          return;
        }
      } catch (err) {
        sessionStorage.removeItem('rj-nav-line');
      }
    }

    setIndicator(next);
  }, [current]);

  React.useEffect(() => {
    measureIndicator(true);
    const onResize = () => measureIndicator(false);
    const onScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [measureIndicator]);

  const rememberLinePosition = () => {
    const el = linkRefs.current[current];
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    try {
      sessionStorage.setItem('rj-nav-line', JSON.stringify({
        left: rect.left,
        width: rect.width,
      }));
    } catch (err) {}
  };

  const link = (href, label) => {
    const key = label.toLowerCase();
    const active = current === key;
    return (
      <a
        ref={(el) => { linkRefs.current[key] = el; }}
        href={href}
        onClick={rememberLinePosition}
        style={{
        color: active ? fg : subtle, textDecoration:'none',
        fontSize: isMobile ? 13 : 14, fontWeight: active ? 600 : 500,
        position:'relative', padding: isMobile ? '8px 2px' : '4px 2px',
        transition:'color .15s',
        whiteSpace:'nowrap',
      }}
        onMouseEnter={e => e.currentTarget.style.color = fg}
        onMouseLeave={e => e.currentTarget.style.color = active ? fg : subtle}>
        {label}
      </a>
    );
  };

  const border = dark ? 'rgba(248,252,253,0.10)' : 'rgba(31,34,36,0.10)';

  const headerSurface = {
    background: hasScrolled
      ? dark
        ? 'rgba(31,34,36,0.72)'
        : 'rgba(248,252,253,0.86)'
      : 'transparent',
    backdropFilter: hasScrolled ? 'blur(10px) saturate(120%)' : 'none',
    WebkitBackdropFilter: hasScrolled ? 'blur(10px) saturate(120%)' : 'none',
    transition: 'background 320ms ease, backdrop-filter 320ms ease, -webkit-backdrop-filter 320ms ease',
  };

  const Menu = () => (
    <div style={{
      position:'fixed',
      top: isMobile ? 72 : 80, // below header
      left: 0,
      right: 0,
      background: dark
        ? 'rgba(31,34,36,0.96)'
        : 'rgba(248,252,253,0.94)',
      backdropFilter: 'blur(18px) saturate(190%)',
      WebkitBackdropFilter: 'blur(18px) saturate(190%)',
      boxShadow: dark ? '0 2px 36px -4px rgba(0,0,0,0.55)' : '0 2px 28px -4px rgba(31,34,36,0.10)',
      zIndex: 99,
      padding: '20px 5vw',
      animation: 'slideDown 0.3s ease-out',
      overflow:'hidden',
    }}>
      <nav style={{
        display:'flex',
        flexDirection:'column',
        gap: 20,
        fontFamily:'"Manrope", sans-serif',
        position:'relative',
        zIndex: 1,
      }}>
        {pages.map(([href, label]) => {
          const key = label.toLowerCase();
          const active = current === key;
          return (
            <a
              key={key}
              href={href}
              onClick={() => { setMenuOpen(false); rememberLinePosition(); }}
              style={{
                color: active ? fg : subtle,
                textDecoration:'none',
                fontSize: 18,
                fontWeight: active ? 600 : 500,
                padding: '10px 0',
                transition:'color .15s',
              }}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
    <header style={{
      position:'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      ...headerSurface,
      borderBottom: 'none',
      boxShadow: 'none',
      overflow:'hidden',
    }}>
      <div style={{
        position:'relative',
        zIndex: 1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        gap: isMobile ? 14 : 28,
        padding: isMobile ? '20px 5vw 12px' : isTablet ? '24px 5vw' : '28px 6vw',
        maxWidth: 1600, margin:'0 auto', width:'100%', boxSizing:'border-box',
      }}>
      <a href="index.html" style={{ display:'flex', alignItems:'center', textDecoration:'none' }}>
        <img
          src={dark ? 'assets/images/logo-white.svg' : 'assets/images/logo-dark.svg'}
          alt="RJ"
          style={{ height: isMobile ? 32 : 38, width:'auto', display:'block' }}
        />
      </a>
      <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent: 'flex-end',
        gap: isMobile ? 12 : 28,
        width: 'auto',
        minWidth: 0,
      }}>
        {isMobile ? (
          <>
            {onToggleDark && (
              <>
                <label
                  className="switch"
                  title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                  style={{
                    '--width-of-switch': '3em',
                    '--height-of-switch': '1.7em',
                    '--size-of-icon': '1.05em',
                    '--slider-offset': '0.24em',
                    display:'inline-flex',
                    alignItems:'center',
                  }}
                >
                  <input type="checkbox" checked={dark} onChange={onToggleDark} />
                  <span className="slider"></span>
                </label>
                <span style={{ width: 1, height: 18, background: border, opacity: 0.7 }} />
              </>
            )}
            <input type="checkbox" id="hamburger-checkbox" checked={menuOpen} onChange={() => setMenuOpen(!menuOpen)} style={{ display: 'none' }} />
            <label htmlFor="hamburger-checkbox" className="toggle" style={{ width: 34, height: 26, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="bar bar--top" style={{ background: fg }}></div>
              <div className="bar bar--middle" style={{ background: fg }}></div>
              <div className="bar bar--bottom" style={{ background: fg }}></div>
            </label>
          </>
        ) : (
          <>
            <nav ref={navRef} style={{
              display:'flex',
              minWidth: 0,
              gap: isTablet ? 24 : 32,
              fontFamily:'"Manrope", sans-serif',
              position:'relative',
            }}>
              {pages.map(([href, label]) => link(href, label))}
              {indicator && (
                <span style={{
                  position:'absolute',
                  left: 0,
                  bottom: -6,
                  width: indicator.width,
                  height: 2,
                  background: accent,
                  borderRadius: 1,
                  transform: `translateX(${indicator.left}px)`,
                  transition: indicator.animate
                    ? 'transform 420ms cubic-bezier(.2,.8,.2,1), width 420ms cubic-bezier(.2,.8,.2,1), background-color 180ms'
                    : 'background-color 180ms',
                  pointerEvents:'none',
                }}/>
              )}
            </nav>
            {onToggleDark && (
              <label className="switch" title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
                <input type="checkbox" checked={dark} onChange={onToggleDark} />
                <span className="slider"></span>
              </label>
            )}
          </>
        )}
      </div>
      </div>
    </header>
    {menuOpen && <Menu />}
    </>
  );
}

function Footer({ dark, accent }) {
  const { isMobile, isTablet } = useViewport();
  const subtle = dark ? 'rgba(248,252,253,0.55)' : 'rgba(31,34,36,0.60)';
  const border = dark ? 'rgba(248,252,253,0.10)' : 'rgba(31,34,36,0.12)';
  const fg = dark ? PALETTE.white : PALETTE.indigo;

  const socials = [
    { label:'GitHub',   href:'https://github.com',   icon:'github' },
    { label:'LinkedIn', href:'https://linkedin.com', icon:'linkedin' },
    { label:'Email',    href:'mailto:roman.janssens@mail', icon:'mail' },
  ];

  return (
    <footer data-rj-reveal style={{
      position:'relative', zIndex: 10,
      padding: isMobile ? '40px 5vw 28px' : isTablet ? '44px 5vw 30px' : '48px 6vw 32px',
      fontFamily:'"Manrope", sans-serif',
      color: subtle,
    }}>
      <div style={{
        maxWidth: 1600, margin:'0 auto',
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr' : '1.2fr 1fr 1fr',
        gap: isMobile ? 28 : 40,
      }}>
        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <div style={{
            fontFamily:'"Space Grotesk", sans-serif',
            fontSize: 22, fontWeight: 700, color: fg,
            letterSpacing: 0, marginBottom: 10,
          }}>Roman Janssens</div>
          <div style={{ fontSize: 14, lineHeight: 1.55, maxWidth: 300 }}>
            Cloud & Cybersecurity student building scalable, secure infrastructure.
          </div>
        </div>
        <FooterCol title="Navigate">
          <FooterLink href="index.html" accent={accent}>Home</FooterLink>
          <FooterLink href="about.html" accent={accent}>About</FooterLink>
          <FooterLink href="projects.html" accent={accent}>Projects</FooterLink>
          <FooterLink href="contact.html" accent={accent}>Contact</FooterLink>
        </FooterCol>
        <FooterCol title="Connect">
          {socials.map(s => (
            <FooterLink key={s.label} href={s.href} accent={accent}>{s.label} →</FooterLink>
          ))}
        </FooterCol>
      </div>
      <div style={{
        maxWidth: 1600, margin:'40px auto 0',
        paddingTop: 20,
        display:'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 10 : 20,
        justifyContent:'space-between',
        fontSize: 12, fontFamily:'"JetBrains Mono", monospace',
        letterSpacing: 1.2, textTransform:'uppercase',
      }}>
        <span>© 2026 Roman Janssens</span>
        <span>Built with intention · v2026.04</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <div style={{
        fontFamily:'"JetBrains Mono", monospace',
        fontSize: 10.5, letterSpacing: 1.5, fontWeight: 600,
        textTransform:'uppercase', marginBottom: 14,
        color:'inherit', opacity:.7,
      }}>{title}</div>
      <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>{children}</div>
    </div>
  );
}

function saveNavLine() {
  try {
    let filename = window.location.pathname.split('/').pop() || 'index.html';
    if (!filename.includes('.')) filename += '.html';
    const activeNav = document.querySelector(`header nav a[href="${filename}"]`);
    if (activeNav) {
      const rect = activeNav.getBoundingClientRect();
      sessionStorage.setItem('rj-nav-line', JSON.stringify({ left: rect.left, width: rect.width }));
    }
  } catch (e) {}
}

// Intercept every internal-page link that isn't already inside the nav bar.
// The nav links call rememberLinePosition themselves; everything else — CTA
// buttons, project cards, footer links — is handled here so the sliding
// indicator always animates on the destination page.
(function () {
  const PAGES = new Set(['index.html', 'about.html', 'projects.html', 'contact.html']);
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a || a.closest('header nav')) return;
    const page = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
    if (PAGES.has(page)) saveNavLine();
  });
}());

function FooterLink({ href, children, accent = PALETTE.blue }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a href={href} style={{
      color: hovered ? accent : 'inherit',
      textDecoration:'none',
      fontSize: 14,
      transition:'color .15s',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {children}
    </a>
  );
}

// PageShell — unified background + nav + content + footer
function PageShell({ current, children, tw, setTw, headerOverlay = false }) {
  const { dark, accent, bg } = tw;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const onToggleDark = setTw ? () => setTw({ dark: !dark }) : undefined;
  const { isMobile } = useViewport();
  useScrollReveal();

  return (
    <div style={{
      minHeight:'100vh', position:'relative',
      color: fg, fontFamily:'"Manrope", sans-serif',
    }}>
      <div style={{ position:'fixed', inset: 0, zIndex: 0 }}>
        <Background bg={bg} accent={accent} dark={dark} />
      </div>
      <div style={{ position:'relative', zIndex: 1 }}>
        <Nav current={current} dark={dark} accent={accent} onToggleDark={onToggleDark} />
        <div style={{ height: headerOverlay ? 0 : isMobile ? 100 : 78 }} />
        {children}
        <Footer dark={dark} accent={accent} />
      </div>
    </div>
  );
}

export { Nav, Footer, PageShell, saveNavLine };
