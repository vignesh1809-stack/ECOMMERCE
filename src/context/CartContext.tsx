import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedSize: string, selectedColor: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, delta: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  promoCode: string;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'atelier_clothing_cart_v1';
const FREE_SHIPPING_THRESHOLD = 150;
const SHIPPING_FEE = 15;
const TAX_RATE = 0.08;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product: Product, selectedSize: string, selectedColor: string, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prev, { product, selectedSize, selectedColor, quantity }];
    });
  };

  const removeFromCart = (productId: string, selectedSize: string, selectedColor: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
    ));
  };

  const updateQuantity = (productId: string, selectedSize: string, selectedColor: string, delta: number) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
    setDiscountPercent(0);
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BLUEZ15' || clean === 'LUXORIA15' || clean === 'ATELIER15' || clean === 'AIRBNB15') {
      setAppliedPromo(clean);
      setDiscountPercent(0.15);
      setPromoCode('');
      return { success: true, message: '15% Bluez Luxoria VIP discount applied!' };
    }
    if (clean === 'WELCOME10') {
      setAppliedPromo(clean);
      setDiscountPercent(0.10);
      setPromoCode('');
      return { success: true, message: '10% Welcome discount applied!' };
    }
    if (clean === 'FREESHIP') {
      setAppliedPromo(clean);
      setDiscountPercent(0);
      setPromoCode('');
      return { success: true, message: 'Complimentary express shipping unlocked!' };
    }
    return { success: false, message: 'Invalid promo code. Try "BLUEZ15" or "WELCOME10".' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setDiscountPercent(0);
  };

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    return Math.round(subtotal * discountPercent);
  }, [subtotal, discountPercent]);

  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo === 'FREESHIP') return 0;
    return SHIPPING_FEE;
  }, [items, subtotal, appliedPromo]);

  const tax = useMemo(() => {
    return Math.round((subtotal - discount) * TAX_RATE);
  }, [subtotal, discount]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + shipping + tax);
  }, [subtotal, discount, shipping, tax]);

  const freeShippingProgress = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo === 'FREESHIP') return 100;
    return Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [subtotal, appliedPromo]);

  const amountNeededForFreeShipping = useMemo(() => {
    if (appliedPromo === 'FREESHIP') return 0;
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  }, [subtotal, appliedPromo]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        promoCode,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
