import React from 'react';
import { SlidersHorizontal, RefreshCw, X } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useFilter } from '../../context/FilterContext';
import { useUI } from '../../context/UIContext';

export const ProductGrid: React.FC = () => {
  const { 
    filteredProducts, 
    totalCount, 
    filters, 
    resetFilters, 
    setCategory, 
    setOccasion, 
    setSearch,
    toggleSize,
    setSustainableOnly,
    setGuestFavoriteOnly,
    activeFilterCount
  } = useFilter();

  const { setFilterModalOpen } = useUI();

  return (
    <main className="app-container" style={{ flex: 1 }}>
      {/* Top Meta Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-dark)' }}>
            Showing {filteredProducts.length} of {totalCount} garments
          </span>
          {filters.category !== 'all' && (
            <span style={{ color: 'var(--color-subtle)', fontSize: '13px' }}>
              • {filters.category.toUpperCase()}
            </span>
          )}
        </div>

        {/* Right Action Controls: Badges + Filters Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
          {filters.search && (
            <button className="badge badge-tag" onClick={() => setSearch('')}>
              Search: "{filters.search}" <X size={12} />
            </button>
          )}
          {filters.occasion !== 'all' && (
            <button className="badge badge-tag" onClick={() => setOccasion('all')}>
              Occasion: {filters.occasion} <X size={12} />
            </button>
          )}
          {filters.sizes.map(sz => (
            <button key={sz} className="badge badge-tag" onClick={() => toggleSize(sz)}>
              Size {sz} <X size={12} />
            </button>
          ))}
          {filters.sustainableOnly && (
            <button className="badge badge-tag" onClick={() => setSustainableOnly(false)}>
              🌱 Sustainable <X size={12} />
            </button>
          )}
          {filters.guestFavoriteOnly && (
            <button className="badge badge-tag" onClick={() => setGuestFavoriteOnly(false)}>
              ⭐ Guest Favorites <X size={12} />
            </button>
          )}

          {/* Filters Button Fixed to the Right */}
          <button 
            className="filter-btn-trigger" 
            onClick={() => setFilterModalOpen(true)}
            aria-label="Open filter settings"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="filter-active-count">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Grid or Zero State */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '500px', margin: '0 auto' }}>
          <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'var(--color-surface-subtle)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px auto' 
            }}
          >
            <SlidersHorizontal size={28} style={{ color: 'var(--color-subtle)' }} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No exact matches found</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-subtle)', marginBottom: '24px', lineHeight: 1.5 }}>
            Try adjusting your search criteria, clearing specific size filters, or exploring all artisan collections.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn btn-outline btn-pill" onClick={resetFilters}>
              <RefreshCw size={14} />
              <span>Reset all filters</span>
            </button>
            <button className="btn btn-dark btn-pill" onClick={() => setFilterModalOpen(true)}>
              <span>Adjust filters</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
