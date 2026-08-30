import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const WishlistDrawer: React.FC = () => {
  const { isWishlistOpen, setWishlistOpen, formatPrice, openPDP, addToast } = useUI();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  const handleMoveToBag = (product: any) => {
    const size = product.sizes.find((s: any) => s.inStock)?.size || product.sizes[0]?.size || 'M';
    const color = product.colors[0]?.name || 'Classic';
    addToCart(product, size, color, 1);
    removeFromWishlist(product.id);
    addToast('Moved to Bag', `${product.title} (${size}) moved to your bag.`, 'cart', product.images[0]);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setWishlistOpen(false)}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} style={{ color: 'var(--color-brand)' }} fill="var(--color-brand)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Saved Collection</h3>
            <span style={{ fontSize: '14px', color: 'var(--color-subtle)' }}>({items.length})</span>
          </div>
          <button className="btn-icon" onClick={() => setWishlistOpen(false)} aria-label="Close wishlist">
            <X size={18} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="drawer-body">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div 
                key={item.product.id}
                style={{ 
                  display: 'flex', 
                  gap: '14px', 
                  paddingBottom: '16px', 
                  borderBottom: idx < items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' 
                }}
              >
                <div 
                  className="wishlist-item-image-wrapper"
                  onClick={() => { setWishlistOpen(false); openPDP(item.product); }} 
                  title={`View ${item.product.title}`}
                >
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.title} 
                  />
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 
                        style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.3, cursor: 'pointer' }}
                        onClick={() => { setWishlistOpen(false); openPDP(item.product); }}
                      >
                        {item.product.title}
                      </h4>
                      <button 
                        onClick={() => removeFromWishlist(item.product.id)}
                        style={{ color: 'var(--color-subtle)', padding: '2px' }}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <p style={{ fontSize: '12px', color: 'var(--color-subtle)', marginTop: '2px' }}>
                      {item.product.brand} • {item.product.atelierLocation}
                    </p>
                    
                    <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px' }}>
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button 
                      className="btn btn-dark btn-pill"
                      style={{ fontSize: '12px', padding: '6px 12px', flex: 1 }}
                      onClick={() => handleMoveToBag(item.product)}
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Bag</span>
                    </button>
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
                <Heart size={24} style={{ color: 'var(--color-subtle)' }} />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Your wishlist is empty</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-subtle)', marginBottom: '20px' }}>
                Tap the heart icon on any garment to save pieces for later curation.
              </p>
              <button className="btn btn-outline btn-pill" onClick={() => setWishlistOpen(false)}>
                Start Exploring
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
