import React from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';
import * as topo from 'topojson-client';
import { PALETTE, useViewport, sectionSurface, SectionPattern, globalNoiseTexture, getSectionBackgroundTone, sectionFade } from '../shared/hero-shared.jsx';
import { PageShell } from '../shared/shared-chrome.jsx';
import { useTweaks } from '../shared/use-tweaks.jsx';
import { SectionHeader, Experience } from '../shared/landing-sections.jsx';

const CV_FILE = 'assets/files/cv.pdf';

function CVSection({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const { dark, accent } = tw;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.68)' : 'rgba(31,34,36,0.72)';
  const border = dark ? 'rgba(248,252,253,0.11)' : 'rgba(31,34,36,0.12)';
  const paper = dark ? 'rgba(248,252,253,0.92)' : 'rgba(248,252,253,0.98)';
  const ink = PALETTE.indigo;

  return (
    <section style={{
      position:'relative',
      overflow:'hidden',
      padding: isMobile ? '64px 5vw' : isTablet ? '80px 5vw' : '92px 6vw',
      background: dark ? PALETTE.indigo : PALETTE.white,
      ...globalNoiseTexture(dark),
    }}>
      {/* Subtle fade effect for smooth section transition */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: dark
          ? 'linear-gradient(to bottom, rgba(31,34,36,0.4) 0%, transparent 12%, transparent 88%, rgba(31,34,36,0.3) 100%)'
          : 'linear-gradient(to bottom, rgba(248,252,253,0.25) 0%, transparent 12%, transparent 88%, rgba(248,252,253,0.2) 100%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}/>
      <div style={{ maxWidth: 1400, margin:'0 auto' }}>
      <div data-rj-reveal style={{
        position:'relative',
        zIndex: 1,
        display:'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '0.88fr 1.12fr',
        gap: isMobile ? 32 : 56,
        alignItems:'center',
      }}>
        <a href={CV_FILE} target="_blank" rel="noopener noreferrer" style={{
          display:'block',
          textDecoration:'none',
          color:'inherit',
          justifySelf: isMobile || isTablet ? 'stretch' : 'center',
          width:'100%',
          maxWidth: 420,
        }}>
          <div style={{
            borderRadius: 8,
            background: dark ? 'rgba(31,34,36,0.55)' : 'rgba(248,252,253,0.85)',
            padding: isMobile ? 18 : 24,
            boxShadow: dark ? '0 24px 80px -28px rgba(0,0,0,0.55)' : '0 24px 80px -28px rgba(31,34,36,0.16)',
          }}>
            <div style={{
              aspectRatio:'0.72 / 1',
              borderRadius: 6,
              background: paper,
              color: ink,
              padding: isMobile ? 20 : 26,
              boxShadow:'0 16px 36px -22px rgba(31,34,36,0.45)',
              display:'flex',
              flexDirection:'column',
              gap: 18,
            }}>
              <div>
                <div style={{
                  fontFamily:'"Space Grotesk", sans-serif',
                  fontSize: isMobile ? 24 : 30,
                  fontWeight: 700,
                  lineHeight: 1.05,
                }}>Roman<br/>Janssens</div>
                <div style={{
                  marginTop: 10,
                  width: 78,
                  height: 4,
                  background: accent,
                }}/>
              </div>
              <div style={{
                fontFamily:'"JetBrains Mono", monospace',
                fontSize: 10.5,
                color: PALETTE.blueDk,
                textTransform:'uppercase',
                letterSpacing: 1.2,
              }}>Cloud & Cybersecurity CV</div>
              {[0.92, 0.76, 0.86, 0.64].map((w, i) => (
                <div key={i} style={{
                  height: 9,
                  width: `${w * 100}%`,
                  background: i === 0 ? 'rgba(48,88,93,0.22)' : 'rgba(31,34,36,0.12)',
                  borderRadius: 2,
                }}/>
              ))}
              <div style={{
                marginTop:'auto',
                display:'grid',
                gridTemplateColumns:'1fr 1fr',
                gap: 10,
              }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    height: 42,
                    borderRadius: 4,
                    background: dark ? 'rgba(248,252,253,0.12)' : 'rgba(31,34,36,0.06)',
                  }}/>
                ))}
              </div>
            </div>
          </div>
        </a>

        <div>
          <SectionHeader
            eyebrow="06 / CV"
            title="My resume, ready to open or download."
            subtitle="Use the preview to open the PDF in a new tab, or download a copy directly."
            accent={accent}
            dark={dark}
          />
          <div style={{
            display:'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
            alignItems: isMobile ? 'stretch' : 'center',
          }}>
            <a href={CV_FILE} target="_blank" rel="noopener noreferrer" className="rj-primary-action" style={{
              display:'inline-flex',
              alignItems:'center',
              justifyContent:'center',
              gap: 10,
              padding:'13px 20px',
              borderRadius: 8,
              background: accent,
              color: PALETTE.white,
              textDecoration:'none',
              fontSize: 14,
              fontWeight: 700,
              boxShadow:`0 8px 0 ${PALETTE.blueDk}33, 0 18px 32px -18px ${accent}cc`,
              transition:'transform .18s ease, filter .18s ease',
            }}>Open CV</a>
            <a href={CV_FILE} download className="rj-secondary-action" style={{
              display:'inline-flex',
              alignItems:'center',
              justifyContent:'center',
              gap: 10,
              padding:'13px 20px',
              borderRadius: 8,
              border:`1px solid ${border}`,
              background: dark ? 'rgba(248,252,253,0.035)' : 'rgba(255,255,255,0.46)',
              color: fg,
              textDecoration:'none',
              fontSize: 14,
              fontWeight: 600,
              transition:'transform .18s ease, background .18s ease, border-color .18s ease',
            }}>Download PDF</a>
          </div>
          <div style={{ marginTop: 18, color: subtle, fontSize: 14, lineHeight: 1.6 }}>
            Replace <span style={{ fontFamily:'"JetBrains Mono", monospace', color: accent }}>{CV_FILE}</span> with your real CV PDF when it is ready.
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

function GlobeVisual({ accent, dark }) {
  const canvasRef = React.useRef(null);
  const stateRef  = React.useRef({ raf: 0, land: null, lon: 96, dragging: false, lastX: 0, lastT: 0, velocity: 0, smoothing: false });

  const resetToUSA = () => {
    stateRef.current.velocity = 0;
    stateRef.current.smoothing = true;
  };

  const onMouseDown = (e) => {
    const s = stateRef.current;
    s.dragging = true;
    s.smoothing = false;
    s.velocity = 0;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    e.preventDefault();
  };
  const onMouseMove = (e) => {
    const s = stateRef.current;
    if (!s.dragging) return;
    const now = performance.now();
    const dx = e.clientX - s.lastX;
    const dt = Math.max(16, now - s.lastT);
    const delta = dx * 0.5;
    s.lon += delta;
    s.velocity = delta / dt * 16.67;
    s.lastX = e.clientX;
    s.lastT = now;
  };
  const onDragEnd = () => { stateRef.current.dragging = false; };
  const onTouchStart = (e) => {
    const s = stateRef.current;
    s.dragging = true;
    s.smoothing = false;
    s.velocity = 0;
    s.lastX = e.touches[0].clientX;
    s.lastT = performance.now();
  };
  const onTouchMove = (e) => {
    const s = stateRef.current;
    if (!s.dragging) return;
    const now = performance.now();
    const dx = e.touches[0].clientX - s.lastX;
    const dt = Math.max(16, now - s.lastT);
    const delta = dx * 0.5;
    s.lon += delta;
    s.velocity = delta / dt * 16.67;
    s.lastX = e.touches[0].clientX;
    s.lastT = now;
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 280, H = 280;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // R shrunk by 22px so atmosphere glow (R+16) stays within canvas bounds
    const cx = W / 2, cy = H / 2, R = W / 2 - 22;
    const s = stateRef.current;
    s.lon = 96;

    const proj = d3.geoOrthographic()
      .scale(R).translate([cx, cy]).clipAngle(90).precision(0.5);
    const gPath     = d3.geoPath(proj, ctx);
    const graticule = d3.geoGraticule()();

    const ar = parseInt(accent.slice(1,3), 16);
    const ag = parseInt(accent.slice(3,5), 16);
    const ab = parseInt(accent.slice(5,7), 16);
    const ac = (a) => `rgba(${ar},${ag},${ab},${a})`;

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(w  => { s.land = topo.feature(w, w.objects.land); })
      .catch(() => {});

    const frame = (now) => {
      if (s.smoothing) {
        const diff = ((96 - s.lon) % 360 + 540) % 360 - 180;
        s.lon += diff * 0.08;
        s.velocity *= 0.82;
        if (Math.abs(diff) < 0.3) { s.lon = 96; s.smoothing = false; }
      } else if (!s.dragging) {
        s.lon += s.velocity;
        s.velocity *= 0.94;
        if (Math.abs(s.velocity) < 0.035) {
          s.velocity = 0;
          s.lon -= 0.04;
        }
      }
      proj.rotate([s.lon, -28, 0]);
      ctx.clearRect(0, 0, W, H);

      // atmosphere glow — radius capped so it stays within canvas
      const atm = ctx.createRadialGradient(cx, cy, R - 1, cx, cy, R + 16);
      atm.addColorStop(0, dark ? 'rgba(30,77,140,0.55)' : 'rgba(147,197,253,0.50)');
      atm.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(cx, cy, R + 16, 0, Math.PI * 2);
      ctx.fillStyle = atm; ctx.fill();

      // ocean
      const ocean = ctx.createRadialGradient(cx * 0.62, cy * 0.52, 0, cx, cy, R);
      dark
        ? (ocean.addColorStop(0,'#1e558f'), ocean.addColorStop(0.55,'#0b2c56'), ocean.addColorStop(1,'#020c1c'))
        : (ocean.addColorStop(0,'#bfdbfe'), ocean.addColorStop(0.55,'#3b82f6'), ocean.addColorStop(1,'#1e3a8a'));
      ctx.beginPath(); gPath({ type:'Sphere' });
      ctx.fillStyle = ocean; ctx.fill();

      // graticule
      ctx.beginPath(); gPath(graticule);
      ctx.strokeStyle = dark ? ac(0.11) : ac(0.09);
      ctx.lineWidth = 0.35; ctx.stroke();

      // land masses
      if (s.land) {
        ctx.beginPath(); gPath(s.land);
        ctx.fillStyle   = dark ? ac(0.72) : ac(0.60);
        ctx.fill();
        ctx.strokeStyle = dark ? ac(0.45) : ac(0.38);
        ctx.lineWidth   = 0.55; ctx.stroke();
      }

      // specular shine — 3D sphere illusion
      const spec = ctx.createRadialGradient(cx * 0.57, cy * 0.40, 0, cx * 0.57, cy * 0.40, R * 1.15);
      spec.addColorStop(0,   dark ? 'rgba(255,255,255,0.17)' : 'rgba(255,255,255,0.26)');
      spec.addColorStop(0.4, 'rgba(255,255,255,0.04)');
      spec.addColorStop(1,   dark ? 'rgba(0,0,0,0.52)'       : 'rgba(0,0,0,0.26)');
      ctx.beginPath(); gPath({ type:'Sphere' });
      ctx.fillStyle = spec; ctx.fill();

      // globe outline
      ctx.beginPath(); gPath({ type:'Sphere' });
      ctx.strokeStyle = ac(0.30); ctx.lineWidth = 1; ctx.stroke();

      // waypoint: geographic centre of contiguous USA (39°N 98°W)
      const pin = proj([-98, 39]);
      if (pin) {
        const [px, py] = pin;
        const t = now * 0.001;

        // expanding pulse rings
        [0, 0.65, 1.3].forEach((offset) => {
          const phase = ((t * 0.52 + offset) % 1.95) / 1.95;
          if (phase > 0.97) return;
          ctx.beginPath();
          ctx.arc(px, py, 6 + phase * 20, 0, Math.PI * 2);
          ctx.strokeStyle = ac((1 - phase) * 0.58);
          ctx.lineWidth = 1.3; ctx.stroke();
        });

        // dot
        ctx.beginPath(); ctx.arc(px, py, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = accent; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();

        // flag pole + flag
        ctx.beginPath();
        ctx.moveTo(px, py - 5.5); ctx.lineTo(px, py - 19);
        ctx.strokeStyle = accent; ctx.lineWidth = 1.3; ctx.stroke();
        ctx.beginPath(); ctx.rect(px, py - 19, 10, 6);
        ctx.fillStyle = accent; ctx.fill();
      }

      s.raf = requestAnimationFrame(frame);
    };

    s.raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(s.raf);
  }, [accent, dark]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onDragEnd}
        style={{ display:'block', width:'100%', maxWidth:280, height:'auto', margin:'0 auto', cursor:'grab', touchAction:'none' }}
      />
      <button
        onClick={resetToUSA}
        style={{
          display:'block', margin:'10px auto 0',
          padding:'5px 14px', borderRadius:6,
          background:'transparent',
          border:`1px solid ${accent}`,
          color:accent, fontSize:10.5,
          fontFamily:'"JetBrains Mono", monospace',
          letterSpacing:1, fontWeight:600,
          cursor:'pointer', textTransform:'uppercase',
        }}
      >↺ Center America</button>
    </div>
  );
}

function WhatsNext({ tw }) {
  const { isMobile, isTablet } = useViewport();
  const { dark, accent } = tw;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.66)' : 'rgba(31,34,36,0.72)';
  const border = dark ? 'rgba(248,252,253,0.11)' : 'rgba(48,88,93,0.20)';
  const cardBg = dark
    ? 'linear-gradient(180deg, rgba(42,49,50,0.78), rgba(31,34,36,0.94))'
    : 'linear-gradient(180deg, rgba(250,252,247,0.98), rgba(238,246,244,0.96))';

  const items = [
    ['Cloud security internship', 'Work with a team that ships secure infrastructure in production.'],
    ['AWS Solutions Architect', 'Finish the associate track and apply it in more realistic builds.'],
    ['Security lab publishing', 'Turn home-lab experiments and CTF notes into clearer public writeups.'],
  ];

  return (
    <section style={{
      position:'relative',
      overflow:'hidden',
      padding: isMobile ? '56px 5vw 80px' : isTablet ? '72px 5vw 92px' : '84px 6vw 110px',
      background: getSectionBackgroundTone(1, dark),
      ...globalNoiseTexture(dark),
    }}>
      <div style={sectionFade('top', dark)}/>
      <div style={{ maxWidth: 1400, margin:'0 auto' }}>
      <div style={{ position:'relative', zIndex: 1 }}>
        <div data-rj-reveal>
          <SectionHeader
            eyebrow="07 / What's next"
            title="Where I want to go next."
            subtitle="The short version: keep building practical cloud security skills, and do it around people who care about clear systems."
            accent={accent}
            dark={dark}
          />
        </div>

        {/* Dream card — move to America */}
        <div data-rj-reveal style={{
          '--rj-delay': '80ms',
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 20 : 40,
          alignItems:'center',
          borderRadius: 12,
          padding: isMobile ? '28px 22px' : isTablet ? '32px' : '36px 44px',
          border: `1px solid ${border}`,
          background: cardBg,
          boxShadow: dark ? '0 18px 45px -28px rgba(0,0,0,0.55)' : '0 18px 45px -28px rgba(48,88,93,0.22)',
          marginBottom: 14,
          position:'relative',
          overflow:'hidden',
        }}>
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{
              fontFamily:'"JetBrains Mono", monospace',
              fontSize: 10.5, color: accent, fontWeight: 700,
              letterSpacing: 1.4, marginBottom: 14,
            }}>★ THE DREAM</div>
            <div style={{
              fontFamily:'"Space Grotesk", sans-serif',
              fontSize: isMobile ? 22 : 26, fontWeight: 700,
              color: fg, lineHeight: 1.25, marginBottom: 14,
            }}>Move & work in America.</div>
            <div style={{
              color: subtle, fontSize: 14.5, lineHeight: 1.68, marginBottom: 20,
            }}>
              Long-term, I want to build my career in the US — working on infrastructure problems at scale, in a place where cloud security is taken seriously. Belgium gave me a strong foundation; America is where I want to apply it.
            </div>
            <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
              {['Work visa','US tech sector','Long-term goal'].map(tag => (
                <span key={tag} style={{
                  padding:'4px 10px', borderRadius: 4,
                  border:`1px solid ${accent}`,
                  color: accent, fontSize: 11,
                  fontFamily:'"JetBrains Mono", monospace',
                  fontWeight: 600, letterSpacing: 0.5,
                }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{
            display:'flex', justifyContent:'center',
            padding: isMobile ? '8px 0 0' : '0',
            position:'relative', zIndex:1,
          }}>
            <GlobeVisual accent={accent} dark={dark} />
          </div>
        </div>

        {/* Goal cards */}
        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: 14,
        }}>
          {items.map(([title, body], i) => (
            <div key={title} data-rj-reveal style={{
              '--rj-delay': `${150 + i * 70}ms`,
              borderRadius: 8,
              padding:'22px',
              border: `1px solid ${border}`,
              background: cardBg,
              boxShadow: dark ? '0 12px 32px -24px rgba(0,0,0,0.42)' : '0 12px 32px -24px rgba(48,88,93,0.20)',
            }}>
              <div style={{
                fontFamily:'"JetBrains Mono", monospace',
                fontSize: 11,
                color: accent,
                fontWeight: 700,
                marginBottom: 18,
              }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{
                fontFamily:'"Space Grotesk", sans-serif',
                fontSize: 19,
                fontWeight: 700,
                color: fg,
                marginBottom: 8,
              }}>{title}</div>
              <div style={{ color: subtle, fontSize: 14.5, lineHeight: 1.55 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

// About page
function AboutPage() {
  const { tw, setTw } = useTweaks();
  const { isMobile, isTablet } = useViewport();
  const { dark, accent } = tw;
  const fg = dark ? PALETTE.white : PALETTE.indigo;
  const subtle = dark ? 'rgba(248,252,253,0.75)' : 'rgba(31,34,36,0.75)';
  const border = dark ? 'rgba(248,252,253,0.10)' : 'rgba(31,34,36,0.12)';

  return (
    <PageShell current="about" tw={tw} setTw={setTw} headerOverlay={true}>
      <section style={{
        position:'relative',
        overflow:'hidden',
        padding: isMobile ? '84px 5vw 40px' : isTablet ? '78px 5vw 44px' : '76px 6vw 36px',
        background: dark ? PALETTE.indigo : PALETTE.white,
        ...globalNoiseTexture(dark),
        borderTop:'none',
        borderBottom:'none',
      }}>
        {/* Subtle fade effect for smooth section transition */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: dark
            ? 'linear-gradient(to bottom, rgba(31,34,36,0.5) 0%, transparent 12%, transparent 88%, rgba(31,34,36,0.35) 100%)'
            : 'linear-gradient(to bottom, rgba(248,252,253,0.3) 0%, transparent 12%, transparent 88%, rgba(248,252,253,0.2) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}/>
        <div style={{ maxWidth: 1200, margin:'0 auto' }}>
        <div style={{ position:'relative', zIndex: 1 }}>
        <div className="rj-fadeup" style={{
          fontFamily:'"JetBrains Mono", monospace',
          fontSize: 11, letterSpacing: 2, fontWeight: 600,
          textTransform:'uppercase', color: accent, marginBottom: 20,
        }}>01 / About</div>

        <h1 className="rj-fadeup" style={{
          fontFamily:'"Space Grotesk", sans-serif',
          fontSize: isMobile ? 40 : isTablet ? 54 : 62,
          fontWeight: 700, letterSpacing: 0, lineHeight: 1.05,
          color: fg, margin:'0 0 32px', maxWidth: 960,
          animationDelay:'0.1s',
        }}>
          Cloud, security,<br/>and the quiet joy<br/>of well-built systems.
        </h1>

        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile || isTablet ? '1fr' : '1.4fr 1fr',
          gap: isMobile ? 24 : isTablet ? 38 : 64,
          alignItems:'flex-start',
          paddingTop: isMobile ? 16 : 32,
        }}>
          <div className="rj-fadeup" style={{ animationDelay:'0.3s' }}>
            {[
              "I'm Roman — a final-year Cloud & Cybersecurity student based in Eindhoven. I spend most days between AWS consoles, a Proxmox home lab, and whatever CTF challenge is currently humbling me.",
              "My interest isn't in security as an abstract. It's in the gap between how systems are documented and how they actually behave. Most interesting findings live there.",
              "I like infrastructure that reads like prose — clear boundaries, obvious failure modes, dependencies you can actually count. Terraform that a stranger could take over next week without needing a call.",
              "Outside of school I write short post-mortems on my home lab breakages, mentor first-years through our CTF club, and am slowly working through the AWS SA Associate material.",
            ].map((p, i) => (
              <p key={i} style={{
                fontSize: isMobile ? 15 : 16, lineHeight: 1.65, color: subtle,
                margin:'0 0 20px', maxWidth: 640,
              }}>{p}</p>
            ))}
          </div>

          <div className="rj-fadeup" style={{
            padding: isMobile ? '22px 18px' : '24px 28px', borderRadius: 16,
            border: `1px solid ${border}`,
            background: dark ? 'rgba(248,252,253,0.04)' : 'rgba(248,252,253,0.6)',
            backdropFilter:'blur(14px)',
            animationDelay:'0.5s',
          }}>
            <div style={{
              fontFamily:'"JetBrains Mono", monospace',
              fontSize: 10.5, letterSpacing: 1.5, fontWeight: 600,
              color: accent, textTransform:'uppercase', marginBottom: 18,
            }}>At a glance</div>

            {[
              ['Based in',   'Eindhoven · NL'],
              ['Program',    'BSc Cybersecurity & Cloud'],
              ['Graduating', 'Summer 2026'],
              ['Focus',      'Cloud architecture · Pentesting'],
              ['Languages',  'Dutch · English'],
              ['Looking for','Summer internship 2026'],
            ].map(([k, v]) => (
              <div key={k} style={{
                display:'flex', justifyContent:'space-between', gap: 16,
                padding:'12px 0', borderBottom: `1px solid ${border}`,
                fontSize: 14,
              }}>
                <span style={{
                  fontFamily:'"JetBrains Mono", monospace', color: subtle,
                  fontSize: 12,
                }}>{k}</span>
                <span style={{ color: fg, fontWeight: 500, textAlign:'right' }}>{v}</span>
              </div>
            ))}

            <a href="contact.html" className="rj-primary-action" style={{
              display:'block', marginTop: 22, textAlign:'center',
              padding:'12px 20px', borderRadius: 8,
              background: accent, color: PALETTE.white,
              fontSize: 14, fontWeight: 600, textDecoration:'none',
              boxShadow:`0 9px 0 ${PALETTE.blueDk}33, 0 18px 32px -18px ${accent}cc`,
              transition:'transform .18s ease, box-shadow .18s ease, filter .18s ease',
            }}>Get in touch →</a>
          </div>
        </div>
        </div>
        </div>
      </section>

      <Experience tw={tw} />
      <CVSection tw={tw} />
      <WhatsNext tw={tw} />

    </PageShell>
  );
}

createRoot(document.getElementById('root')).render(<AboutPage />);
