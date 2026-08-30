import React, { useState } from 'react';
import { Search, X, Sparkles, Check, Tag } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useFilter } from '../../context/FilterContext';
import { OCCASIONS } from '../../data/products';

type SearchTab = 'collection' | 'occasion' | 'size' | 'price';

const POPULAR_SEARCHES = [
  'Cashmere Trench',
  'Belgian Linen',
  'Japanese Selvedge',
  'Mulberry Silk',
  'Pleated Wool',
  'Supima Cotton',
];

const SIZES_ALL = ['XS', 'S', 'M', 'L', 'XL', '30', '32', '34', '36', '38', '40', '42'];

export const OmniSearchModal: React.FC = () => {
  const { isOmniSearchOpen, setOmniSearchOpen, formatPrice } = useUI();
  const { 
    filters, 
    setSearch, 
    setOccasion, 
    toggleSize, 
    setPriceRange, 
    setSustainableOnly, 
    setGuestFavoriteOnly, 
    resetFilters,
    filteredProducts 
  } = useFilter();

  const [activeTab, setActiveTab] = useState<SearchTab>('collection');
  const [localQuery, setLocalQuery] = useState(filters.search);

  if (!isOmniSearchOpen) return null;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearch(localQuery);
    setOmniSearchOpen(false);
  };

  const handleSelectQuickTag = (tag: string) => {
    setLocalQuery(tag);
    setSearch(tag);
    setOmniSearchOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setOmniSearchOpen(false)}>
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '780px', borderRadius: '32px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div style={{ padding: '20px 24px 0 24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'var(--color-brand)' }} />
              <span style={{ fontWeight: 700, fontSize: '15px' }}>Bluez Luxoria Discovery</span>
            </div>
            <button className="btn-icon" onClick={() => setOmniSearchOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="omni-tab-nav" style={{ justifyContent: 'flex-start', margin: 0, paddingBottom: '12px' }}>
            <button 
              className={`omni-tab-btn ${activeTab === 'collection' ? 'active' : ''}`}
              onClick={() => setActiveTab('collection')}
            >
              1. Collection & Keyword
            </button>
            <button 
              className={`omni-tab-btn ${activeTab === 'occasion' ? 'active' : ''}`}
              onClick={() => setActiveTab('occasion')}
            >
              2. Occasion
            </button>
            <button 
              className={`omni-tab-btn ${activeTab === 'size' ? 'active' : ''}`}
              onClick={() => setActiveTab('size')}
            >
              3. Fit & Sizes
            </button>
            <button 
              className={`omni-tab-btn ${activeTab === 'price' ? 'active' : ''}`}
              onClick={() => setActiveTab('price')}
            >
              4. Price & Badges
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="modal-body" style={{ minHeight: '280px', padding: '24px' }}>
          {activeTab === 'collection' && (
            <div>
              <form onSubmit={handleSearchSubmit}>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-subtle)' }} />
                  <input
                    type="text"
                    placeholder="Search by fabric, cut, artisan atelier, or silhouette..."
                    value={localQuery}
                    onChange={e => setLocalQuery(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '14px 44px 14px 48px',
                      fontSize: '16px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--color-border)',
                      outline: 'none',
                      background: 'var(--color-surface-subtle)',
                    }}
                  />
                  {localQuery && (
                    <button 
                      type="button" 
                      onClick={() => setLocalQuery('')}
                      style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-subtle)' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </form>

              <div>
                <h5 style={{ fontSize: '13px', color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Trending Fabric & Silhouette Capsules
                </h5>
                <div className="capsule-chip-grid">
                  {POPULAR_SEARCHES.map(item => (
                    <button 
                      key={item} 
                      className="capsule-chip"
                      onClick={() => handleSelectQuickTag(item)}
                    >
                      <Tag size={13} style={{ color: 'var(--color-brand)' }} />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'occasion' && (
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>What occasion are you styling for?</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-subtle)', marginBottom: '16px' }}>Filter premium hand-picked imported garments curated for distinct atmospheres.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                {OCCASIONS.map(occ => {
                  const isSelected = filters.occasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      className={`btn ${isSelected ? 'btn-dark' : 'btn-outline'}`}
                      style={{ padding: '14px', justifyContent: 'flex-start', borderRadius: '12px' }}
                      onClick={() => setOccasion(occ.id)}
                    >
                      <span>{occ.label}</span>
                      {isSelected && <Check size={16} style={{ marginLeft: 'auto' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'size' && (
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Select sizes in your wardrobe</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-subtle)', marginBottom: '16px' }}>Only show garments currently in stock in these sizes.</p>

              <div className="size-pills-row">
                {SIZES_ALL.map(sz => {
                  const isSelected = filters.sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      className={`size-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSize(sz)}
                      style={{ width: '48px', height: '48px' }}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'price' && (
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Price range & ethical badges</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-subtle)', marginBottom: '20px' }}>Transparent pricing breakdown before taxes.</p>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                  <span>Up to {formatPrice(filters.priceRange[1])}</span>
                  <span style={{ color: 'var(--color-subtle)', fontSize: '13px' }}>Max: {formatPrice(600)}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={600}
                  step={20}
                  value={filters.priceRange[1]}
                  onChange={e => setPriceRange([filters.priceRange[0], Number(e.target.value)])}
                  style={{ width: '100%', accentColor: 'var(--color-brand)', height: '6px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${filters.guestFavoriteOnly ? 'btn-dark' : 'btn-outline'}`}
                  style={{ borderRadius: 'var(--radius-pill)', fontSize: '13px' }}
                  onClick={() => setGuestFavoriteOnly(!filters.guestFavoriteOnly)}
                >
                  ⭐ Guest Favorites Only
                </button>
                <button
                  className={`btn ${filters.sustainableOnly ? 'btn-dark' : 'btn-outline'}`}
                  style={{ borderRadius: 'var(--radius-pill)', fontSize: '13px' }}
                  onClick={() => setSustainableOnly(!filters.sustainableOnly)}
                >
                  🌱 GOTS & OEKO-TEX Certified Only
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ background: 'var(--color-surface-subtle)' }}>
          <button 
            className="btn btn-ghost" 
            onClick={() => {
              resetFilters();
              setLocalQuery('');
            }}
            style={{ textDecoration: 'underline', fontWeight: 600 }}
          >
            Clear all
          </button>

          <button 
            className="btn btn-primary btn-pill btn-lg" 
            onClick={() => handleSearchSubmit()}
            style={{ padding: '12px 28px' }}
          >
            <Search size={16} />
            <span>Show {filteredProducts.length} Garments</span>
          </button>
        </div>
      </div>
    </div>
  );
};
