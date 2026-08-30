import React from 'react';
import { FilterProvider } from './context/FilterContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { UIProvider, useUI } from './context/UIContext';

import { Navbar } from './components/layout/Navbar';
import { CategoryBar } from './components/layout/CategoryBar';
import { Hero } from './components/layout/Hero';
import { ProductGrid } from './components/product/ProductGrid';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { FilterModal } from './components/filters/FilterModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { ToastManager } from './components/common/ToastManager';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { MobileSearchPage } from './components/search/MobileSearchPage';

export const AppContent: React.FC = () => {
  const { activePDPProduct, isCheckoutOpen } = useUI();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Page View Routing */}
      {/* Checkout Page Commented Down For Now
      isCheckoutOpen ? (
        <CheckoutPage />
      ) : */}
      {activePDPProduct ? (
        /* Dedicated Product Detail Page */
        <ProductDetailPage />
      ) : (
        /* Home Catalog Landing Page */
        <>
          {/* Editorial Hero Banner */}
          <Hero />

          {/* Quick Actions Category Bar */}
          <CategoryBar />

          {/* Main Product Catalog Grid */}
          <ProductGrid />
        </>
      )}

      {/* Global Overlays & Modals */}
      <MobileSearchPage />
      <FilterModal />
      <CartDrawer />
      <WishlistDrawer />
      <OrderSuccessModal />
      <ToastManager />
      <Footer />
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <UIProvider>
      <CartProvider>
        <WishlistProvider>
          <FilterProvider>
            <AppContent />
          </FilterProvider>
        </WishlistProvider>
      </CartProvider>
    </UIProvider>
  );
}
