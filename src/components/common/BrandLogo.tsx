import React from 'react';
import { useUI } from '../../context/UIContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md',
  showTagline = true 
}) => {
  const { closePDP } = useUI();

  const handleLogoClick = () => {
    closePDP();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const emblemSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const nameFontSize = size === 'sm' ? '1rem' : size === 'lg' ? '1.4rem' : '1.18rem';

  return (
    <div 
      className={`brand-logo brand-logo-${size}`}
      onClick={handleLogoClick}
      role="button"
      tabIndex={0}
      title="Bluez Luxoria • Return to Home"
    >
      {/* Bluez Luxoria Stag Emblem (Pure Transparent Cutout, No BG Color) */}
      <div 
        className="brand-logo-emblem"
        style={{ 
          width: emblemSize, 
          height: emblemSize,
          background: 'transparent',
          borderRadius: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          boxShadow: 'none',
          border: 'none',
          overflow: 'visible'
        }}
      >
        <img 
          src="/bluez-logo-cutout.png" 
          alt="Bluez Luxoria Logo"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            display: 'block'
          }} 
        />
      </div>

      {/* Haute-Couture Wordmark & Sub-Label */}
      <div className="brand-logo-text">
        <span className="brand-name" style={{ fontSize: nameFontSize, letterSpacing: '0.08em' }}>
          Bluez Luxoria
        </span>
        {showTagline && (
          <span className="brand-tagline" style={{ letterSpacing: '0.22em' }}>
            Feel the luxury 
          </span>
        )}
      </div>
    </div>
  );
};
