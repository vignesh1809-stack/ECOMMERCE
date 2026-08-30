import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  Share2, 
  Sparkles, 
  ShieldCheck,
  Truck, 
  RotateCcw,
  Scissors,
  MapPin
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductDetailModal: React.FC = () => {
  const { activePDPProduct, closePDP, formatPrice, addToast, setCartOpen } = useUI();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = activePDPProduct;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Initialize selected size and color when product opens
  React.useEffect(() => {
    if (product) {
      const firstAvailableSize = product.sizes.find(s => s.inStock)?.size || product.sizes[0]?.size || '';
      setSelectedSize(firstAvailableSize);
      setSelectedColor(product.colors[0]?.name || '');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast('Please select a size', 'Choose your preferred size before adding to bag.', 'info');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    addToast(
      'Added to Bag', 
      `${quantity}x ${product.title} (${selectedSize}, ${selectedColor}) added to your bag.`,
      'cart',
      product.images[0]
    );
    setCartOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link Copied', 'Product link copied to your clipboard.', 'info');
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={closePDP}
      style={{ padding: '20px 0', alignItems: 'flex-start', overflowY: 'auto' }}
    >
      <div 
        className="modal-dialog"
        style={{ 
          maxWidth: '1180px', 
          width: '95%', 
          borderRadius: '24px', 
          margin: '20px auto',
          maxHeight: 'none',
          overflow: 'visible'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Floating Close Button */}
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-curator">Bluez Luxoria Masterpiece</span>
            <span style={{ fontSize: '13px', color: 'var(--color-subtle)' }}>{product.category.toUpperCase()} COLLECTION</span>
          </div>
          <button className="btn-icon" onClick={closePDP} aria-label="Close details">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px 32px' }}>
          
          {/* Header Row: Title & Actions */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
              {product.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <Star size={15} fill="currentColor" style={{ color: 'var(--color-dark)' }} />
                  {product.rating.toFixed(2)}
                </span>
                <span>•</span>
                {product.isGuestFavorite && (
                  <>
                    <span className="badge badge-guest-favorite">⭐ Guest favorite</span>
                    <span>•</span>
                  </>
                )}
                <span style={{ color: 'var(--color-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {product.atelierLocation}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button className="btn btn-ghost" onClick={handleShare} style={{ fontSize: '13px', padding: '6px 12px' }}>
                  <Share2 size={15} />
                  <span>Share</span>
                </button>
                <button 
                  className="btn btn-ghost" 
                  onClick={() => toggleWishlist(product)} 
                  style={{ fontSize: '13px', padding: '6px 12px', color: isFavorited ? 'var(--color-brand)' : 'inherit' }}
                >
                  <Heart size={15} fill={isFavorited ? 'var(--color-brand)' : 'none'} />
                  <span>{isFavorited ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Airbnb 5-Image Mosaic Grid */}
          <div className="pdp-mosaic-grid" style={{ marginBottom: '32px' }}>
            <img 
              src={product.images[0]} 
              alt={`${product.title} main`}
              className="mosaic-main-img"
              onClick={() => setLightboxImage(product.images[0])}
            />
            {product.images.slice(1, 5).map((img, i) => (
              <img 
                key={i}
                src={img} 
                alt={`${product.title} angle ${i + 2}`}
                className="mosaic-sub-img"
                onClick={() => setLightboxImage(img)}
              />
            ))}
          </div>

          {/* PDP Two Column Grid Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '48px', alignItems: 'start' }}>
            
            {/* LEFT COLUMN: Garment Specs, Atelier Story, Size & Fit, Reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Atelier Master Tailor Card */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                    Crafted by {product.brand}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-subtle)' }}>
                    Ethically produced in {product.atelierLocation} • Master Artisan Certified
                  </p>
                </div>
                <div 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: 'var(--color-dark)', 
                    color: '#FFFFFF', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {product.brand.charAt(0)}
                </div>
              </div>

              {/* Garment Key Highlights (Airbnb style icons) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Sparkles size={24} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontSize: '15px', fontWeight: 700 }}>Guest Favorite</h5>
                    <p style={{ fontSize: '13px', color: 'var(--color-subtle)' }}>
                      Ranked in the top 5% of all garments based on verified ratings, drape quality, and customer satisfaction.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <Truck size={24} style={{ color: 'var(--color-dark)', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontSize: '15px', fontWeight: 700 }}>Complimentary Express Delivery</h5>
                    <p style={{ fontSize: '13px', color: 'var(--color-subtle)' }}>
                      Dispatched in 100% recyclable garment bag with complimentary wooden hanger and dust bag.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <RotateCcw size={24} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontSize: '15px', fontWeight: 700 }}>30-Day In-Home Try-On Guarantee</h5>
                    <p style={{ fontSize: '13px', color: 'var(--color-subtle)' }}>
                      Free exchanges and prepaid courier returns if the fit is not completely impeccable.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <Scissors size={24} style={{ color: 'var(--color-dark)', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontSize: '15px', fontWeight: 700 }}>Lifetime Seam & Button Care</h5>
                    <p style={{ fontSize: '13px', color: 'var(--color-subtle)' }}>
                      Complimentary repairs at any partner atelier worldwide for the lifespan of the garment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description & Story */}
              <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>The Silhouette & Craftsmanship</h4>
                <p style={{ fontSize: '15px', lineHeight: 1.65, color: 'var(--color-text-body)' }}>
                  {product.description}
                </p>
              </div>

              {/* Fabric Specifications Table */}
              <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Fabric & Material Provenance</h4>
                <div style={{ background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Material Name</span>
                    <p style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>{product.fabric.name}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Composition</span>
                    <p style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>{product.fabric.composition}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fabric Weight</span>
                    <p style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>{product.fabric.weight}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Weaving Origin</span>
                    <p style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>{product.fabric.origin}</p>
                  </div>
                  <div style={{ gridColumn: '1 / span 2' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sustainability Certificate</span>
                    <p style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} /> {product.fabric.sustainabilityCert}
                    </p>
                  </div>
                </div>
              </div>

              {/* Size & Fit Guide */}
              <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '17px', fontWeight: 700 }}>Size & Fit Precision</h4>
                  <span className="badge badge-tag">{product.fit.runsSmallOrLarge}</span>
                </div>
                
                <p style={{ fontSize: '14px', color: 'var(--color-subtle)', marginBottom: '16px' }}>
                  {product.fit.modelWearing}. Cut is tailored in a <strong>{product.fit.cut}</strong> drape.
                </p>

                {/* Dimensions Table */}
                <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '10px 14px', fontWeight: 700 }}>Size</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700 }}>Chest / Waist (cm)</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700 }}>Garment Length (cm)</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700 }}>Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizes.map((s, idx) => (
                        <tr 
                          key={s.size} 
                          style={{ 
                            borderBottom: idx < product.sizes.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                            background: selectedSize === s.size ? 'rgba(0,0,0,0.03)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{s.size}</td>
                          <td style={{ padding: '10px 14px' }}>{s.chestCm} cm</td>
                          <td style={{ padding: '10px 14px' }}>{s.lengthCm} cm</td>
                          <td style={{ padding: '10px 14px' }}>
                            {s.inStock ? (
                              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>In Stock</span>
                            ) : (
                              <span style={{ color: 'var(--color-subtle)' }}>Made to Order</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Airbnb Sticky Booking / Buy Card */}
            <div>
              <div className="sticky-buy-card">
                
                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-dark)' }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span style={{ fontSize: '16px', color: 'var(--color-light-gray)', textDecoration: 'line-through', marginLeft: '8px' }}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <span style={{ fontSize: '13px', color: 'var(--color-subtle)', display: 'block' }}>
                      total before tax
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600 }}>
                    <Star size={14} fill="currentColor" />
                    <span>{product.rating.toFixed(2)}</span>
                    <span style={{ color: 'var(--color-subtle)', fontSize: '12px' }}>({product.reviewCount})</span>
                  </div>
                </div>

                {/* Color Selector */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                    Color: <span style={{ fontWeight: 500, color: 'var(--color-subtle)' }}>{selectedColor}</span>
                  </label>
                  <div className="color-swatches-row">
                    {product.colors.map(c => (
                      <div
                        key={c.name}
                        className={`color-swatch-circle ${selectedColor === c.name ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                      >
                        <div className="color-swatch-inner" style={{ background: c.hex }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Size: <span style={{ fontWeight: 500, color: 'var(--color-subtle)' }}>{selectedSize || 'Select'}</span>
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--color-brand)', fontWeight: 600 }}>
                      {product.fit.runsSmallOrLarge}
                    </span>
                  </div>
                  
                  <div className="size-pills-row">
                    {product.sizes.map(s => (
                      <button
                        key={s.size}
                        className={`size-pill ${selectedSize === s.size ? 'selected' : ''} ${!s.inStock ? 'disabled' : ''}`}
                        onClick={() => setSelectedSize(s.size)}
                        title={s.inStock ? `Size ${s.size} available` : `Size ${s.size} made to order`}
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Quantity</span>
                  <div className="quantity-stepper">
                    <button 
                      className="stepper-btn" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="stepper-value">{quantity}</span>
                    <button 
                      className="stepper-btn" 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Add To Bag Button */}
                <button 
                  className="btn btn-primary btn-pill btn-lg" 
                  style={{ width: '100%', marginBottom: '12px', height: '52px' }}
                  onClick={handleAddToCart}
                >
                  <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                </button>

                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-subtle)', marginBottom: '18px' }}>
                  You won't be charged until dispatch
                </p>

                {/* Itemized Price Calculation */}
                <div className="price-breakdown-table">
                  <div className="price-breakdown-row">
                    <span>{formatPrice(product.price)} x {quantity} garment{quantity > 1 ? 's' : ''}</span>
                    <span>{formatPrice(product.price * quantity)}</span>
                  </div>
                  <div className="price-breakdown-row">
                    <span>Express Courier Shipping</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div className="price-breakdown-row">
                    <span>Bluez Luxoria Care & Warranty</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Included</span>
                  </div>
                  <div className="price-breakdown-row total">
                    <span>Total before tax</span>
                    <span>{formatPrice(product.price * quantity)}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Lightbox Modal for Photo Zoom */}
      {lightboxImage && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.92)', 
            zIndex: 2000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="btn-icon" 
            style={{ position: 'absolute', top: '24px', right: '24px', background: '#FFFFFF' }}
            onClick={() => setLightboxImage(null)}
          >
            <X size={20} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Full size garment view" 
            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '12px' }} 
          />
        </div>
      )}
    </div>
  );
};
