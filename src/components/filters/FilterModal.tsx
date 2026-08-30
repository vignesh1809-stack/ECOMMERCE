import React from 'react';
import { X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useFilter } from '../../context/FilterContext';
import { COLOR_PALETTE } from '../../data/products';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '30', '32', '34', '36', '38', '40', '42'];

export const FilterModal: React.FC = () => {
  const { isFilterModalOpen, setFilterModalOpen, formatPrice } = useUI();
  const { 
    filters, 
    setGender, 
    setPriceRange, 
    toggleSize, 
    toggleColor, 
    setSustainableOnly, 
    setGuestFavoriteOnly, 
    setInStockOnly,
    setSortBy,
    resetFilters,
    filteredProducts 
  } = useFilter();

  if (!isFilterModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setFilterModalOpen(false)}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <button className="btn-icon" onClick={() => setFilterModalOpen(false)}>
            <X size={18} />
          </button>
          <span className="modal-title">Filters & Sorting</span>
          <div style={{ width: 38 }} />
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section 1: Sort By */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Sort By</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
              {[
                { id: 'recommended', label: 'Curator’s Pick' },
                { id: 'rating', label: 'Highest Rated (★)' },
                { id: 'price-asc', label: 'Price: Low to High' },
                { id: 'price-desc', label: 'Price: High to Low' },
              ].map(opt => {
                const isSelected = filters.sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={`btn ${isSelected ? 'btn-dark' : 'btn-outline'}`}
                    style={{ borderRadius: 'var(--radius-pill)', fontSize: '13px', padding: '8px 14px' }}
                    onClick={() => setSortBy(opt.id as any)}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Section 2: Department / Gender */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Department</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { id: 'all', label: 'All Departments' },
                { id: 'women', label: 'Women' },
                { id: 'men', label: 'Men' },
              ].map(dep => {
                const isSelected = filters.gender === dep.id;
                return (
                  <button
                    key={dep.id}
                    className={`btn ${isSelected ? 'btn-dark' : 'btn-outline'}`}
                    style={{ borderRadius: 'var(--radius-pill)', fontSize: '13px' }}
                    onClick={() => setGender(dep.id)}
                  >
                    {dep.label}
                  </button>
                );
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Section 3: Price Range */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Price Range</h4>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-dark)' }}>
                {formatPrice(filters.priceRange[0])} – {formatPrice(filters.priceRange[1])}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-subtle)', marginBottom: '16px' }}>
              Standard retail price excluding promotional Bluez Luxoria member discounts.
            </p>
            <input
              type="range"
              min={0}
              max={600}
              step={25}
              value={filters.priceRange[1]}
              onChange={e => setPriceRange([filters.priceRange[0], Number(e.target.value)])}
              style={{ width: '100%', accentColor: 'var(--color-brand)', height: '6px' }}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Section 4: Size */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Size & Cut</h4>
            <div className="size-pills-row">
              {ALL_SIZES.map(sz => {
                const isSelected = filters.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    className={`size-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSize(sz)}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Section 5: Color Swatches */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Artisan Color Palette</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {COLOR_PALETTE.map(c => {
                const isSelected = filters.colors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    className={`capsule-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleColor(c.name)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span 
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        background: c.hex, 
                        border: '1px solid rgba(0,0,0,0.2)',
                        display: 'inline-block'
                      }} 
                    />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Section 6: Verified Badges */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Garment Badges & Availability</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Guest Favorites Only</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-subtle)' }}>Top 5% most loved pieces based on ratings and repeat orders</div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.guestFavoriteOnly}
                  onChange={e => setGuestFavoriteOnly(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-brand)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>100% Certified Sustainable</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-subtle)' }}>GOTS organic cotton, RWS wool, or zero-waste knitting</div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.sustainableOnly}
                  onChange={e => setSustainableOnly(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-brand)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>In Stock Now</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-subtle)' }}>Ready for immediate same-day atelier dispatch</div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-brand)' }}
                />
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={resetFilters} style={{ textDecoration: 'underline', fontWeight: 600 }}>
            Clear all
          </button>
          <button 
            className="btn btn-dark btn-pill btn-lg" 
            onClick={() => setFilterModalOpen(false)}
          >
            Show {filteredProducts.length} Garments
          </button>
        </div>
      </div>
    </div>
  );
};
