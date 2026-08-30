import React from 'react';
import { Search, Heart, ShoppingBag, Compass } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const MobileNav: React.FC = () => {
  const { 
    isWishlistOpen,
    setWishlistOpen, 
    isCartOpen,
    setCartOpen, 
    closePDP, 
    isMobileSearchOpen, 
    openMobileSearch, 
    closeMobileSearch,
    activePDPProduct
  } = useUI();
  const { wishlistCount } = useWishlist();
  const { totalItemsCount } = useCart();

  const isExploreActive = !isMobileSearchOpen && !isWishlistOpen && !isCartOpen && !activePDPProduct;

  return (
    <nav className="mobile-bottom-nav">
      <button 
        className={`mobile-nav-item ${isExploreActive ? 'active' : ''}`}
        onClick={() => { 
          setWishlistOpen(false);
          setCartOpen(false);
          closeMobileSearch();
          closePDP(); 
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }}
        type="button"
      >
        <Compass size={22} />
        <span>Explore</span>
      </button>

      <button 
        className={`mobile-nav-item ${isMobileSearchOpen ? 'active' : ''}`}
        onClick={() => { 
          setWishlistOpen(false);
          setCartOpen(false);
          if (isMobileSearchOpen) {
            closeMobileSearch();
          } else {
            openMobileSearch();
          }
        }}
        type="button"
      >
        <Search size={22} />
        <span>Search</span>
      </button>

      <button 
        className={`mobile-nav-item ${isWishlistOpen ? 'active' : ''}`}
        onClick={() => {
          closeMobileSearch();
          if (isWishlistOpen) {
            setWishlistOpen(false);
          } else {
            setCartOpen(false);
            setWishlistOpen(true);
          }
        }}
        type="button"
      >
        <Heart size={22} fill={isWishlistOpen ? 'currentColor' : 'none'} />
        {wishlistCount > 0 && <span className="cart-counter" style={{ top: 2, right: 18 }}>{wishlistCount}</span>}
        <span>Wishlist</span>
      </button>

      <button 
        className={`mobile-nav-item ${isCartOpen ? 'active' : ''}`}
        onClick={() => {
          closeMobileSearch();
          if (isCartOpen) {
            setCartOpen(false);
          } else {
            setWishlistOpen(false);
            setCartOpen(true);
          }
        }}
        type="button"
      >
        <ShoppingBag size={22} fill={isCartOpen ? 'currentColor' : 'none'} />
        {totalItemsCount > 0 && <span className="cart-counter" style={{ top: 2, right: 18 }}>{totalItemsCount}</span>}
        <span>Bag</span>
      </button>
    </nav>
  );
};
