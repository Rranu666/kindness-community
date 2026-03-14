import { lazy, Suspense, useEffect, useState, useRef } from "react";
import Header from "@/components/kcf/Header";

const HeroSection = lazy(() => import("@/components/kcf/HeroSection"));
const AboutSection = lazy(() => import("@/components/kcf/AboutSection"));
const VisionMission = lazy(() => import("@/components/kcf/VisionMission"));
const ImpactMetricsDisplay = lazy(() => import("@/components/kcf/ImpactMetricsDisplay"));
const InitiativesSection = lazy(() => import("@/components/kcf/InitiativesSection"));
const WhyDifferent = lazy(() => import("@/components/kcf/WhyDifferent"));
const EvolutionSection = lazy(() => import("@/components/kcf/EvolutionSection"));
const ImpactMap = lazy(() => import("@/components/kcf/ImpactMap"));
const LeadershipSection = lazy(() => import("@/components/kcf/LeadershipSection"));
const PartnerSection = lazy(() => import("@/components/kcf/PartnerSection"));
const GovernanceSection = lazy(() => import("@/components/kcf/GovernanceSection"));
const ProspectusSection = lazy(() => import("@/components/kcf/ProspectusSection"));
const BoardRecruitmentSection = lazy(() => import("@/components/kcf/BoardRecruitmentSection"));
const CommunityStories = lazy(() => import("@/components/kcf/CommunityStories"));
const EngagementSection = lazy(() => import("@/components/kcf/EngagementSection"));
const Footer = lazy(() => import("@/components/kcf/Footer"));

const SectionFallback = () => <div className="w-full h-20" />;

// Renders children only once the sentinel div enters the viewport
function LazySection({ children, rootMargin = "200px" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {visible ? (
        <Suspense fallback={<SectionFallback />}>{children}</Suspense>
      ) : (
        <SectionFallback />
      )}
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    // Retry scrolling until the element is in the DOM (lazy sections may not be ready yet)
    let attempts = 0;
    const tryScroll = () => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (attempts < 15) {
        attempts++;
        setTimeout(tryScroll, 200);
      }
    };
    const timeout = setTimeout(tryScroll, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Header />
      <main id="main-content">
        {/* Above the fold — load immediately */}
        <Suspense fallback={<SectionFallback />}>
          <HeroSection />
        </Suspense>

        {/* Just below fold — small root margin so it's ready quickly */}
        <LazySection rootMargin="300px">
          <AboutSection />
        </LazySection>

        <LazySection rootMargin="200px">
          <VisionMission />
        </LazySection>

        <LazySection rootMargin="200px">
          <ImpactMetricsDisplay />
        </LazySection>

        <LazySection rootMargin="200px">
          <InitiativesSection />
        </LazySection>

        <LazySection rootMargin="200px">
          <WhyDifferent />
        </LazySection>

        <LazySection rootMargin="200px">
          <EvolutionSection />
        </LazySection>

        <LazySection rootMargin="200px">
          <ImpactMap />
        </LazySection>

        <LazySection rootMargin="200px">
          <LeadershipSection />
        </LazySection>

        <LazySection rootMargin="200px">
          <PartnerSection />
        </LazySection>

        <LazySection rootMargin="200px">
          <GovernanceSection />
        </LazySection>

        <LazySection rootMargin="200px">
          <ProspectusSection />
        </LazySection>

        <LazySection rootMargin="200px">
          <BoardRecruitmentSection />
        </LazySection>

        <LazySection rootMargin="200px">
          <CommunityStories />
        </LazySection>

        <LazySection rootMargin="200px">
          <EngagementSection />
        </LazySection>

        {/* Footer loaded eagerly so #contact anchor is always in the DOM */}
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}