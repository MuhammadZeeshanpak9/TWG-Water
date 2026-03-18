import { useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface Droplet {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingDropletsProps {
  count?: number;
  className?: string;
}

export default function FloatingDroplets({ count = 20, className = '' }: FloatingDropletsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const droplets: Droplet[] = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 6 + Math.random() * 20,
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 5,
      opacity: 0.3 + Math.random() * 0.5,
    })), [count]);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const dropletEls = container.querySelectorAll('.floating-droplet');
    
    dropletEls.forEach((el, i) => {
      const d = droplets[i];
      if (!d) return;

      // Floating animation
      gsap.to(el, {
        y: `-=${25 + Math.random() * 40}`,
        x: `+=${Math.random() * 30 - 15}`,
        duration: d.duration,
        repeat: -1,
        yoyo: true,
        delay: d.delay,
        ease: 'sine.inOut',
        force3D: true,
      });

      // Pulsing opacity
      gsap.to(el, {
        opacity: d.opacity * 1.8,
        duration: 1.5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
        ease: 'sine.inOut',
        force3D: true,
      });

      // Subtle scale pulse
      gsap.to(el, {
        scale: 1.15,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        delay: Math.random(),
        ease: 'sine.inOut',
        force3D: true,
      });
    });
  }, { scope: containerRef, dependencies: [droplets] });

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {droplets.map((droplet) => (
        <div
          key={droplet.id}
          className="floating-droplet absolute rounded-full"
          style={{
            left: `${droplet.x}%`,
            top: `${droplet.y}%`,
            width: droplet.size,
            height: droplet.size,
            background: `radial-gradient(circle at 25% 25%, 
              rgba(255,255,255,0.95) 0%, 
              rgba(159,129,185,${droplet.opacity + 0.2}) 35%, 
              rgba(159,129,185,${droplet.opacity}) 70%, 
              rgba(159,129,185,${droplet.opacity * 0.5}) 100%)`,
            boxShadow: `
              0 0 ${droplet.size * 1.5}px rgba(159,129,185,0.6), 
              0 0 ${droplet.size * 3}px rgba(159,129,185,0.3),
              inset 0 0 ${droplet.size/2}px rgba(255,255,255,0.6)`,
            opacity: droplet.opacity,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}
