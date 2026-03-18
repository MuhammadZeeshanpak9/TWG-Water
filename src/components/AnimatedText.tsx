import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  children: string | string[];
  className?: string;
  type?: 'words' | 'chars' | 'lines';
  delay?: number;
  stagger?: number;
  duration?: number;
  trigger?: boolean;
}

export default function AnimatedText({
  children,
  className = '',
  type = 'words',
  delay = 0,
  stagger = 0.05,
  duration = 0.6,
  trigger = true,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.animate-item');
    
    const vars: gsap.TweenVars = {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration,
      stagger,
      delay,
      ease: 'power3.out',
      force3D: true,
    };

    if (trigger) {
      vars.scrollTrigger = {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      };
    }

    gsap.fromTo(
      elements,
      { y: 60, opacity: 0, rotateX: -45 },
      vars
    );
  }, { dependencies: [delay, duration, stagger, trigger], scope: containerRef });

  const splitText = () => {
    const text = Array.isArray(children) ? children.join('') : children;
    
    if (type === 'words') {
      return text.split(' ').map((word, i) => (
        <span key={i} className="animate-item inline-block mr-[0.25em]" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
          {word}
        </span>
      ));
    }
    
    if (type === 'chars') {
      return text.split('').map((char, i) => (
        <span key={i} className="animate-item inline-block" style={{ transformStyle: 'preserve-3d', display: char === ' ' ? 'inline' : 'inline-block', width: char === ' ' ? '0.25em' : 'auto', willChange: 'transform, opacity' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }
    
    const lines = text.split('\n');
    return lines.map((line, i) => (
      <span key={i} className="animate-item block" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
        {line}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className={`perspective-1000 ${className}`}>
      {splitText()}
    </div>
  );
}
