import React from 'react';
import { createRoot } from 'react-dom/client';
import { PALETTE, useViewport, globalNoiseTexture, getSectionBackgroundTone } from '../shared/hero-shared.jsx';
import { PageShell } from '../shared/shared-chrome.jsx';
import { useTweaks } from '../shared/use-tweaks.jsx';

// Extended project data with details for carousel
const PROJECTS_DETAILED = [
  {
    id:'01', tag:'SECURITY / CLOUD / KUBERNETES',
    title:'Thomas Minder Secure Hosting Platform',
    body:'Work in progress secure hosting platform for PHP applications under the thomasminder.be domain. The team is building secure authentication, automated deployment, DNS setup, monitoring, and vulnerability scanning.',
    problem:'The client needs a hosting platform that is simple for customers to use while still applying strong security controls around deployment, user data, and application isolation.',
    learnings:'I am applying CIS Controls in a real team project, improving API and UI integration skills, and learning how to design secure database handling for user data.',
    stack:['Kubernetes','Docker','NGINX','PHP','MySQL','Terraform','Ansible','CrowdSec'],
    skills:['Secure Architecture','Team Collaboration','API Development','Agile'],
    github:'https://github.com/Romanjns',
    githubLabel:'Project progress',
    demo:'contact.html',
    demoLabel:'Design report',
  },
  {
    id:'02', tag:'APPLICATION SECURITY / PENTEST',
    title:'Shopmore E-commerce Security Check',
    body:'Individual Application Security project where I performed a full penetration test on Shopmore, a vulnerable e-commerce web application provided by my instructor.',
    problem:'The goal was to find exploitable weaknesses, show their real impact, and write a clear report for developers and decision-makers.',
    learnings:'I practiced the full pentest process from scoping to reporting, including XSS, CSRF, unauthenticated admin access, clickjacking, CVSS scoring, and mitigation advice.',
    stack:['Burp Suite','OWASP ZAP','CVSS','OWASP WSTG'],
    skills:['Penetration Testing','Security Reporting','Risk Rating','Proof of Concept'],
    github:'https://github.com/Romanjns',
    githubLabel:'Project report',
    demo:'contact.html',
    demoLabel:'Full security report',
  },
  {
    id:'03', tag:'MOBILE APP / API INTEGRATION',
    title:'Smart Grocery Management System',
    body:'Team project for Skills Integration Lab 1 and 2. We used Grocy as the base system and built a mobile-focused workflow with inventory tracking, barcode scanning, shopping list generation, and WhatsApp alerts.',
    problem:'Our client Jochen needed an easy way to manage groceries locally on his own server, keeping the data private while still receiving practical reminders.',
    learnings:'I learned how to connect systems through APIs, work with inventory data, write professional project documentation, and plan work with Scrum and Agile methods.',
    stack:['Grocy API','Twilio WhatsApp Business API','Barcode Scanner'],
    skills:['API Integration','Notifications','Documentation','Scrum'],
    github:'https://github.com/Romanjns',
    githubLabel:'Project files',
    demo:'contact.html',
    demoLabel:'Documentation and design',
  },
  {
    id:'04', tag:'IOT / TEMPERATURE CONTROL',
    title:'IoT Thermostat with Enhanced Cooling',
    body:'Individual IoT Recovery Exam project where I built a thermostat that controls heating and cooling with two potentiometers, MQTT communication, live temperature readings, and an LCD display.',
    problem:'The system needed accurate temperature control and faster cooling when required, with clear feedback from sensors and controls.',
    learnings:'I learned how to combine sensors, controllers, MQTT data flow, PWM fan control, ThingSpeak monitoring, troubleshooting, planning, and clear project explanation.',
    stack:['OrangePi','Raspberry Pi Pico','MQTT','BMP280','PWM','ThingSpeak'],
    skills:['IoT Development','MQTT','Hardware Integration','Troubleshooting'],
    github:'https://github.com/Romanjns',
    githubLabel:'Documentation',
    demo:'contact.html',
    demoLabel:'Video proof',
  },
  {
    id:'05', tag:'PLACEHOLDER / NEXT PROJECT',
    title:'Upcoming Cybersecurity Project',
    body:'This slot is reserved for a future project. I am keeping the portfolio at six projects so the page layout stays complete while I choose the strongest work to add here.',
    problem:'I still need to select a real project that is strong enough to deserve this position in the portfolio.',
    learnings:'This placeholder will be replaced with clear context, results, tools, my contribution, and lessons learned once the project is selected.',
    stack:['To be added'],
    skills:['Coming Soon'],
    github:'https://github.com/Romanjns',
    githubLabel:'Coming soon',
    demo:'contact.html',
    demoLabel:'Contact me',
  },
  {
    id:'06', tag:'PLACEHOLDER / FUTURE WORK',
    title:'Future Project Slot',
    body:'A second reserved slot for another real project. It will be updated when I have a project that adds something different from the current security, cloud, API, and IoT work.',
    problem:'The portfolio needs six total projects, but I do not want to fill this one with weak or fake work.',
    learnings:'The final version will explain the problem, what I built, the tools used, my role, and what I learned.',
    stack:['To be added'],
    skills:['Coming Soon'],
    github:'https://github.com/Romanjns',
    githubLabel:'Coming soon',
    demo:'contact.html',
    demoLabel:'Contact me',
  },
];

// Inject carousel keyframes
if (typeof document !== 'undefined' && !document.getElementById('rj-carousel-keyframes')) {
  const s = document.createElement('style');
  s.id = 'rj-carousel-keyframes';
  s.textContent = `
    @keyframes rjCarouselSlideLeft {
      from { opacity: 0; transform: translateX(100px) scale(0.95); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes rjCarouselSlideRight {
      from { opacity: 0; transform: translateX(-100px) scale(0.95); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes rjCarouselSlideOutLeft {
      from { opacity: 1; transform: translateX(0) scale(1); }
      to { opacity: 0; transform: translateX(-100px) scale(0.95); }
    }
    @keyframes rjCarouselSlideOutRight {
      from { opacity: 1; transform: translateX(0) scale(1); }
      to { opacity: 0; transform: translateX(100px) scale(0.95); }
    }
    @keyframes rjDetailFadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(s);
}

function ProjectCarousel({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const { dark, accent } = tw;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.70)' : 'rgba(31,34,36,0.75)';
  const border = dark ? 'rgba(248,252,253,0.12)' : 'rgba(31,34,36,0.13)';
  const cardBg = dark
    ? 'linear-gradient(180deg, rgba(39,48,49,0.94), rgba(31,34,36,0.98))'
    : 'linear-gradient(180deg, rgba(249,251,248,0.98), rgba(237,245,243,0.96))';

  const [current, setCurrent] = React.useState(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('project');
    if (id) {
      const idx = PROJECTS_DETAILED.findIndex(p => p.id === id);
      if (idx >= 0) return idx;
    }
    return 0;
  });
  const [direction, setDirection] = React.useState('next'); // 'next' or 'prev'
  
  const total = PROJECTS_DETAILED.length;
  const project = PROJECTS_DETAILED[current];

  const goNext = () => {
    setDirection('next');
    setCurrent((c) => (c + 1) % total);
  };

  const goPrev = () => {
    setDirection('prev');
    setCurrent((c) => (c - 1 + total) % total);
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const animDuration = 500; // ms
  const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)';

  return (
    <div data-rj-reveal style={{
      position:'relative',
      overflow:'hidden',
      display: 'grid',
      gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
      gap: isMobile ? 36 : 48,
      alignItems: 'center',
      padding: isMobile ? '24px 5vw 64px' : isTablet ? '32px 5vw 72px' : '40px 6vw 80px',
      maxWidth: 1600,
      margin: '0 auto',
    }}>
      {/* LEFT PANE - Visual carousel */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        {/* Main visual card */}
        <div key={`card-${current}`} style={{
          position: 'relative',
          height: isMobile ? 280 : isTablet ? 360 : 420,
          borderRadius: 16,
          border: `1px solid ${border}`,
          background: cardBg,
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          boxShadow: dark
            ? '0 28px 70px -42px rgba(0,0,0,0.82), 0 1px 0 rgba(255,255,255,0.04) inset'
            : '0 28px 70px -42px rgba(31,34,36,0.32), 0 1px 0 rgba(255,255,255,0.90) inset',
          overflow: 'hidden',
          animation: `rjCarousel${direction === 'next' ? 'SlideLeft' : 'SlideRight'} ${animDuration}ms ${easeOut} forwards`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? 24 : 40,
        }}>
          <div style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: isMobile ? 74 : isTablet ? 96 : 120,
            fontWeight: 700,
            color: accent,
            opacity: 0.15,
            letterSpacing: 0,
            lineHeight: 1,
            textAlign: 'center',
          }}>
            {project.id}
          </div>
          <div style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: isMobile ? 24 : isTablet ? 30 : 36,
            fontWeight: 700,
            color: fg,
            letterSpacing: 0,
            lineHeight: 1.2,
            textAlign: 'center',
            marginTop: isMobile ? -12 : -20,
          }}>
            {project.title}
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: accent,
            marginTop: 24,
          }}>
            {project.tag}
          </div>
        </div>

        {/* Pagination dots + Counter */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: isMobile ? 14 : 20,
        }}>
          <div style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flex: 1,
          }}>
            {PROJECTS_DETAILED.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 'next' : 'prev');
                  setCurrent(i);
                }}
                style={{
                  height: 6,
                  borderRadius: 3,
                  border: 'none',
                  background: i === current
                    ? `linear-gradient(90deg, ${accent} 0%, ${accent}cc 100%)`
                    : dark ? 'rgba(208,59,8,0.15)' : 'rgba(48,88,93,0.15)',
                  width: i === current ? 24 : 6,
                  transition: 'all 300ms ease-out',
                  cursor: 'pointer',
                  opacity: i === current ? 1 : 0.6,
                  boxShadow: i === current ? `0 0 12px ${accent}66` : 'none',
                }}
              />
            ))}
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1,
            color: accent,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>

        {/* Navigation arrows */}
        <div style={{
          display: 'flex',
          gap: 12,
        }}>
          <button
            onClick={goPrev}
            className="rj-secondary-action"
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: dark ? 'rgba(248,252,253,0.035)' : 'rgba(255,255,255,0.62)',
              color: fg,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms',
              fontSize: 20,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.color = accent;
              e.currentTarget.style.boxShadow = `0 0 12px ${accent}44`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.color = fg;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            &lt;
          </button>
          <button
            onClick={goNext}
            className="rj-secondary-action"
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: dark ? 'rgba(248,252,253,0.035)' : 'rgba(255,255,255,0.62)',
              color: fg,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms',
              fontSize: 20,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.color = accent;
              e.currentTarget.style.boxShadow = `0 0 12px ${accent}44`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.color = fg;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* RIGHT PANE - Details panel */}
      <div key={`detail-${current}`}
        style={{
          position:'relative',
          zIndex: 1,
          animation: `rjDetailFadeUp ${animDuration}ms ${easeOut} forwards`,
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 22 : 28,
        }}
      >
        <div>
          <h2 style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: isMobile ? 26 : 32,
            fontWeight: 700,
            color: fg,
            letterSpacing: 0,
            margin: 0,
            lineHeight: 1.15,
          }}>
            {project.title}
          </h2>
          <p style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: 1.5,
            fontWeight: 600,
            textTransform: 'uppercase',
            color: accent,
            marginTop: 12,
            margin: '12px 0 0 0',
          }}>
            {project.tag}
          </p>
        </div>

        {/* Description */}
        <div>
          <p style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: subtle,
            margin: 0,
          }}>
            {project.body}
          </p>
        </div>

        {/* Problem */}
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: 1.5,
            fontWeight: 600,
            textTransform: 'uppercase',
            color: accent,
            marginBottom: 8,
          }}>
            The Problem
          </div>
          <p style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: subtle,
            margin: 0,
          }}>
            {project.problem}
          </p>
        </div>

        {/* Learnings */}
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: 1.5,
            fontWeight: 600,
            textTransform: 'uppercase',
            color: accent,
            marginBottom: 8,
          }}>
            Key Learnings
          </div>
          <p style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: subtle,
            margin: 0,
          }}>
            {project.learnings}
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: 1.5,
            fontWeight: 600,
            textTransform: 'uppercase',
            color: accent,
            marginBottom: 10,
          }}>
            Tech Stack
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {project.stack.map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 12,
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: dark ? 'rgba(248,252,253,0.06)' : 'rgba(31,34,36,0.06)',
                  color: subtle,
                  border: `1px solid ${border}`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: 1.5,
            fontWeight: 600,
            textTransform: 'uppercase',
            color: accent,
            marginBottom: 10,
          }}>
            Skills Applied
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {project.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  padding: '5px 11px',
                  borderRadius: 4,
                  background: `${accent}15`,
                  color: accent,
                  border: `1px solid ${accent}44`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 12,
          marginTop: 8,
        }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rj-secondary-action"
            style={{
              padding: '11px 18px',
              justifyContent: 'center',
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: dark ? 'rgba(248,252,253,0.035)' : 'rgba(255,255,255,0.72)',
              color: fg,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textDecoration: 'none',
              transition: 'all 200ms',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.color = accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.color = fg;
            }}
          >
            {project.githubLabel || 'GitHub'}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 3h5v5M4 8l5-5" />
            </svg>
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="rj-secondary-action"
            style={{
              padding: '11px 18px',
              justifyContent: 'center',
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: dark ? 'rgba(248,252,253,0.035)' : 'rgba(255,255,255,0.72)',
              color: fg,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textDecoration: 'none',
              transition: 'all 200ms',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.color = accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.color = fg;
            }}
          >
            {project.demoLabel || 'Demo'}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 3h5v5M4 8l5-5" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function ProjectsPage() {
  const { tw, setTw } = useTweaks();
  const { isMobile, isTablet } = useViewport();
  const { dark, accent } = tw;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.70)' : 'rgba(31,34,36,0.70)';

  return (
    <PageShell current="projects" tw={tw} setTw={setTw}>
      {/* Header */}
      <section style={{
        position:'relative',
        overflow:'hidden',
        padding: isMobile ? '36px 5vw 36px' : isTablet ? '48px 5vw 44px' : '40px 6vw 60px',
        background: getSectionBackgroundTone(0, dark),
        ...globalNoiseTexture(dark),
      }}>
        <div style={{ position:'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
        <div className="rj-fadeup" style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          letterSpacing: 2,
          fontWeight: 600,
          textTransform: 'uppercase',
          color: accent,
          marginBottom: 20,
        }}>
          01 / Projects
        </div>

        <h1 className="rj-fadeup" style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: isMobile ? 42 : isTablet ? 64 : 80,
          fontWeight: 700,
          letterSpacing: 0,
          lineHeight: 1.05,
          color: fg,
          margin: '0 0 24px',
          maxWidth: 960,
          animationDelay: '0.1s',
        }}>
          Projects and achievements,<br />ordered by impact.
        </h1>

        <p className="rj-fadeup" style={{
          fontSize: isMobile ? 15.5 : 17,
          lineHeight: 1.6,
          color: subtle,
          maxWidth: 720,
          margin: '0 0 0',
          animationDelay: '0.2s',
        }}>
          A focused overview of the strongest work I have done so far in secure
          hosting, application security, API integration, and IoT. Two slots are
          reserved for future projects so the portfolio stays ready for six.
        </p>
        </div>
      </section>

      {/* Carousel */}
      <ProjectCarousel tw={tw} />

    </PageShell>
  );
}

createRoot(document.getElementById('root')).render(<ProjectsPage />);
