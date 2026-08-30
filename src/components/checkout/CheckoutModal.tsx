import React, { useState } from 'react';
import { X, CreditCard, Lock, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import type { Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setCheckoutOpen, formatPrice, setOrderSuccess } = useUI();
  const { items, subtotal, shipping, tax, discount, total, clearCart } = useCart();

  const [fullName, setFullName] = useState('Alexandra Thorne');
  const [email, setEmail] = useState('alexandra.thorne@example.com');
  const [street, setStreet] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('94107');
  const [country] = useState('United States');

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'klarna'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9128');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF385C', '#222222', '#FFB400', '#008A05']
        });
      } catch (err) {
        console.log('Confetti triggered');
      }

      const generatedOrder: Order = {
        id: `ATL-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        items: [...items],
        subtotal,
        shipping,
        tax,
        discount,
        total,
        shippingAddress: {
          fullName,
          email,
          street,
          city,
          state,
          zip,
          country,
        },
        deliveryEstimate: '3-4 Business Days (Express Courier)',
        paymentMethod: paymentMethod === 'card' ? 'Visa ending in 9128' : paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Klarna (4-Pay)',
        status: 'confirmed',
      };

      clearCart();
      setCheckoutOpen(false);
      setOrderSuccess(generatedOrder);
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '960px', borderRadius: '24px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <button className="btn-icon" onClick={() => setCheckoutOpen(false)}>
            <X size={18} />
          </button>
          <span className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Lock size={15} style={{ color: 'var(--color-success)' }} /> Secure Bluez Luxoria Express Checkout
          </span>
          <div style={{ width: 38 }} />
        </div>

        {/* Checkout Content Grid */}
        <div className="modal-body" style={{ padding: '24px 32px' }}>
          <form onSubmit={handlePlaceOrder}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '36px' }}>
              
              {/* Left Column: Delivery & Payment Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Delivery Address */}
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} /> 1. Shipping & Delivery
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: '1 / span 2' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-subtle)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / span 2' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-subtle)', display: 'block', marginBottom: '4px' }}>Email for Tracking</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / span 2' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-subtle)', display: 'block', marginBottom: '4px' }}>Street Address</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-subtle)', display: 'block', marginBottom: '4px' }}>City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-subtle)', display: 'block', marginBottom: '4px' }}>State & ZIP</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={e => setState(e.target.value)}
                          style={{ width: '60px', padding: '10px 8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        />
                        <input
                          type="text"
                          required
                          value={zip}
                          onChange={e => setZip(e.target.value)}
                          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

                {/* Payment Method */}
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} /> 2. Payment Method
                  </h4>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      className={`btn ${paymentMethod === 'card' ? 'btn-dark' : 'btn-outline'}`}
                      style={{ flex: 1, borderRadius: '8px', fontSize: '13px' }}
                      onClick={() => setPaymentMethod('card')}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      className={`btn ${paymentMethod === 'apple_pay' ? 'btn-dark' : 'btn-outline'}`}
                      style={{ flex: 1, borderRadius: '8px', fontSize: '13px' }}
                      onClick={() => setPaymentMethod('apple_pay')}
                    >
                      Apple Pay
                    </button>
                    <button
                      type="button"
                      className={`btn ${paymentMethod === 'klarna' ? 'btn-dark' : 'btn-outline'}`}
                      style={{ flex: 1, borderRadius: '8px', fontSize: '13px' }}
                      onClick={() => setPaymentMethod('klarna')}
                    >
                      Klarna (4x)
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div style={{ background: 'var(--color-surface-subtle)', padding: '16px', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ gridColumn: '1 / span 2' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-subtle)', display: 'block', marginBottom: '4px' }}>Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-subtle)', display: 'block', marginBottom: '4px' }}>Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-subtle)', display: 'block', marginBottom: '4px' }}>CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Order Summary Preview */}
              <div style={{ background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Order Summary</h4>

                {/* Items Mini List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', marginBottom: '16px' }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                      <img src={item.product.images[0]} alt={item.product.title} style={{ width: '38px', height: '46px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{item.product.title}</div>
                        <div style={{ color: 'var(--color-subtle)', fontSize: '11px' }}>Qty: {item.quantity} • {item.selectedSize}</div>
                      </div>
                      <span style={{ fontWeight: 600 }}>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', marginBottom: '12px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-subtle)' }}>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-brand)' }}>
                      <span>Member Savings</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-subtle)' }}>Express Delivery</span>
                    <span>{shipping === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : formatPrice(shipping)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-subtle)' }}>Estimated Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '6px', fontSize: '18px', fontWeight: 800 }}>
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-pill btn-lg"
                  style={{ width: '100%', marginTop: '20px', height: '52px' }}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span>Confirming with Bluez Luxoria...</span>
                  ) : (
                    <span>Complete Order • {formatPrice(total)}</span>
                  )}
                </button>

                <p style={{ fontSize: '11px', color: 'var(--color-subtle)', textAlign: 'center', marginTop: '12px' }}>
                  30-Day Return Guarantee • Zero Risk Home Try-On
                </p>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
