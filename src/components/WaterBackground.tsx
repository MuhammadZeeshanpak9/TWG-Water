import { useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Simplified WaveLayer using GSAP ticker for smoother updates
function WaveLayer({ color, opacity, speed, amplitude, yOffset }: { color: string; opacity: number; speed: number; amplitude: number; yOffset: number; }) {
  const waveRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (!waveRef.current) return;

    let offset = 0;
    const generateWavePath = (off: number, amp: number, y: number) => {
      let path = `M 0 ${y}`;
      // Larger steps for performance (30px instead of 10px/20px)
      for (let x = 0; x <= 1440; x += 30) {
        const yPos = y + Math.sin((x + off) * 0.01) * amp + Math.sin((x + off * 0.5) * 0.02) * (amp * 0.5);
        path += ` L ${x} ${yPos}`;
      }
      path += ` L 1440 400 L 0 400 Z`;
      return path;
    };

    const updateWave = () => {
      offset += speed;
      if (waveRef.current) {
        waveRef.current.setAttribute('d', generateWavePath(offset, amplitude, yOffset));
      }
    };

    gsap.ticker.add(updateWave);
    return () => gsap.ticker.remove(updateWave);
  }, { dependencies: [speed, amplitude, yOffset] });

  return (
    <svg className="absolute w-full pointer-events-none" style={{ height: '400px', top: 0 }} viewBox="0 0 1440 400" preserveAspectRatio="none">
      <path ref={waveRef} fill={color} opacity={opacity} />
    </svg>
  );
}

export default function WaterBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const waterLevelRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const bubbles = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: 8 + Math.random() * 20,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 12 + Math.random() * 8,
    opacity: 0.15 + Math.random() * 0.25,
  })), []);

  const particles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 3,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
  })), []);

  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. Water Level - smooth scrub
    if (waterLevelRef.current) {
      gsap.to(waterLevelRef.current, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        }
      });
    }

    // 2. Batched Bubbles - Unified timeline/tweens
    const bubbleEls = bubblesRef.current?.querySelectorAll('.bubble');
    if (bubbleEls) {
      bubbleEls.forEach((el, i) => {
        const b = bubbles[i];
        gsap.to(el, {
          y: '-120vh',
          x: `+=${Math.random() * 60 - 30}`,
          duration: b.duration,
          delay: b.delay,
          repeat: -1,
          ease: 'none',
          force3D: true,
        });
        gsap.to(el, {
          scale: 1.2,
          opacity: b.opacity * 1.5,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }

    // 3. Batched Particles
    const particleEls = particlesRef.current?.querySelectorAll('.particle');
    if (particleEls) {
      particleEls.forEach((el, i) => {
        const p = particles[i];
        gsap.to(el, {
          y: '-=20',
          x: `+=${Math.random() * 30 - 15}`,
          duration: 4 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          delay: p.delay,
          ease: 'sine.inOut',
          force3D: true,
        });
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(243,239,248,0.15) 0%, rgba(159,129,185,0.08) 30%, rgba(159,129,185,0.12) 60%, rgba(159,129,185,0.2) 100%)` }} />

      {/* Rising Water Level */}
      <div ref={waterLevelRef} className="absolute bottom-0 left-0 right-0" style={{ height: '0%', background: `linear-gradient(180deg, rgba(159,129,185,0.05) 0%, rgba(159,129,185,0.1) 30%, rgba(159,129,185,0.2) 70%, rgba(159,129,185,0.3) 100%)`, willChange: 'height' }}>
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
          <WaveLayer color="#9f81b9" opacity={0.25} speed={1.2} amplitude={12} yOffset={20} />
          <WaveLayer color="#c4a8d8" opacity={0.15} speed={0.8} amplitude={8} yOffset={25} />
        </div>
      </div>

      <div ref={bubblesRef} className="absolute inset-0 overflow-hidden">
        {bubbles.map(b => (
          <div key={b.id} className="bubble absolute rounded-full" style={{ left: b.left, width: b.size, height: b.size, bottom: '-50px', background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(159,129,185,${b.opacity}) 40%)`, opacity: b.opacity, willChange: 'transform' }} />
        ))}
      </div>

      <div ref={particlesRef} className="absolute inset-0">
        {particles.map(p => (
          <div key={p.id} className="particle absolute rounded-full" style={{ left: p.left, top: p.top, width: p.size, height: p.size, background: `rgba(255,255,255,0.5)`, boxShadow: `0 0 10px rgba(159,129,185,0.3)`, opacity: 0.25, willChange: 'transform' }} />
        ))}
      </div>

      {/* Reduced active effects for better performance */}
      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden opacity-20">
        <svg className="absolute w-[200%] h-full animate-wave-slow" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="rgba(159,129,185,0.2)" d="M0,100 C240,150 480,50 720,100 C960,150 1200,50 1440,100 L1440,200 L0,200 Z" />
        </svg>
      </div>

      <div className="absolute inset-0 overflow-hidden opacity-30">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="absolute animate-caustic" style={{ left: `${i * 25}%`, top: 0, width: '100px', height: '100%', background: `linear-gradient(180deg, transparent 0%, rgba(159,129,185,0.05) 50%, transparent 100%)`, transform: `rotate(${-5 + Math.random() * 10}deg)`, animationDelay: `${i * 1}s` } as any} />
        ))}
      </div>

      <style>{`
        @keyframes wave-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-wave-slow { animation: wave-slow 25s linear infinite; }
        @keyframes caustic { 0%, 100% { opacity: 0.2; transform: translateX(-15px); } 50% { opacity: 0.5; transform: translateX(15px); } }
        .animate-caustic { animation: caustic 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
