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

    // 1. Entrance and Scroll Pinned Timeline
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
      },
    });

    if (headlineRef.current) {
      mainTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }

    if (carouselRef.current) {
      mainTl.fromTo(
        carouselRef.current,
        { rotateY: 0, x: 0, opacity: 1 },
        { rotateY: -35, x: '-25vw', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }

    // 2. Card Floating Animation
    const cards = gsap.utils.toArray<HTMLElement>('.carousel-card');
    cards.forEach((card, index) => {
      gsap.to(card, {
        y: '+=10',
        duration: 2.5 + index * 0.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
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
      const normalizedDiff = ((diff + carouselItems.length + Math.floor(carouselItems.length / 2)) % carouselItems.length) - Math.floor(carouselItems.length / 2);
      
      const rotateY = normalizedDiff * 40;
      const translateX = normalizedDiff * 320;
      const translateZ = Math.abs(normalizedDiff) * -220;
      const scale = 1 - Math.abs(normalizedDiff) * 0.18;
      const opacity = 1 - Math.abs(normalizedDiff) * 0.4;
      const blur = Math.abs(normalizedDiff) * 3;

      gsap.to(card, {
        x: translateX,
        z: translateZ,
        rotateY: rotateY,
        scale: scale,
        opacity: Math.max(opacity, 0.2),
        filter: `blur(${blur}px)`,
        duration: immediate ? 0 : 0.7,
        ease: 'power2.out',
        overwrite: true,
        force3D: true,
      });
      
      card.style.zIndex = (10 - Math.abs(normalizedDiff)).toString();
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

      <div ref={carouselRef} className="relative w-full h-[550px] flex items-center justify-center" style={{ perspective: '1200px', willChange: 'transform, opacity' }}>
        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className="carousel-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[350px] cursor-pointer group"
              style={{ willChange: 'transform, opacity, filter' }}
              onClick={() => setActiveIndex(index)}
            >
              <div className="glass-card-strong overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/70 via-luxury-dark/25 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="font-mono text-xs text-luxury-purple uppercase tracking-widest">{item.subtitle}</span>
                  <h3 className="font-display font-bold text-2xl text-white mt-1 group-hover:text-luxury-purple transition-colors duration-300">{item.title}</h3>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-luxury-purple/20" />
                {index === activeIndex && <div className="absolute inset-0 rounded-2xl shadow-glow-lg pointer-events-none" />}
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
