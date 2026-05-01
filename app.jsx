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

ReactDOM.createRoot(document.getElementById('root')).render(<LandingPage />);
