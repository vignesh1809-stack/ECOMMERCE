import React from 'react';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, Sparkles } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export const OrderSuccessModal: React.FC = () => {
  const { activeOrder, setOrderSuccess, formatPrice } = useUI();

  if (!activeOrder) return null;

  return (
    <div className="modal-backdrop" onClick={() => setOrderSuccess(null)}>
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '680px', borderRadius: '28px', padding: '32px' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'var(--color-success-light)', 
              color: 'var(--color-success)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px auto' 
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <span className="badge badge-guest-favorite" style={{ marginBottom: '8px' }}>
            <Sparkles size={12} style={{ color: 'var(--color-brand)' }} /> Order Reserved & Confirmed
          </span>

          <h2 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>
            Thank You, {activeOrder.shippingAddress.fullName.split(' ')[0]}!
          </h2>
          <p style={{ color: 'var(--color-subtle)', fontSize: '14px', marginTop: '4px' }}>
            Order confirmation #{activeOrder.id} has been dispatched to <strong>{activeOrder.shippingAddress.email}</strong>.
          </p>
        </div>

        {/* Order Tracking Progress Steps */}
        <div style={{ background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-subtle)', marginBottom: '16px' }}>
            Bluez Luxoria Preparation Status
          </h4>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-success)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={16} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700 }}>Confirmed</span>
            </div>

            <div style={{ flex: 1, height: '3px', background: 'var(--color-success)', margin: '0 8px', position: 'relative', top: '-10px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-dark)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PackageCheck size={16} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700 }}>Tailoring & QC</span>
            </div>

            <div style={{ flex: 1, height: '3px', background: '#DDDDDD', margin: '0 8px', position: 'relative', top: '-10px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EEEEEE', color: '#999999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={16} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-subtle)' }}>Express Delivery</span>
            </div>
          </div>
        </div>

        {/* Garments Ordered List */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Garment Details</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '160px', overflowY: 'auto' }}>
            {activeOrder.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <img src={item.product.images[0]} alt={item.product.title} style={{ width: '48px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>{item.product.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-subtle)' }}>
                    Qty: {item.quantity} • Size: {item.selectedSize} • {item.selectedColor}
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Delivery Address Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: '24px', fontSize: '13px' }}>
          <div>
            <span style={{ color: 'var(--color-subtle)', fontSize: '11px', textTransform: 'uppercase', display: 'block' }}>Delivery Address</span>
            <strong>{activeOrder.shippingAddress.fullName}</strong>
            <div>{activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.zip}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--color-subtle)', fontSize: '11px', textTransform: 'uppercase', display: 'block' }}>Estimated Arrival</span>
            <strong style={{ color: 'var(--color-dark)' }}>{activeOrder.deliveryEstimate}</strong>
            <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>Total Paid: {formatPrice(activeOrder.total)}</div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="btn btn-dark btn-pill btn-lg" 
          style={{ width: '100%' }}
          onClick={() => setOrderSuccess(null)}
        >
          <span>Continue Exploring Bluez Luxoria Collections</span>
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
};
