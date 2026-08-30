import React, { useState } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types';
import { useUI } from '../../context/UIContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { openPDP, formatPrice, addToast } = useUI();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % product.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHeartAnimating(true);
    const added = toggleWishlist(product);
    setTimeout(() => setIsHeartAnimating(false), 400);

    if (added) {
      addToast('Saved to Wishlist', `${product.title} was saved to your private collection.`, 'success', product.images[0]);
    } else {
      addToast('Removed from Wishlist', `${product.title} was removed.`, 'info');
    }
  };

  return (
    <div
      className="product-card animate-stagger-card"
      style={{ '--item-index': index } as React.CSSProperties}
      onClick={() => openPDP(product)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.title}`}
    >
      {/* Image Gallery Container */}
      <div className="product-image-container">
        <img
          src={product.images[activeImageIndex]}
          alt={`${product.title} preview ${activeImageIndex + 1}`}
          className="product-image"
          loading="lazy"
        />

        {/* Wishlist Heart Button */}
        <button
          className={`card-wishlist-btn ${isFavorited ? 'active' : ''} ${isHeartAnimating ? 'animate-heart-pop' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={13}
            fill={isFavorited ? 'var(--color-brand)' : 'rgba(0, 0, 0, 0.45)'}
            stroke={isFavorited ? 'var(--color-brand)' : '#FFFFFF'}
            strokeWidth={1.8}
          />
        </button>

        {/* Image Carousel Navigation (Desktop hover) */}
        {product.images.length > 1 && (
          <>
            {activeImageIndex > 0 && (
              <button
                className="carousel-nav-btn prev"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {activeImageIndex < product.images.length - 1 && (
              <button
                className="carousel-nav-btn next"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            )}

            {/* Pagination Dots */}
            <div className="carousel-dots">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`carousel-dot ${idx === activeImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Information */}
      <div className="card-content">
        <div className="card-row-top">
          <span className="card-title" title={product.title}>
            {product.title}
          </span>
        </div>

        {/* Price & Review Row (Review Beside Price) */}
        <div className="card-price-row">
          <div className="card-price-cluster">
            <span className="card-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="card-original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <div className="card-rating">
            <Star size={12} fill="currentColor" style={{ color: 'var(--color-dark)' }} />
            <span>{product.rating.toFixed(2)}</span>
            <span style={{ color: 'var(--color-subtle)', fontSize: '11px' }}>({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
