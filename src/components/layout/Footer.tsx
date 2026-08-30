import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="luxury-footer-wrapper">
      <div className="app-container">
        <div className="luxury-footer-card">
          
          {/* Left: Brand Copyright & Heritage */}
          <div className="luxury-footer-brand">
            <span className="luxury-footer-copy">© 2026 Bluez Luxoria</span>
            <span className="luxury-footer-bullet">•</span>
            <span className="luxury-footer-tagline">Haute Couture & Essentials</span>
          </div>

          {/* Right: Legal & Policies */}
          <div className="luxury-footer-links">
            <a href="#privacy" className="luxury-footer-link">Privacy Policy</a>
            <span className="luxury-footer-bullet">•</span>
            <a href="#terms" className="luxury-footer-link">Terms of Service</a>
            <span className="luxury-footer-bullet">•</span>
            <a href="#garment-care" className="luxury-footer-link">Garment Care</a>
          </div>

        </div>
      </div>
    </footer>
  );
};
