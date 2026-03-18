import { useRef, useCallback } from 'react';

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface WaterRippleProps {
  children: React.ReactNode;
  className?: string;
}

export default function WaterRipple({ children, className = '' }: WaterRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const idCounter = useRef(0);

  const createRipple = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      x,
      y,
      id: idCounter.current++,
    };

    ripplesRef.current.push(newRipple);

    // Remove ripple after animation
    setTimeout(() => {
      ripplesRef.current = ripplesRef.current.filter(r => r.id !== newRipple.id);
    }, 1000);

    // Force re-render to show ripple
    container.style.setProperty('--ripple-x', `${x}px`);
    container.style.setProperty('--ripple-y', `${y}px`);
    
    const rippleEl = document.createElement('span');
    rippleEl.className = 'absolute rounded-full bg-luxury-purple/20 pointer-events-none animate-ripple-expand';
    rippleEl.style.left = `${x}px`;
    rippleEl.style.top = `${y}px`;
    rippleEl.style.width = '10px';
    rippleEl.style.height = '10px';
    rippleEl.style.marginLeft = '-5px';
    rippleEl.style.marginTop = '-5px';
    rippleEl.style.willChange = 'transform, opacity';
    
    container.appendChild(rippleEl);
    
    setTimeout(() => {
      rippleEl.remove();
    }, 1000);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
    >
      {children}
      <style>{`
        @keyframes ripple-expand {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(50);
            opacity: 0;
          }
        }
        .animate-ripple-expand {
          animation: ripple-expand 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
