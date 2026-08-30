import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  Scissors, 
  MapPin, 
  X,
  ChevronRight,
  ChevronLeft,
  Maximize2
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { SAMPLE_PRODUCTS } from '../../data/products';

const ANGLE_LABELS = [
  'Studio Front View',
  'Editorial Profile 3/4',
  'Fabric & Weave Close-up',
  'Back Tailored Silhouette',
  'Movement & Drape'
];

export const ProductDetailPage: React.FC = () => {
  const { activePDPProduct, closePDP, openPDP, formatPrice, addToast, setCartOpen } = useUI();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = activePDPProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Initialize selected size, color, and reset image carousel when product changes
  useEffect(() => {
    if (product) {
      const firstAvailableSize = product.sizes.find(s => s.inStock)?.size || product.sizes[0]?.size || '';
      setSelectedSize(firstAvailableSize);
      setSelectedColor(product.colors[0]?.name || '');
      setActiveImageIndex(0);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const totalImages = product.images.length;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % totalImages);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + totalImages) % totalImages);
  };

  // Related products
  const relatedProducts = SAMPLE_PRODUCTS
    .filter(p => p.id !== product.id)
    .slice(0, 4);

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
    <main className="pdp-editorial-canvas">
      <div className="app-container">
        
        {/* Top Minimalist Navigation Bar */}
        <div className="pdp-top-nav">
          <button 
            className="pdp-back-btn" 
            onClick={closePDP}
            aria-label="Back to collections"
          >
            <ArrowLeft size={15} />
            <span>Back to Collections</span>
          </button>

          <div className="pdp-breadcrumbs">
            <span onClick={closePDP} style={{ cursor: 'pointer' }}>Home</span>
            <ChevronRight size={12} />
            <span onClick={closePDP} style={{ cursor: 'pointer', textTransform: 'capitalize' }}>{product.category}</span>
            <ChevronRight size={12} />
            <span className="current">{product.title}</span>
          </div>
        </div>

        {/* ENTERPRISE-GRADE 2-COLUMN STUDIO LAYOUT */}
        <div className="pdp-studio-layout">
          
          {/* LEFT: Enterprise Studio Gallery (HD Stage + Right-side Thumbnails) */}
          <div className="pdp-studio-gallery">
            
            {/* Main High-Definition Stage Viewport */}
            <div className="pdp-hd-stage">
              <img 
                src={product.images[activeImageIndex]} 
                alt={`${product.title} - ${ANGLE_LABELS[activeImageIndex] || `angle ${activeImageIndex + 1}`}`}
                className="pdp-hd-stage-photo"
                onClick={() => setLightboxImage(product.images[activeImageIndex])}
              />

              {/* Floating Navigation Chevrons */}
              {totalImages > 1 && (
                <>
                  <button 
                    className="pdp-floating-chevron prev"
                    onClick={prevImage}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} strokeWidth={2.4} />
                  </button>
                  <button 
                    className="pdp-floating-chevron next"
                    onClick={nextImage}
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} strokeWidth={2.4} />
                  </button>
                </>
              )}

              {/* Angle Description & Counter Pill */}
              <div className="pdp-stage-pill">
                <span className="pdp-pill-dot" />
                <span>{ANGLE_LABELS[activeImageIndex] || `View ${activeImageIndex + 1}`}</span>
                <span className="pdp-pill-separator">•</span>
                <span>{activeImageIndex + 1} / {totalImages}</span>
              </div>

              {/* Top Controls: Fullscreen Expand */}
              <div className="pdp-stage-top-controls">
                <button 
                  className="pdp-control-circle-btn"
                  onClick={() => setLightboxImage(product.images[activeImageIndex])}
                  aria-label="Full size preview"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 size={15} />
                </button>
              </div>
            </div>

            {/* Vertical Thumbnail Rail (Placed on the right side of the main image) */}
            {totalImages > 1 && (
              <div className="pdp-rail-container">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pdp-rail-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    type="button"
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} />
                    <span className="pdp-rail-index">{String(idx + 1).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT: Minimalist Product Purchase & Information Column */}
          <div className="pdp-summary-section">
            
            {/* Meta & Actions Header */}
            <div className="pdp-meta-header">
              <span className="pdp-collection-tag">
                {product.category.toUpperCase()} • BLUEZ LUXORIA ESSENTIALS
              </span>
              
              <div className="pdp-actions-wrap">
                <button 
                  className="pdp-action-icon-btn" 
                  onClick={handleShare}
                  title="Share product link"
                  aria-label="Share"
                >
                  <Share2 size={16} />
                </button>
                <button 
                  className={`pdp-action-icon-btn ${isFavorited ? 'favorited' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  title={isFavorited ? 'Saved to Wishlist' : 'Add to Wishlist'}
                  aria-label="Save to Wishlist"
                >
                  <Heart size={16} fill={isFavorited ? 'var(--color-brand)' : 'none'} />
                </button>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="pdp-main-heading">{product.title}</h1>

            {/* Rating & Provenance */}
            <div className="pdp-ratings-line">
              <span className="pdp-star-val">
                <Star size={14} fill="currentColor" />
                <strong>{product.rating.toFixed(2)}</strong>
              </span>
              <span>•</span>
              <span className="pdp-provenance-text">
                <MapPin size={13} /> {product.atelierLocation}
              </span>
            </div>

            {/* Price Line */}
            <div className="pdp-price-wrap">
              <span className="pdp-main-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="pdp-original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="pdp-hairline-divider" />

            {/* Color Swatches */}
            <div className="pdp-form-group">
              <div className="pdp-label-row">
                <label className="pdp-field-title">COLOR</label>
                <span className="pdp-field-val">{selectedColor}</span>
              </div>
              <div className="pdp-swatches-grid">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    className={`pdp-swatch-circle ${selectedColor === c.name ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    type="button"
                    aria-label={`Select color ${c.name}`}
                  >
                    <span className="pdp-swatch-dot" style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pdp-form-group">
              <div className="pdp-label-row">
                <label className="pdp-field-title">SIZE</label>
                <span className="pdp-fit-note">{product.fit.runsSmallOrLarge}</span>
              </div>
              <div className="pdp-sizes-flex">
                {product.sizes.map(s => (
                  <button
                    key={s.size}
                    className={`pdp-size-btn ${selectedSize === s.size ? 'active' : ''} ${!s.inStock ? 'out-of-stock' : ''}`}
                    onClick={() => setSelectedSize(s.size)}
                    type="button"
                    title={s.inStock ? `Size ${s.size} in stock` : `Size ${s.size} made to order`}
                  >
                    <span>{s.size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Bag */}
            <div className="pdp-cta-block">
              <div className="pdp-stepper-control">
                <button 
                  className="pdp-step-btn" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  type="button"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="pdp-step-num">{quantity}</span>
                <button 
                  className="pdp-step-btn" 
                  onClick={() => setQuantity(quantity + 1)}
                  type="button"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button 
                className="pdp-add-bag-btn" 
                onClick={handleAddToCart}
                type="button"
              >
                Add to Bag • {formatPrice(product.price * quantity)}
              </button>
            </div>

            {/* Service & Guarantee Perks */}
            <div className="pdp-trust-perks">
              <div className="pdp-perk-row">
                <Truck size={16} />
                <span>Complimentary Express Courier Shipping</span>
              </div>
              <div className="pdp-perk-row">
                <RotateCcw size={16} style={{ color: 'var(--color-success)' }} />
                <span>30-Day in-home try-on with prepaid returns</span>
              </div>
              <div className="pdp-perk-row">
                <Scissors size={16} />
                <span>Lifetime seam & button repair care</span>
              </div>
            </div>

          </div>

        </div>

        {/* LOWER SECTION: Technical Specifications & Provenance */}
        <div className="pdp-details-lower">
          
          {/* Fabric & Material Provenance Grid */}
          <div className="pdp-section-card">
            <h4>Fabric & Material Specifications</h4>
            <div className="pdp-provenance-grid">
              <div>
                <span className="provenance-label">Composition</span>
                <p className="provenance-val">{product.fabric.composition}</p>
              </div>
              <div>
                <span className="provenance-label">Fabric Weight</span>
                <p className="provenance-val">{product.fabric.weight}</p>
              </div>
              <div>
                <span className="provenance-label">Atelier Origin</span>
                <p className="provenance-val">{product.fabric.origin}</p>
              </div>
              <div>
                <span className="provenance-label">Sustainability Certification</span>
                <p className="provenance-val">{product.fabric.sustainabilityCert}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Related Garments Recommendation Strip */}
        <div className="pdp-related-section">
          <h3 className="pdp-related-title">You May Also Like</h3>
          <div className="pdp-related-grid">
            {relatedProducts.map(rel => (
              <div 
                key={rel.id} 
                className="pdp-related-card"
                onClick={() => openPDP(rel)}
                role="button"
                tabIndex={0}
              >
                <div className="pdp-related-img-box">
                  <img src={rel.images[0]} alt={rel.title} />
                </div>
                <div className="pdp-related-meta">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 className="pdp-related-name">{rel.title}</h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', fontWeight: 700 }}>
                      <Star size={11} fill="currentColor" />
                      <span>{rel.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <span className="pdp-related-price">{formatPrice(rel.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Photo Zoom */}
      {lightboxImage && (
        <div 
          className="pdp-lightbox-overlay"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="btn-icon pdp-lightbox-close"
            onClick={() => setLightboxImage(null)}
          >
            <X size={20} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Full size garment preview" 
            className="pdp-lightbox-img"
          />
        </div>
      )}
    </main>
  );
};
