import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Mic2, Palette, Award, ArrowRight } from 'lucide-react';
import LiquidBlob from '../components/LiquidBlob';
import FloatingDroplets from '../components/FloatingDroplets';

gsap.registerPlugin(ScrollTrigger);

const collaborationTypes = [
  {
    icon: Mic2,
    title: 'Sponsorships',
    description: 'Product placement, events, and content integrations.',
    image: '/sponsership.jpg',
  },
  {
    icon: Palette,
    title: 'Co-Creation',
    description: 'Design limited editions with our product team.',
    image: '/collab_02.jpg',
  },
  {
    icon: Award,
    title: 'Affiliate & Ambassador',
    description: 'Earn and grow as part of the inner circle.',
    image: '/collab_03.png',
  },
];

export default function CollaborationTypesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Headline animation
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
            trigger: headlineRef.current,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.5,
          },
        }
      );
    }

    // Row animations
    rowRefs.current.forEach((row) => {
      if (row) {
        const image = row.querySelector('.row-image');
        const text = row.querySelector('.row-text');

        const rowTl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.5,
          }
        });

        rowTl
          .fromTo(
            image,
            { x: '-12vw', opacity: 0, rotateY: -20 },
            { x: 0, opacity: 1, rotateY: 0, duration: 1, ease: 'power3.out' },
            0
          )
          .fromTo(
            text,
            { x: '8vw', opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
            0.1
          );
      }
    });
  }, { scope: sectionRef });

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center py-20 overflow-hidden"
    >
      <LiquidBlob className="right-[-15%] top-[20%]" size={700} color="rgba(159,129,185,0.28)" delay={1.5} />
      <LiquidBlob className="left-[-10%] bottom-[15%]" size={550} color="rgba(195,168,216,0.22)" delay={2} />
      <FloatingDroplets count={18} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div ref={headlineRef} className="mb-16 max-w-xl glass-card-strong p-8" style={{ willChange: 'transform, opacity' }}>
          <span className="font-mono text-sm text-luxury-purple uppercase tracking-widest mb-4 block">
            Partnership Models
          </span>
          <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl mb-4">
            COLLABORATION
            <br />
            <span className="text-luxury-purple drop-shadow-[0_0_20px_rgba(159,129,185,0.5)]">TYPES</span>
          </h2>
          <p className="font-body text-luxury-gray text-lg">
            Choose how you want to partner.
          </p>
        </div>

        <div className="space-y-16">
          {collaborationTypes.map((type, index) => {
            const Icon = type.icon;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={type.title}
                ref={el => { rowRefs.current[index] = el; }}
                className={`grid lg:grid-cols-2 gap-10 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
                style={{ perspective: '1000px' }}
              >
                <div
                  className={`row-image relative aspect-video rounded-2xl overflow-hidden shadow-2xl group glass-card ${
                    isReversed ? 'lg:order-2' : ''
                  }`}
                  style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
                >
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-luxury-purple/15 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-purple/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-7 h-7 text-luxury-purple" strokeWidth={1.5} />
                  </div>
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-luxury-purple/90 flex items-center justify-center shadow-glow">
                    <span className="font-display font-bold text-white text-sm">0{index + 1}</span>
                  </div>
                </div>

                <div className={`row-text ${isReversed ? 'lg:order-1 lg:text-right' : ''}`} style={{ willChange: 'transform, opacity' }}>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-luxury-dark mb-4 group-hover:text-luxury-purple transition-colors duration-300">
                    {type.title}
                  </h3>
                  <p className="font-body text-luxury-gray leading-relaxed max-w-md mb-6">
                    {type.description}
                  </p>
                  <button 
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-3 font-display font-semibold text-luxury-purple hover:gap-5 transition-all duration-300 group/btn"
                  >
                    <span className="relative">
                      Learn more
                      <span className="absolute -bottom-1 left-0 w-full h-px bg-luxury-purple scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
