import React, { createContext, useContext, useState, useMemo } from 'react';
import type { FilterState, Product } from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';

interface FilterContextType {
  filters: FilterState;
  setSearch: (query: string) => void;
  setCategory: (cat: string) => void;
  setOccasion: (occ: string) => void;
  setGender: (gender: string) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleSize: (size: string) => void;
  toggleColor: (color: string) => void;
  setSustainableOnly: (val: boolean) => void;
  setGuestFavoriteOnly: (val: boolean) => void;
  setInStockOnly: (val: boolean) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  resetFilters: () => void;
  activeFilterCount: number;
  filteredProducts: Product[];
  totalCount: number;
}

const initialFilters: FilterState = {
  search: '',
  category: 'all',
  occasion: 'all',
  gender: 'all',
  priceRange: [0, 600],
  sizes: [],
  colors: [],
  sustainableOnly: false,
  guestFavoriteOnly: false,
  inStockOnly: false,
  sortBy: 'recommended',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const setSearch = (query: string) => setFilters(prev => ({ ...prev, search: query }));
  const setCategory = (category: string) => setFilters(prev => ({ ...prev, category }));
  const setOccasion = (occasion: string) => setFilters(prev => ({ ...prev, occasion }));
  const setGender = (gender: string) => setFilters(prev => ({ ...prev, gender }));
  const setPriceRange = (priceRange: [number, number]) => setFilters(prev => ({ ...prev, priceRange }));

  const toggleSize = (size: string) => {
    setFilters(prev => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const toggleColor = (color: string) => {
    setFilters(prev => {
      const exists = prev.colors.includes(color);
      return {
        ...prev,
        colors: exists ? prev.colors.filter(c => c !== color) : [...prev.colors, color],
      };
    });
  };

  const setSustainableOnly = (sustainableOnly: boolean) => setFilters(prev => ({ ...prev, sustainableOnly }));
  const setGuestFavoriteOnly = (guestFavoriteOnly: boolean) => setFilters(prev => ({ ...prev, guestFavoriteOnly }));
  const setInStockOnly = (inStockOnly: boolean) => setFilters(prev => ({ ...prev, inStockOnly }));
  const setSortBy = (sortBy: FilterState['sortBy']) => setFilters(prev => ({ ...prev, sortBy }));

  const resetFilters = () => setFilters(initialFilters);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.occasion !== 'all') count++;
    if (filters.gender !== 'all') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 600) count++;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.colors.length > 0) count += filters.colors.length;
    if (filters.sustainableOnly) count++;
    if (filters.guestFavoriteOnly) count++;
    if (filters.inStockOnly) count++;
    return count;
  }, [filters]);

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter(product => {
      // Search text match
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesFabric = product.fabric.name.toLowerCase().includes(query);
        const matchesLocation = (product.atelierLocation || '').toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBrand && !matchesDesc && !matchesFabric && !matchesLocation && !matchesCategory) {
          return false;
        }
      }

      // Category match
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Occasion match
      if (filters.occasion !== 'all' && product.occasion !== filters.occasion) {
        return false;
      }

      // Gender match
      if (filters.gender !== 'all' && product.gender !== 'unisex' && product.gender !== filters.gender) {
        return false;
      }

      // Price match
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Sizes match
      if (filters.sizes.length > 0) {
        const hasSize = product.sizes.some(s => filters.sizes.includes(s.size) && s.inStock);
        if (!hasSize) return false;
      }

      // Colors match
      if (filters.colors.length > 0) {
        const hasColor = product.colors.some(c => filters.colors.includes(c.name));
        if (!hasColor) return false;
      }

      // Guest Favorite match
      if (filters.guestFavoriteOnly && !product.isGuestFavorite) {
        return false;
      }

      // Sustainable match
      if (filters.sustainableOnly && !product.isSustainable) {
        return false;
      }

      // In-stock match
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.reviewCount || 0) - (a.reviewCount || 0);
      // Default: recommended (Guest favorites first, then highest rating)
      return (b.isGuestFavorite ? 1 : 0) - (a.isGuestFavorite ? 1 : 0) || b.rating - a.rating;
    });
  }, [filters]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearch,
        setCategory,
        setOccasion,
        setGender,
        setPriceRange,
        toggleSize,
        toggleColor,
        setSustainableOnly,
        setGuestFavoriteOnly,
        setInStockOnly,
        setSortBy,
        resetFilters,
        activeFilterCount,
        filteredProducts,
        totalCount: SAMPLE_PRODUCTS.length,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilter must be used within a FilterProvider');
  return context;
};
