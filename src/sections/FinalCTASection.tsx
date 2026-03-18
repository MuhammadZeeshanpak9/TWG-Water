import { useRef, useState, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Canvas } from '@react-three/fiber';
import LiquidBlob from '../components/LiquidBlob';
import WaterBottle3D from '../components/WaterBottle3D';
import FloatingParticles from '../components/FloatingParticles';
import FloatingDroplets from '../components/FloatingDroplets';

gsap.registerPlugin(ScrollTrigger);

function WaterfallEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const streams = containerRef.current?.querySelectorAll('.water-stream');
    if (!streams) return;

    streams.forEach((stream, i) => {
      gsap.to(stream, {
        y: '120vh',
        duration: 1.5 + Math.random() * 1,
        repeat: -1,
        delay: i * 0.15,
        ease: 'none',
        force3D: true,
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="water-stream absolute"
          style={{
            left: `${3 + Math.random() * 94}%`,
            top: '-150px',
            width: `${2 + Math.random() * 4}px`,
            height: `${80 + Math.random() * 120}px`,
            background: `linear-gradient(180deg, transparent, rgba(159,129,185,${0.3 + Math.random() * 0.4}), rgba(255,255,255,${0.4 + Math.random() * 0.4}), transparent)`,
            filter: 'blur(1px)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const leftBottleRef = useRef<HTMLImageElement>(null);
  const rightBottleRef = useRef<HTMLImageElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  useGSAP(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: 0.5,
      }
    });

    // 1. Blob & Bottle
    tl.fromTo('.cta-blob', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0);
    
    if (bottleRef.current) {
      tl.fromTo(bottleRef.current, { y: '10vh', opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 1 }, 0.1);
    }

    // 2. Text Content
    if (headlineRef.current) {
      tl.fromTo(headlineRef.current.parentElement, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, 0.3);
    }

    if (subtextRef.current) {
      tl.fromTo(subtextRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.5);
    }

    if (ctaRef.current) {
      tl.fromTo(ctaRef.current, { y: 40, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0.6);
    }

    // 3. Side bottle animations
    if (leftBottleRef.current) {
      gsap.fromTo(leftBottleRef.current,
        { x: '-120%', opacity: 0, rotate: -25 },
        { 
          x: '0%', 
          opacity: 0.25, 
          rotate: -12, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 1,
          }
        }
      );
    }

    if (rightBottleRef.current) {
      gsap.fromTo(rightBottleRef.current,
        { x: '120%', opacity: 0, rotate: 25 },
        { 
          x: '0%', 
          opacity: 0.25, 
          rotate: 12, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 1,
          }
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 2D Background Bottles (Sides) */}
      <img 
        ref={leftBottleRef}
        src="/bottle.png" 
        alt="" 
        className="absolute left-[-5%] top-[15%] w-[450px] h-auto pointer-events-none z-0 brightness-110 blur-[1px]"
        style={{ willChange: 'transform, opacity' }}
      />
      <img 
        ref={rightBottleRef}
        src="/bottle.png" 
        alt="" 
        className="absolute right-[-5%] bottom-[5%] w-[400px] h-auto pointer-events-none z-0 brightness-110 blur-[1px] scale-x-[-1]"
        style={{ willChange: 'transform, opacity' }}
      />

      <div className="cta-blob absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-luxury-purple/25 blur-[150px]" style={{ willChange: 'transform, opacity' }} />

      <LiquidBlob className="left-[3%] top-[10%]" size={500} color="rgba(159,129,185,0.35)" delay={0.5} />
      <LiquidBlob className="right-[3%] bottom-[10%]" size={450} color="rgba(195,168,216,0.3)" delay={1.5} />

      <WaterfallEffect />

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 10}px`,
              height: `${4 + Math.random() * 10}px`,
              background: `radial-gradient(circle, white, rgba(159,129,185,${0.6 + Math.random() * 0.4}))`,
              boxShadow: `0 0 ${15 + Math.random() * 15}px rgba(159,129,185,0.7)`,
              opacity: 0.5 + Math.random() * 0.4,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <FloatingDroplets count={35} />

      <div
        ref={bottleRef}
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[450px] h-[550px] z-10"
        style={{ willChange: 'transform, opacity' }}
      >
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.4} />
            <pointLight position={[-5, 5, 5]} intensity={1} color="#9f81b9" />
            <pointLight position={[0, -5, 5]} intensity={0.7} color="#c4a8d8" />
            <WaterBottle3D position={[0, -0.2, 0]} scale={2.3} />
            <FloatingParticles count={60} spread={7} size={0.03} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-[280px]">
        <div className="glass-card-strong inline-block px-10 py-8 mb-6" style={{ willChange: 'transform, opacity' }}>
          <h2 ref={headlineRef} className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            READY TO
            <br />
            <span className="text-luxury-purple drop-shadow-[0_0_30px_rgba(159,129,185,0.6)]">CONNECT?</span>
          </h2>
        </div>

        <p ref={subtextRef} className="font-body text-lg sm:text-xl text-luxury-dark max-w-xl mx-auto mb-10" style={{ willChange: 'transform, opacity' }}>
          Let's build something premium—together.
        </p>

        <button
          ref={ctaRef}
          onMouseEnter={handleMouseEnter}
          onClick={() => window.open('mailto:hello@elev8water.co', '_blank')}
          className="btn-luxury text-lg px-14 py-6 relative overflow-hidden group"
          style={{ willChange: 'transform, opacity' }}
        >
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple-expand"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
                willChange: 'transform, opacity',
              }}
            />
          ))}
          <span className="relative z-10">SAY HELLO</span>
          <span className="absolute inset-0 bg-gradient-to-r from-luxury-purple via-[#b8a0cc] via-[#d4c0e0] to-luxury-purple opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[length:200%_100%] group-hover:animate-shimmer" />
          <span className="absolute inset-[-30px] bg-luxury-purple/60 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        </button>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-luxury-dark">
          <a href="mailto:hello@elev8water.co" className="font-body text-sm hover:text-luxury-purple transition-colors relative group">
            hello@elev8water.co
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-purple group-hover:w-full transition-all duration-300" />
          </a>
          <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-luxury-purple/60 shadow-glow" />
          <span className="font-body text-sm">Global Headquarters</span>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
