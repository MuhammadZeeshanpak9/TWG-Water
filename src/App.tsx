import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import LeftNavigation from './components/LeftNavigation';
import WaterBackground from './components/WaterBackground';

// Sections
import HeroSection from './sections/HeroSection';
import WelcomeSection from './sections/WelcomeSection';
import ValuePackagesSection from './sections/ValuePackagesSection';
import WhyCollaborateSection from './sections/WhyCollaborateSection';
import StoryCarouselSection from './sections/StoryCarouselSection';
import CreatorsSection from './sections/CreatorsSection';
import CollaborationTypesSection from './sections/CollaborationTypesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import FinalCTASection from './sections/FinalCTASection';
import FooterSection from './sections/FooterSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Page load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Setup global snap for pinned sections
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    // Delay snap setup to ensure all ScrollTriggers are created
    const snapTimer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(snapTimer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isLoaded]);

  // Track active section
  useEffect(() => {
    const sections = ['home', 'story', 'packages', 'creators', 'contact'];
    
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        ScrollTrigger.create({
          trigger: element,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(section),
          onEnterBack: () => setActiveSection(section),
        });
      }
    });
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen">
      {/* Global Water Background - fills as you scroll - ALWAYS VISIBLE */}
      <WaterBackground />
      
      {/* Grain overlay - subtle */}
      <div className="grain-overlay" />
      
      {/* Left Navigation */}
      <LeftNavigation activeSection={activeSection} />
      
      {/* Main Content - TRANSPARENT SECTIONS */}
      <main className="relative">
        {/* Section 1: Hero - pin: true */}
        <section id="home" className="relative z-10">
          <HeroSection />
        </section>
        
        {/* Section 2: Welcome - TRANSPARENT */}
        <section className="relative z-20">
          <WelcomeSection />
        </section>
        
        {/* Section 3: Value Packages - TRANSPARENT */}
        <section className="relative z-30">
          <ValuePackagesSection />
        </section>
        
        {/* Section 4: Why Collaborate - TRANSPARENT */}
        <section className="relative z-40">
          <WhyCollaborateSection />
        </section>
        
        {/* Section 5: Our Story Carousel - pin: true */}
        <section id="story" className="relative z-50">
          <StoryCarouselSection />
        </section>
        
        {/* Section 6: Creators - TRANSPARENT */}
        <section id="creators" className="relative z-[60]">
          <CreatorsSection />
        </section>
        
        {/* Section 7: Collaboration Types - TRANSPARENT */}
        <section id="packages" className="relative z-[70]">
          <CollaborationTypesSection />
        </section>
        
        {/* Section 8: Testimonials - TRANSPARENT */}
        <section className="relative z-[80]">
          <TestimonialsSection />
        </section>
        
        {/* Section 9: Final CTA - TRANSPARENT */}
        <section id="contact" className="relative z-[90]">
          <FinalCTASection />
        </section>
        
        {/* Section 10: Footer */}
        <section className="relative z-[100]">
          <FooterSection />
        </section>
      </main>
    </div>
  );
}

export default App;
