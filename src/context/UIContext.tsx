import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Order, Product, ToastMessage } from '../types';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyRate {
  symbol: string;
  rate: number;
  label: string;
}

const CURRENCY_MAP: Record<CurrencyCode, CurrencyRate> = {
  INR: { symbol: '₹', rate: 83.5, label: '₹ INR' },
  USD: { symbol: '$', rate: 1.0, label: '$ USD' },
  EUR: { symbol: '€', rate: 0.92, label: '€ EUR' },
  GBP: { symbol: '£', rate: 0.79, label: '£ GBP' },
};

interface UIContextType {
  isMobileSearchOpen: boolean;
  setMobileSearchOpen: (open: boolean) => void;
  openMobileSearch: () => void;
  closeMobileSearch: () => void;
  isOmniSearchOpen: boolean;
  setOmniSearchOpen: (open: boolean) => void;
  isFilterModalOpen: boolean;
  setFilterModalOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  activePDPProduct: Product | null;
  openPDP: (product: Product) => void;
  closePDP: () => void;
  activeOrder: Order | null;
  setOrderSuccess: (order: Order | null) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'cart', productImage?: string) => void;
  removeToast: (id: string) => void;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isOmniSearchOpen, setOmniSearchOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [activePDPProduct, setActivePDPProduct] = useState<Product | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  const openMobileSearch = useCallback(() => {
    setActivePDPProduct(null);
    setMobileSearchOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeMobileSearch = useCallback(() => {
    setMobileSearchOpen(false);
  }, []);

  const openPDP = useCallback((product: Product) => {
    setActivePDPProduct(product);
    setMobileSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closePDP = useCallback(() => {
    setActivePDPProduct(null);
  }, []);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'cart' = 'info', productImage?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastMessage = { id, title, message, type, productImage };
    
    setToasts(prev => [newToast, ...prev.slice(0, 3)]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const formatPrice = useCallback((amountInUSD: number) => {
    const { symbol, rate } = CURRENCY_MAP[currency];
    const converted = Math.round(amountInUSD * rate);
    if (currency === 'INR') {
      return `${symbol}${converted.toLocaleString('en-IN')}`;
    }
    return `${symbol}${converted.toLocaleString('en-US')}`;
  }, [currency]);

  return (
    <UIContext.Provider
      value={{
        isMobileSearchOpen,
        setMobileSearchOpen,
        openMobileSearch,
        closeMobileSearch,
        isOmniSearchOpen,
        setOmniSearchOpen,
        isFilterModalOpen,
        setFilterModalOpen,
        isCartOpen,
        setCartOpen,
        isWishlistOpen,
        setWishlistOpen,
        isCheckoutOpen,
        setCheckoutOpen,
        activePDPProduct,
        openPDP,
        closePDP,
        activeOrder,
        setOrderSuccess: setActiveOrder,
        toasts,
        addToast,
        removeToast,
        currency,
        setCurrency,
        formatPrice,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
