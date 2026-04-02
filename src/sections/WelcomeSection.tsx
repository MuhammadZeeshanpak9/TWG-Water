import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import LiquidBlob from '../components/LiquidBlob';
import FloatingDroplets from '../components/FloatingDroplets';

gsap.registerPlugin(ScrollTrigger);

export default function WelcomeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Consolidated ScrollTrigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 0.5,
      }
    });

    if (headlineRef.current) {
      tl.fromTo(
        headlineRef.current,
        { x: '-10vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        0
      );
    }

    if (bodyRef.current) {
      tl.fromTo(
        bodyRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.2
      );
    }

    if (portraitRef.current) {
      tl.fromTo(
        portraitRef.current,
        { x: '15vw', scale: 0.8, opacity: 0, rotateY: -30 },
        { x: 0, scale: 1, opacity: 1, rotateY: 0, duration: 1, ease: 'power3.out' },
        0.1
      );
    }

    // Badge rotation (Infinite)
    if (badgeRef.current) {
      gsap.to(badgeRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
        force3D: true,
      });
    }
  }, { scope: sectionRef });

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center py-20 overflow-hidden"
    >
      <LiquidBlob className="left-[-10%] top-[20%]" size={600} color="rgba(159,129,185,0.35)" delay={1} />
      <LiquidBlob className="right-[-5%] bottom-[10%]" size={500} color="rgba(195,168,216,0.3)" delay={2} />
      <FloatingDroplets count={25} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="glass-card-strong p-8 lg:p-12">
            <h2
              ref={headlineRef}
              className="heading-display text-4xl sm:text-5xl lg:text-6xl mb-8"
              style={{ willChange: 'transform, opacity' }}
            >
              WELCOME TO
              <br />
              <span className="text-luxury-purple drop-shadow-[0_0_20px_rgba(159,129,185,0.5)]">OUR UNIVERSE</span>
            </h2>

            <div ref={bodyRef} className="space-y-6" style={{ willChange: 'transform, opacity' }}>
              <p className="font-body text-lg text-luxury-dark leading-relaxed">
                The number 1 self-development and wellness premium lifestyle water brand globally.
              </p>
              <p className="font-body text-base text-luxury-gray leading-relaxed">
                We exist to elevate hydration into a daily ritual—clean, beautiful, and unapologetically premium.
              </p>

              <button 
                onClick={() => {
                  const storySection = document.getElementById('story');
                  if (storySection) storySection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 font-display font-semibold text-luxury-purple hover:gap-4 transition-all duration-300 group mt-4"
              >
                <span className="relative">
                  Explore our story
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-luxury-purple scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div 
            ref={portraitRef} 
            className="relative flex justify-center lg:justify-end" 
            style={{ perspective: '1000px', willChange: 'transform, opacity' }}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 group">
              <div className="absolute inset-0 rounded-full border-2 border-luxury-purple/40 animate-pulse" />
              <div className="absolute inset-[-15px] rounded-full border border-luxury-purple/25" />
              <div className="absolute inset-[-25px] rounded-full border border-luxury-purple/15" />
              
              <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl group-hover:shadow-glow-lg transition-shadow duration-500">
                <img
                  src="/Welcome to our universe.jpg"
                  alt="Wellness lifestyle"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-luxury-purple/15 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>

              <div ref={badgeRef} className="absolute inset-[-30px]" style={{ willChange: 'transform' }}>
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <path id="circlePath" d="M 100, 100 m -95, 0 a 95,95 0 1,1 190,0 a 95,95 0 1,1 -190,0" />
                  </defs>
                  <text className="fill-luxury-purple font-mono text-[10px] uppercase tracking-[0.4em] drop-shadow-[0_0_5px_rgba(159,129,185,0.5)]">
                    <textPath href="#circlePath">
                      WELLNESS • LIFESTYLE • MOVEMENT • WELLNESS • LIFESTYLE • MOVEMENT •
                    </textPath>
                  </text>
                </svg>
              </div>

              <div className="absolute -top-2 right-1/4 w-4 h-4 rounded-full bg-luxury-purple/60 animate-pulse shadow-glow" />
              <div className="absolute -bottom-4 left-1/3 w-3 h-3 rounded-full bg-luxury-purple/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/3 -left-8 w-5 h-5 rounded-full bg-luxury-purple/40 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-luxury-purple/60 to-luxury-purple/30 backdrop-blur-sm animate-float shadow-glow" />
              <div className="absolute bottom-10 -right-6 w-6 h-6 rounded-full bg-gradient-to-br from-luxury-purple/50 to-luxury-purple/20 backdrop-blur-sm animate-float-slow" />
              <div className="absolute top-[40%] -left-10 w-5 h-5 rounded-full bg-gradient-to-br from-luxury-purple/45 to-luxury-purple/15 backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
