import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { TrendingUp, Ship, Eye, TrendingUp as Growth } from 'lucide-react';
import LiquidBlob from '../components/LiquidBlob';
import FloatingDroplets from '../components/FloatingDroplets';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  { icon: TrendingUp, title: 'Premium Positioning', description: 'We elevate trends through strategic placement and premium alignment.' },
  { icon: Ship, title: 'Reliable Distribution', description: 'Consistent, scalable distribution across key global markets.' },
  { icon: Eye, title: 'Global Vision', description: 'A forward-thinking approach designed for worldwide impact.' },
  { icon: Growth, title: 'Long-Term Growth', description: 'We build relationships designed to grow over time and value.' },
];

export default function WhyCollaborateSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const reasonsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const secondaryImageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // 1. Headline & Reasons Timeline
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 0.5,
      }
    });

    if (headlineRef.current) {
      contentTl.fromTo(headlineRef.current, { x: '-8vw', opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 0);
    }

    reasonsRef.current.forEach((reason, index) => {
      if (reason) {
        contentTl.fromTo(
          reason,
          { x: '-6vw', opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8 },
          0.2 + index * 0.1
        );
      }
    });

    // 2. Images Entrance & Parallax
    if (mainImageRef.current) {
      gsap.fromTo(
        mainImageRef.current,
        { x: '15vw', opacity: 0, rotateY: 20 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 0.5,
          },
          force3D: true,
        }
      );

      gsap.to(mainImageRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    if (secondaryImageRef.current) {
      gsap.fromTo(
        secondaryImageRef.current,
        { y: '12vh', opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'top 20%',
            scrub: 0.5,
          },
          force3D: true,
        }
      );

      gsap.to(secondaryImageRef.current, {
        y: -150,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, { scope: sectionRef });

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center py-20 overflow-hidden"
    >
      <LiquidBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={1000} color="rgba(159,129,185,0.25)" delay={1.5} intensity={0.6} />
      <FloatingDroplets count={22} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="glass-card-strong p-8 lg:p-12">
            <div ref={headlineRef} className="mb-12" style={{ willChange: 'transform, opacity' }}>
              <span className="font-mono text-sm text-luxury-purple uppercase tracking-widest mb-4 block">Partnership</span>
              <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl">
                WHY
                <br />
                <span className="text-luxury-purple drop-shadow-[0_0_20px_rgba(159,129,185,0.5)]">COLLABORATE</span>
                <br />
                WITH US
              </h2>
            </div>

            <div className="space-y-8">
              {reasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <div
                    key={reason.title}
                    ref={el => { reasonsRef.current[index] = el; }}
                    className="flex gap-5 group cursor-pointer relative p-4 -mx-4 rounded-xl transition-all duration-300 hover:bg-white/30"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-luxury-purple/15 flex items-center justify-center group-hover:bg-luxury-purple/30 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7 text-luxury-purple group-hover:rotate-12 transition-transform duration-300" strokeWidth={1.5} />
                    </div>
                    <div className="group-hover:translate-x-2 transition-transform duration-300">
                      <h3 className="font-display font-bold text-lg mb-1 text-luxury-dark group-hover:text-luxury-purple transition-colors duration-300">{reason.title}</h3>
                      <p className="font-body text-sm text-luxury-gray leading-relaxed">{reason.description}</p>
                    </div>
                    <div className="absolute left-0 bottom-0 w-0 h-px bg-luxury-purple group-hover:w-full transition-all duration-500" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative h-[650px] lg:h-[750px]" style={{ perspective: '1000px' }}>
            <div
              ref={mainImageRef}
              className="absolute right-0 top-0 w-[85%] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
            >
              <img src="/WHy%20collaborate%20with%20us.jpg" alt="Why collaborate with us" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-luxury-purple/15 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-purple/35 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="absolute bottom-6 left-6 glass-card px-4 py-2">
                <span className="font-mono text-xs text-luxury-purple uppercase tracking-wider">Global Reach</span>
              </div>
            </div>

            <div
              ref={secondaryImageRef}
              className="absolute left-0 bottom-0 w-[55%] aspect-video rounded-2xl overflow-hidden shadow-xl group"
              style={{ willChange: 'transform, opacity' }}
            >
              <img src="/why%20collaborate%20second.jpg" alt="Why collaborate second" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-luxury-purple/15 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>

            <div className="absolute right-[10%] bottom-[25%] w-28 h-28 rounded-full bg-luxury-purple/25 blur-3xl animate-pulse-glow" />
            <div className="absolute left-[20%] top-[10%] w-5 h-5 rounded-full bg-luxury-purple/50 animate-pulse shadow-glow" />
            <div className="absolute top-[20%] right-[5%] w-8 h-8 rounded-full bg-gradient-to-br from-luxury-purple/60 to-luxury-purple/30 backdrop-blur-sm animate-float shadow-glow" />
            <div className="absolute bottom-[30%] left-[10%] w-6 h-6 rounded-full bg-gradient-to-br from-luxury-purple/50 to-luxury-purple/20 backdrop-blur-sm animate-float-slow" />
          </div>
        </div>
      </div>
    </div>
  );
}
