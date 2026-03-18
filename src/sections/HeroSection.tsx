import { useRef, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Canvas } from '@react-three/fiber';

import LiquidBlob from '../components/LiquidBlob';
import WaterBottle3D from '../components/WaterBottle3D';
import FloatingParticles from '../components/FloatingParticles';
import FloatingDroplets from '../components/FloatingDroplets';

gsap.registerPlugin(ScrollTrigger);

// Falling water drops component - simplified and batched
function FallingWaterDrops() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const drops = containerRef.current?.querySelectorAll('.water-drop');
    if (!drops) return;

    // Use a single stagger animation for all drops
    gsap.to(drops, {
      y: '120vh',
      duration: 1.8,
      repeat: -1,
      stagger: {
        amount: 3,
        from: "random",
        repeat: -1
      },
      ease: 'none',
      force3D: true,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => ( // Reduced count from 12 to 8
        <div
          key={i}
          className="water-drop absolute w-1.5 h-3 rounded-full"
          style={{
            left: `${48.5 + Math.random() * 3}%`,
            top: '-20px',
            background: 'linear-gradient(180deg, rgba(159,129,185,0.4) 0%, rgba(159,129,185,0.2) 100%)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const bottleContainerRef = useRef<HTMLDivElement>(null);
  const waterStreamRef = useRef<HTMLDivElement>(null);
  const leftFallingBottleRef = useRef<HTMLImageElement>(null);
  const rightFallingBottleRef = useRef<HTMLImageElement>(null);

  // Use useGSAP for all animations
  useGSAP(() => {
    if (!sectionRef.current) return;

    // 1. Mouse Parallax (Optimized to avoid re-renders)
    const xSetter = gsap.quickSetter(bottleContainerRef.current, 'x', 'px');
    const ySetter = gsap.quickSetter(bottleContainerRef.current, 'y', 'px');

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      gsap.to({}, {
        duration: 0.8,
        onUpdate: () => {
          xSetter(x);
          ySetter(y);
        },
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Entrance Timeline
    const entranceTl = gsap.timeline({ delay: 0.2 });

    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.word');
      entranceTl.fromTo(
        words,
        { y: 80, opacity: 0, rotateX: -60 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
        },
        0.1
      );
    }

    entranceTl
      .fromTo(
        bottleContainerRef.current,
        { y: 150, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
        0
      )
      .fromTo(
        subtextRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.7
      )
      .fromTo(
        ctaRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
        0.9
      )
      .fromTo(
        waterStreamRef.current,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 1, ease: 'power2.out' },
        0.6
      )
      .fromTo(
        leftFallingBottleRef.current,
        { y: '-120vh', opacity: 0, rotate: -45 },
        { y: 0, opacity: 0.35, rotate: -15, duration: 2, ease: 'bounce.out' },
        0.5
      )
      .fromTo(
        rightFallingBottleRef.current,
        { y: '-120vh', opacity: 0, rotate: 45 },
        { y: 0, opacity: 0.35, rotate: 15, duration: 2.2, ease: 'bounce.out' },
        0.6
      );

    // 3. Scroll-driven Timeline
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    scrollTl
      .to(headlineRef.current, { y: '-20vh', opacity: 0, scale: 1.1, ease: 'power2.in' }, 0.7)
      .to(subtextRef.current, { y: '-15vh', opacity: 0, ease: 'power2.in' }, 0.72)
      .to(ctaRef.current, { y: '15vh', opacity: 0, ease: 'power2.in' }, 0.75)
      .to(bottleContainerRef.current, { y: '30vh', opacity: 0, scale: 0.85, ease: 'power2.in' }, 0.7)
      .to(waterStreamRef.current, { scaleY: 3, opacity: 0, ease: 'power2.in' }, 0.65);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: sectionRef });

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 2D Background Bottles (Falling from above) */}
      <img 
        ref={leftFallingBottleRef}
        src="/bottle.png" 
        alt="" 
        className="absolute left-[8%] top-[12%] w-[380px] h-auto pointer-events-none z-0 brightness-110 opacity-0"
        style={{ translate: '0 0', willChange: 'transform, opacity' }}
      />
      <img 
        ref={rightFallingBottleRef}
        src="/bottle.png" 
        alt="" 
        className="absolute right-[8%] top-[18%] w-[350px] h-auto pointer-events-none z-0 brightness-110 opacity-0 scale-x-[-1]"
        style={{ translate: '0 0', willChange: 'transform, opacity' }}
      />

      {/* Animated background blobs */}
      <LiquidBlob
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        size={800}
        color="rgba(159,129,185,0.25)"
        delay={0}
      />
      <LiquidBlob
        className="left-[15%] top-[25%]"
        size={450}
        color="rgba(195,168,216,0.2)"
        delay={1}
        intensity={0.5}
      />
      <LiquidBlob
        className="right-[10%] bottom-[15%]"
        size={400}
        color="rgba(159,129,185,0.15)"
        delay={2}
        intensity={0.7}
      />

      {/* Floating droplets */}
      <FloatingDroplets count={20} />

      {/* Falling water from bottle */}
      <FallingWaterDrops />

      {/* Water stream from bottle */}
      <div
        ref={waterStreamRef}
        className="absolute left-1/2 top-[35%] w-1 h-[40vh] -translate-x-1/2 origin-top"
        style={{
          background: 'linear-gradient(180deg, rgba(159,129,185,0.4) 0%, rgba(159,129,185,0.1) 50%, transparent 100%)',
          filter: 'blur(2px)',
          willChange: 'transform',
        }}
      />

      {/* 3D Canvas for bottle */}
      <div
        ref={bottleContainerRef}
        className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] z-10"
        style={{ willChange: 'transform' }}
      >
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, 5, 5]} intensity={0.5} color="#9f81b9" />
            
            <WaterBottle3D position={[0, -0.2, 0]} scale={2.5} />
            <FloatingParticles count={40} spread={5} size={0.02} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content overlay */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        {/* Headline */}
        <h1
          ref={headlineRef}
          className="heading-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-6"
          style={{ perspective: '1000px', willChange: 'transform, opacity' }}
        >
          <span className="word inline-block">I</span>{' '}
          <span className="word inline-block">ONLY</span>{' '}
          <span className="word inline-block">DRINK</span>{' '}
          <span className="word inline-block">THE</span>{' '}
          <span className="word inline-block text-luxury-purple drop-shadow-[0_0_30px_rgba(159,129,185,0.5)]">GREATEST</span>
        </h1>

        {/* Subtext */}
        <p
          ref={subtextRef}
          className="font-body text-lg sm:text-xl text-luxury-gray max-w-2xl mx-auto mb-10"
          style={{ willChange: 'transform, opacity' }}
        >
          Join a self-development movement and wellness water brand globally.
        </p>

        {/* CTA Button */}
        <button
          ref={ctaRef}
          onClick={scrollToContact}
          className="btn-luxury group relative overflow-hidden"
          style={{ willChange: 'transform, opacity' }}
        >
          <span className="relative z-10">COLLABORATE</span>
          <span className="absolute inset-0 bg-gradient-to-r from-luxury-purple via-[#b8a0cc] to-luxury-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
          </span>
          <span className="absolute inset-[-20px] bg-luxury-purple/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-luxury-gray uppercase tracking-widest">
          Scroll to explore
        </span>
        <div className="w-6 h-10 border-2 border-luxury-purple/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-luxury-purple rounded-full animate-bounce" />
        </div>
      </div>

      {/* Header and Nav ... */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6 flex justify-between items-center lg:hidden">
        <span className="font-display font-bold text-xl tracking-tight">ELEV8</span>
        <button onClick={scrollToContact} className="px-4 py-2 bg-luxury-purple text-white text-sm font-display font-bold uppercase rounded-full">
          Collaborate
        </button>
      </div>
      <div className="absolute top-8 left-8 z-30 hidden lg:block">
        <span className="font-display font-bold text-2xl tracking-tight">ELEV8</span>
      </div>
      <div className="absolute top-8 right-8 z-30 hidden lg:flex items-center gap-5">
        {['Home', 'Story', 'Packages', 'Creators', 'Contact'].map((item) => (
          <button
            key={item}
            onClick={() => {
              const id = item.toLowerCase();
              const element = document.getElementById(id === 'home' ? 'home' : id);
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-body text-sm text-luxury-gray hover:text-luxury-purple transition-colors relative group"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-purple group-hover:w-full transition-all duration-300" />
          </button>
        ))}
        <button onClick={scrollToContact} className="px-5 py-2.5 bg-luxury-purple text-white text-sm font-display font-bold uppercase rounded-full hover:shadow-glow transition-shadow">
          Collaborate
        </button>
      </div>
    </div>
  );
}
