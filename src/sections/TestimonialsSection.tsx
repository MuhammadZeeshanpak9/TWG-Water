import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Quote, Star } from 'lucide-react';
import LiquidBlob from '../components/LiquidBlob';
import FloatingDroplets from '../components/FloatingDroplets';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  { id: 1, quote: 'Elev8 turned our campaign into a movement. The brand alignment was perfect.', author: 'A. R.', role: 'Creative Director', rating: 5 },
  { id: 2, quote: 'The smoothest wholesale partnership we\'ve run. Reliable and professional.', author: 'M. T.', role: 'Retail Lead', rating: 5 },
  { id: 3, quote: 'Premium feel, premium results. Our audience loves the collaboration.', author: 'S. K.', role: 'Brand Manager', rating: 5 },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Optimized staggered animation for all testimonial cards
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, rotateX: -15, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.5,
          },
          force3D: true,
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center py-20 overflow-hidden"
    >
      <LiquidBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={900} color="rgba(159,129,185,0.28)" delay={1} intensity={0.5} />
      <FloatingDroplets count={20} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 glass-card-strong inline-block px-10 py-6 mx-auto w-full max-w-2xl" style={{ willChange: 'transform, opacity' }}>
          <span className="font-mono text-sm text-luxury-purple uppercase tracking-widest mb-4 block">Testimonials</span>
          <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl">
            WHAT <span className="text-luxury-purple drop-shadow-[0_0_20px_rgba(159,129,185,0.5)]">PARTNERS</span> SAY
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8" style={{ perspective: '1000px' }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={el => { cardsRef.current[index] = el; }}
              className="glass-card p-8 group card-lift relative overflow-hidden"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(159,129,185,0.2) 0%, transparent 70%)' }}
              />

              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-luxury-purple/15 flex items-center justify-center group-hover:bg-luxury-purple/30 group-hover:scale-110 transition-all duration-300 relative z-10">
                <Quote className="w-6 h-6 text-luxury-purple" strokeWidth={1.5} />
              </div>

              <div className="flex gap-1 mb-6 relative z-10">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-luxury-purple fill-luxury-purple/40" strokeWidth={1.5} />
                ))}
              </div>

              <blockquote className="font-body text-lg text-luxury-dark leading-relaxed mb-8 pt-4 relative z-10">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-luxury-purple to-[#c4a8d8] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="font-display font-bold text-white text-lg">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-luxury-dark group-hover:text-luxury-purple transition-colors duration-300">
                    {testimonial.author}
                  </p>
                  <p className="font-body text-sm text-luxury-gray">{testimonial.role}</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 w-2 h-2 rounded-full bg-luxury-purple/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow" />
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 30px rgba(159,129,185,0.2), 0 0 40px rgba(159,129,185,0.2)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
