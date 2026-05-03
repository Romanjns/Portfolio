import React from 'react';
import { PALETTE, useViewport, Background, SectionPattern, useScrollReveal, sectionSurface } from './hero-shared.jsx';

// Shared Nav + Footer used across every page.

const OPENABLE_FILE_RE = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z)(?:[?#].*)?$/i;
const INTERNAL_PAGE_PATHS = new Set([
  '/',
  '/index.html',
  '/about',
  '/about.html',
  '/projects',
  '/projects.html',
  '/contact',
  '/contact.html',
  '/internship',
  '/internship.html',
]);

function shouldOpenAwayFromPortfolio(anchor) {
  const rawHref = anchor.getAttribute('href') || '';
  if (
    !rawHref ||
    rawHref.startsWith('#') ||
    rawHref.startsWith('javascript:') ||
    rawHref.startsWith('tel:')
  ) {
    return false;
  }

  try {
    const url = new URL(rawHref, window.location.href);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (url.protocol === 'mailto:') return true;
    if (url.origin !== window.location.origin) return true;
    if (path.startsWith('/assets/files/') || OPENABLE_FILE_RE.test(path)) return true;

    return !INTERNAL_PAGE_PATHS.has(path);
  } catch (err) {
    return OPENABLE_FILE_RE.test(rawHref);
  }
}

function keepPortfolioOpen(root = document) {
  root.querySelectorAll?.('a[href]').forEach((anchor) => {
    if (!shouldOpenAwayFromPortfolio(anchor)) return;
    anchor.setAttribute('target', '_blank');

    const rel = new Set((anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    anchor.setAttribute('rel', Array.from(rel).join(' '));
  });
}

// Keep external links and openable files from replacing the portfolio tab.
(function () {
  keepPortfolioOpen();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.matches?.('a[href]')) keepPortfolioOpen(node.parentElement || document);
        else keepPortfolioOpen(node);
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || !shouldOpenAwayFromPortfolio(anchor)) return;
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  }, true);
})();

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
    ['/', 'Home'],
    ['/about', 'About'],
    ['/internship', 'Internship'],
    ['/projects', 'Projects'],
    ['/contact', 'Contact'],
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

  const border = dark ? 'rgba(248,252,253,0.12)' : 'rgba(31,34,36,0.12)';

  const headerSurface = {
    background: isMobile
      ? dark ? 'rgba(31,36,37,0.92)' : 'rgba(237,244,243,0.94)'
      : hasScrolled
        ? dark ? 'rgba(31,36,37,0.90)' : 'rgba(237,244,243,0.94)'
        : 'transparent',
    backdropFilter: isMobile || hasScrolled ? 'blur(14px) saturate(140%)' : 'none',
    WebkitBackdropFilter: isMobile || hasScrolled ? 'blur(14px) saturate(140%)' : 'none',
    transition: 'background 320ms ease, backdrop-filter 320ms ease',
  };

  const menu = (
    <div style={{
      position:'fixed',
      top: isMobile ? 60 : 80,
      left: 0,
      right: 0,
      background: dark
        ? 'rgba(31,34,36,0.92)'
        : 'rgba(248,252,253,0.94)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      borderTop: `1px solid ${dark ? 'rgba(248,252,253,0.07)' : 'rgba(31,34,36,0.07)'}`,
      borderBottom: `1px solid ${dark ? 'rgba(248,252,253,0.06)' : 'rgba(31,34,36,0.06)'}`,
      boxShadow: dark ? '0 20px 56px -8px rgba(0,0,0,0.65)' : '0 20px 56px -8px rgba(31,34,36,0.12)',
      zIndex: 99,
      padding: '8px 5vw 16px',
      animation: menuOpen ? 'slideDown 0.28s cubic-bezier(.2,.8,.2,1)' : 'none',
      overflow:'hidden',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
    }}>
      <nav style={{
        display:'flex',
        flexDirection:'column',
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
                display:'flex',
                alignItems:'center',
                gap: 14,
                color: active ? fg : subtle,
                textDecoration:'none',
                fontSize: 17,
                fontWeight: active ? 600 : 500,
                padding: '14px 0',
                borderBottom: `1px solid ${dark ? 'rgba(248,252,253,0.05)' : 'rgba(31,34,36,0.05)'}`,
                transition:'color .15s',
              }}
            >
              <span style={{
                width: 3, height: 18, borderRadius: 99,
                background: active ? accent : 'transparent',
                flexShrink: 0,
                transition: 'background .15s',
              }}/>
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
      borderBottom: isMobile || hasScrolled ? `1px solid ${border}` : '1px solid transparent',
      boxShadow: 'none',
      overflow:'hidden',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
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
      <a href="/" style={{ display:'flex', alignItems:'center', textDecoration:'none' }}>
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
    {menuOpen && menu}
    </>
  );
}

function Footer({ dark, accent }) {
  const { isMobile, isTablet } = useViewport();
  const subtle = dark ? 'rgba(248,252,253,0.55)' : 'rgba(31,34,36,0.60)';
  const border = dark ? 'rgba(248,252,253,0.10)' : 'rgba(31,34,36,0.12)';
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const footerBg = dark
    ? 'linear-gradient(180deg, rgba(31,36,37,0.92), rgba(31,34,36,0.98))'
    : 'linear-gradient(180deg, rgba(238,247,245,0.94), rgba(248,252,253,0.98))';

  const socials = [
    { label:'GitHub',   href:'https://github.com/Romanjns', icon:'github' },
    { label:'LinkedIn', href:'https://www.linkedin.com/in/roman-janssens-3652b2298/', icon:'linkedin' },
    { label:'Instagram', href:'https://www.instagram.com/roman.janssens05/', icon:'instagram' },
    { label:'Email',    href:'mailto:roman.janssens@mail', icon:'mail' },
  ];

  return (
    <footer style={{
      position:'relative', zIndex: 10,
      padding: isMobile ? '40px 5vw 28px' : isTablet ? '44px 5vw 30px' : '48px 6vw 32px',
      fontFamily:'"Manrope", sans-serif',
      color: subtle,
      background: footerBg,
      borderTop: `1px solid ${border}`,
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
          <FooterLink href="/" accent={accent}>Home</FooterLink>
          <FooterLink href="/about" accent={accent}>About</FooterLink>
          <FooterLink href="/projects" accent={accent}>Projects</FooterLink>
          <FooterLink href="/contact" accent={accent}>Contact</FooterLink>
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
    const segment = window.location.pathname.replace(/\.html$/, '').split('/').filter(Boolean).pop() || 'index';
    const href = segment === 'index' ? '/' : `/${segment}`;
    const activeNav = document.querySelector(`header nav a[href="${href}"]`);
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
  const PAGES = new Set(['/', '/about', '/projects', '/contact', '/internship']);
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
      position:'relative',
      display:'inline-flex',
      width:'fit-content',
      transform: hovered ? 'translateX(4px)' : 'none',
      transition:'color .16s ease, transform .16s ease',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {children}
      <span style={{
        position:'absolute',
        left:0,
        right: hovered ? 0 : '100%',
        bottom:-3,
        height:1,
        background: accent,
        transition:'right .18s ease',
      }}/>
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

  React.useEffect(() => {
    const color = dark ? '#1f2224' : '#f8fcfd';
    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [dark]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--rj-accent', accent);
  }, [accent]);

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
