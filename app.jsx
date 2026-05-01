import React from 'react';
import { createRoot } from 'react-dom/client';
import { useTweaks } from './components/shared/use-tweaks.jsx';
import { PageShell } from './components/shared/shared-chrome.jsx';
import { HeroSection } from './components/shared/hero-terminal.jsx';
import { SkillsGrid, FeaturedProjects, Certifications } from './components/shared/landing-sections.jsx';

// index.html landing page — hero + skills + featured projects + certs
function LandingPage() {
  const { tw, setTw } = useTweaks();
  return (
    <PageShell current="home" tw={tw} setTw={setTw}>
      <HeroSection tw={tw} />
      <SkillsGrid tw={tw} />
      <FeaturedProjects tw={tw} />
      <Certifications tw={tw} />
    </PageShell>
  );
}

createRoot(document.getElementById('root')).render(<LandingPage />);
