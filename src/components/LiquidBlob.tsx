import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface LiquidBlobProps {
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
  intensity?: number;
}

export default function LiquidBlob({
  className = '',
  color = 'rgba(159,129,185,0.25)',
  size = 600,
  delay = 0,
  intensity = 1,
}: LiquidBlobProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const innerBlobRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!blobRef.current) return;

    // Morphing animation
    const morphTl = gsap.timeline({ repeat: -1, yoyo: true });
    
    morphTl.to(blobRef.current, {
      borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
      scale: 1 + intensity * 0.1,
      duration: 4 + delay,
      ease: 'sine.inOut',
      force3D: true,
    })
    .to(blobRef.current, {
      borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
      scale: 1,
      duration: 4,
      ease: 'sine.inOut',
      force3D: true,
    })
    .to(blobRef.current, {
      borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%',
      scale: 1 + intensity * 0.05,
      duration: 3,
      ease: 'sine.inOut',
      force3D: true,
    });

    // Inner blob counter-rotation
    if (innerBlobRef.current) {
      gsap.to(innerBlobRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
        force3D: true,
      });
    }

    // Gentle floating
    gsap.to(blobRef.current, {
      y: '+=20',
      x: '+=10',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      force3D: true,
    });
  }, { scope: containerRef, dependencies: [delay, intensity] });

  return (
    <div ref={containerRef} className={`absolute pointer-events-none ${className}`}>
      <div
        ref={blobRef}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          filter: 'blur(60px)',
          opacity: 0.8,
          willChange: 'transform, border-radius',
        }}
      >
        {/* Inner glow layer */}
        <div
          ref={innerBlobRef}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 70% 70%, ${color.replace('0.25', '0.15')}, transparent 60%)`,
            borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  );
}
