import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Home, BookOpen, Package, Users, Mail } from 'lucide-react';

interface LeftNavigationProps {
  activeSection: string;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'story', label: 'Our Story', icon: BookOpen },
  { id: 'packages', label: 'Value Packages', icon: Package },
  { id: 'creators', label: 'Creators', icon: Users },
  { id: 'contact', label: 'Say Hello', icon: Mail },
];

export default function LeftNavigation({ activeSection }: LeftNavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useGSAP(() => {
    const activeIndex = navItems.findIndex(item => item.id === activeSection);
    const activeItem = itemRefs.current[activeIndex];
    
    if (activeItem && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        y: activeItem.offsetTop,
        height: activeItem.offsetHeight,
        duration: 0.5,
        ease: 'power3.out',
        force3D: true,
      });
    }
  }, [activeSection]);

  useGSAP(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out', force3D: true }
      );
    }
  }, { scope: navRef });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:block"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="glass-panel rounded-3xl p-1.5 relative">
        <div
          ref={indicatorRef}
          className="absolute left-2 right-2 rounded-xl bg-luxury-purple/20 transition-all"
          style={{ top: 0, willChange: 'transform, height' }}
        />
        
        <div className="relative flex flex-col gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isHovered = hoveredIndex === index;
            
            return (
              <button
                key={item.id}
                ref={el => { itemRefs.current[index] = el; }}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  relative flex items-center px-2 py-3 rounded-xl
                  transition-all duration-300 group
                  ${isActive ? 'text-luxury-purple' : 'text-luxury-gray'}
                  hover:text-luxury-purple
                `}
              >
                <span className={`
                  relative flex items-center justify-center w-8 h-8 rounded-lg
                  transition-all duration-300
                  ${isActive || isHovered ? 'bg-luxury-purple/10' : 'bg-transparent'}
                `}>
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                  {(isActive || isHovered) && (
                    <span className="absolute inset-0 rounded-lg bg-luxury-purple/20 animate-ping" />
                  )}
                </span>
                
                <span className={`
                  font-body text-sm font-medium whitespace-nowrap overflow-hidden
                  transition-all duration-500 ease-in-out
                  ${isActive ? 'opacity-100 max-w-xs ml-2' : 'opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:ml-2'}
                `}>
                  {item.label}
                </span>
                
                {(isActive || isHovered) && (
                  <span className="absolute inset-0 rounded-xl bg-luxury-purple/5 blur-sm -z-10" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes nav-float {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50% { transform: translateY(-52%) translateX(2px); }
        }
        nav {
          animation: nav-float 6s ease-in-out infinite;
        }
      `}</style>
    </nav>
  );
}
