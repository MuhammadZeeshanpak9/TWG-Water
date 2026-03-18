import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LiquidBlob from '../components/LiquidBlob';
import FloatingDroplets from '../components/FloatingDroplets';

gsap.registerPlugin(ScrollTrigger);

const carouselItems = [
  { id: 1, title: 'Founders', subtitle: 'Visionaries', image: '/carousel_01.jpg' },
  { id: 2, title: 'Product Team', subtitle: 'Innovators', image: '/carousel_02.jpg' },
  { id: 3, title: 'Community Leads', subtitle: 'Connectors', image: '/carousel_03.jpg' },
  { id: 4, title: 'Athlete Partners', subtitle: 'Champions', image: '/carousel_04.jpg' },
  { id: 5, title: 'Creative Crew', subtitle: 'Artists', image: '/carousel_05.jpg' },
];

export default function StoryCarouselSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(2);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // 1. Scroll-driven carousel navigation
    const carouselTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const newIndex = Math.min(
            Math.floor(progress * carouselItems.length),
            carouselItems.length - 1
          );
          setActiveIndex(current => {
            if (newIndex !== current) return newIndex;
            return current;
          });
        }
      },
    });

    if (headlineRef.current) {
      carouselTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: -30, opacity: 0, scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'top -20%',
          scrub: true
        }},
        0
      );
    }

    // 2. Card Floating Animation (Batched)
    const cards = gsap.utils.toArray<HTMLElement>('.carousel-card');
    gsap.to(cards, {
      y: '+=10',
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.4,
        from: "random"
      },
      force3D: true,
    });

    // 3. Initial Card Positioning
    updateCardPositions(true);

  }, { scope: sectionRef });

  // 4. Handle Active Index Change (GSAP transition)
  useGSAP(() => {
    updateCardPositions();
  }, { dependencies: [activeIndex], scope: sectionRef });

  function updateCardPositions(immediate = false) {
    const cards = gsap.utils.toArray<HTMLElement>('.carousel-card');
    cards.forEach((card, index) => {
      const diff = index - activeIndex;
      
      // Horizontal slider with scaling and opacity
      const translateX = diff * 340; // Spacing between cards
      const scale = index === activeIndex ? 1.15 : 0.85;
      const opacity = index === activeIndex ? 1 : 0.45;
      const zIndex = index === activeIndex ? 20 : 10 - Math.abs(diff);

      gsap.to(card, {
        x: translateX,
        scale: scale,
        opacity: opacity,
        duration: immediate ? 0 : 0.8,
        ease: 'power3.out',
        overwrite: true,
        force3D: true,
      });
      
      card.style.zIndex = zIndex.toString();
    });
  }

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveIndex(prev => (prev === 0 ? carouselItems.length - 1 : prev - 1));
    } else {
      setActiveIndex(prev => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <LiquidBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={1100} color="rgba(159,129,185,0.3)" delay={1} intensity={0.8} />
      <FloatingDroplets count={25} />

      <div ref={headlineRef} className="absolute top-[10vh] left-[8vw] z-20 glass-card-strong px-8 py-6" style={{ willChange: 'transform, opacity' }}>
        <span className="font-mono text-sm text-luxury-purple uppercase tracking-widest mb-4 block">Behind The Brand</span>
        <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl">
          OUR <span className="text-luxury-purple drop-shadow-[0_0_20px_rgba(159,129,185,0.5)]">STORY</span>
        </h2>
        <p className="font-body text-luxury-gray mt-4 text-lg">The faces of our movement.</p>
      </div>

      <div ref={carouselRef} className="relative w-full h-[550px] flex items-center justify-center pt-20" style={{ willChange: 'transform, opacity' }}>
        <div className="relative w-full max-w-[400px]" style={{ perspective: '1000px' }}>
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className="carousel-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] cursor-pointer group"
              style={{ 
                willChange: 'transform, opacity',
                transition: 'filter 0.5s ease',
              }}
              onClick={() => setActiveIndex(index)}
            >
              <div className={`glass-card-strong overflow-hidden ${index !== activeIndex ? 'grayscale-[0.5] blur-[1px]' : ''} transition-all duration-700`}>
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/80 via-luxury-dark/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                  <span className="font-mono text-[10px] text-luxury-purple uppercase tracking-widest">{item.subtitle}</span>
                  <h3 className="font-display font-bold text-xl text-white mt-1">{item.title}</h3>
                </div>
                {index === activeIndex && <div className="absolute inset-0 border-2 border-luxury-purple/30 rounded-2xl pointer-events-none" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        <button onClick={() => navigate('prev')} className="w-14 h-14 rounded-full glass-card flex items-center justify-center hover:bg-luxury-purple/40 transition-all duration-300 group hover:scale-110">
          <ChevronLeft className="w-6 h-6 text-luxury-dark group-hover:text-luxury-purple transition-colors" />
        </button>
        <div className="flex items-center gap-3">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-500 ${index === activeIndex ? 'w-8 bg-luxury-purple shadow-glow' : 'w-2 bg-luxury-purple/40 hover:bg-luxury-purple/60'}`}
            />
          ))}
        </div>
        <button onClick={() => navigate('next')} className="w-14 h-14 rounded-full glass-card flex items-center justify-center hover:bg-luxury-purple/40 transition-all duration-300 group hover:scale-110">
          <ChevronRight className="w-6 h-6 text-luxury-dark group-hover:text-luxury-purple transition-colors" />
        </button>
      </div>
    </div>
  );
}
