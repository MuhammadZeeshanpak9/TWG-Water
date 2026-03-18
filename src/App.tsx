import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Setup global active section tracking
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

    // 2. Optimization: Setup global snap for pinned sections
    // We delay this slightly to ensure all child components have registered their ScrollTriggers
    const snapTimer = setTimeout(() => {
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
    }, 500);

    return () => clearTimeout(snapTimer);
  }, { scope: mainRef });

  return (
    <div ref={mainRef} className="relative min-h-screen">
      <WaterBackground />
      <div className="grain-overlay" />
      <LeftNavigation activeSection={activeSection} />
      
      <main className="relative">
        <section id="home" className="relative z-10"><HeroSection /></section>
        <section className="relative z-20"><WelcomeSection /></section>
        <section className="relative z-30"><ValuePackagesSection /></section>
        <section className="relative z-40"><WhyCollaborateSection /></section>
        <section id="story" className="relative z-50"><StoryCarouselSection /></section>
        <section id="creators" className="relative z-[60]"><CreatorsSection /></section>
        <section id="packages" className="relative z-[70]"><CollaborationTypesSection /></section>
        <section className="relative z-[80]"><TestimonialsSection /></section>
        <section id="contact" className="relative z-[90]"><FinalCTASection /></section>
        <section className="relative z-[100]"><FooterSection /></section>
      </main>
    </div>
  );
}

export default App;
