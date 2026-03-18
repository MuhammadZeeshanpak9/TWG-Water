import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Instagram, Linkedin, Twitter, Droplets } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter, label: 'TikTok', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Cookie Policy', href: '#' },
];

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 0.5,
          },
          force3D: true,
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <footer
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(243,239,248,0.5) 0%, rgba(159,129,185,0.15) 100%)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden" style={{ willChange: 'transform' }}>
        <svg viewBox="0 0 1440 100" className="absolute bottom-0 w-[200%] animate-wave" preserveAspectRatio="none">
          <path fill="rgba(159,129,185,0.2)" d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,100 L0,100 Z" />
        </svg>
        <svg viewBox="0 0 1440 100" className="absolute bottom-0 w-[200%] animate-wave" style={{ animationDelay: '-3s', animationDuration: '10s' }} preserveAspectRatio="none">
          <path fill="rgba(195,168,216,0.15)" d="M0,80 C360,40 720,100 1080,80 C1260,70 1350,90 1440,80 L1440,100 L0,100 Z" />
        </svg>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'transform' }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${20 + Math.random() * 80}%`,
              width: `${6 + Math.random() * 12}px`,
              height: `${6 + Math.random() * 12}px`,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(159,129,185,${0.3 + Math.random() * 0.3}))`,
              boxShadow: `0 0 ${8 + Math.random() * 8}px rgba(159,129,185,0.5)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div ref={contentRef} className="container mx-auto px-6 lg:px-12 relative z-10 pt-12" style={{ willChange: 'transform, opacity' }}>
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="w-8 h-8 text-luxury-purple group-hover:rotate-12 transition-transform duration-300" strokeWidth={1.5} />
              <span className="font-display font-bold text-3xl tracking-tight text-luxury-dark">ELEV8</span>
            </div>
            <p className="font-body text-luxury-gray text-sm leading-relaxed max-w-xs">Hydration, elevated. The premium wellness water brand for those who demand the greatest.</p>
            <div className="flex gap-2 mt-6">
              <div className="w-4 h-4 rounded-full bg-luxury-purple/50 animate-pulse shadow-glow" />
              <div className="w-3 h-3 rounded-full bg-luxury-purple/35 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="w-5 h-5 rounded-full bg-luxury-purple/40 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-luxury-dark mb-6">Contact</h4>
            <a href="mailto:hello@elev8water.co" className="font-body text-luxury-gray hover:text-luxury-purple transition-colors block mb-3 relative group">
              hello@elev8water.co
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-purple group-hover:w-full transition-all duration-300" />
            </a>
            <p className="font-body text-luxury-gray text-sm">Global Headquarters</p>
            <div className="mt-6 w-12 h-px bg-gradient-to-r from-luxury-purple to-transparent" />
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-luxury-dark mb-6">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-purple hover:text-white transition-all duration-300 group hover:scale-110 hover:rotate-6 shadow-lg"
                  >
                    <Icon className="w-5 h-5 text-luxury-purple group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-luxury-purple/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-luxury-gray">© 2026 Elev8 Water. All rights reserved.</p>
          <div className="flex gap-6">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="font-body text-xs text-luxury-gray hover:text-luxury-purple transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-purple group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-luxury-purple/50 to-transparent" />
      <div className="absolute bottom-10 right-10 w-5 h-5 rounded-full bg-luxury-purple/30 animate-float shadow-glow" />
      <div className="absolute top-24 left-20 w-4 h-4 rounded-full bg-luxury-purple/20 animate-float-slow" />

      <style>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave {
          animation: wave 8s linear infinite;
        }
      `}</style>
    </footer>
  );
}
