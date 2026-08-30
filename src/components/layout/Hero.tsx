import React from 'react';
import { ChevronRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="hero-wide-container">
      {/* Expanded Wide Luxury Hero Canvas */}
      <div className="freshmart-hero-canvas">
        
        {/* Giant Decorative Typographic Watermark Background */}
        <div className="freshmart-big-text-watermark" aria-hidden="true" style={{ fontSize: 'clamp(3rem, 11vw, 8.5rem)' }}>
          Bluez  Luxoria
        </div>

        {/* Central Hero Fashion Persona Model */}
        <div className="freshmart-model-center">
          <img 
            src="/hero-model.png" 
            alt="Bluez Luxoria Terracotta Wool Coat Model" 
            className="freshmart-model-img"
          />
        </div>

        {/* Bottom Left Narrative Text & Pill CTA */}
        <div className="freshmart-bottom-content">
          <p className="freshmart-narrative">
            Shop from hundreds of premium hand-picked imported garments, Grade-A cashmere, and luxury essentials at direct Bluez Luxoria prices.
          </p>
          <button 
            className="freshmart-shop-now-btn"
            onClick={() => {
              const el = document.querySelector('.products-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Shop Now</span>
            <span className="freshmart-arrow-circle">
              <ChevronRight size={16} strokeWidth={2.5} />
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};
