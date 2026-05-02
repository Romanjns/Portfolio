import React from 'react';
import { PALETTE, useViewport, SectionPattern, sectionSurface, BigName } from './hero-shared.jsx';

// Hero section — terminal focus, name near-left with breathing room.
// Nav + footer come from shared-chrome; this is just the hero block.

const RJ_ASCII = [
  '  ██████╗      ██╗',
  '  ██╔══██╗     ██║',
  '  ██████╔╝     ██║',
  '  ██╔══██╗██   ██║',
  '  ██║  ██║╚█████╔╝',
  '  ╚═╝  ╚═╝ ╚════╝ ',
];

const NEOFETCH_LINES = [
  { k: 'user',    v: 'roman@portfolio' },
  { k: 'sep',     v: '─────────────────' },
  { k: 'Role',    v: 'Cloud & Cybersecurity Student' },
  { k: 'Year',    v: 'Final year (2026)' },
  { k: 'Stack',   v: 'AWS · Azure · Terraform · Python' },
  { k: 'Focus',   v: 'Scalable infra · Security fundamentals' },
  { k: 'Certs',   v: 'AWS CCP · in-progress SAA' },
  { k: 'Status',  v: 'Available for collaboration' },
  { k: 'Contact', v: 'roman.janssens@mail' },
];

function useTypewriter(lines, enabled = true, speed = 204) {
  const [state, setState] = React.useState({ row: 0, col: 0, done: !enabled });
  React.useEffect(() => {
    if (!enabled) { setState({ row: lines.length, col: 0, done: true }); return; }
    setState({ row: 0, col: 0, done: false });
    let row = 0, col = 0;
    const tick = () => {
      if (row >= lines.length) { setState({ row, col: 0, done: true }); return; }
      const line = lines[row];
      if (col >= line.length) { row++; col = 0; setState({ row, col, done: false }); return; }
      col++;
      setState({ row, col, done: false });
    };
    const int = setInterval(tick, speed);
    return () => clearInterval(int);
  }, [enabled, lines.join('\n'), speed]);
  const rendered = [];
  for (let i = 0; i < state.row && i < lines.length; i++) rendered.push(lines[i]);
  if (state.row < lines.length) rendered.push(lines[state.row].slice(0, state.col));
  return { rendered, done: state.done };
}

function Terminal({ accent, dark }) {
  const { isMobile } = useViewport();
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const terminalSubtle = dark ? 'rgba(248,252,253,0.55)' : 'rgba(31,34,36,0.55)';
  const terminalMuted = dark ? 'rgba(248,252,253,0.42)' : 'rgba(31,34,36,0.42)';
  const mobileLines = React.useMemo(() => [
    'roman@portfolio ~ % status',
    '',
    'Role: Cloud & Cybersecurity Student',
    'Year: Final year (2026)',
    'Stack: AWS / Azure / Terraform',
    'Focus: Scalable infra + security',
    'Certs: AWS CCP / SAA in progress',
    'Status: Available for collaboration',
    'Contact: roman.janssens@mail',
    '',
    'roman@portfolio ~ % _',
  ], []);
  const allLines = React.useMemo(() => {
    const out = [];
    out.push('roman@portfolio ~ % neofetch');
    out.push('');
    const maxRows = Math.max(RJ_ASCII.length, NEOFETCH_LINES.length);
    for (let i = 0; i < maxRows; i++) {
      const art = RJ_ASCII[i] || ' '.repeat(19);
      const info = NEOFETCH_LINES[i];
      if (!info) { out.push(art); continue; }
      if (info.k === 'user')  out.push(`${art}   roman@portfolio`);
      else if (info.k === 'sep')   out.push(`${art}   ─────────────────────────`);
      else out.push(`${art}   ${info.k}: ${info.v}`);
    }
    out.push('');
    out.push('roman@portfolio ~ % _');
    return out;
  }, []);
  const lines = isMobile ? mobileLines : allLines;
  const { rendered, done } = useTypewriter(lines, true, isMobile ? 10 : 8);

  const lineStyle = (line, i, cursor = null) => {
    if (!line) return <div key={i}>&nbsp;{cursor}</div>;
    if (line.startsWith('roman@portfolio ~ %')) {
      const [, cmd] = line.split('% ');
      return (
        <div key={i} style={{ display:'flex' }}>
          <span style={{ color: accent }}>roman@portfolio</span>
          <span style={{ color: terminalSubtle, margin:'0 6px' }}>~</span>
          <span style={{ color: fg, marginRight: 6 }}>%</span>
          <span style={{ color: fg }}>{cmd || ''}</span>
          {cursor}
        </div>
      );
    }
    if (isMobile) {
      const colonIdx = line.indexOf(': ');
      if (colonIdx > 0) {
        return (
          <div key={i} style={{
            display:'grid',
            gridTemplateColumns:'58px minmax(0, 1fr)',
            columnGap: 10,
            alignItems:'baseline',
            marginBottom: 3,
          }}>
            <span style={{ color: accent, fontWeight: 600 }}>{line.slice(0, colonIdx)}</span>
            <span style={{ color: fg, minWidth: 0, overflowWrap:'anywhere' }}>{line.slice(colonIdx + 2)}{cursor}</span>
          </div>
        );
      }
      return <div key={i} style={{ color: terminalMuted }}>{line}{cursor}</div>;
    }
    const art = line.slice(0, 19);
    const rest = line.slice(19);
    const colonIdx = rest.indexOf(': ');
    let body;
    if (colonIdx > 0 && !rest.trim().startsWith('─') && !rest.includes('@portfolio')) {
      const label = rest.slice(0, colonIdx);
      const value = rest.slice(colonIdx + 2);
      body = (
        <>
          <span style={{ color: accent, fontWeight: 600 }}>{label}</span>
          <span style={{ color: terminalSubtle }}>: </span>
          <span style={{ color: fg }}>{value}</span>
        </>
      );
    } else if (rest.includes('@portfolio')) {
      body = <span style={{ color: accent, fontWeight: 600 }}>{rest.trim()}</span>;
    } else {
      body = <span style={{ color: terminalMuted }}>{rest}</span>;
    }
    return (
      <div key={i}>
        <span style={{ color: accent, opacity: 0.9 }}>{art}</span>
        {body && <>{'   '}{body}</>}
        {cursor}
      </div>
    );
  };

  const bg = dark ? 'rgba(31, 34, 36, 0.95)' : 'rgba(248, 252, 253, 0.88)';
  const border = dark ? 'rgba(208, 59, 8, 0.15)' : 'rgba(48, 88, 93, 0.12)';
  const terminalHeight = isMobile ? 250 : 315;

  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden', background: bg,
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      border: `1px solid ${border}`,
      boxShadow: dark
        ? '0 24px 80px -20px rgba(0,0,0,0.6)'
        : '0 24px 80px -20px rgba(31,34,36,0.25)',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      maxWidth: '100%',
      width: '100%',
      minHeight: terminalHeight,
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap: 10,
        padding: isMobile ? '11px 13px' : '13px 16px', borderBottom: `1px solid ${border}`,
        background: dark ? 'rgba(31, 34, 36, 0.70)' : 'rgba(48, 88, 93, 0.07)',
      }}>
        <div style={{ display:'flex', gap:6 }}>
          <span style={{ width:11, height:11, borderRadius:'50%', background: '#ff5f57' }}/>
          <span style={{ width:11, height:11, borderRadius:'50%', background: '#febc2e' }}/>
          <span style={{ width:11, height:11, borderRadius:'50%', background: '#28c840' }}/>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 500,
          color: terminalSubtle,
          marginLeft: isMobile ? 4 : 10, letterSpacing: 0.2,
        }}>roman@portfolio — zsh</span>
      </div>
      <div style={{
        padding: isMobile ? '16px 15px 20px' : '20px 22px 24px',
        fontSize: isMobile ? 11 : 12.5, lineHeight: 1.65,
        whiteSpace: isMobile ? 'normal' : 'pre-wrap', fontVariantLigatures: 'none',
        minHeight: isMobile ? 220 : 280,
        overflowX: 'hidden',
        maxWidth: '100%',
        minWidth: 0,
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}>
        {rendered.map((l, i) => {
          const isLast = i === rendered.length - 1;
          return lineStyle(l, i, (isLast && !done) ? (
            <span style={{
              display:'inline-block', width: 7, height: 14,
              background: accent, marginLeft: 1, verticalAlign:'-2px',
              animation: 'rjBlink 0.9s steps(2) infinite',
            }}/>
          ) : null);
        })}
      </div>
    </div>
  );
}

function FocusCard({ accent, dark }) {
  const { isMobile } = useViewport();
  const bg = dark ? 'rgba(31, 34, 36, 0.80)' : 'rgba(248, 252, 253, 0.75)';
  const border = dark ? 'rgba(208, 59, 8, 0.12)' : 'rgba(48, 88, 93, 0.14)';
  const subtle = dark ? 'rgba(248,252,253,0.60)' : 'rgba(31,34,36,0.60)';
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const items = [
    { label: 'Cloud',     value: 'AWS · Azure · Terraform' },
    { label: 'Security',  value: 'Pentesting · SIEM · Zero-trust' },
    { label: 'Building',  value: 'Home lab · CTF writeups' },
  ];
  return (
    <div style={{
      borderRadius: 12, background: bg,
      backdropFilter: 'blur(8px) saturate(110%)',
      WebkitBackdropFilter: 'blur(8px) saturate(110%)',
      border: `2px solid ${border}`,
      padding: isMobile ? '18px' : '18px 22px',
      display:'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 18 : 28,
      flexWrap:'wrap',
      boxShadow: dark
        ? '0 10px 40px -10px rgba(0,0,0,0.4)'
        : '0 10px 40px -10px rgba(31,34,36,0.15)',
    }}>
      <div style={{
        fontFamily:'"JetBrains Mono", monospace',
        fontSize: 10.5, letterSpacing: 2, fontWeight: 600,
        color: accent, textTransform:'uppercase',
        alignSelf: isMobile ? 'stretch' : 'center',
        paddingRight: isMobile ? 0 : 20,
        paddingBottom: isMobile ? 14 : 0,
        borderRight: isMobile ? 'none' : `1px solid ${border}`,
        borderBottom: isMobile ? `1px solid ${border}` : 'none',
      }}>
        Current<br/>Focus
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ minWidth: isMobile ? 0 : 130 }}>
          <div style={{
            fontSize: 10.5, fontWeight: 600, color: subtle,
            letterSpacing: 1.5, textTransform:'uppercase',
            marginBottom: 6, fontFamily: '"JetBrains Mono", monospace',
          }}>{it.label}</div>
          <div style={{
            fontFamily:'"Space Grotesk", sans-serif',
            fontSize: 16, fontWeight: 500, color: fg,
            letterSpacing: 0,
          }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

function FocusPanel({ accent, dark }) {
  const { isMobile } = useViewport();
  const border = dark ? 'rgba(208, 59, 8, 0.12)' : 'rgba(48, 88, 93, 0.14)';
  const subtle = dark ? 'rgba(248,252,253,0.60)' : 'rgba(31,34,36,0.60)';
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const items = [
    { id:'01', label: 'Cloud architecture', value: 'AWS, Azure, Terraform' },
    { id:'02', label: 'Security practice', value: 'Pentesting, SIEM, zero-trust' },
    { id:'03', label: 'Lab work', value: 'Home lab, CTF writeups' },
  ];

  return (
    <div style={{
      display:'grid',
      gridTemplateColumns: isMobile ? '1fr' : '0.7fr repeat(3, 1fr)',
      gap: isMobile ? 10 : 12,
      alignItems:'stretch',
    }}>
      <div style={{
        position:'relative',
        overflow:'hidden',
        borderRadius: 8,
        border: `1px solid ${border}`,
        background: dark ? 'rgba(31,34,36,0.62)' : 'rgba(248,252,253,0.72)',
        padding: isMobile ? '16px' : '16px 18px',
        minHeight: isMobile ? 0 : 124,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
      }}>
        <SectionPattern dark={dark} accent={accent} variant="diagonal" opacity={0.65} />
        <div style={{
          position:'relative',
          fontFamily:'"JetBrains Mono", monospace',
          fontSize: 10.5,
          letterSpacing: 1.7,
          fontWeight: 600,
          color: accent,
          textTransform:'uppercase',
        }}>Current focus</div>
        <div style={{
          position:'relative',
          fontFamily:'"Space Grotesk", sans-serif',
          fontSize: isMobile ? 18 : 20,
          fontWeight: 700,
          color: fg,
          marginTop: isMobile ? 8 : 0,
        }}>Now building</div>
      </div>
      {items.map((it) => (
        <div key={it.id} style={{
          borderRadius: 8,
          border: `1px solid ${border}`,
          background: dark ? 'rgba(248,252,253,0.035)' : 'rgba(248,252,253,0.62)',
          padding: '16px',
          minHeight: isMobile ? 0 : 124,
          display:'flex',
          flexDirection:'column',
          justifyContent:'space-between',
        }}>
          <div style={{
            display:'flex',
            justifyContent:'space-between',
            gap: 12,
            alignItems:'center',
            marginBottom: 18,
          }}>
            <span style={{
              fontFamily:'"JetBrains Mono", monospace',
              fontSize: 10.5,
              color: accent,
              fontWeight: 600,
            }}>{it.id}</span>
            <span style={{ width: 22, height: 2, background: accent, opacity: 0.75 }}/>
          </div>
          <div>
            <div style={{
              fontFamily:'"Space Grotesk", sans-serif',
              fontSize: 15,
              fontWeight: 700,
              color: fg,
              marginBottom: 6,
            }}>{it.label}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.45, color: subtle }}>{it.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroSection({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const { dark, accent, effect, showTerminal, showCards } = tw;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.65)' : 'rgba(31,34,36,0.70)';
  const border = dark ? 'rgba(248,252,253,0.12)' : 'rgba(31,34,36,0.14)';

  return (
    <section style={{
      position:'relative',
      overflow:'hidden',
      overflowX:'hidden',
      ...sectionSurface(dark, 0.7),
      minHeight: isMobile || isTablet ? 'auto' : '100vh',
      display:'grid',
      alignItems:'center',
      padding: isMobile ? '88px 5vw' : isTablet ? '84px 5vw' : '84px 6vw',
    }}>
      <SectionPattern dark={dark} accent={accent} variant="hero" opacity={isMobile ? 0.42 : 0.62} />
      <div style={{
        display:'grid',
        gridTemplateColumns: showTerminal && !isMobile && !isTablet ? 'minmax(0, 0.88fr) minmax(520px, 1.12fr)' : '1fr',
        gap: isMobile ? 36 : isTablet ? 48 : 56,
        alignItems:'center', alignContent:'center',
        padding: '0',
        maxWidth: 1600, margin: '0 auto',
      }}>
        {/* LEFT */}
        <div style={{ position:'relative', zIndex: 1, minWidth: 0, paddingLeft: isMobile || isTablet ? 0 : '2vw' }}>
        <div style={{ fontSize: isMobile ? 46 : isTablet ? 76 : 104 }}>
          <BigName text="ROMAN" effect={effect} accent={accent} dark={dark} seed={0} />
          <BigName text="JANSSENS" effect={effect} accent={accent} dark={dark} seed={1} startDelay={effect === 'typewriter' ? 650 : 0} />
        </div>

        <div className="rj-fadeup" style={{ marginTop: isMobile ? 22 : 28, maxWidth: 520, animationDelay:'0.5s' }}>
          <div style={{
            fontFamily:'"Space Grotesk", sans-serif',
            fontSize: isMobile ? 18 : 20, fontWeight: 500, color: fg,
            letterSpacing: 0, marginBottom: 10,
          }}>Cloud & Cybersecurity Student</div>
          <div style={{ fontSize: isMobile ? 14.5 : 15.5, lineHeight: 1.55, color: subtle }}>
            Focused on cloud systems, security fundamentals, and scalable infrastructure.
          </div>
        </div>

        <div className="rj-fadeup" style={{
          marginTop: isMobile ? 28 : 36,
          display:'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 14,
          alignItems: isMobile ? 'stretch' : 'center',
          animationDelay:'0.7s',
        }}>
          <a href="projects.html" style={{
            display:'inline-flex', alignItems:'center', gap: 10,
            justifyContent:'center',
            padding:'14px 22px', borderRadius: 8,
            background: accent, color: PALETTE.white,
            fontSize: 15, fontWeight: 600, textDecoration:'none',
            boxShadow: `0 10px 30px -8px ${accent}cc`,
            transition:'transform .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            View projects
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h8M8 4l3 3-3 3"/></svg>
          </a>
          <a href="contact.html" style={{
            display:'inline-flex', alignItems:'center', gap: 8,
            justifyContent:'center',
            padding:'14px 22px', borderRadius: 8,
            background:'transparent', color: fg,
            border: `1px solid ${border}`,
            fontSize: 15, fontWeight: 500, textDecoration:'none',
          }}>Get in touch</a>
        </div>

        {showTerminal && isMobile && (
          <div data-rj-reveal style={{ marginTop: 34, '--rj-delay': '80ms' }}>
            <Terminal accent={accent} dark={dark} />
          </div>
        )}

      </div>

      {showTerminal && !isMobile && (
        <div data-rj-reveal="right" style={{ position:'relative', zIndex: 1, minWidth: 0, alignSelf:'center', transform:'translateX(100px)', '--rj-delay': '120ms' }}>
          <Terminal accent={accent} dark={dark} />
        </div>
      )}
      </div>
    </section>
  );
}

export { HeroSection, Terminal, FocusCard, FocusPanel };
