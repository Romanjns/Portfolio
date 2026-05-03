import React from 'react';
import { createPortal } from 'react-dom';
import { PALETTE, useViewport, SectionPattern, sectionSurface, sectionFade, globalNoiseTexture, getSectionBackgroundTone, getSectionTopAccent } from './hero-shared.jsx';

// Landing-page sections (below hero): Skills, Featured Projects, Certifications, Experience.
// Each section is a standalone component used on index.html.

function SectionHeader({ eyebrow, title, subtitle, accent, dark, align = 'left' }) {
  const { isMobile, isTablet } = useViewport();
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.70)' : 'rgba(31,34,36,0.75)';
  const centered = align === 'center';
  return (
    <div style={{ marginBottom: isMobile ? 32 : 48, textAlign: align }}>
      <div style={{
        fontFamily:'"JetBrains Mono", monospace',
        fontSize: isMobile ? 10.5 : 11, letterSpacing: 2, fontWeight: 600,
        textTransform:'uppercase', color: accent,
        marginBottom: 14,
      }}>{eyebrow}</div>
      <h2 style={{
        fontFamily:'"Space Grotesk", sans-serif',
        fontSize: isMobile ? 32 : isTablet ? 42 : 51, fontWeight: 700,
        letterSpacing: 0, lineHeight: 1.05,
        color: fg, margin: centered ? '0 auto' : 0, maxWidth: 760,
      }}>{title}</h2>
      {subtitle && (
        <div style={{
          marginTop: 16, maxWidth: 640,
          marginLeft: centered ? 'auto' : 0,
          marginRight: centered ? 'auto' : 0,
          fontSize: isMobile ? 14.5 : 16, lineHeight: 1.55, color: subtle,
        }}>{subtitle}</div>
      )}
    </div>
  );
}

// ── Skills Marquee ────────────────────────────────────────────
// Inject marquee keyframes once at module load
(function() {
  if (document.getElementById('rj-marquee-kf')) return;
  const s = document.createElement('style');
  s.id = 'rj-marquee-kf';
  s.textContent = `
    @keyframes rjMarqueeL { from { transform:translateX(0); } to { transform:translateX(-33.333%); } }
    @keyframes rjMarqueeR { from { transform:translateX(-33.333%); } to { transform:translateX(0); } }
  `;
  document.head.appendChild(s);
})();

const SKILL_GROUPS = [
  { title:'Cloud',       items:['Kubernetes','Docker','Terraform','Ansible','NGINX','CrowdSec'] },
  { title:'Security',    items:['Burp Suite','OWASP ZAP','OWASP WSTG','CVSS','CIS Controls','CrowdSec'] },
  { title:'Languages',   items:['PHP','SQL','Python','PowerShell','Bash','JavaScript'] },
  { title:'Tooling',     items:['Grocy API','Twilio API','MQTT','ThingSpeak','Git','Scrum'] },
];

const SKILLS_ALL = [
  { name:'Kubernetes',       cat:'Cloud',      projects:['01'] },
  { name:'Docker',           cat:'Cloud',      projects:['01'] },
  { name:'Terraform',        cat:'Cloud',      projects:['01'] },
  { name:'Ansible',          cat:'Cloud',      projects:['01'] },
  { name:'NGINX',            cat:'Cloud',      projects:['01'] },
  { name:'MySQL',            cat:'Cloud',      projects:['01'] },
  { name:'CrowdSec',         cat:'Security',   projects:['01'] },
  { name:'CIS Controls',     cat:'Security',   projects:['01'] },
  { name:'Burp Suite',       cat:'Security',   projects:['02'] },
  { name:'OWASP ZAP',        cat:'Security',   projects:['02'] },
  { name:'CVSS',             cat:'Security',   projects:['02'] },
  { name:'OWASP',            cat:'Security',   projects:['02'] },
  { name:'OWASP WSTG',       cat:'Security',   projects:['02'] },
  { name:'XSS Testing',      cat:'Security',   projects:['02'] },
  { name:'CSRF Testing',     cat:'Security',   projects:['02'] },
  { name:'Grocy API',        cat:'Networking', projects:['03'] },
  { name:'Twilio API',       cat:'Networking', projects:['03'] },
  { name:'MQTT',             cat:'Networking', projects:['04'] },
  { name:'DNS',              cat:'Networking', projects:[] },
  { name:'Subnetting',       cat:'Networking', projects:[] },
  { name:'API Integration',  cat:'Networking', projects:['01','03'] },
  { name:'Barcode Scanning', cat:'Systems',    projects:['03'] },
  { name:'OrangePi',         cat:'Systems',    projects:['04'] },
  { name:'Raspberry Pi Pico',cat:'Systems',    projects:['04'] },
  { name:'BMP280 Sensor',    cat:'Systems',    projects:['04'] },
  { name:'PWM Control',      cat:'Systems',    projects:['04'] },
  { name:'ThingSpeak',       cat:'Systems',    projects:['04'] },
  { name:'PowerShell',       cat:'Systems',    projects:[] },
  { name:'Linux',            cat:'Systems',    projects:['01'] },
  { name:'PHP',              cat:'Dev',        projects:['01'] },
  { name:'SQL',              cat:'Dev',        projects:['01'] },
  { name:'Git',              cat:'Dev',        projects:[] },
  { name:'Scrum',            cat:'Dev',        projects:['01','03'] },
  { name:'Agile',            cat:'Dev',        projects:['01','03'] },
  { name:'Documentation',    cat:'Dev',        projects:['02','03','04'] },
  { name:'Testing',          cat:'Dev',        projects:['02','03'] },
  { name:'Python',           cat:'Dev',        projects:[] },
];

const SKILL_CATS = ['All','Cloud','Security','Networking','Systems','Dev'];

function SkillTooltip({ skill, x, y, dark, accent }) {
  const fg     = dark ? PALETTE.white : PALETTE.indigo;
  const border = dark ? 'rgba(208,59,8,0.16)' : 'rgba(48,88,93,0.16)';
  const bg     = dark ? 'rgba(31,34,36,0.98)' : 'rgba(248,252,253,0.99)';
  const muted  = dark ? 'rgba(248,252,253,0.50)' : 'rgba(31,34,36,0.50)';

  const related = (skill.projects || [])
    .map(id => (typeof PROJECTS !== 'undefined' ? PROJECTS : []).find(p => p.id === id))
    .filter(Boolean);

  const el = (
    <div style={{
      position:'fixed', left: x, top: y - 10,
      transform:'translateX(-50%) translateY(-100%)',
      background: bg,
      border:`1px solid ${border}`,
      borderRadius: 10, padding:'11px 15px',
      minWidth: related.length ? 220 : 120,
      zIndex: 9999, pointerEvents:'none',
      boxShadow: dark ? '0 10px 36px rgba(0,0,0,0.55)' : '0 10px 36px rgba(31,34,36,0.15)',
      backdropFilter:'blur(8px)',
      fontFamily:'"Manrope", sans-serif',
    }}>
      <div style={{
        fontFamily:'"JetBrains Mono", monospace',
        fontSize: 9.5, letterSpacing: 1.6, color: accent,
        textTransform:'uppercase', fontWeight: 600, marginBottom: 4,
      }}>{skill.cat}</div>
      <div style={{
        fontFamily:'"Space Grotesk", sans-serif',
        fontSize: 14, fontWeight: 600, color: fg,
        marginBottom: related.length ? 9 : 0,
      }}>{skill.name}</div>
      {related.length > 0 && (
        <>
          <div style={{
            fontFamily:'"JetBrains Mono", monospace',
            fontSize: 9.5, letterSpacing: 1.2, color: muted,
            textTransform:'uppercase', fontWeight: 600, marginBottom: 5,
          }}>Used in</div>
          {related.map(p => (
            <div key={p.id} style={{
              display:'flex', alignItems:'baseline', gap: 7,
              fontSize: 12, color: dark ? 'rgba(248,252,253,0.72)' : 'rgba(31,34,36,0.72)',
              marginBottom: 3,
            }}>
              <span style={{ color: accent, fontFamily:'"JetBrains Mono", monospace', fontSize: 10, flexShrink: 0 }}>{p.id}</span>
              <span style={{ lineHeight: 1.35 }}>{p.title}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
  return createPortal(el, document.body);
}

function SkillChip({ skill, accent, dark, onEnter, onLeave }) {
  const { isMobile } = useViewport();
  const ref    = React.useRef(null);
  const [hov, setHov] = React.useState(false);
  const subtle = dark ? 'rgba(248,252,253,0.62)' : 'rgba(31,34,36,0.72)';
  const border = dark ? 'rgba(248,252,253,0.10)' : 'rgba(31,34,36,0.12)';
  const bg     = dark ? 'rgba(248,252,253,0.055)' : 'rgba(255,255,255,0.72)';

  const handleEnter = () => {
    if (isMobile) return;
    setHov(true);
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      onEnter(skill, r.left + r.width / 2, r.top);
    }
  };

  const handleClick = (event) => {
    if (!isMobile) return;
    event.stopPropagation();
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      onEnter(skill, r.left + r.width / 2, r.top);
    }
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={() => { setHov(false); onLeave(); }}
      onClick={handleClick}
      style={{
        fontFamily:'"JetBrains Mono", monospace',
        fontSize: isMobile ? 11 : 12,
        padding: isMobile ? '7px 12px' : '7px 15px',
        borderRadius: 99, flexShrink: 0,
        color: hov ? accent : subtle,
        background: hov ? (dark ? `${accent}18` : `${accent}10`) : bg,
        border:`1px solid ${hov ? accent : border}`,
        backdropFilter:'blur(8px)',
        cursor: isMobile ? 'pointer' : 'default', whiteSpace:'nowrap', userSelect:'none',
        transition:'border-color .15s, color .15s, background .15s',
      }}
    >{skill.name}</div>
  );
}

function MarqueeRow({ skills, direction, paused, accent, dark, onRowEnter, onRowLeave, onChipEnter, onChipLeave }) {
  const items = [...skills, ...skills, ...skills];
  const dur   = Math.max(14, skills.length * 2.6) + 's';
  return (
    <div
      onMouseEnter={onRowEnter}
      onMouseLeave={onRowLeave}
      style={{
        overflow:'hidden', marginBottom: 10,
        maskImage:'linear-gradient(to right,transparent,black 8%,black 92%,transparent)',
        WebkitMaskImage:'linear-gradient(to right,transparent,black 8%,black 92%,transparent)',
      }}
    >
      <div style={{
        display:'flex', gap: 10, width:'max-content',
        animation:`${direction === 'left' ? 'rjMarqueeL' : 'rjMarqueeR'} ${dur} linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
      }}>
        {items.map((skill, i) => (
          <SkillChip
            key={`${skill.name}-${i}`}
            skill={skill} accent={accent} dark={dark}
            onEnter={onChipEnter}
            onLeave={onChipLeave}
          />
        ))}
      </div>
    </div>
  );
}

function SkillsMarquee({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const { accent, dark } = tw;
  const fg     = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.70)' : 'rgba(31,34,36,0.75)';
  const border = dark ? 'rgba(208,59,8,0.14)' : 'rgba(48,88,93,0.14)';

  const [filter, setFilter]     = React.useState('All');
  const [pausedSet, setPausedSet] = React.useState(() => new Set());
  const [tooltip, setTooltip]   = React.useState(null);

  const filtered  = filter === 'All' ? SKILLS_ALL : SKILLS_ALL.filter(s => s.cat === filter);
  const stationary = filter !== 'All' || filtered.length < 12;

  const rows = React.useMemo(() => {
    if (stationary) return [];
    const n = filtered.length >= 18 ? 3 : filtered.length >= 8 ? 2 : 1;
    return Array.from({ length: n }, (_, ri) => filtered.filter((_, i) => i % n === ri));
  }, [filter, stationary]);

  const pauseRow   = ri => setPausedSet(s => new Set([...s, ri]));
  const unpauseRow = ri => setPausedSet(s => { const n = new Set(s); n.delete(ri); return n; });

  const showTip  = (skill, x, y) => setTooltip({ skill, x, y });
  const hideTip  = ()             => setTooltip(null);

  React.useEffect(() => {
    if (!isMobile || !tooltip) return;
    const close = () => setTooltip(null);
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, { passive: true });
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close);
    };
  }, [isMobile, tooltip]);

  return (
    <section style={{
      position:'relative',
      padding: isMobile ? '64px 0' : isTablet ? '80px 0' : '100px 0 100px',
      overflow:'hidden',
      background: getSectionBackgroundTone(0, dark),
      ...globalNoiseTexture(dark),
    }}>
      {getSectionTopAccent(2, dark) && <div style={getSectionTopAccent(2, dark)} />}
      <div style={sectionFade('top', dark)}/>
      {/* Header + filter - padded */}
      <div data-rj-reveal style={{ position:'relative', zIndex: 1, padding: isMobile ? '0 5vw' : isTablet ? '0 5vw' : '0 6vw', maxWidth: 1600, margin:'0 auto', marginBottom: isMobile ? 32 : 44 }}>
        <SectionHeader
          eyebrow="02 / Skills"
          title="Tools I reach for."
          subtitle="Practical tools for secure hosting, application testing, API work, IoT systems, and clear documentation."
          accent={accent} dark={dark}
        />
        {/* Filter bar */}
        <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
          {SKILL_CATS.map(cat => {
            const active = cat === filter;
            return (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setPausedSet(new Set()); setTooltip(null); }}
                style={{
                  fontFamily:'"JetBrains Mono", monospace',
                  fontSize: isMobile ? 10.5 : 11, letterSpacing: 1, fontWeight: 600,
                  padding: isMobile ? '6px 11px' : '6px 14px', borderRadius: 99,
                  border:`1px solid ${active ? accent : border}`,
                  background: active ? (dark ? `${accent}22` : `${accent}14`) : 'transparent',
                  color: active ? accent : subtle,
                  cursor:'pointer', transition:'all .15s',
                  textTransform:'uppercase',
                }}
              >{cat}</button>
            );
          })}
          <span style={{
            fontFamily:'"JetBrains Mono", monospace',
            fontSize: 10.5, color: subtle, alignSelf:'center',
            marginLeft: isMobile ? 0 : 8, opacity: 0.7,
          }}>{filtered.length} skills</span>
        </div>
      </div>

      {stationary ? (
        /* Centered stationary view for filtered or small result sets */
        <div data-rj-reveal style={{ position:'relative', zIndex: 1, padding: isMobile || isTablet ? '0 5vw' : '0 6vw', maxWidth: 1600, margin:'0 auto', '--rj-delay': '80ms' }}>
          <div style={{
            display:'flex', flexWrap:'wrap', gap: 10,
            justifyContent:'center', alignItems:'center',
            maxWidth: filter === 'All' ? 920 : 760,
            margin:'0 auto',
          }}>
            {filtered.map(skill => (
              <SkillChip
                key={skill.name} skill={skill}
                accent={accent} dark={dark}
                onEnter={showTip} onLeave={hideTip}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Marquee rows */
        <div key={filter} data-rj-reveal style={{ position:'relative', zIndex: 1, '--rj-delay': '80ms' }}>
          {rows.map((row, ri) => (
            <MarqueeRow
              key={ri} skills={row}
              direction={ri % 2 === 0 ? 'left' : 'right'}
              paused={pausedSet.has(ri)}
              accent={accent} dark={dark}
              onRowEnter={() => pauseRow(ri)}
              onRowLeave={() => { unpauseRow(ri); hideTip(); }}
              onChipEnter={showTip}
              onChipLeave={hideTip}
            />
          ))}
        </div>
      )}

      {tooltip && (
        <SkillTooltip
          skill={tooltip.skill} x={tooltip.x} y={tooltip.y}
          dark={dark} accent={accent}
        />
      )}
    </section>
  );
}

function SkillsGrid({ tw }) { return <SkillsMarquee tw={tw} />; }

// ── Featured Projects (preview on landing) ────────────────────
const PROJECTS = [
  {
    id:'01', tag:'SECURITY / CLOUD',
    title:'Thomas Minder Secure Hosting Platform',
    body:'Work in progress secure hosting platform for PHP apps with Kubernetes, automated deployment, DNS setup, monitoring, and CIS-based security design.',
    stack:['Kubernetes','Docker','Terraform','CrowdSec'],
  },
  {
    id:'02', tag:'APP SECURITY',
    title:'Shopmore E-commerce Security Check',
    body:'Individual penetration test on a vulnerable e-commerce app, including XSS, CSRF, admin access issues, clickjacking, CVSS scoring, and remediation advice.',
    stack:['Burp Suite','OWASP ZAP','CVSS'],
  },
  {
    id:'03', tag:'MOBILE / API',
    title:'Smart Grocery Management System',
    body:'Team project using Grocy and its API to manage groceries locally, scan barcodes, generate shopping lists, and send WhatsApp alerts through Twilio.',
    stack:['Grocy API','Twilio','Barcode Scanner'],
  },
  {
    id:'04', tag:'IOT',
    title:'IoT Thermostat with Enhanced Cooling',
    body:'Thermostat system with dual potentiometers, MQTT data exchange, BMP280 readings, PWM fan control, LCD output, and ThingSpeak monitoring.',
    stack:['OrangePi','Raspberry Pi Pico','MQTT'],
  },
  {
    id:'05', tag:'PLACEHOLDER',
    title:'Upcoming Cybersecurity Project',
    body:'Reserved for a future real project. This slot will be replaced with stronger work once the project is selected and documented.',
    stack:['Coming Soon'],
  },
  {
    id:'06', tag:'PLACEHOLDER',
    title:'Future Project Slot',
    body:'Reserved for another real project so the portfolio keeps six total projects without filling the page with fake work.',
    stack:['Coming Soon'],
  },
];

function ProjectCard({ p, accent, dark, index = 0 }) {
  const { isMobile, isTablet } = useViewport();
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const cardBg = dark
    ? 'linear-gradient(180deg, rgba(39,48,49,0.94), rgba(31,34,36,0.98))'
    : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,252,251,0.98))';
  const border = dark ? 'rgba(248,252,253,0.12)' : 'rgba(48,88,93,0.24)';
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const active = hovered && !pressed;
  const previewHeight = isMobile ? 170 : isTablet ? 180 : 190;
  const idFontSize = isMobile ? 82 : isTablet ? 92 : 102;

  return (
    <a
      href={`projects.html?project=${p.id}`}
      data-rj-reveal
      style={{
        '--rj-delay': `${Math.min(index, 5) * 70}ms`,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 12,
        padding: 6,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        border: `1px solid ${active ? PALETTE.blueDk : border}`,
        cursor: 'pointer',
        background: cardBg,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease, background 0.2s ease',
        boxShadow: active && !isMobile
          ? `10px 18px 0 ${accent}, 20px 36px 0 ${PALETTE.blueDk}, 0 16px 38px -30px rgba(31,34,36,0.28)`
          : active
            ? dark
              ? '0 18px 44px -28px rgba(0,0,0,0.78)'
              : '0 18px 44px -28px rgba(48,88,93,0.35)'
            : dark
              ? '0 18px 44px -34px rgba(0,0,0,0.70), 0 1px 0 rgba(255,255,255,0.04) inset'
              : '0 16px 44px -32px rgba(48,88,93,0.24), 0 1px 0 rgba(255,255,255,0.85) inset',
        transform: active
          ? isMobile ? 'translateY(-3px)' : 'translate(-8px, -12px)'
          : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {/* Preview area */}
      <div style={{
        width: '100%',
        height: previewHeight,
        borderRadius: 7,
        background: dark
          ? `linear-gradient(135deg, rgba(48,88,93,0.35), rgba(31,34,36,0.82)), linear-gradient(180deg, ${accent}26, transparent)`
          : `linear-gradient(135deg, rgba(48,88,93,0.18), rgba(255,255,255,0.70)), linear-gradient(180deg, ${accent}18, transparent)`,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: 12,
          left: 14,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10.5, letterSpacing: 1.5, fontWeight: 600,
          textTransform: 'uppercase',
          color: 'rgba(248,252,253,0.82)',
        }}>{p.tag}</div>
        <div style={{
          position: 'absolute',
          right: 14,
          bottom: -16,
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: idFontSize,
          fontWeight: 700,
          lineHeight: 1,
          color: 'rgba(248,252,253,0.07)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>{p.id}</div>
      </div>

      {/* Info section */}
      <div style={{ padding: '14px 10px 10px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Title + arrow */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <div style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: isMobile ? 18 : 20,
            fontWeight: 600,
            color: fg,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>{p.title}</div>
          <div style={{
            borderRadius: '50%',
            width: 44,
            height: 44,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: active ? `${accent}22` : 'transparent',
            transition: 'transform 0.3s ease, background 0.3s ease',
            transform: active ? 'rotate(-45deg)' : 'none',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke={fg}>
              <line y2="12" x2="19" y1="12" x1="5"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>

        {/* Stack tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {p.stack.slice(0, 4).map((s, i) => (
            <span key={s} style={{
              background: i % 2 === 0 ? `${accent}28` : `${PALETTE.blueDk}28`,
              color: i % 2 === 0 ? accent : PALETTE.blueDk,
              fontWeight: 700,
              padding: '0.3em 0.75em',
              borderRadius: 15,
              fontSize: 11,
              letterSpacing: 0,
              fontFamily: '"JetBrains Mono", monospace',
            }}>• {s}</span>
          ))}
        </div>
      </div>
    </a>
  );
}

function FeaturedProjects({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const { accent, dark } = tw;
  return (
    <section style={{
      position:'relative',
      overflow:'hidden',
      background: getSectionBackgroundTone(1, dark),
      ...globalNoiseTexture(dark),
    }}>
      {getSectionTopAccent(1, dark) && <div style={getSectionTopAccent(1, dark)} />}
      <div style={{
        padding: isMobile ? '64px 5vw' : isTablet ? '80px 5vw' : '100px 6vw',
        maxWidth: 1600,
        margin:'0 auto',
      }}>
        <div data-rj-reveal style={{
          position:'relative',
          zIndex: 1,
          display:'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent:'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          marginBottom: isMobile ? 32 : 48,
          gap: isMobile ? 12 : 24,
        }}>
          <SectionHeader
            eyebrow="03 / Selected work"
            title="Projects and achievements."
            subtitle="Real project work in secure hosting, application security, API integration, and IoT. Two slots are intentionally reserved for future projects."
            accent={accent} dark={dark}
          />
          <a href="projects.html" style={{
            flexShrink: 0,
            fontSize: 14, fontWeight: 500, color: accent,
            textDecoration:'none',
            display:'inline-flex', alignItems:'center', gap: 6,
            paddingBottom: 8,
          }}>All projects &gt;</a>
        </div>
        <div style={{
          position:'relative',
          zIndex: 1,
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? 14 : 20,
        }}>
          <ProjectCard p={PROJECTS[0]} accent={accent} dark={dark} index={0} />
          <ProjectCard p={PROJECTS[1]} accent={accent} dark={dark} index={1} />
          <ProjectCard p={PROJECTS[2]} accent={accent} dark={dark} index={2} />
          <ProjectCard p={PROJECTS[3]} accent={accent} dark={dark} index={3} />
          <ProjectCard p={PROJECTS[4]} accent={accent} dark={dark} index={4} />
          <ProjectCard p={PROJECTS[5]} accent={accent} dark={dark} index={5} />
        </div>
      </div>
    </section>
  );
}

// ── Certifications ───────────────────────────────────────────
(function() {
  if (document.getElementById('rj-cert-kf')) return;
  const s = document.createElement('style');
  s.id = 'rj-cert-kf';
  s.textContent = `
    @keyframes rjSpinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .rj-cert-stack {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .rj-cert-item {
      position: relative;
      transition: transform .3s cubic-bezier(.2,.8,.2,1), filter .3s cubic-bezier(.2,.8,.2,1);
    }
    .rj-cert-item:hover {
      transform: translateY(-10px);
    }
    .rj-cert-carousel {
      width: 100%;
      max-width: 330px;
      margin: 0 auto;
      overflow: hidden;
      touch-action: pan-y;
      padding: 12px 0 4px;
      mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
    }
    .rj-cert-carousel-track {
      display: flex;
      align-items: flex-start;
      transition: transform .55s cubic-bezier(.2,.8,.2,1);
      will-change: transform;
    }
    .rj-cert-carousel-slide {
      flex: 0 0 194px;
      display: flex;
      justify-content: center;
    }
    @media (max-width: 719px) {
      .rj-cert-stack {
        align-items: center;
      }
      .rj-cert-item:hover {
        transform: none;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .rj-cert-item,
      .rj-cert-carousel-track {
        transition: none !important;
      }
      .rj-cert-item:hover {
        transform: none !important;
      }
    }
  `;
  document.head.appendChild(s);
})();

const CERTS = [
  { name:'Cisco CyberOps Associate',  issuer:'Cisco',               year:'2025', status:'Issued',      abbr:'CCA'   },
  { name:'IELTS Academic English',    issuer:'IELTS',               year:'2025', status:'Issued',      abbr:'IELTS', level:'C1' },
  { name:'AWS Cloud Practitioner',    issuer:'Amazon Web Services', year:'2026', status:'In progress', abbr:'AWS'   },
];

const CERT_COLORS = {
  primary: PALETTE.blue,
  secondary: PALETTE.blueDk,
  green: '#6d8f55',
};

function CertBadge({ cert, accent, dark, index, reveal = true }) {
  const { isMobile } = useViewport();
  const [hovered, setHovered] = React.useState(false);
  const isIssued = cert.status === 'Issued';
  const orange = CERT_COLORS.primary;
  const teal = CERT_COLORS.secondary;
  const green = CERT_COLORS.green;
  const color = orange;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.60)' : 'rgba(31,34,36,0.68)';

  const sz = isMobile ? 130 : 160;
  const cx = sz / 2;
  const cy = sz / 2;
  const ringR = sz * 0.455;   // outer decorative circle radius
  const hexR = sz * 0.375;   // hex vertex radius

  const abbr = cert.abbr || cert.issuer.split(' ').map(w => w[0]).slice(0, 3).join('');

  // Pointy-top hexagon: vertex angle offset -30° so top/bottom are points
  const hexPts = (r) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
    }).join(' ');

  // Tick marks radiating out from the ring (issued only)
  const ticks = isIssued
    ? Array.from({ length: 24 }, (_, i) => {
        const a  = ((Math.PI * 2) / 24) * i - Math.PI / 2;
        const r1 = ringR + 2;
        const r2 = ringR + (i % 6 === 0 ? 10 : i % 3 === 0 ? 6.5 : 3.5);
        return {
          x1: (cx + r1 * Math.cos(a)).toFixed(2), y1: (cy + r1 * Math.sin(a)).toFixed(2),
          x2: (cx + r2 * Math.cos(a)).toFixed(2), y2: (cy + r2 * Math.sin(a)).toFixed(2),
          w:  i % 6 === 0 ? 1.6 : i % 3 === 0 ? 1.1 : 0.7,
          op: i % 6 === 0 ? 0.95 : i % 3 === 0 ? 0.65 : 0.40,
        };
      })
    : [];

  const gradId  = `cg${index}`;
  const shineId = `csh${index}`;

  const shadow = hovered
    ? `drop-shadow(0 1px 1px ${color}dd) drop-shadow(0 7px 18px ${color}99) drop-shadow(0 20px 44px ${color}55)`
    : isIssued
      ? `drop-shadow(0 1px 2px ${color}aa) drop-shadow(0 5px 14px ${color}66) drop-shadow(0 14px 30px ${color}33)`
      : `drop-shadow(0 1px 2px rgba(0,0,0,0.22)) drop-shadow(0 5px 14px rgba(0,0,0,0.16)) drop-shadow(0 14px 30px rgba(0,0,0,0.10))`;

  return (
    <div
      className="rj-cert-item"
      {...(reveal ? { 'data-rj-reveal': true } : {})}
      style={{
        '--rj-delay': `${60 + index * 90}ms`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 18, cursor: 'default',
        width: isMobile ? 158 : 194,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* overflow:visible lets the drop-shadow bleed past the SVG box */}
      <div style={{ width: sz, height: sz, flexShrink: 0, filter: shadow, transition: 'filter .30s' }}>
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ overflow: 'visible' }}>
          <defs>
            {/* 3-stop gradient: specular flash to flat color to dark underside */}
            <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
              {isIssued ? (
                <>
                  <stop offset="0%" stopColor="rgba(255,255,255,0.60)"/>
                  <stop offset="14%" stopColor={orange}/>
                  <stop offset="54%" stopColor={green}/>
                  <stop offset="100%" stopColor={teal}/>
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor={dark ? teal : green}/>
                  <stop offset="100%" stopColor={dark ? '#151b1c' : '#dce9e3'}/>
                </>
              )}
            </linearGradient>
            {/* Dome-gloss radial: bright top-left specular highlight */}
            <radialGradient id={shineId} cx="28%" cy="17%" r="55%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.58)"/>
              <stop offset="44%" stopColor="rgba(255,255,255,0.10)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </radialGradient>
          </defs>

          {/* ── Outer decorative ring ── */}
          <circle cx={cx} cy={cy} r={ringR}
            fill="none"
            stroke={isIssued ? teal : (dark ? 'rgba(248,252,253,0.16)' : 'rgba(31,34,36,0.14)')}
            strokeWidth={isIssued ? 1.2 : 0.8}
            opacity={0.72}
          />
          {/* Tick marks radiating outward (issued badges) */}
          {ticks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={i % 2 === 0 ? orange : green} strokeWidth={t.w} strokeLinecap="round" opacity={t.op}/>
          ))}
          {/* Spinning dashed arc (in-progress) */}
          {!isIssued && (
            <circle cx={cx} cy={cy} r={ringR - 1}
              fill="none" stroke={orange} strokeWidth="1.5"
              strokeDasharray={`${2 * Math.PI * (ringR - 1) * 0.55} ${2 * Math.PI * (ringR - 1) * 0.45}`}
              strokeLinecap="round"
              style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'rjSpinSlow 9s linear infinite', opacity: 0.55 }}
            />
          )}

          {/* ── Hex glow halo (slightly oversized, faint) ── */}
          <polygon points={hexPts(hexR + 6)}
            fill={isIssued ? `${green}24` : (dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')}
          />

          {/* ── Hex main body ── */}
          <polygon points={hexPts(hexR)} fill={`url(#${gradId})`}/>

          {/* ── Dome-gloss specular overlay ── */}
          <polygon points={hexPts(hexR)} fill={`url(#${shineId})`}/>

          {/* ── Top-bevel highlight ring ── */}
          <polygon points={hexPts(hexR)}
            fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="1.5"
          />
          {/* ── Bottom-shadow edge ── */}
          <polygon points={hexPts(hexR)}
            fill="none" stroke="rgba(0,0,0,0.24)" strokeWidth="0.6"
          />
          {/* ── Inner depth ring ── */}
          {isIssued && (
            <polygon points={hexPts(hexR * 0.83)}
              fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1"
            />
          )}

          {/* ── Abbreviation ── */}
          <text
            x={cx}
            y={cy + (cert.level ? -(sz * 0.088) : isIssued ? -(sz * 0.034) : sz * 0.018)}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily='"JetBrains Mono", monospace'
            fontSize={sz * (abbr.length > 4 ? 0.098 : abbr.length === 4 ? 0.118 : abbr.length === 3 ? 0.148 : 0.175)}
            fontWeight="800"
            fill={isIssued ? 'rgba(255,255,255,0.97)' : (dark ? 'rgba(248,252,253,0.36)' : 'rgba(31,34,36,0.30)')}
            style={{ filter: isIssued ? 'drop-shadow(0 1px 4px rgba(0,0,0,0.52))' : 'none' }}
          >{abbr}</text>

          {/* ── Level label (e.g. C1) ── */}
          {cert.level && (
            <text
              x={cx} y={cy + sz * 0.112}
              textAnchor="middle" dominantBaseline="middle"
              fontFamily='"Space Grotesk", sans-serif'
              fontSize={sz * 0.135} fontWeight="700"
              fill={isIssued ? 'rgba(255,255,255,0.86)' : (dark ? 'rgba(248,252,253,0.30)' : 'rgba(31,34,36,0.24)')}
              style={{ filter: isIssued ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.40))' : 'none' }}
            >{cert.level}</text>
          )}

          {/* ── Checkmark ── */}
          {isIssued && (
            <g transform={`translate(${cx - 7 * sz / 100}, ${cy + sz * (cert.level ? 0.265 : 0.165) - 5 * sz / 100}) scale(${sz / 100})`}>
              <path d="M0 5l5 5L14 0" fill="none"
                stroke="rgba(255,255,255,0.72)" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </g>
          )}

        </svg>
      </div>

      {/* ── Text below badge ── */}
      <div style={{ textAlign: 'center', maxWidth: isMobile ? 158 : 194, padding: '0 6px' }}>
        <div style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: isMobile ? 13.5 : 15, fontWeight: 700,
          color: fg, lineHeight: 1.25, marginBottom: 6,
        }}>{cert.name}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10.5, color: subtle, marginBottom: 11, letterSpacing: 0.4,
        }}>{cert.issuer}</div>
        <span style={{
          display: 'inline-block',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9.5, letterSpacing: 1.2, fontWeight: 700, textTransform: 'uppercase',
          color: isIssued ? orange : teal,
          padding: '3px 12px', borderRadius: 99,
          border: `1px solid ${isIssued ? orange + '55' : teal + '44'}`,
          background: isIssued ? `${green}18` : `${teal}10`,
        }}>{isIssued ? `✓ ${cert.year}` : 'In progress'}</span>
      </div>
    </div>
  );
}

function Certifications({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const { accent, dark } = tw;
  const slideWidth = 194;
  const carouselWidth = 330;
  const [activeCert, setActiveCert] = React.useState(0);
  const [carouselStep, setCarouselStep] = React.useState(0);
  const [carouselTransition, setCarouselTransition] = React.useState(true);
  const [dragX, setDragX] = React.useState(0);
  const [autoResetKey, setAutoResetKey] = React.useState(0);
  const dragStartRef = React.useRef(null);
  const movingRef = React.useRef(false);
  const visibleCert = activeCert;
  const certSlides = React.useMemo(() => {
    const prev = (activeCert - 1 + CERTS.length) % CERTS.length;
    const next = (activeCert + 1) % CERTS.length;
    return [CERTS[prev], CERTS[activeCert], CERTS[next]];
  }, [activeCert]);
  const carouselOffset = ((carouselWidth - slideWidth) / 2) - slideWidth - (carouselStep * slideWidth) + dragX;

  React.useEffect(() => {
    if (!isMobile) {
      setActiveCert(0);
      setCarouselStep(0);
      return;
    }
    const reduced = typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const timer = setInterval(() => {
      if (movingRef.current) return;
      movingRef.current = true;
      setCarouselTransition(true);
      setCarouselStep(1);
    }, 3200);
    return () => clearInterval(timer);
  }, [isMobile, autoResetKey]);

  React.useEffect(() => {
    if (!isMobile || carouselTransition) return;
    const raf = requestAnimationFrame(() => setCarouselTransition(true));
    return () => cancelAnimationFrame(raf);
  }, [isMobile, carouselTransition]);

  const finishCarouselMove = (event) => {
    if (event.currentTarget !== event.target) return;
    if (carouselStep !== 0) {
      setCarouselTransition(false);
      setActiveCert(i => (i + carouselStep + CERTS.length) % CERTS.length);
      setCarouselStep(0);
    }
    movingRef.current = false;
  };

  const resetAutoAdvance = () => setAutoResetKey(k => k + 1);

  const showCert = (i, manual = true) => {
    if (movingRef.current || i === visibleCert) return;
    setCarouselTransition(false);
    setCarouselStep(0);
    setDragX(0);
    setActiveCert(i);
    if (manual) resetAutoAdvance();
  };

  const moveCert = (direction, manual = true) => {
    if (movingRef.current || carouselStep !== 0) return;
    movingRef.current = true;
    setCarouselTransition(true);
    setCarouselStep(direction > 0 ? 1 : -1);
    if (manual) resetAutoAdvance();
  };

  const startDrag = (event) => {
    if (!isMobile || movingRef.current || carouselStep !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragStartRef.current = { x: event.clientX, lastX: event.clientX, pointerId: event.pointerId };
    setCarouselTransition(false);
  };

  const moveDrag = (event) => {
    if (!dragStartRef.current || dragStartRef.current.pointerId !== event.pointerId) return;
    dragStartRef.current.lastX = event.clientX;
    setDragX(Math.max(-104, Math.min(104, event.clientX - dragStartRef.current.x)));
  };

  const endDrag = (event) => {
    if (!dragStartRef.current || dragStartRef.current.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    const delta = dragStartRef.current.lastX - dragStartRef.current.x;
    dragStartRef.current = null;
    setDragX(0);
    setCarouselTransition(true);
    resetAutoAdvance();
    if (Math.abs(delta) < 42) return;
    moveCert(delta < 0 ? 1 : -1);
  };

  const handleCarouselKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveCert(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveCert(-1);
    }
  };

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: getSectionBackgroundTone(2, dark),
      ...globalNoiseTexture(dark),
    }}>
      {getSectionTopAccent(2, dark) && <div style={getSectionTopAccent(2, dark)} />}
      <div style={sectionFade('top', dark)}/>
      <div style={{
        padding: isMobile ? '64px 5vw' : isTablet ? '80px 5vw' : '100px 6vw',
        maxWidth: 1600,
        margin: '0 auto',
        position: 'relative', zIndex: 1
      }}>
        <div data-rj-reveal>
          <SectionHeader
            eyebrow="04 / Certifications"
            title="Verifiable credentials."
            subtitle="Earned and in progress across security, language, and cloud topics."
            accent={accent} dark={dark} align="center"
          />
        </div>
        {isMobile ? (
          <div data-rj-reveal style={{ paddingTop: 6 }}>
            <div
              className="rj-cert-carousel"
              role="region"
              aria-label="Certificates carousel"
              tabIndex={0}
              onKeyDown={handleCarouselKeyDown}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <div
                className="rj-cert-carousel-track"
                onTransitionEnd={finishCarouselMove}
                style={{
                  transform: `translateX(${carouselOffset}px)`,
                  transition: carouselTransition ? undefined : 'none',
                }}
              >
                {certSlides.map((c, i) => (
                  <div key={`${c.name}-${i}`} className="rj-cert-carousel-slide">
                    <CertBadge cert={c} accent={accent} dark={dark} index={i} reveal={false} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              marginTop: 14,
            }}>
              <button
                type="button"
                aria-label="Previous certificate"
                onClick={() => moveCert(-1)}
                style={{
                  width: 36,
                  height: 32,
                  borderRadius: 99,
                  border: `1px solid ${dark ? 'rgba(248,252,253,0.14)' : 'rgba(31,34,36,0.14)'}`,
                  background: dark ? 'rgba(248,252,253,0.06)' : 'rgba(255,255,255,0.58)',
                  color: accent,
                  fontSize: 18,
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
              >&lt;</button>
              <button
                type="button"
                aria-label="Next certificate"
                onClick={() => moveCert(1)}
                style={{
                  width: 36,
                  height: 32,
                  borderRadius: 99,
                  border: `1px solid ${dark ? 'rgba(248,252,253,0.14)' : 'rgba(31,34,36,0.14)'}`,
                  background: dark ? 'rgba(248,252,253,0.06)' : 'rgba(255,255,255,0.58)',
                  color: accent,
                  fontSize: 18,
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
              >&gt;</button>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 12,
            }}>
              {CERTS.map((c, i) => {
                const active = i === visibleCert;
                return (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={`Show ${c.name}`}
                    onClick={() => showCert(i)}
                    style={{
                      width: active ? 22 : 8,
                      height: 8,
                      borderRadius: 99,
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      background: active ? accent : (dark ? 'rgba(248,252,253,0.22)' : 'rgba(31,34,36,0.20)'),
                      transition: 'width .2s ease, background .2s ease',
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 48,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: 20,
          }} className="rj-cert-stack">
            {CERTS.map((c, i) => (
              <CertBadge key={c.name} cert={c} accent={accent} dark={dark} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Experience timeline ──────────────────────────────────────
const EXPERIENCE = [
  {
    period:'Next step',
    title:'Master in Cybersecurity',
    org:'University West, Trollhattan, Sweden',
    body:'Planned next study path after my current program. The goal is to deepen my cybersecurity knowledge and connect it with stronger research and advanced practical work.',
    ghost:true,
  },
  {
    period:'2026',
    title:'Thomas Minder Secure Hosting Platform',
    org:'Fontys University of Applied Sciences',
    body:'Team project building a secure hosting platform for PHP applications with Kubernetes, Docker, NGINX, MySQL, Terraform, Ansible, CrowdSec, and CIS Controls.',
  },
  {
    period:'2026',
    title:'Shopmore E-commerce Security Check',
    org:'Application Security individual project',
    body:'Performed a full penetration test on a vulnerable web shop, documented XSS, CSRF, missing access controls, clickjacking, CVSS scores, proof of concept steps, and mitigations.',
  },
  {
    period:'2025',
    title:'Smart Grocery Management System',
    org:'Skills Integration Lab 1 and 2',
    body:'Worked in a team to adapt Grocy for a client, integrate the Grocy API, send WhatsApp alerts through Twilio, and document the product with user stories, test plans, and design work.',
  },
  {
    period:'2024',
    title:'IoT Thermostat with Enhanced Cooling',
    org:'IoT Recovery Exam',
    body:'Built a thermostat using OrangePi, Raspberry Pi Pico, MQTT, a BMP280 sensor, PWM fan control, dual potentiometers, LCD output, and ThingSpeak monitoring.',
  },
  {
    period:'Current program',
    title:'Cybersecurity & Cloud Management',
    org:'Student portfolio foundation',
    body:'Building skills across security testing, cloud infrastructure, APIs, documentation, teamwork, and practical troubleshooting.',
  },
];

function Experience({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const { accent, dark } = tw;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.65)' : 'rgba(31,34,36,0.75)';
  const border = dark ? 'rgba(208,59,8,0.06)' : 'rgba(48,88,93,0.08)';
  const alternating = !isMobile && !isTablet;

  return (
    <section style={{
      position:'relative',
      overflow:'hidden',
      background: getSectionBackgroundTone(3, dark),
      ...globalNoiseTexture(dark),
      padding: isMobile ? '64px 5vw' : isTablet ? '80px 5vw' : '100px 6vw 88px',
    }}>
      {getSectionTopAccent(3, dark) && <div style={getSectionTopAccent(3, dark)} />}
      <div style={sectionFade('both', dark)}/>
      <div style={{ maxWidth: 1600, margin:'0 auto' }}>
      <div style={{ position:'relative', zIndex: 1 }}>
        <div data-rj-reveal style={{
          textAlign: alternating ? 'center' : 'left',
          maxWidth: alternating ? 780 : 'none',
          margin: alternating ? '0 auto' : 0,
        }}>
          <SectionHeader
            eyebrow="02 / Experience"
            title="What I've done so far."
            accent={accent} dark={dark}
            align={alternating ? 'center' : 'left'}
          />
        </div>
      <div style={{
        position:'relative',
        maxWidth: alternating ? 1080 : 'none',
        margin: alternating ? '0 auto' : 0,
        paddingLeft: alternating ? 0 : isMobile ? 28 : 36,
      }}>
        {/* spine */}
        <div style={{
          position:'absolute',
          left: alternating ? '50%' : 11,
          top: 8,
          bottom: 8,
          width: 1, background: border,
          transform: alternating ? 'translateX(-50%)' : 'none',
        }}/>
        {EXPERIENCE.map((e, i) => {
          const isGhost = Boolean(e.ghost);
          return (
          <div key={i} data-rj-reveal={alternating ? (i % 2 === 0 ? 'left' : 'right') : true} style={{
            '--rj-delay': `${80 + i * 70}ms`,
            position:'relative',
            paddingBottom: i === EXPERIENCE.length - 1 ? 0 : 48,
            display: alternating ? 'grid' : 'block',
            gridTemplateColumns: alternating ? '1fr 80px 1fr' : 'none',
            alignItems:'start',
            opacity: isGhost ? 0.72 : 1,
          }}>
            <div style={{
              position:'absolute',
              left: alternating ? '50%' : isMobile ? -23 : -29,
              top: 4,
              width: 10, height: 10, borderRadius: 5,
              background: isGhost ? (dark ? PALETTE.indigo : PALETTE.white) : accent,
              border: isGhost ? `1px dashed ${accent}` : 'none',
              boxShadow: `0 0 0 3px ${dark ? PALETTE.indigo : PALETTE.white}, 0 0 0 4px ${border}`,
              transform: alternating ? 'translateX(-50%)' : 'none',
            }}/>
            <div style={{
              gridColumn: alternating ? (i % 2 === 0 ? '1' : '3') : 'auto',
              textAlign: alternating ? (i % 2 === 0 ? 'right' : 'left') : 'left',
              padding: alternating ? (i % 2 === 0 ? '0 10px 0 0' : '0 0 0 10px') : 0,
            }}>
              <div style={{
                fontFamily:'"JetBrains Mono", monospace',
                fontSize: 11.5, letterSpacing: 1.5, fontWeight: 600,
                color: accent, textTransform:'uppercase', marginBottom: 6,
              }}>{e.period}</div>
              <div style={{
                fontFamily:'"Space Grotesk", sans-serif',
                fontSize: isMobile ? 18 : 20, fontWeight: 600, color: fg,
                letterSpacing: 0,
              }}>{e.title}</div>
              <div style={{ fontSize: 14, color: subtle, marginTop: 4, marginBottom: 10 }}>{e.org}</div>
              <div style={{
                fontSize: isMobile ? 14 : 14.5,
                lineHeight: 1.55,
                color: subtle,
                maxWidth: 440,
                marginLeft: alternating && i % 2 === 0 ? 'auto' : 0,
              }}>{e.body}</div>
            </div>
          </div>
        )})}
      </div>
      </div>
      </div>
    </section>
  );
}

export { SectionHeader, SkillsGrid, SkillsMarquee, FeaturedProjects, Certifications, CertBadge, Experience, PROJECTS, SKILL_GROUPS, SKILLS_ALL, SKILL_CATS, CERTS, CERT_COLORS, EXPERIENCE, ProjectCard };
