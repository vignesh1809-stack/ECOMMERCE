import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';

export const Banner: React.FC = () => {
  const { appliedPromo } = useCart();
  const { formatPrice } = useUI();

  return (
    <div className="header-announcement">
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <Sparkles size={14} style={{ color: '#FFB400' }} />
        <span>
          <strong>BLUEZ LUXORIA PRIVÉ:</strong> Complimentary Express Delivery on orders over {formatPrice(150)} • Use code <span style={{ textDecoration: 'underline', fontWeight: 700 }}>BLUEZ15</span> for 15% off
        </span>
        {appliedPromo && (
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} /> {appliedPromo} ACTIVE
          </span>
        )}
      </div>
    </div>
  );
};
