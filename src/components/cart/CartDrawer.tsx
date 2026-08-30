import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';
import type { Order } from '../../types';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setCartOpen, setCheckoutOpen, formatPrice, addToast, setOrderSuccess } = useUI();
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    shipping, 
    tax, 
    discount, 
    total,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    clearCart
  } = useCart();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      addToast('Promo Code Applied', res.message, 'success');
      setPromoInput('');
    } else {
      addToast('Promo Error', res.message, 'info');
    }
  };

  const handleProceedToCheckout = () => {
    // No action performed on Proceed to Checkout for now
  };

  return (
    <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--color-dark)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Your Bag</h3>
            <span style={{ fontSize: '14px', color: 'var(--color-subtle)' }}>({items.length} unique pieces)</span>
          </div>
          <button className="btn-icon" onClick={() => setCartOpen(false)} aria-label="Close bag">
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="drawer-body">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div 
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                style={{ 
                  display: 'flex', 
                  gap: '14px', 
                  paddingBottom: '16px', 
                  borderBottom: idx < items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' 
                }}
              >
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.title} 
                  style={{ width: '80px', height: '96px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                />
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.3 }}>{item.product.title}</h4>
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                        style={{ color: 'var(--color-subtle)', padding: '2px' }}
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span className="badge badge-tag" style={{ padding: '2px 6px', fontSize: '11px' }}>Size: {item.selectedSize}</span>
                      <span className="badge badge-tag" style={{ padding: '2px 6px', fontSize: '11px' }}>{item.selectedColor}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div className="quantity-stepper" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                      <button 
                        className="stepper-btn" 
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, -1)}
                      >
                        -
                      </button>
                      <span className="stepper-value">{item.quantity}</span>
                      <button 
                        className="stepper-btn" 
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, 1)}
                      >
                        +
                      </button>
                    </div>

                    <span style={{ fontWeight: 700, fontSize: '15px' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div 
                style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: 'var(--color-surface-subtle)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 16px auto' 
                }}
              >
                <ShoppingBag size={24} style={{ color: 'var(--color-subtle)' }} />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Your bag is empty</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-subtle)', marginBottom: '20px' }}>
                Explore our curated cashmere, fine wool, and pure linen garments.
              </p>
              <button className="btn btn-outline btn-pill" onClick={() => setCartOpen(false)}>
                Explore Collections
              </button>
            </div>
          )}

          {/* Promo Code Box */}
          {items.length > 0 && (
            <div style={{ marginTop: '12px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              {appliedPromo ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontWeight: 600 }}>
                    <ShieldCheck size={16} /> Promo <strong>{appliedPromo}</strong> active (-{formatPrice(discount)})
                  </div>
                  <button onClick={removePromoCode} style={{ fontSize: '12px', textDecoration: 'underline', color: 'var(--color-subtle)' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Promo code (e.g. BLUEZ15)"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                    }}
                  />
                  <button type="submit" className="btn btn-dark" style={{ padding: '8px 14px', fontSize: '13px' }}>
                    Apply
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-subtle)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-brand)' }}>
                  <span>Member Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-subtle)' }}>Shipping</span>
                <span>{shipping === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : formatPrice(shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-subtle)' }}>Estimated Sales Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '4px', fontSize: '16px', fontWeight: 800 }}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-pill btn-lg" 
              style={{ width: '100%', height: '50px' }}
              onClick={handleProceedToCheckout}
            >
              <span>Proceed to Checkout • {formatPrice(total)}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
