// Shared Nav + Footer used across every page.

function Nav({ current, dark, accent, onToggleDark }) {
  const { isMobile, isTablet } = useViewport();
  const subtle = dark ? 'rgba(248,252,253,0.65)' : 'rgba(31,34,36,0.70)';
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const navRef = React.useRef(null);
  const linkRefs = React.useRef({});
  const [indicator, setIndicator] = React.useState(null);
  const [hasScrolled, setHasScrolled] = React.useState(false);
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

  return (
    <header style={{
      position:'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: hasScrolled
        ? (dark
          ? 'linear-gradient(135deg, rgba(11,15,19,0.92) 0%, rgba(17,23,30,0.92) 100%)'
          : 'linear-gradient(135deg, rgba(246,252,254,0.94) 0%, rgba(233,247,252,0.94) 100%)')
        : 'transparent',
      backdropFilter: hasScrolled ? 'blur(18px) saturate(190%)' : 'none',
      WebkitBackdropFilter: hasScrolled ? 'blur(18px) saturate(190%)' : 'none',
      borderBottom: hasScrolled
        ? `1px solid ${dark ? 'rgba(208,59,8,0.22)' : 'rgba(48,88,93,0.16)'}`
        : '1px solid transparent',
      boxShadow: hasScrolled
        ? (dark ? '0 2px 36px -4px rgba(0,0,0,0.55)' : '0 2px 28px -4px rgba(31,34,36,0.10)')
        : 'none',
      transition: 'background 300ms ease, backdrop-filter 300ms ease, -webkit-backdrop-filter 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
    }}>
      <div style={{
        display:'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent:'space-between',
        gap: isMobile ? 18 : 28,
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
        justifyContent: isMobile ? 'space-between' : 'flex-end',
        gap: isMobile ? 14 : 28,
        width: isMobile ? '100%' : 'auto',
        minWidth: 0,
      }}>
        <nav ref={navRef} style={{
          display:'flex',
          flex: isMobile ? 1 : 'initial',
          minWidth: 0,
          gap: isMobile ? 18 : isTablet ? 24 : 32,
          fontFamily:'"Manrope", sans-serif',
          overflowX: isMobile ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100%',
          paddingBottom: isMobile ? 4 : 0,
          position:'relative',
        }}>
          {pages.map(([href, label]) => link(href, label))}
          {indicator && (
            <span style={{
              position:'absolute',
              left: 0,
              bottom: isMobile ? -2 : -6,
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
      </div>
      </div>
    </header>
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
      borderTop: `1px solid ${border}`,
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
            <FooterLink key={s.label} href={s.href} accent={accent}>{s.label} ↗</FooterLink>
          ))}
        </FooterCol>
      </div>
      <div style={{
        maxWidth: 1600, margin:'40px auto 0',
        paddingTop: 20, borderTop: `1px solid ${border}`,
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
function PageShell({ current, children, tw, setTw }) {
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
        <div style={{ height: isMobile ? 100 : 78 }} />
        {children}
        <Footer dark={dark} accent={accent} />
      </div>
    </div>
  );
}

Object.assign(window, { Nav, Footer, PageShell, saveNavLine });
