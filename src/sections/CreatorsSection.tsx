import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import LiquidBlob from '../components/LiquidBlob';
import FloatingDroplets from '../components/FloatingDroplets';

gsap.registerPlugin(ScrollTrigger);

const creators = [
  { id: 1, image: '/Wellnes%20advocate.jpg', title: 'Wellness Advocate', size: 'tall' },
  { id: 2, image: '/Event%20partners.jpg', title: 'Event Partner', size: 'wide' },
  { id: 3, image: '/Fitness%20coach.jpg', title: 'Fitness Coach', size: 'tall' },
  { id: 4, image: '/yoga%20Instructor.jpg', title: 'Yoga Instructor', size: 'wide' },
  { id: 5, image: '/Brand%20Ambassadoe.png', title: 'Brand Ambassador', size: 'tall' },
  { id: 6, image: '/creator_06.jpg', title: 'Creative Team', size: 'wide' },
];

export default function CreatorsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Optimized staggered animation for all creator cards (forced refresh)
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.9, rotateX: -10 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.5,
          },
          force3D: true,
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center py-20 overflow-hidden"
    >
      <LiquidBlob className="left-[-10%] top-[30%]" size={600} color="rgba(159,129,185,0.3)" delay={2} />
      <LiquidBlob className="right-[-5%] bottom-[15%]" size={500} color="rgba(195,168,216,0.25)" delay={1} />
      <FloatingDroplets count={22} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-32 glass-card-strong p-8">
            <span className="font-mono text-sm text-luxury-purple uppercase tracking-widest mb-4 block">Community</span>
            <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl mb-4">
              <span className="text-luxury-purple drop-shadow-[0_0_20px_rgba(159,129,185,0.5)]">CREATORS</span>
            </h2>
            <p className="font-body text-luxury-gray text-lg">Building the future together.</p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="group cursor-pointer">
                <span className="font-display font-bold text-4xl text-luxury-purple group-hover:scale-110 inline-block transition-transform drop-shadow-[0_0_15px_rgba(159,129,185,0.5)]">500+</span>
                <p className="font-body text-sm text-luxury-gray mt-1">Active Partners</p>
              </div>
              <div className="group cursor-pointer">
                <span className="font-display font-bold text-4xl text-luxury-purple group-hover:scale-110 inline-block transition-transform drop-shadow-[0_0_15px_rgba(159,129,185,0.5)]">50+</span>
                <p className="font-body text-sm text-luxury-gray mt-1">Countries</p>
              </div>
            </div>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-luxury-purple to-transparent rounded-full" />
          </div>

          <div className="lg:col-span-8" style={{ perspective: '1000px' }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  ref={el => { cardRefs.current[creator.id - 1] = el; }}
                  className={`
                    group relative overflow-hidden rounded-2xl cursor-pointer glass-card
                    ${creator.size === 'tall' ? 'row-span-2' : ''}
                    ${creator.size === 'wide' ? 'col-span-2 md:col-span-1' : ''}
                  `}
                  style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
                >
                  <div className={`${creator.size === 'tall' ? 'aspect-[3/4]' : 'aspect-[4/3]'} overflow-hidden`}>
                    <img
                      src={creator.image}
                      alt={creator.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/80 via-luxury-dark/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-luxury-purple/0 group-hover:bg-luxury-purple/30 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-[100%] group-hover:translate-y-[100%] transition-transform duration-1000" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="font-mono text-xs text-luxury-purple uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">Creator</span>
                    <h3 className="font-display font-bold text-lg text-white mt-1 group-hover:text-luxury-purple transition-colors duration-300">{creator.title}</h3>
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-luxury-purple opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125 shadow-glow" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-luxury-purple/0 via-luxury-purple/70 to-luxury-purple/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
