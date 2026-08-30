import React from 'react';
import { CheckCircle2, Heart, Info, ShoppingBag, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export const ToastManager: React.FC = () => {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const isWishlist = toast.title.toLowerCase().includes('wishlist');

        return (
          <div 
            key={toast.id} 
            className={`toast ${isWishlist ? 'toast-wishlist-glossy' : ''} ${toast.type === 'success' ? 'toast-success' : ''}`}
            onClick={() => removeToast(toast.id)}
          >
            {/* Glossy Glass Specular Sheen Effect */}
            <div className="toast-gloss-highlight" aria-hidden="true" />

            {toast.productImage ? (
              <div className="toast-image-gloss-wrapper">
                <img 
                  src={toast.productImage} 
                  alt={toast.title} 
                  className="toast-product-thumb"
                />
                {isWishlist && (
                  <div className="toast-thumb-heart-badge">
                    <Heart size={10} fill="#FF385C" stroke="#FF385C" />
                  </div>
                )}
              </div>
            ) : isWishlist ? (
              <div className="toast-icon-gloss-wrapper">
                <Heart size={18} fill="var(--color-brand)" stroke="var(--color-brand)" />
              </div>
            ) : toast.type === 'success' ? (
              <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            ) : toast.type === 'cart' ? (
              <ShoppingBag size={18} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
            ) : (
              <Info size={18} style={{ color: '#FFB400', flexShrink: 0 }} />
            )}

            <div style={{ flex: 1, zIndex: 2 }}>
              <div style={{ fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.92, marginTop: '2px', lineHeight: 1.35 }}>
                {toast.message}
              </div>
            </div>

            <button 
              className="toast-close-btn"
              onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
