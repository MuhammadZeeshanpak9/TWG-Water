import { useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export default function LiquidCard({ 
  children, 
  className = '',
  glowColor = '#9f81b9'
}: LiquidCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePos({ x, y });

    // Tilt effect
    const tiltX = (y - 0.5) * 10;
    const tiltY = (x - 0.5) * -10;
    
    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative glass-card overflow-hidden ${className}`}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Liquid gradient background that follows mouse */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${glowColor}20 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Shimmer effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(
            105deg,
            transparent 40%,
            ${glowColor}15 45%,
            ${glowColor}25 50%,
            ${glowColor}15 55%,
            transparent 60%
          )`,
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.8s ease-in-out',
        }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${glowColor}20, 0 0 30px ${glowColor}20`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Corner accents */}
      <div 
        className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl transition-all duration-300"
        style={{ 
          borderColor: isHovered ? glowColor : 'transparent',
          opacity: isHovered ? 0.5 : 0,
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-2xl transition-all duration-300"
        style={{ 
          borderColor: isHovered ? glowColor : 'transparent',
          opacity: isHovered ? 0.5 : 0,
        }}
      />
    </div>
  );
}
