import { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function WaterBubble({ size, left, delay, duration, opacity }: { size: number; left: string; delay: number; duration: number; opacity: number; }) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bubbleRef.current) return;
    
    // Rising animation
    gsap.to(bubbleRef.current, {
      y: '-120vh',
      x: `+=${Math.random() * 80 - 40}`,
      duration,
      delay,
      repeat: -1,
      ease: 'none',
      force3D: true,
    });

    // Pulsing size
    gsap.to(bubbleRef.current, {
      scale: 1.2,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Opacity pulse
    gsap.to(bubbleRef.current, {
      opacity: opacity * 1.5,
      duration: 1.5 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, { scope: bubbleRef });

  return (
    <div
      ref={bubbleRef}
      className="absolute rounded-full pointer-events-none"
      style={{
        left,
        width: size,
        height: size,
        bottom: '-50px',
        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(159,129,185,${opacity}) 40%, rgba(159,129,185,${opacity * 0.5}) 100%)`,
        boxShadow: `0 0 ${size}px rgba(159,129,185,0.6), inset 0 0 ${size/3}px rgba(255,255,255,0.5)`,
        opacity,
        willChange: 'transform, opacity',
      }}
    />
  );
}

function FloatingParticle({ size, left, top, delay }: { size: number; left: string; top: string; delay: number; }) {
  const particleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!particleRef.current) return;

    gsap.to(particleRef.current, {
      y: '-=30',
      x: `+=${Math.random() * 40 - 20}`,
      duration: 4 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      delay,
      ease: 'sine.inOut',
      force3D: true,
    });

    gsap.to(particleRef.current, {
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      delay: delay + 0.5,
      ease: 'sine.inOut',
    });
  }, { scope: particleRef });

  return (
    <div
      ref={particleRef}
      className="absolute rounded-full pointer-events-none"
      style={{
        left,
        top,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(255,255,255,0.95), rgba(159,129,185,0.7))`,
        boxShadow: `0 0 ${size * 2}px rgba(159,129,185,0.8)`,
        opacity: 0.4,
        willChange: 'transform, opacity',
      }}
    />
  );
}

function WaveLayer({ color, opacity, speed, amplitude, yOffset }: { color: string; opacity: number; speed: number; amplitude: number; yOffset: number; }) {
  const waveRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!waveRef.current) return;

    let offset = 0;
    let frameId: number;
    const generateWavePath = (off: number, amp: number, y: number) => {
      let path = `M 0 ${y}`;
      // Use larger steps for performance
      for (let x = 0; x <= 1440; x += 20) {
        const yPos = y + Math.sin((x + off) * 0.01) * amp + Math.sin((x + off * 0.5) * 0.02) * (amp * 0.5);
        path += ` L ${x} ${yPos}`;
      }
      path += ` L 1440 400 L 0 400 Z`;
      return path;
    };

    const animate = () => {
      offset += speed;
      if (waveRef.current) {
        waveRef.current.setAttribute('d', generateWavePath(offset, amplitude, yOffset));
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [speed, amplitude, yOffset]);

  return (
    <svg className="absolute w-full pointer-events-none" style={{ height: '400px', top: 0, willChange: 'contents' }} viewBox="0 0 1440 400" preserveAspectRatio="none">
      <path ref={waveRef} fill={color} opacity={opacity} />
    </svg>
  );
}

export default function WaterBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const waterLevelRef = useRef<HTMLDivElement>(null);

  const bubbles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: 8 + Math.random() * 25,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 12 + Math.random() * 15,
    opacity: 0.3 + Math.random() * 0.4,
  })), []);

  const particles = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 5,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
  })), []);

  useGSAP(() => {
    if (!waterLevelRef.current) return;
    
    gsap.to(waterLevelRef.current, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(243,239,248,0.3) 0%, rgba(159,129,185,0.15) 30%, rgba(159,129,185,0.25) 60%, rgba(159,129,185,0.4) 100%)` }} />

      <div ref={waterLevelRef} className="absolute bottom-0 left-0 right-0" style={{ height: '0%', background: `linear-gradient(180deg, rgba(159,129,185,0.1) 0%, rgba(159,129,185,0.25) 30%, rgba(159,129,185,0.4) 70%, rgba(159,129,185,0.55) 100%)`, willChange: 'height' }}>
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
          <WaveLayer color="#9f81b9" opacity={0.4} speed={1.5} amplitude={15} yOffset={20} />
          <WaveLayer color="#c4a8d8" opacity={0.3} speed={1} amplitude={10} yOffset={25} />
          <WaveLayer color="#f3eff8" opacity={0.2} speed={0.7} amplitude={8} yOffset={30} />
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden opacity-60" style={{ willChange: 'transform' }}>
        <svg className="absolute w-[200%] h-full animate-wave-slow" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="rgba(159,129,185,0.2)" d="M0,100 C240,150 480,50 720,100 C960,150 1200,50 1440,100 L1440,200 L0,200 Z" />
        </svg>
        <svg className="absolute w-[200%] h-full animate-wave-medium" viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ animationDelay: '-2s' }}>
          <path fill="rgba(195,168,216,0.15)" d="M0,120 C360,60 720,180 1080,120 C1260,90 1350,140 1440,120 L1440,200 L0,200 Z" />
        </svg>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map(bubble => <WaterBubble key={bubble.id} {...bubble} />)}
      </div>

      <div className="absolute inset-0">
        {particles.map(particle => <FloatingParticle key={particle.id} {...particle} />)}
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-caustic"
            style={{
              left: `${i * 12.5}%`,
              top: 0,
              width: '80px',
              height: '100%',
              background: `linear-gradient(180deg, transparent 0%, rgba(159,129,185,0.1) 30%, rgba(255,255,255,0.15) 50%, rgba(159,129,185,0.08) 70%, transparent 100%)`,
              transform: `rotate(${-10 + Math.random() * 20}deg)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              willChange: 'transform, opacity',
            } as any}
          />
        ))}
      </div>

      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9f81b9" stopOpacity="0" />
            <stop offset="50%" stopColor="#9f81b9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9f81b9" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1="-10%"
            y1={`${10 + i * 9}%`}
            x2="110%"
            y2={`${10 + i * 9}%`}
            stroke="url(#flowGradient)"
            strokeWidth={1 + Math.random() * 2}
            className="animate-flow-line"
            style={{ animationDelay: `${i * 0.4}s`, animationDuration: `${4 + Math.random() * 4}s`, willChange: 'transform' } as any}
          />
        ))}
      </svg>

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-water-stream"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-100px',
              width: `${2 + Math.random() * 2}px`,
              height: `${100 + Math.random() * 150}px`,
              background: `linear-gradient(180deg, transparent, rgba(159,129,185,0.2), rgba(255,255,255,0.3), transparent)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${3 + Math.random() * 3}px`,
              height: `${3 + Math.random() * 3}px`,
              background: 'radial-gradient(circle, white, rgba(159,129,185,0.8))',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(159,129,185,0.8)',
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes wave-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes wave-medium { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-wave-slow { animation: wave-slow 12s linear infinite; }
        .animate-wave-medium { animation: wave-medium 8s linear infinite; }
        @keyframes caustic { 0%, 100% { opacity: 0.3; transform: translateX(-20px); } 50% { opacity: 0.7; transform: translateX(20px); } }
        .animate-caustic { animation: caustic 8s ease-in-out infinite; }
        @keyframes flow-line { 0% { transform: translateX(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(100%); opacity: 0; } }
        .animate-flow-line { animation: flow-line 5s linear infinite; }
        @keyframes water-stream { 0% { transform: translateY(-100%); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }
        .animate-water-stream { animation: water-stream 4s linear infinite; }
        @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1); } }
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
