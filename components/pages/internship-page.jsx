import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  PALETTE,
  useViewport,
  globalNoiseTexture,
  getSectionBackgroundTone,
  getSectionTopAccent,
  sectionFade,
  SectionPattern,
} from '../shared/hero-shared.jsx';
import { PageShell } from '../shared/shared-chrome.jsx';
import { useTweaks } from '../shared/use-tweaks.jsx';
import { SectionHeader } from '../shared/landing-sections.jsx';

const COMPANY_LOGO = null;

// Set `logo` to a real asset path when ready, for example: 'assets/images/logos/docker.svg'.
const TECHNOLOGIES = [
  {
    name: 'Docker',
    purpose: 'Containerized deployment',
    logo: null,
    abbr: 'DK',
    role: 'Docker was the base deployment model for internal services on the UGREEN NAS. It made each platform easier to restart, move, document, and maintain.',
    focus: ['Compose based service definitions', 'Persistent volumes under the Docker root', 'Repeatable deployment and recovery steps'],
  },
  {
    name: 'Caddy',
    purpose: 'HTTPS reverse proxy',
    logo: null,
    abbr: 'CD',
    role: 'Caddy sat in front of the internal web services and handled clean routing with HTTPS. This improved the user-facing access pattern and removed direct port based usage.',
    focus: ['Reverse proxy routes', 'HTTPS configuration', 'Readable internal service URLs'],
  },
  {
    name: 'Authentik',
    purpose: 'SSO and identity management',
    logo: null,
    abbr: 'AK',
    role: 'Authentik provided the identity layer for the environment. It centralized login through OAuth2 and OpenID Connect and created a foundation for future single sign-on.',
    focus: ['OAuth2 and OIDC', 'Central user management', 'Future MFA and access policy expansion'],
  },
  {
    name: 'Federated Wiki',
    purpose: 'Internal knowledge platform',
    logo: null,
    abbr: 'FW',
    role: 'Federated Wiki became the main knowledge-sharing service. It was deployed as a Dockerized internal platform with authentication, persistent data, and handoff documentation.',
    focus: ['Wiki farm configuration', 'Persistent wiki data', 'Authenticated internal access'],
  },
  {
    name: 'Piwigo',
    purpose: 'Media library service',
    logo: null,
    abbr: 'PW',
    role: 'Piwigo was prepared as a structured media management platform for internal projects and event material. The work focused on deployment readiness and maintainability.',
    focus: ['Media library setup', 'NAS hosted storage', 'Future internal use preparation'],
  },
  {
    name: 'Kubernetes',
    purpose: 'Future orchestration track',
    logo: null,
    abbr: 'K8S',
    role: 'Kubernetes was researched as the next step for larger multi-service applications. The goal was to understand whether orchestration would fit future self-hosted collaboration platforms.',
    focus: ['Deployments and services', 'Scaling and restart behavior', 'Future Hubs hosting research'],
  },
  {
    name: 'Linux',
    purpose: 'Host and service operations',
    logo: null,
    abbr: 'LX',
    role: 'Linux skills were used across host configuration, DNS work, service inspection, SSH operations, logs, paths, and troubleshooting on NAS and alternative hardware.',
    focus: ['Host level troubleshooting', 'Service logs and shell access', 'DNS and configuration files'],
  },
  {
    name: 'Tailscale',
    purpose: 'Private connectivity testing',
    logo: null,
    abbr: 'TS',
    role: 'Tailscale and VPN testing helped validate remote access and DNS behavior. It was part of making the services reachable without exposing internal systems publicly.',
    focus: ['Private network access', 'DNS behavior testing', 'Connectivity troubleshooting'],
  },
];

const OUTCOMES = [
  { label: 'Federated Wiki deployed', state: 'Complete' },
  { label: 'HTTPS configured through Caddy', state: 'Complete' },
  { label: 'Internal DNS working', state: 'Complete' },
  { label: 'Authentik integrated', state: 'Complete' },
  { label: 'Dockerized services documented', state: 'Complete' },
  { label: 'Piwigo prepared for media workflows', state: 'Ready' },
  { label: 'Tailscale access tested', state: 'Validated' },
  { label: 'Kubernetes research started', state: 'Prepared' },
];

const METRICS = [
  { value: '13', label: 'weeks', detail: 'Structured project, delivery, and handoff period' },
  { value: '3+', label: 'services', detail: 'Federated Wiki, Authentik, Piwigo, plus supporting systems' },
  { value: 'SSO', label: 'identity', detail: 'Centralized access model for internal tools' },
  { value: 'NAS', label: 'platform', detail: 'Dockerized infrastructure on UGREEN hardware' },
];

const DOCUMENTS = [
  {
    label: 'Project Plan',
    short: 'Scope',
    description: 'Approved internship scope, objectives, planning, team context, and business value.',
    href: 'assets/files/ProjectPlan-Internship-Italie.docx',
    icon: 'plan',
    rotate: -15,
  },
  {
    label: 'Realizations',
    short: 'Build',
    description: 'Technical realizations document covering analysis, implementation work, testing, and conclusions.',
    href: 'assets/files/realization-internship.docx',
    icon: 'realization',
    rotate: 4,
  },
  {
    label: 'Reflection',
    short: 'Reflect',
    description: 'Personal reflection on the internship process, learning outcomes, teamwork, and professional growth.',
    href: 'assets/files/reflection-internship.docx',
    icon: 'reflection',
    rotate: 16,
  },
];

function useInternshipStyles() {
  React.useEffect(() => {
    if (document.getElementById('rj-internship-css')) return;
    const style = document.createElement('style');
    style.id = 'rj-internship-css';
    style.textContent = `
      @keyframes rjNodePulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(208,59,8,0.18), 0 20px 60px -34px rgba(0,0,0,0.72); }
        50% { box-shadow: 0 0 0 7px rgba(208,59,8,0.04), 0 24px 70px -30px rgba(0,0,0,0.72); }
      }
      @keyframes rjFlowLine {
        from { transform: translateY(-60%); opacity: 0; }
        22% { opacity: 1; }
        to { transform: translateY(150%); opacity: 0; }
      }
      @keyframes rjGridFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-7px); }
      }
      @keyframes rjScan {
        from { transform: translateX(-120%); }
        to { transform: translateX(120%); }
      }
      .rj-tech-card {
        transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
      }
      .rj-tech-card:hover {
        transform: translateY(-4px);
      }
      .rj-dashboard-scan::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.11), transparent);
        animation: rjScan 4.8s ease-in-out infinite;
        pointer-events: none;
      }
      .rj-docs-stack {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 306px;
        padding: 34px 0 18px;
        min-width: 0;
        overflow: visible;
      }
      .rj-doc-glass {
        position: relative;
        width: 214px;
        height: 248px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 14px;
        margin: 0 12px;
        border-radius: 14px;
        text-decoration: none;
        color: var(--docText);
        border: 1px solid var(--docBorder);
        background: linear-gradient(165deg, var(--docGlow), transparent 72%);
        box-shadow: 0 25px 35px rgba(0, 0, 0, 0.18);
        backdrop-filter: blur(14px) saturate(145%);
        -webkit-backdrop-filter: blur(14px) saturate(145%);
        transform: rotate(calc(var(--r) * 1deg));
        transition: transform 0.45s cubic-bezier(.2,.8,.2,1), border-color 0.2s ease, box-shadow 0.2s ease;
        overflow: hidden;
      }
      .rj-doc-glass:nth-child(1) {
        transform: translateX(86px) rotate(calc(var(--r) * 1deg));
        z-index: 1;
      }
      .rj-doc-glass:nth-child(2) {
        z-index: 2;
      }
      .rj-doc-glass:nth-child(3) {
        transform: translateX(-86px) rotate(calc(var(--r) * 1deg));
        z-index: 1;
      }
      .rj-doc-glass::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 46px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--docText);
        background: var(--docFooter);
        font-family: "JetBrains Mono", monospace;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.3px;
        text-transform: uppercase;
      }
      .rj-doc-glass::after {
        content: "";
        position: absolute;
        inset: -35% -55%;
        background: linear-gradient(110deg, transparent 36%, rgba(255,255,255,0.16) 48%, transparent 60%);
        transform: translateX(-55%);
        opacity: 0;
        transition: transform 0.55s ease, opacity 0.18s ease;
        pointer-events: none;
      }
      .rj-docs-stack:hover .rj-doc-glass {
        transform: rotate(0deg) translateY(-6px);
      }
      .rj-doc-glass:hover {
        border-color: var(--docAccent);
        box-shadow: 0 28px 48px rgba(0, 0, 0, 0.24), 0 0 40px var(--docAccentGlow);
        z-index: 3;
      }
      .rj-doc-glass:hover::after {
        opacity: 1;
        transform: translateX(55%);
      }
      @media (max-width: 720px) {
        .rj-docs-stack {
          flex-direction: column;
          min-height: auto;
          gap: 14px;
          padding: 4px 0 0;
        }
        .rj-doc-glass,
        .rj-doc-glass:nth-child(1),
        .rj-doc-glass:nth-child(3),
        .rj-docs-stack:hover .rj-doc-glass {
          width: min(100%, 320px);
          height: 176px;
          margin: 0;
          transform: none;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .rj-flow-dot,
        .rj-tech-float,
        .rj-dashboard-scan::after,
        .rj-doc-glass,
        .rj-doc-glass::after {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);
}

function colors(dark, accent = PALETTE.blue) {
  return {
    fg: dark ? PALETTE.white : PALETTE.indigo,
    subtle: dark ? 'rgba(248,252,253,0.70)' : 'rgba(31,34,36,0.72)',
    muted: dark ? 'rgba(248,252,253,0.52)' : 'rgba(31,34,36,0.55)',
    border: dark ? 'rgba(248,252,253,0.11)' : 'rgba(31,34,36,0.11)',
    strongBorder: dark ? 'rgba(208,59,8,0.28)' : 'rgba(48,88,93,0.24)',
    panel: dark
      ? 'linear-gradient(160deg, rgba(42,56,58,0.82), rgba(24,28,29,0.92))'
      : 'linear-gradient(160deg, rgba(255,255,255,0.82), rgba(239,248,247,0.72))',
    panelSoft: dark ? 'rgba(248,252,253,0.045)' : 'rgba(255,255,255,0.58)',
    accent,
    teal: PALETTE.blueDk,
  };
}

function ShellSection({ index, tw, children, minHeight = '100vh', padTop, padBottom }) {
  const { isMobile, isTablet } = useViewport();
  const top = isMobile ? (padTop || 88) : isTablet ? (padTop || 104) : (padTop || 118);
  const bottom = isMobile ? (padBottom || 74) : isTablet ? (padBottom || 92) : (padBottom || 110);
  const padding = isMobile
    ? `${top}px 5vw ${bottom}px`
    : isTablet
      ? `${top}px 5vw ${bottom}px`
      : `${top}px 6vw ${bottom}px`;

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      minHeight,
      padding,
      background: getSectionBackgroundTone(index, tw.dark),
      ...globalNoiseTexture(tw.dark),
    }}>
      {getSectionTopAccent(index, tw.dark) && <div style={getSectionTopAccent(index, tw.dark)} />}
      <SectionPattern dark={tw.dark} accent={tw.accent} variant={index === 2 ? 'dots' : 'grid'} opacity={0.72} />
      <div style={sectionFade('both', tw.dark)} />
      <div style={{ maxWidth: 1500, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

function InternshipHeroCard({ tw, reveal = true }) {
  const { isMobile } = useViewport();
  const c = colors(tw.dark, tw.accent);

  return (
    <div data-rj-reveal={reveal ? 'right' : undefined} style={{
      '--rj-delay': '120ms',
      marginTop: reveal ? 0 : 30,
      maxWidth: 560,
      position: 'relative',
      marginLeft: reveal ? 'auto' : 0,
      marginRight: reveal ? 'auto' : 0,
    }}>
      <div style={{
        position: 'absolute',
        top: -12,
        right: -12,
        width: 68,
        height: 68,
        borderTop: `2px solid ${c.accent}`,
        borderRight: `2px solid ${c.accent}`,
        borderRadius: '0 12px 0 0',
        opacity: 0.62,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -12,
        left: -12,
        width: 68,
        height: 68,
        borderBottom: `2px solid ${c.teal}`,
        borderLeft: `2px solid ${c.teal}`,
        borderRadius: '0 0 0 12px',
        opacity: 0.44,
        pointerEvents: 'none',
      }} />

      <div style={{
        padding: isMobile ? '22px 18px' : '30px 28px',
        minHeight: isMobile ? 348 : 390,
        borderRadius: 18,
        border: `1px solid ${c.strongBorder}`,
        background: tw.dark
          ? 'linear-gradient(160deg, rgba(48,88,93,0.22), rgba(31,34,36,0.94))'
          : 'linear-gradient(160deg, rgba(255,255,255,0.94), rgba(239,248,247,0.78))',
        backdropFilter: 'blur(20px) saturate(145%)',
        WebkitBackdropFilter: 'blur(20px) saturate(145%)',
        boxShadow: tw.dark
          ? '0 34px 90px -46px rgba(0,0,0,0.82), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 34px 90px -48px rgba(48,88,93,0.28), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}>
        <div style={{
          minHeight: isMobile ? 122 : 148,
          borderRadius: 15,
          border: `1px solid ${c.border}`,
          background: tw.dark
            ? 'linear-gradient(135deg, rgba(208,59,8,0.15), rgba(48,88,93,0.20))'
            : 'linear-gradient(135deg, rgba(208,59,8,0.09), rgba(48,88,93,0.11))',
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 24,
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle, ${tw.dark ? 'rgba(248,252,253,0.08)' : 'rgba(31,34,36,0.08)'} 1px, transparent 1.5px)`,
            backgroundSize: '15px 15px',
            opacity: 0.72,
          }} />
          {COMPANY_LOGO ? (
            <img
              src={COMPANY_LOGO}
              alt="CrHackLab logo"
              style={{
                position: 'relative',
                width: isMobile ? '76%' : '70%',
                maxHeight: isMobile ? 92 : 112,
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <div style={{
              position: 'relative',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: isMobile ? 34 : 46,
              lineHeight: 1,
              fontWeight: 850,
              color: c.accent,
              letterSpacing: 0,
              textAlign: 'center',
            }}>CrHackLab</div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 18,
          alignItems: 'start',
          marginBottom: 22,
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: 1.8,
              fontWeight: 700,
              color: c.accent,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>Internship profile</div>
            <div style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: isMobile ? 22 : 26,
              lineHeight: 1.08,
              fontWeight: 800,
              color: c.fg,
              marginBottom: 8,
            }}>CrHackLab</div>
            <div style={{
              fontSize: 14.5,
              lineHeight: 1.5,
              color: c.subtle,
              maxWidth: 360,
            }}>Foligno, Italy. Internal services, NAS operations, documentation, and secure access.</div>
          </div>
        </div>

        <div style={{
          height: 1,
          background: c.border,
          marginBottom: 24,
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
          gap: isMobile ? 14 : 18,
        }}>
          {[
            ['Role', 'Infrastructure intern'],
            ['Duration', '13 weeks'],
            ['Platform', 'UGREEN NAS'],
            ['Domain', 'Internal infrastructure'],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9.5,
                letterSpacing: 1,
                fontWeight: 700,
                color: c.muted,
                textTransform: 'uppercase',
                marginBottom: 5,
              }}>{label}</div>
              <div style={{
                fontSize: 13.2,
                lineHeight: 1.3,
                fontWeight: 750,
                color: c.fg,
              }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssignmentSection({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const c = colors(tw.dark, tw.accent);

  return (
    <ShellSection
      index={0}
      tw={tw}
      minHeight="100svh"
      padTop={isMobile ? 92 : isTablet ? 102 : 108}
      padBottom={isMobile ? 54 : isTablet ? 64 : 68}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '0.95fr 1.05fr',
        gap: isMobile ? 32 : isTablet ? 42 : 68,
        alignItems: 'center',
      }}>
        <div data-rj-reveal="left">
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: c.accent,
            marginBottom: 18,
          }}>01 / The assignment</div>
          <h1 style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: isMobile ? 36 : isTablet ? 48 : 64,
            lineHeight: 1.02,
            fontWeight: 800,
            letterSpacing: 0,
            color: c.fg,
            margin: '0 0 22px',
            maxWidth: 720,
          }}>
            Internal services for CrHackLab.
          </h1>
          <p style={{
            fontSize: isMobile ? 15.5 : 17.5,
            lineHeight: 1.66,
            color: c.subtle,
            maxWidth: 650,
            margin: '0 0 18px',
          }}>
            During my internship at CrHackLab in Foligno, Italy, I worked on internal infrastructure used by a non-profit education and innovation environment. The project focused on deploying and managing reliable services before the C.R.E.A. Cultura Festival.
          </p>
          <p style={{
            fontSize: isMobile ? 15.5 : 17.5,
            lineHeight: 1.66,
            color: c.subtle,
            maxWidth: 650,
            margin: 0,
          }}>
            The assignment centered on Dockerized services running on a UGREEN NAS, with maintainable documentation, secure access, readable internal names, and a clear operations handoff for future interns and team members.
          </p>
        </div>
        <InternshipHeroCard tw={tw} />
      </div>
    </ShellSection>
  );
}

function TechLogo({ tech, tw, size = 46 }) {
  const c = colors(tw.dark, tw.accent);

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: Math.max(12, Math.round(size * 0.28)),
      border: `1px solid ${c.strongBorder}`,
      background: tw.dark ? 'rgba(248,252,253,0.055)' : 'rgba(255,255,255,0.64)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {tech.logo ? (
        <img
          src={tech.logo}
          alt={`${tech.name} logo`}
          style={{
            width: '70%',
            height: '70%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : (
        <span style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: tech.abbr.length > 2 ? Math.round(size * 0.23) : Math.round(size * 0.28),
          fontWeight: 850,
          color: c.accent,
          letterSpacing: 0,
        }}>{tech.abbr}</span>
      )}
    </div>
  );
}

function TechCard({ tech, tw, selected, onSelect }) {
  const { isMobile } = useViewport();
  const c = colors(tw.dark, tw.accent);
  return (
    <button
      type="button"
      className="rj-tech-card"
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        width: '100%',
        minHeight: isMobile ? 128 : 144,
        padding: isMobile ? 15 : 17,
        borderRadius: 15,
        textAlign: 'left',
        cursor: 'pointer',
        color: 'inherit',
        border: `1px solid ${selected ? c.accent : c.border}`,
        background: selected
          ? tw.dark
            ? 'linear-gradient(145deg, rgba(208,59,8,0.18), rgba(48,88,93,0.14))'
            : 'linear-gradient(145deg, rgba(208,59,8,0.11), rgba(255,255,255,0.78))'
          : tw.dark
            ? 'linear-gradient(145deg, rgba(248,252,253,0.075), rgba(248,252,253,0.025))'
            : 'linear-gradient(145deg, rgba(255,255,255,0.86), rgba(255,255,255,0.48))',
        boxShadow: selected
          ? tw.dark
            ? '0 28px 70px -34px rgba(208,59,8,0.62), 0 0 0 1px rgba(208,59,8,0.16) inset'
            : '0 28px 70px -38px rgba(208,59,8,0.42), 0 0 0 1px rgba(208,59,8,0.10) inset'
          : tw.dark
            ? '0 22px 60px -42px rgba(0,0,0,0.82)'
            : '0 22px 60px -46px rgba(48,88,93,0.30)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <div style={{ marginBottom: 15 }}>
        <TechLogo tech={tech} tw={tw} size={46} />
      </div>
      <div style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: 18,
        fontWeight: 700,
        color: c.fg,
        marginBottom: 6,
      }}>{tech.name}</div>
      <div style={{
        fontSize: 13.5,
        lineHeight: 1.45,
        color: c.subtle,
      }}>{tech.purpose}</div>
    </button>
  );
}

function StackCarousel({ tw, selectedTech, onSelect }) {
  const { isMobile } = useViewport();
  const c = colors(tw.dark, tw.accent);

  return (
    <div data-rj-reveal="left" style={{
      position: 'relative',
      padding: isMobile ? '22px 0' : '28px 0',
      borderRadius: 18,
      border: `1px solid ${c.strongBorder}`,
      background: tw.dark
        ? 'linear-gradient(160deg, rgba(42,56,58,0.52), rgba(24,28,29,0.78))'
        : 'linear-gradient(160deg, rgba(255,255,255,0.62), rgba(239,248,247,0.54))',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: isMobile ? '0 18px 20px' : '0 24px 24px',
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            color: c.accent,
            fontSize: 10.5,
            letterSpacing: 1.8,
            textTransform: 'uppercase',
            fontWeight: 800,
            marginBottom: 7,
          }}>DevOps stack</div>
          <div style={{
            fontFamily: '"Space Grotesk", sans-serif',
            color: c.fg,
            fontSize: isMobile ? 22 : 27,
            fontWeight: 800,
            lineHeight: 1.1,
          }}>All layers visible.</div>
        </div>
        <div style={{
          display: isMobile ? 'none' : 'block',
          fontFamily: '"JetBrains Mono", monospace',
          color: c.muted,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          border: `1px solid ${c.border}`,
          borderRadius: 999,
          padding: '7px 10px',
          background: c.panelSoft,
        }}>click to select</div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
        gap: isMobile ? 12 : 14,
        padding: isMobile ? '0 18px' : '0 24px',
      }}>
        {TECHNOLOGIES.map((tech) => (
          <TechCard
            key={tech.name}
            tech={tech}
            tw={tw}
            selected={tech.name === selectedTech.name}
            onSelect={() => onSelect(tech)}
          />
        ))}
      </div>

      <div style={{
        margin: isMobile ? '20px 18px 0' : '24px 24px 0',
        height: 2,
        borderRadius: 99,
        background: `linear-gradient(90deg, transparent, ${c.accent}, ${c.teal}, transparent)`,
        opacity: 0.72,
      }} />
    </div>
  );
}

function ImplementationText({ tw, selectedTech }) {
  const { isMobile } = useViewport();
  const c = colors(tw.dark, tw.accent);

  return (
    <div key={selectedTech.name} data-rj-reveal="right" style={{
      padding: isMobile ? 22 : 30,
      borderRadius: 18,
      border: `1px solid ${c.strongBorder}`,
      background: c.panel,
      backdropFilter: 'blur(22px) saturate(145%)',
      WebkitBackdropFilter: 'blur(22px) saturate(145%)',
      boxShadow: tw.dark ? '0 32px 92px -44px rgba(0,0,0,0.86)' : '0 32px 92px -46px rgba(48,88,93,0.30)',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10.5,
        letterSpacing: 1.8,
        color: c.accent,
        textTransform: 'uppercase',
        fontWeight: 700,
        marginBottom: 16,
      }}>Selected layer</div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 18,
      }}>
        <div style={{
          boxShadow: tw.dark ? '0 0 32px rgba(208,59,8,0.18)' : '0 0 28px rgba(208,59,8,0.12)',
        }}>
          <TechLogo tech={selectedTech} tw={tw} size={54} />
        </div>
        <div>
          <div style={{
            fontFamily: '"Space Grotesk", sans-serif',
            color: c.fg,
            fontSize: isMobile ? 25 : 31,
            fontWeight: 850,
            lineHeight: 1.05,
          }}>{selectedTech.name}</div>
          <div style={{
            color: c.subtle,
            fontSize: 14,
            marginTop: 5,
          }}>{selectedTech.purpose}</div>
        </div>
      </div>
      <h2 style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: isMobile ? 24 : 32,
        lineHeight: 1.08,
        color: c.fg,
        margin: '0 0 16px',
      }}>
        How it supported the internship infrastructure.
      </h2>
      <p style={{
        fontSize: isMobile ? 14.5 : 16,
        lineHeight: 1.68,
        color: c.subtle,
        margin: '0 0 22px',
      }}>
        {selectedTech.role}
      </p>
      <div style={{ display: 'grid', gap: 12 }}>
        {selectedTech.focus.map((point, index) => (
          <div key={point} style={{
            display: 'grid',
            gridTemplateColumns: '28px 1fr',
            gap: 12,
            alignItems: 'start',
            padding: '12px 0',
            borderTop: index === 0 ? 'none' : `1px solid ${c.border}`,
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              border: `1px solid ${c.strongBorder}`,
              color: c.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              fontWeight: 800,
              background: tw.dark ? 'rgba(208,59,8,0.08)' : 'rgba(208,59,8,0.06)',
            }}>{String(index + 1).padStart(2, '0')}</div>
            <div style={{ color: c.subtle, fontSize: isMobile ? 13.8 : 14.8, lineHeight: 1.58 }}>{point}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechnologiesSection({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const [selectedTech, setSelectedTech] = React.useState(TECHNOLOGIES[0]);

  return (
    <ShellSection index={1} tw={tw}>
      <div data-rj-reveal>
        <SectionHeader
          eyebrow="02 / Implementation and technologies"
          title="A practical DevOps stack for internal services."
          subtitle="The implementation combined container operations, secure routing, identity, internal DNS, testing, and Kubernetes preparation."
          accent={tw.accent}
          dark={tw.dark}
        />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '1.06fr 0.94fr',
        gap: isMobile ? 36 : isTablet ? 44 : 68,
        alignItems: 'center',
      }}>
        <StackCarousel tw={tw} selectedTech={selectedTech} onSelect={setSelectedTech} />
        <ImplementationText tw={tw} selectedTech={selectedTech} />
      </div>
    </ShellSection>
  );
}

function MetricCard({ metric, tw, index }) {
  const c = colors(tw.dark, tw.accent);
  return (
    <div data-rj-reveal style={{
      '--rj-delay': `${index * 70}ms`,
      padding: 20,
      borderRadius: 15,
      border: `1px solid ${c.border}`,
      background: tw.dark ? 'rgba(248,252,253,0.055)' : 'rgba(255,255,255,0.68)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      minHeight: 142,
    }}>
      <div style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: 42,
        lineHeight: 1,
        fontWeight: 800,
        color: c.accent,
        marginBottom: 8,
      }}>{metric.value}</div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10.5,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: c.fg,
        fontWeight: 700,
        marginBottom: 9,
      }}>{metric.label}</div>
      <div style={{ fontSize: 13.5, color: c.subtle, lineHeight: 1.45 }}>{metric.detail}</div>
    </div>
  );
}

function OutcomeDashboard({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const c = colors(tw.dark, tw.accent);
  const ringBg = tw.dark ? 'rgba(248,252,253,0.08)' : 'rgba(31,34,36,0.08)';
  const completion = 82;

  return (
    <div data-rj-reveal className="rj-dashboard-scan" style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 22,
      border: `1px solid ${c.strongBorder}`,
      background: c.panel,
      boxShadow: tw.dark ? '0 42px 110px -54px rgba(0,0,0,0.92)' : '0 42px 110px -58px rgba(48,88,93,0.38)',
      backdropFilter: 'blur(24px) saturate(145%)',
      WebkitBackdropFilter: 'blur(24px) saturate(145%)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '0.78fr 1.22fr',
        gap: 0,
      }}>
        <div style={{
          padding: isMobile ? 24 : 32,
          borderRight: isMobile || isTablet ? 'none' : `1px solid ${c.border}`,
          borderBottom: isMobile || isTablet ? `1px solid ${c.border}` : 'none',
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10.5,
            letterSpacing: 1.8,
            textTransform: 'uppercase',
            fontWeight: 700,
            color: c.accent,
            marginBottom: 20,
          }}>Deployment outcome</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '164px 1fr',
            gap: 24,
            alignItems: 'center',
          }}>
            <div style={{
              width: 164,
              height: 164,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: `conic-gradient(${c.accent} ${completion * 3.6}deg, ${ringBg} 0deg)`,
              margin: isMobile ? '0 auto' : 0,
              boxShadow: `0 0 42px ${tw.dark ? 'rgba(208,59,8,0.12)' : 'rgba(208,59,8,0.10)'}`,
            }}>
              <div style={{
                width: 122,
                height: 122,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: tw.dark ? '#1f2224' : '#f8fcfd',
                border: `1px solid ${c.border}`,
                textAlign: 'center',
              }}>
                <div>
                  <div style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 38,
                    lineHeight: 1,
                    fontWeight: 800,
                    color: c.fg,
                  }}>{completion}%</div>
                  <div style={{
                    marginTop: 5,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    color: c.muted,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                  }}>handoff</div>
                </div>
              </div>
            </div>
            <div>
              <h3 style={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: c.fg,
                fontSize: isMobile ? 25 : 31,
                lineHeight: 1.1,
                margin: '0 0 12px',
              }}>Services became easier to access, secure, and maintain.</h3>
              <p style={{
                fontSize: isMobile ? 14.5 : 15.5,
                color: c.subtle,
                lineHeight: 1.65,
                margin: 0,
              }}>
                The final result was not only a set of running containers. It was an operational model with identity, HTTPS, local service discovery, testing notes, and documentation that made the infrastructure easier to extend.
              </p>
            </div>
          </div>
        </div>
        <div style={{ padding: isMobile ? 18 : 24 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
            gap: 12,
          }}>
            {OUTCOMES.map((outcome, index) => (
              <div key={outcome.label} style={{
                display: 'grid',
                gridTemplateColumns: '12px 1fr auto',
                alignItems: 'center',
                gap: 12,
                padding: '14px 14px',
                borderRadius: 13,
                border: `1px solid ${c.border}`,
                background: tw.dark ? 'rgba(248,252,253,0.045)' : 'rgba(255,255,255,0.58)',
              }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: index < 5 ? c.accent : c.teal,
                  boxShadow: `0 0 18px ${index < 5 ? c.accent : c.teal}`,
                }} />
                <span style={{ color: c.fg, fontSize: 14.2, fontWeight: 650, lineHeight: 1.3 }}>{outcome.label}</span>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  color: c.muted,
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}>{outcome.state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultSection({ tw }) {
  const { isMobile } = useViewport();

  return (
    <ShellSection index={2} tw={tw} minHeight="100vh">
      <div data-rj-reveal>
        <SectionHeader
          eyebrow="03 / Result and impact"
          title="A maintainable internal platform with a clearer security model."
          subtitle="The internship resulted in improved infrastructure, centralized authentication, secure internal access, maintainable deployments, and documented workflows for future operators."
          accent={tw.accent}
          dark={tw.dark}
          align="center"
        />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))',
        gap: 14,
        marginBottom: isMobile ? 26 : 34,
      }}>
        {METRICS.map((metric, index) => (
          <MetricCard key={metric.label} metric={metric} tw={tw} index={index} />
        ))}
      </div>
      <OutcomeDashboard tw={tw} />
    </ShellSection>
  );
}

function DocumentIcon({ type, tw }) {
  const c = colors(tw.dark, tw.accent);
  const secondary = type === 'reflection' ? c.teal : c.accent;
  const label = type === 'plan' ? 'PLAN' : type === 'realization' ? 'REAL' : 'REFL';

  return (
    <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="13" y="8" width="42" height="56" rx="7" stroke={c.muted} strokeWidth="2" />
      <path d="M55 21H42a4 4 0 0 1-4-4V8" stroke={c.muted} strokeWidth="2" />
      <path d="M25 30h22M25 38h22M25 46h14" stroke={secondary} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="18" y="54" width="40" height="15" rx="5" fill={secondary} opacity="0.92" />
      <text
        x="38"
        y="62"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="7.8"
        fontWeight="800"
        fill={PALETTE.white}
      >
        {label}
      </text>
    </svg>
  );
}

function DocumentGlassCard({ doc, tw }) {
  const c = colors(tw.dark, tw.accent);

  return (
    <a
      className="rj-doc-glass"
      data-text={doc.label}
      href={doc.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        '--r': doc.rotate,
        '--docText': c.fg,
        '--docBorder': tw.dark ? 'rgba(248,252,253,0.14)' : 'rgba(31,34,36,0.13)',
        '--docGlow': tw.dark ? 'rgba(248,252,253,0.16)' : 'rgba(255,255,255,0.72)',
        '--docFooter': tw.dark ? 'rgba(248,252,253,0.065)' : 'rgba(31,34,36,0.045)',
        '--docAccent': c.accent,
        '--docAccentGlow': tw.dark ? 'rgba(208,59,8,0.16)' : 'rgba(208,59,8,0.12)',
      }}
      aria-label={`Open ${doc.label}`}
    >
      <DocumentIcon type={doc.icon} tw={tw} />
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        color: c.muted,
        fontSize: 10.5,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        fontWeight: 800,
      }}>{doc.short}</div>
    </a>
  );
}

function DocumentsSection({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const c = colors(tw.dark, tw.accent);

  return (
    <ShellSection index={3} tw={tw} minHeight={isMobile ? 'auto' : '88vh'}>
      <div data-rj-reveal>
        <SectionHeader
          eyebrow="04 / Documents"
          title="Project documents."
          subtitle="The portfolio includes the project plan, realizations document, and reflection used to explain the internship work and learning outcomes."
          accent={tw.accent}
          dark={tw.dark}
          align="center"
        />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '0.95fr 1.05fr',
        gap: isMobile ? 28 : 48,
        alignItems: 'center',
      }}>
        <div data-rj-reveal="left" className="rj-docs-stack">
          {DOCUMENTS.map((doc) => (
            <DocumentGlassCard key={doc.label} doc={doc} tw={tw} />
          ))}
        </div>
        <div data-rj-reveal="right" style={{
          padding: isMobile ? 20 : 28,
          borderRadius: 18,
          border: `1px solid ${c.strongBorder}`,
          background: c.panel,
          backdropFilter: 'blur(20px) saturate(145%)',
          WebkitBackdropFilter: 'blur(20px) saturate(145%)',
          boxShadow: tw.dark ? '0 32px 92px -46px rgba(0,0,0,0.86)' : '0 32px 92px -50px rgba(48,88,93,0.30)',
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10.5,
            letterSpacing: 1.8,
            color: c.accent,
            textTransform: 'uppercase',
            fontWeight: 800,
            marginBottom: 16,
          }}>Project documents</div>
          <div style={{ display: 'grid', gap: 14 }}>
            {DOCUMENTS.map((doc, index) => (
              <a
                key={doc.label}
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '34px 1fr',
                  gap: 13,
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '14px 0',
                  borderTop: index === 0 ? 'none' : `1px solid ${c.border}`,
                }}
              >
                <span style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${c.strongBorder}`,
                  color: c.accent,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  fontWeight: 800,
                  background: tw.dark ? 'rgba(208,59,8,0.08)' : 'rgba(208,59,8,0.06)',
                }}>{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span style={{
                    display: 'block',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 17,
                    fontWeight: 750,
                    color: c.fg,
                    marginBottom: 5,
                  }}>{doc.label}</span>
                  <span style={{
                    display: 'block',
                    fontSize: 13.8,
                    lineHeight: 1.5,
                    color: c.subtle,
                  }}>{doc.description}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </ShellSection>
  );
}

function InternshipPage() {
  useInternshipStyles();
  const { tw, setTw } = useTweaks();

  return (
    <PageShell current="internship" tw={tw} setTw={setTw} headerOverlay={true}>
      <AssignmentSection tw={tw} />
      <TechnologiesSection tw={tw} />
      <ResultSection tw={tw} />
      <DocumentsSection tw={tw} />
    </PageShell>
  );
}

createRoot(document.getElementById('root')).render(<InternshipPage />);
