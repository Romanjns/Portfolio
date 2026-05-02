import React from 'react';
import { createPortal } from 'react-dom';
import { PALETTE, useViewport, SectionPattern, sectionSurface } from './hero-shared.jsx';

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
    @keyframes rjMarqueeL { from { transform:translateX(0); } to { transform:translateX(-50%); } }
    @keyframes rjMarqueeR { from { transform:translateX(-50%); } to { transform:translateX(0); } }
  `;
  document.head.appendChild(s);
})();

const SKILL_GROUPS = [
  { title:'Cloud',       items:['AWS','Azure','Terraform','Docker','Kubernetes','CloudFormation'] },
  { title:'Security',    items:['Burp Suite','Wireshark','Nmap','Metasploit','OWASP','MITRE ATT&CK'] },
  { title:'Languages',   items:['Python','Bash','Go','TypeScript','SQL','PowerShell'] },
  { title:'Tooling',     items:['Linux','Git','CI/CD','Ansible','Grafana','Splunk'] },
];

const SKILLS_ALL = [
  { name:'AWS',              cat:'Cloud',      projects:['01','04'] },
  { name:'Azure',            cat:'Cloud',      projects:['04'] },
  { name:'Terraform',        cat:'Cloud',      projects:['01','04'] },
  { name:'Docker',           cat:'Cloud',      projects:[] },
  { name:'Kubernetes',       cat:'Cloud',      projects:['04'] },
  { name:'CloudFormation',   cat:'Cloud',      projects:['01'] },
  { name:'Lambda',           cat:'Cloud',      projects:['01'] },
  { name:'CloudWatch',       cat:'Cloud',      projects:['01'] },
  { name:'IAM',              cat:'Cloud',      projects:['01','04'] },
  { name:'S3',               cat:'Cloud',      projects:['01'] },
  { name:'Burp Suite',       cat:'Security',   projects:['02'] },
  { name:'Wireshark',        cat:'Security',   projects:['03'] },
  { name:'Nmap',             cat:'Security',   projects:['05'] },
  { name:'Metasploit',       cat:'Security',   projects:['02'] },
  { name:'OWASP',            cat:'Security',   projects:['02'] },
  { name:'MITRE ATT&CK',cat:'Security',   projects:[] },
  { name:'Wazuh',            cat:'Security',   projects:['03'] },
  { name:'Splunk',           cat:'Security',   projects:['06'] },
  { name:'Kali Linux',       cat:'Security',   projects:['02','05'] },
  { name:'OpenVAS',          cat:'Security',   projects:[] },
  { name:'pfSense',          cat:'Networking', projects:['03'] },
  { name:'VLANs',            cat:'Networking', projects:['03'] },
  { name:'WireGuard',        cat:'Networking', projects:[] },
  { name:'DNS',              cat:'Networking', projects:[] },
  { name:'Subnetting',       cat:'Networking', projects:[] },
  { name:'Zero-trust',       cat:'Networking', projects:['04'] },
  { name:'IPsec',            cat:'Networking', projects:[] },
  { name:'BGP/OSPF',         cat:'Networking', projects:[] },
  { name:'Linux',            cat:'Systems',    projects:['03','05'] },
  { name:'Proxmox',          cat:'Systems',    projects:['03'] },
  { name:'Ansible',          cat:'Systems',    projects:[] },
  { name:'Grafana',          cat:'Systems',    projects:['03'] },
  { name:'PowerShell',       cat:'Systems',    projects:[] },
  { name:'Active Directory', cat:'Systems',    projects:[] },
  { name:'Nginx',            cat:'Systems',    projects:[] },
  { name:'Bash',             cat:'Systems',    projects:['05'] },
  { name:'Python',           cat:'Dev',        projects:['01','05'] },
  { name:'Go',               cat:'Dev',        projects:['05'] },
  { name:'TypeScript',       cat:'Dev',        projects:[] },
  { name:'SQL',              cat:'Dev',        projects:[] },
  { name:'Git',              cat:'Dev',        projects:[] },
  { name:'CI/CD',            cat:'Dev',        projects:['04'] },
  { name:'GitHub Actions',   cat:'Dev',        projects:['04'] },
  { name:'Checkov',          cat:'Dev',        projects:['04'] },
  { name:'tfsec',            cat:'Dev',        projects:['04'] },
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
  const border = dark ? 'rgba(208,59,8,0.13)' : 'rgba(48,88,93,0.14)';
  const bg     = dark ? 'rgba(31,34,36,0.65)' : 'rgba(248,252,253,0.80)';

  const handleEnter = () => {
    if (isMobile) return;
    setHov(true);
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
      style={{
        fontFamily:'"JetBrains Mono", monospace',
        fontSize: isMobile ? 11 : 12,
        padding: isMobile ? '7px 12px' : '7px 15px',
        borderRadius: 99, flexShrink: 0,
        color: hov ? accent : subtle,
        background: hov ? (dark ? `${accent}20` : `${accent}14`) : bg,
        border:`1px solid ${hov ? accent : border}`,
        backdropFilter:'blur(8px)',
        cursor:'default', whiteSpace:'nowrap', userSelect:'none',
        transition:'border-color .15s, color .15s, background .15s',
      }}
    >{skill.name}</div>
  );
}

function MarqueeRow({ skills, direction, paused, accent, dark, onRowEnter, onRowLeave, onChipEnter, onChipLeave }) {
  const items = [...skills, ...skills];
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

  return (
    <section style={{
      position:'relative',
      padding: isMobile ? '64px 0' : isTablet ? '80px 0' : '100px 0 100px',
      overflow:'hidden',
      ...sectionSurface(dark, 0.45),
    }}>
      <SectionPattern dark={dark} accent={accent} variant="dots" opacity={0.38} />
      {/* Header + filter — padded */}
      <div data-rj-reveal style={{ position:'relative', zIndex: 1, padding: isMobile ? '0 5vw' : isTablet ? '0 5vw' : '0 6vw', maxWidth: 1600, margin:'0 auto', marginBottom: isMobile ? 32 : 44 }}>
        <SectionHeader
          eyebrow="02 / Skills"
          title="Tools I reach for."
          subtitle="Opinionated stack. Cloud-native and security-first — with enough breadth to ship end-to-end."
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
    id:'01', tag:'CLOUD · IAC',
    title:'Self-healing AWS VPC with Terraform',
    body:'Multi-AZ VPC, auto-scaling app tier, CloudWatch → Lambda remediation loops. ~40% cost drop over baseline.',
    stack:['AWS','Terraform','Lambda','Python'],
  },
  {
    id:'02', tag:'SECURITY · RESEARCH',
    title:'Web app pentest writeups',
    body:'Documented 12 engagements on intentionally vulnerable targets. IDOR, SSRF, auth flaws, chained exploits.',
    stack:['Burp','OWASP','HTB'],
  },
  {
    id:'03', tag:'HOMELAB · NET',
    title:'Segmented home network + monitoring',
    body:'Proxmox cluster, VLANs for IoT / trusted / guest, Wazuh + Grafana for visibility.',
    stack:['Proxmox','pfSense','Wazuh'],
  },
  {
    id:'04', tag:'AZURE · DEVSECOPS',
    title:'GitHub Actions → Azure pipeline',
    body:'OIDC trust, tfsec + Checkov gates, drift detection. Deploys to AKS with zero long-lived secrets.',
    stack:['Azure','GitHub Actions','Checkov'],
  },
  {
    id:'05', tag:'CTF · TOOLING',
    title:'CTF runner CLI',
    body:'Go CLI that scaffolds challenge dirs, auto-launches nmap/gobuster, and logs to a local notebook.',
    stack:['Go','Linux','Nmap'],
  },
  {
    id:'06', tag:'EDU · CONTENT',
    title:'SOC analyst primer (workshop)',
    body:'Hands-on workshop for juniors — Splunk queries, triage, incident reporting. Ran twice at uni.',
    stack:['Splunk','SIEM','Teaching'],
  },
];

function ProjectCard({ p, accent, dark, large, index = 0 }) {
  const { isMobile, isTablet } = useViewport();
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.65)' : 'rgba(31,34,36,0.75)';
  const border = dark ? 'rgba(248,252,253,0.12)' : 'rgba(31,34,36,0.12)';
  const bg = dark
    ? 'linear-gradient(145deg, rgba(31,34,36,0.78), rgba(31,34,36,0.96))'
    : 'linear-gradient(145deg, rgba(248,252,253,0.92), rgba(248,252,253,0.99))';
  const baseShadow = dark
    ? '0 28px 80px -34px rgba(0,0,0,0.9)'
    : '0 28px 80px -36px rgba(31,34,36,0.32)';
  const hoverShadow = dark
    ? `0 34px 90px -34px rgba(0,0,0,0.95), 0 0 42px -28px ${accent}`
    : `0 34px 90px -38px rgba(31,34,36,0.36), 0 0 42px -30px ${PALETTE.blueDk}`;
  
  return (
    <a href={`projects.html?project=${p.id}`} data-rj-reveal style={{
      '--rj-delay': `${Math.min(index, 5) * 70}ms`,
      display:'flex', flexDirection:'column', gap: 16,
      padding: isMobile ? '22px' : large ? '32px 32px 28px' : '24px 26px 22px',
      borderRadius: 14,
      border: `1px solid ${border}`,
      background: bg,
      backdropFilter:'blur(8px)',
      WebkitBackdropFilter:'blur(8px)',
      textDecoration:'none', color:'inherit',
      transition:'opacity 760ms cubic-bezier(.2,.8,.2,1), transform .28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow .28s, border-color .28s',
      minHeight: isMobile ? 0 : large ? 280 : 220,
      gridColumn: large && !isMobile && !isTablet ? 'span 2' : 'span 1',
      position:'relative',
      overflow:'hidden',
      boxShadow: baseShadow,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
        e.currentTarget.style.boxShadow = hoverShadow;
        e.currentTarget.style.borderColor = dark ? 'rgba(248,252,253,0.22)' : 'rgba(48,88,93,0.24)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = baseShadow;
        e.currentTarget.style.borderColor = border;
      }}>
      <div style={{ 
        position:'absolute', inset: 0,
        background: `
          linear-gradient(135deg, ${accent}15 0%, transparent 34%),
          radial-gradient(circle at 86% 12%, ${PALETTE.blueDk}20, transparent 28%),
          repeating-linear-gradient(135deg, ${dark ? 'rgba(248,252,253,0.045)' : 'rgba(31,34,36,0.045)'} 0 1px, transparent 1px 18px)
        `,
        pointerEvents:'none',
      }}/>
      <div style={{
        position:'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: large && !isMobile ? 6 : 4,
        background: `linear-gradient(180deg, ${PALETTE.blueDk}, ${accent})`,
        opacity: dark ? 0.86 : 0.78,
      }}/>
      <div style={{
        position:'absolute',
        right: isMobile ? 14 : 20,
        bottom: isMobile ? -10 : -18,
        fontFamily:'"Space Grotesk", sans-serif',
        fontSize: isMobile ? 68 : large ? 118 : 86,
        fontWeight: 700,
        lineHeight: 1,
        color: dark ? 'rgba(248,252,253,0.055)' : 'rgba(31,34,36,0.055)',
        pointerEvents:'none',
      }}>{p.id}</div>
      <div style={{
        position:'absolute',
        right: 18,
        top: 18,
        width: isMobile ? 52 : large ? 82 : 64,
        height: isMobile ? 52 : large ? 82 : 64,
        borderRadius: 999,
        border: `1px solid ${dark ? 'rgba(248,252,253,0.08)' : 'rgba(31,34,36,0.09)'}`,
        background: `conic-gradient(from 180deg, ${accent}30, transparent, ${PALETTE.blueDk}35, transparent, ${accent}30)`,
        opacity: 0.9,
        pointerEvents:'none',
      }}/>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:1 }}>
        <span style={{
          fontFamily:'"JetBrains Mono", monospace',
          fontSize: 10.5, letterSpacing: 1.5, fontWeight: 600,
          color: dark ? 'rgba(248,252,253,0.72)' : 'rgba(31,34,36,0.70)', textTransform:'uppercase',
        }}>{p.tag}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={subtle} strokeWidth="1.6" strokeLinecap="round">
          <path d="M5 4h7v7M5 11l7-7"/>
        </svg>
      </div>
      <div style={{
        fontFamily:'"Space Grotesk", sans-serif',
        fontSize: isMobile ? 20 : large ? 26 : 19, fontWeight: 600,
        color: fg, letterSpacing: 0, lineHeight: 1.15,
        position:'relative', zIndex:1,
      }}>{p.title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: subtle, flex: 1, position:'relative', zIndex:1 }}>{p.body}</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap: 6, position:'relative', zIndex:1 }}>
        {p.stack.map(s => (
          <span key={s} style={{
            fontFamily:'"JetBrains Mono", monospace',
            fontSize: 11, padding:'4px 9px', borderRadius: 4,
            background: dark ? 'rgba(248,252,253,0.055)' : 'rgba(31,34,36,0.045)',
            color: dark ? 'rgba(248,252,253,0.72)' : 'rgba(31,34,36,0.70)',
            border: `1px solid ${dark ? 'rgba(248,252,253,0.08)' : 'rgba(31,34,36,0.08)'}`,
            fontWeight: 500,
          }}>{s}</span>
        ))}
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
      ...sectionSurface(dark, 0.62),
    }}>
      <SectionPattern dark={dark} accent={accent} variant="grid" opacity={0.36} />
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
            title="Things I've built."
            subtitle="Six projects spanning cloud infra, offensive security, and tooling. More on the Projects page."
            accent={accent} dark={dark}
          />
          <a href="projects.html" style={{
            flexShrink: 0,
            fontSize: 14, fontWeight: 500, color: accent,
            textDecoration:'none',
            display:'inline-flex', alignItems:'center', gap: 6,
            paddingBottom: 8,
          }}>All projects →</a>
        </div>
        <div style={{
          position:'relative',
          zIndex: 1,
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: isMobile ? 14 : 20,
      }}>
        <ProjectCard p={PROJECTS[0]} accent={accent} dark={dark} large index={0} />
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
  `;
  document.head.appendChild(s);
})();

const CERTS = [
  { name:'Cisco CyberOps Associate',  issuer:'Cisco',               year:'2025', status:'Issued',      abbr:'CCA'   },
  { name:'IELTS Academic English',    issuer:'IELTS',               year:'2025', status:'Issued',      abbr:'IELTS', level:'C1' },
  { name:'AWS Cloud Practitioner',    issuer:'Amazon Web Services', year:'2026', status:'In progress', abbr:'AWS'   },
];

const CERT_COLORS = {
  'Amazon Web Services': '#d03b08',
  'Cisco':               '#1d6fa4',
  'IELTS':               '#c71f37',
  'CompTIA':             '#c01c2c',
  'Microsoft':           '#0078d4',
  'TryHackMe':           '#1a9e5c',
};

function CertBadgeIcon({ cert, accent, dark, size = 88 }) {
  const color = CERT_COLORS[cert.issuer] || accent;
  const isIssued = cert.status === 'Issued';
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  const initials = cert.issuer === 'Amazon Web Services' ? 'AWS'
    : cert.issuer === 'TryHackMe' ? 'THM'
    : cert.issuer.split(' ').slice(0, 2).map(w => w[0]).join('');

  return (
    <div style={{ position:'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ position:'absolute', inset: 0 }}>
        <circle cx={cx} cy={cy} r={r + 10} fill={`${color}09`}/>
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={dark ? 'rgba(248,252,253,0.08)' : 'rgba(31,34,36,0.08)'} strokeWidth="2"/>
        {isIssued ? (
          <>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="2.5"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
              const rad = (angle - 90) * Math.PI / 180;
              return (
                <line key={angle}
                  x1={cx + Math.cos(rad) * (r + 1)} y1={cy + Math.sin(rad) * (r + 1)}
                  x2={cx + Math.cos(rad) * (r + 5)} y2={cy + Math.sin(rad) * (r + 5)}
                  stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
              );
            })}
          </>
        ) : (
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke={accent} strokeWidth="2"
            strokeDasharray={`${circ * 0.65} ${circ * 0.35}`}
            strokeLinecap="round"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              animation: 'rjSpinSlow 9s linear infinite',
            }}/>
        )}
      </svg>
      <div style={{
        position:'absolute', inset: 0,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap: 3,
      }}>
        <div style={{
          fontFamily:'"JetBrains Mono", monospace',
          fontSize: size * 0.165, fontWeight: 700, letterSpacing: 0.5, lineHeight: 1,
          color: isIssued ? color : (dark ? 'rgba(248,252,253,0.5)' : 'rgba(31,34,36,0.5)'),
        }}>{initials}</div>
        {isIssued && (
          <svg width={size * 0.22} height={size * 0.22} viewBox="0 0 16 12" fill="none"
            stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 6l4 4L15 1"/>
          </svg>
        )}
      </div>
    </div>
  );
}

function CertCard({ cert, accent, dark, index, featured }) {
  const { isMobile, isTablet } = useViewport();
  const [hovered, setHovered] = React.useState(false);
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.62)' : 'rgba(31,34,36,0.72)';
  const isIssued = cert.status === 'Issued';
  const color = CERT_COLORS[cert.issuer] || accent;
  const isHorizFeatured = featured && !isMobile && !isTablet;
  const borderColor = hovered
    ? (isIssued ? `${color}66` : `${accent}55`)
    : (dark ? 'rgba(248,252,253,0.10)' : 'rgba(31,34,36,0.12)');

  return (
    <div
      data-rj-reveal
      style={{
        '--rj-delay': `${60 + index * 70}ms`,
        position:'relative',
        borderRadius: 16,
        border: `1px solid ${borderColor}`,
        background: dark
          ? 'linear-gradient(158deg, rgba(31,34,36,0.88), rgba(31,34,36,0.97))'
          : 'linear-gradient(158deg, rgba(248,252,253,0.93), rgba(248,252,253,0.99))',
        backdropFilter:'blur(14px)',
        padding: isHorizFeatured ? '32px 36px' : (isMobile ? '22px' : '26px 28px'),
        overflow:'hidden',
        transition:'transform .28s cubic-bezier(.2,.8,.2,1), box-shadow .28s, border-color .2s',
        transform: hovered ? 'translateY(-5px) scale(1.012)' : 'none',
        boxShadow: hovered
          ? (isIssued
            ? `0 28px 64px -22px ${color}44, 0 0 0 1px ${color}1a`
            : `0 28px 64px -22px ${accent}33, 0 0 0 1px ${accent}1a`)
          : (dark ? '0 6px 28px -10px rgba(0,0,0,0.55)' : '0 6px 28px -10px rgba(31,34,36,0.15)'),
        gridColumn: isHorizFeatured ? 'span 2' : 'span 1',
        cursor:'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Decorative radial glow + crosshatch */}
      <div style={{
        position:'absolute', inset: 0, pointerEvents:'none',
        backgroundImage: `
          radial-gradient(circle at 90% 10%, ${color}1c, transparent 38%),
          repeating-linear-gradient(135deg,
            ${dark ? 'rgba(248,252,253,0.028)' : 'rgba(31,34,36,0.028)'} 0 1px,
            transparent 1px 20px)
        `,
      }}/>
      {/* Top accent stripe */}
      <div style={{
        position:'absolute', top: 0, left: 0, right: 0, height: 3,
        background: isIssued
          ? `linear-gradient(90deg, ${color}, ${PALETTE.blueDk})`
          : `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`,
        backgroundSize: isIssued ? '100% 100%' : '200% 100%',
        animation: isIssued ? 'none' : 'rjShimmer 2.4s ease-in-out infinite',
      }}/>
      {/* Ghost watermark number */}
      <div style={{
        position:'absolute', right: isHorizFeatured ? 28 : 16, bottom: isHorizFeatured ? -8 : -14,
        fontFamily:'"Space Grotesk", sans-serif',
        fontSize: isHorizFeatured ? 110 : 80, fontWeight: 700, lineHeight: 1,
        color: dark ? 'rgba(248,252,253,0.035)' : 'rgba(31,34,36,0.04)',
        pointerEvents:'none', userSelect:'none',
      }}>{String(index + 1).padStart(2, '0')}</div>

      <div style={{
        position:'relative', zIndex: 1,
        display:'flex',
        flexDirection: isHorizFeatured ? 'row' : 'column',
        gap: isHorizFeatured ? 28 : 18,
        alignItems: isHorizFeatured ? 'center' : 'flex-start',
      }}>
        <CertBadgeIcon cert={cert} accent={accent} dark={dark}
          size={isHorizFeatured ? 104 : isMobile ? 76 : 84}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 10, flexWrap:'wrap' }}>
            <span style={{
              fontFamily:'"JetBrains Mono", monospace',
              fontSize: 9.5, letterSpacing: 1.4, fontWeight: 700, textTransform:'uppercase',
              color: isIssued ? color : accent,
              padding:'3px 8px', borderRadius: 99,
              border: `1px solid ${isIssued ? color + '3a' : accent + '3a'}`,
              background: isIssued ? color + '0e' : accent + '0e',
            }}>{cert.status}</span>
            <span style={{
              fontFamily:'"JetBrains Mono", monospace',
              fontSize: 11, color: subtle,
            }}>{cert.year}</span>
          </div>
          <div style={{
            fontFamily:'"Space Grotesk", sans-serif',
            fontSize: isHorizFeatured ? 22 : (isMobile ? 16 : 17),
            fontWeight: 700, color: fg, lineHeight: 1.2, marginBottom: 6,
          }}>{cert.name}</div>
          <div style={{ fontSize: 13, color: subtle }}>{cert.issuer}</div>
          {!isIssued && (
            <div style={{ marginTop: 14 }}>
              <div style={{
                height: 3, borderRadius: 99,
                background: dark ? 'rgba(248,252,253,0.08)' : 'rgba(31,34,36,0.08)',
                overflow:'hidden',
              }}>
                <div style={{
                  height:'100%', width:'65%',
                  background: `linear-gradient(90deg, ${accent}, ${PALETTE.blueDk})`,
                  borderRadius: 99,
                  backgroundSize:'200% 100%',
                  animation:'rjShimmer 2.4s ease-in-out infinite',
                }}/>
              </div>
              <div style={{
                marginTop: 5, fontSize: 10.5,
                fontFamily:'"JetBrains Mono", monospace',
                color: subtle, opacity: 0.8,
              }}>in progress · ~65%</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CertBadge({ cert, accent, dark, index }) {
  const { isMobile } = useViewport();
  const [hovered, setHovered] = React.useState(false);
  const isIssued = cert.status === 'Issued';
  const color    = CERT_COLORS[cert.issuer] || accent;
  const fg       = dark ? PALETTE.white : PALETTE.indigo;
  const subtle   = dark ? 'rgba(248,252,253,0.60)' : 'rgba(31,34,36,0.68)';

  const sz     = isMobile ? 130 : 160;
  const cx     = sz / 2;
  const cy     = sz / 2;
  const ringR  = sz * 0.455;   // outer decorative circle radius
  const hexR   = sz * 0.375;   // hex vertex radius

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
      : `drop-shadow(0 3px 14px rgba(0,0,0,0.32))`;

  return (
    <div
      data-rj-reveal
      style={{
        '--rj-delay': `${60 + index * 90}ms`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 20, cursor: 'default',
        width: isMobile ? 158 : 194,
        transition: 'transform .30s cubic-bezier(.2,.8,.2,1)',
        transform: hovered ? 'translateY(-10px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* overflow:visible lets the drop-shadow bleed past the SVG box */}
      <div style={{ width: sz, height: sz, flexShrink: 0, filter: shadow, transition: 'filter .30s' }}>
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ overflow: 'visible' }}>
          <defs>
            {/* 3-stop gradient: specular flash → flat color → dark underside */}
            <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
              {isIssued ? (
                <>
                  <stop offset="0%"   stopColor="rgba(255,255,255,0.60)"/>
                  <stop offset="13%"  stopColor={color}/>
                  <stop offset="62%"  stopColor={color} stopOpacity="0.90"/>
                  <stop offset="100%" stopColor="rgba(0,0,0,0.44)"/>
                </>
              ) : (
                <>
                  <stop offset="0%"   stopColor={dark ? '#3d4348' : '#d2dde6'}/>
                  <stop offset="100%" stopColor={dark ? '#12161a' : '#a4b6c2'}/>
                </>
              )}
            </linearGradient>
            {/* Dome-gloss radial: bright top-left specular highlight */}
            <radialGradient id={shineId} cx="28%" cy="17%" r="55%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.58)"/>
              <stop offset="44%"  stopColor="rgba(255,255,255,0.10)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </radialGradient>
          </defs>

          {/* ── Outer decorative ring ── */}
          <circle cx={cx} cy={cy} r={ringR}
            fill="none"
            stroke={isIssued ? color : (dark ? 'rgba(248,252,253,0.16)' : 'rgba(31,34,36,0.14)')}
            strokeWidth={isIssued ? 1.2 : 0.8}
            opacity={0.72}
          />
          {/* Tick marks radiating outward (issued badges) */}
          {ticks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={color} strokeWidth={t.w} strokeLinecap="round" opacity={t.op}/>
          ))}
          {/* Spinning dashed arc (in-progress) */}
          {!isIssued && (
            <circle cx={cx} cy={cy} r={ringR - 1}
              fill="none" stroke={accent} strokeWidth="1.5"
              strokeDasharray={`${2 * Math.PI * (ringR - 1) * 0.55} ${2 * Math.PI * (ringR - 1) * 0.45}`}
              strokeLinecap="round"
              style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'rjSpinSlow 9s linear infinite', opacity: 0.55 }}
            />
          )}

          {/* ── Hex glow halo (slightly oversized, faint) ── */}
          <polygon points={hexPts(hexR + 6)}
            fill={isIssued ? `${color}1c` : (dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')}
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
          color: isIssued ? color : accent,
          padding: '3px 12px', borderRadius: 99,
          border: `1px solid ${isIssued ? color + '55' : accent + '44'}`,
          background: isIssued ? color + '16' : accent + '10',
        }}>{isIssued ? `✓ ${cert.year}` : 'In progress'}</span>
      </div>
    </div>
  );
}

function Certifications({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const { accent, dark } = tw;

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      ...sectionSurface(dark, 0.5),
    }}>
      <SectionPattern dark={dark} accent={accent} variant="diagonal" opacity={0.34} />
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
            subtitle="Earned and in progress — cloud, security, and language."
            accent={accent} dark={dark} align="center"
          />
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: isMobile ? 32 : 48,
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: isMobile ? 8 : 20,
        }}>
          {CERTS.map((c, i) => (
            <CertBadge key={c.name} cert={c} accent={accent} dark={dark} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Experience timeline ──────────────────────────────────────
const EXPERIENCE = [
  {
    period:'2024 — present',
    title:'BSc Cybersecurity & Cloud',
    org:'Fontys University of Applied Sciences',
    body:'Final year. Focus areas: cloud architecture, offensive security, zero-trust networking.',
  },
  {
    period:'Summer 2025',
    title:'IT Intern · Cloud Operations',
    org:'Regional logistics company',
    body:'Migrated on-prem workloads to Azure. Wrote Terraform modules used across three production environments.',
  },
  {
    period:'2024',
    title:'Volunteer · CTF Club',
    org:'Student society',
    body:'Organized monthly CTFs, mentored first-years, authored three web-exploitation challenges.',
  },
  {
    period:'2023',
    title:'Helpdesk · Part-time',
    org:'Local SMB',
    body:'Tier-1 support, Active Directory hygiene, endpoint rollouts. Learned how real users break things.',
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
      padding: isMobile ? '64px 5vw' : isTablet ? '80px 5vw' : '100px 6vw 88px',
      ...sectionSurface(dark, 0.42),
    }}>
      <div style={{ maxWidth: 1600, margin:'0 auto' }}>
      <SectionPattern dark={dark} accent={accent} variant="dots" opacity={0.32} />
      <div style={{ position:'relative', zIndex: 1 }}>
        <div data-rj-reveal style={{
          textAlign: alternating ? 'center' : 'left',
          maxWidth: alternating ? 780 : 'none',
          margin: alternating ? '0 auto' : 0,
        }}>
          <SectionHeader
            eyebrow="05 / Experience"
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
        {EXPERIENCE.map((e, i) => (
          <div key={i} data-rj-reveal={alternating ? (i % 2 === 0 ? 'left' : 'right') : true} style={{
            '--rj-delay': `${80 + i * 70}ms`,
            position:'relative',
            paddingBottom: i === EXPERIENCE.length - 1 ? 0 : 48,
            display: alternating ? 'grid' : 'block',
            gridTemplateColumns: alternating ? '1fr 80px 1fr' : 'none',
            alignItems:'start',
          }}>
            <div style={{
              position:'absolute',
              left: alternating ? '50%' : isMobile ? -23 : -29,
              top: 4,
              width: 10, height: 10, borderRadius: 5,
              background: accent, boxShadow: `0 0 0 3px ${dark ? PALETTE.indigo : PALETTE.white}, 0 0 0 4px ${border}`,
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
        ))}
      </div>
      </div>
      </div>
    </section>
  );
}

export { SectionHeader, SkillsGrid, SkillsMarquee, FeaturedProjects, Certifications, CertBadge, CertCard, CertBadgeIcon, Experience, PROJECTS, SKILL_GROUPS, SKILLS_ALL, SKILL_CATS, CERTS, CERT_COLORS, EXPERIENCE, ProjectCard };
