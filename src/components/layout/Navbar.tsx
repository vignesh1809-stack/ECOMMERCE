import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useFilter } from '../../context/FilterContext';
import { BrandLogo } from '../common/BrandLogo';

export const Navbar: React.FC = () => {
  const { 
    setCartOpen, 
    setWishlistOpen, 
    activePDPProduct,
    closePDP,
    isCheckoutOpen,
    setCheckoutOpen,
    currency,
    setCurrency,
    openMobileSearch
  } = useUI();
  
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { filters, setSearch } = useFilter();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (isCheckoutOpen) setCheckoutOpen(false);
    if (activePDPProduct) closePDP();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (activePDPProduct) {
      closePDP();
    }
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  return (
    <header className={`header-wrapper ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="app-container">
        <nav className="navbar">
          {/* Brand Logo */}
          <div className="navbar-logo-wrap" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <BrandLogo size="md" showTagline={true} />
          </div>

          {/* Simple Minimal Inline Search Bar */}
          <div className="simple-search-wrapper desktop-search">
            <div className="simple-search-box">
              <Search size={16} className="simple-search-icon" />
              <input
                type="text"
                className="simple-search-input"
                placeholder="Search shirts, hoodies, cashmere, denim..."
                value={filters.search}
                onChange={handleSearchChange}
                aria-label="Search garments"
              />
              {filters.search && (
                <button 
                  className="simple-search-clear-btn" 
                  onClick={handleClearSearch}
                  type="button"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right Navigation Actions */}
          <div className="nav-actions">
            {/* Currency Switcher Pill */}
            <button
              className="btn btn-ghost"
              style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                padding: '6px 10px', 
                borderRadius: 'var(--radius-pill)', 
                border: '1px solid var(--color-border)',
                height: '36px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--color-dark)'
              }}
              onClick={() => {
                const CURRENCIES: ('INR' | 'USD' | 'EUR' | 'GBP')[] = ['INR', 'USD', 'EUR', 'GBP'];
                const next = CURRENCIES[(CURRENCIES.indexOf(currency) + 1) % CURRENCIES.length];
                setCurrency(next);
              }}
              title="Click to Switch Currency (INR, USD, EUR, GBP)"
              aria-label="Switch Currency"
            >
              <span>{currency === 'INR' ? '₹ INR' : currency === 'USD' ? '$ USD' : currency === 'EUR' ? '€ EUR' : '£ GBP'}</span>
            </button>

            {/* Wishlist Button */}
            <button 
              className="btn-icon cart-indicator-badge"
              onClick={() => setWishlistOpen(true)}
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={18} style={{ color: wishlistCount > 0 ? 'var(--color-brand)' : 'inherit' }} />
              {wishlistCount > 0 && <span className="cart-counter">{wishlistCount}</span>}
            </button>

            {/* Cart Drawer Trigger */}
            <button 
              className="btn-icon cart-indicator-badge"
              onClick={() => setCartOpen(true)}
              title="Your Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={18} />
              {totalItemsCount > 0 && <span className="cart-counter">{totalItemsCount}</span>}
            </button>
          </div>
        </nav>

        {/* Mobile Search Row (Flipkart Style Trigger for screens < 768px) */}
        <div className="mobile-search-bar-wrap" onClick={openMobileSearch}>
          <div className="simple-search-box mobile-search-box" style={{ cursor: 'pointer' }}>
            <Search size={15} className="simple-search-icon" />
            <input
              type="text"
              className="simple-search-input"
              placeholder={filters.search || "Search 'Polo', 'T-Shirts', 'Cashmere'..."}
              value={filters.search}
              readOnly
              onFocus={openMobileSearch}
              aria-label="Search Bluez Luxoria mobile"
            />
            {filters.search && (
              <button 
                className="simple-search-clear-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSearch();
                }}
                type="button"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
