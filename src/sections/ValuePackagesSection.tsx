import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Truck, Handshake, Globe, Tag } from 'lucide-react';
import LiquidBlob from '../components/LiquidBlob';
import FloatingDroplets from '../components/FloatingDroplets';

gsap.registerPlugin(ScrollTrigger);

const packages = [
  { icon: Truck, title: 'Wholesale Distribution', description: 'Bulk supply with retail-ready packaging and fast turnaround.', color: '#9f81b9' },
  { icon: Handshake, title: 'Brand Collaborations', description: 'Co-branded drops, limited editions, and campaign storytelling.', color: '#b8a0cc' },
  { icon: Globe, title: 'Global Collaborations', description: 'International logistics, localized compliance, worldwide delivery.', color: '#c4a8d8' },
  { icon: Tag, title: 'Private Label Supply', description: 'Your brand, our formula. Custom labeling and flexible MOQs.', color: '#d4c0e0' },
];

export default function ValuePackagesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // 1. Headline
    if (headlineRef.current) {
      gsap.fromTo(
        headlineRef.current,
        { x: '-8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.5,
          },
        }
      );
    }

    // 2. Batched Cards Stagger
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, rotateX: -15, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
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
      <LiquidBlob className="right-[-15%] top-[30%]" size={700} color="rgba(159,129,185,0.3)" delay={2} />
      <LiquidBlob className="left-[-10%] bottom-[10%]" size={550} color="rgba(195,168,216,0.25)" delay={1.5} />
      <FloatingDroplets count={20} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div ref={headlineRef} className="lg:col-span-4 lg:sticky lg:top-32 glass-card-strong p-8" style={{ willChange: 'transform, opacity' }}>
            <span className="font-mono text-sm text-luxury-purple uppercase tracking-widest mb-4 block">What We Offer</span>
            <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl mb-4">
              VALUE
              <br />
              <span className="text-luxury-purple drop-shadow-[0_0_20px_rgba(159,129,185,0.5)]">PACKAGES</span>
            </h2>
            <p className="font-body text-luxury-gray text-lg">Built for scale. Designed for culture.</p>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-luxury-purple to-transparent rounded-full" />
          </div>

          <div className="lg:col-span-8" style={{ perspective: '1000px' }}>
            <div className="grid sm:grid-cols-2 gap-6">
              {packages.map((pkg) => {
                const Icon = pkg.icon;
                return (
                  <div
                    key={pkg.title}
                    ref={el => { cardsRef.current[packages.indexOf(pkg)] = el; }}
                    className="glass-card p-8 group cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      boxShadow: `0 10px 30px rgba(0,0,0,0.06), 0 0 20px ${pkg.color}15`,
                      willChange: 'transform, opacity'
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${pkg.color}25 0%, transparent 70%)` }}
                    />
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-115 group-hover:rotate-6 relative z-10"
                      style={{ backgroundColor: `${pkg.color}35` }}
                    >
                      <Icon className="w-8 h-8 transition-all duration-500 group-hover:scale-110" style={{ color: pkg.color }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-3 text-luxury-dark group-hover:text-luxury-purple transition-colors duration-300 relative z-10">{pkg.title}</h3>
                    <p className="font-body text-luxury-gray text-sm leading-relaxed relative z-10">{pkg.description}</p>
                    <div className="mt-6 flex items-center gap-2 text-luxury-purple opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 relative z-10">
                      <span className="font-mono text-xs uppercase tracking-wider">Learn more</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-0 left-[-100%] w-[200%] h-full transition-transform duration-1000 group-hover:translate-x-[50%]" style={{ background: `linear-gradient(90deg, transparent, ${pkg.color}70, transparent)` }} />
                    </div>
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: `inset 0 0 30px ${pkg.color}30, 0 0 40px ${pkg.color}25` }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
