import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Mic, 
  MicOff, 
  Clock, 
  Sparkles, 
  ChevronRight,
  SlidersHorizontal,
  Heart
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useFilter } from '../../context/FilterContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { SAMPLE_PRODUCTS, CATEGORIES } from '../../data/products';
import type { Product } from '../../types';

const TRENDING_SEARCHES = [
  { text: 'Textured Knit Polo', tag: 'Trending' },
  { text: 'Linen Resort Shorts', tag: 'Summer' },
  { text: 'French Terry Shorts', tag: 'Popular' },
  { text: 'Cashmere Wool', tag: 'Luxury' },
  { text: 'Heavyweight T-Shirt', tag: 'Bestseller' },
  { text: 'Washed Indigo Tee', tag: 'New' },
  { text: 'Ecru Waffle Shorts', tag: 'Curated' },
];

const SEARCH_PLACEHOLDERS = [
  "Search 'Linen Resort Shorts'...",
  "Search 'Textured Knit Polo'...",
  "Search 'French Terry Shorts'...",
  "Search 'Heavyweight T-Shirt'...",
  "Search 'Cashmere Sweaters'...",
  "Search 'Bluez Luxoria Essentials'..."
];

const RECENT_SEARCHES_KEY = 'bluez_luxoria_recent_searches';

export const MobileSearchPage: React.FC = () => {
  const { 
    isMobileSearchOpen, 
    closeMobileSearch, 
    openPDP, 
    formatPrice, 
    setFilterModalOpen,
    addToast 
  } = useUI();

  const { 
    filters, 
    setSearch, 
    setCategory, 
    setSortBy, 
    filteredProducts 
  } = useFilter();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [query, setQuery] = useState(filters.search || '');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [activeTabCategory, setActiveTabCategory] = useState<string>('all');
  const [showAllResults, setShowAllResults] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches(['Polo T-Shirts', 'Cashmere', 'Heavyweight Tee']);
      }
    } catch {
      setRecentSearches(['Polo T-Shirts', 'Cashmere', 'Heavyweight Tee']);
    }
  }, []);

  // Save query to recent searches
  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save recent search:', e);
    }
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving recent searches', err);
    }
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.warn('Error clearing recent searches', err);
    }
  };

  // Focus input automatically when search page opens
  useEffect(() => {
    if (isMobileSearchOpen) {
      setQuery(filters.search || '');
      setShowAllResults(Boolean(filters.search));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isMobileSearchOpen, filters.search]);

  // Animated placeholder cycling
  useEffect(() => {
    if (query) return;
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [query]);

  // Handle voice search (Web Speech API with fallback)
  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          handlePerformSearch(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
          addToast('Voice Search', 'Could not capture voice. Please type your search.', 'info');
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } catch {
        setIsListening(false);
      }
    } else {
      // Graceful voice search simulation
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const sampleQuery = 'Textured Knit Polo';
        setQuery(sampleQuery);
        handlePerformSearch(sampleQuery);
        addToast('Voice Captured', `Searching for "${sampleQuery}"`, 'success');
      }, 1500);
    }
  };

  const handlePerformSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    setSearch(trimmed);
    setShowAllResults(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSearch(val);
    if (!val) {
      setShowAllResults(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearch('');
    setShowAllResults(false);
    inputRef.current?.focus();
  };

  const handleSelectProduct = (product: Product) => {
    saveRecentSearch(product.title);
    closeMobileSearch();
    openPDP(product);
  };

  // Instant Suggestions calculation
  const searchSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const suggestions: { text: string; category?: string; count: number }[] = [];

    // Check matching categories
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all' && cat.label.toLowerCase().includes(q)) {
        const count = SAMPLE_PRODUCTS.filter(p => p.category === cat.id).length;
        suggestions.push({ text: cat.label, category: 'Category', count });
      }
    });

    // Check matching product titles
    SAMPLE_PRODUCTS.forEach(p => {
      if (p.title.toLowerCase().includes(q) && !suggestions.some(s => s.text.toLowerCase() === p.title.toLowerCase())) {
        suggestions.push({ text: p.title, category: p.category.toUpperCase(), count: 1 });
      }
      if (p.fabric.name.toLowerCase().includes(q) && !suggestions.some(s => s.text.toLowerCase() === p.fabric.name.toLowerCase())) {
        suggestions.push({ text: p.fabric.name, category: 'Fabric', count: 1 });
      }
    });

    return suggestions.slice(0, 6);
  }, [query]);

  // Direct Product Previews
  const previewProducts = useMemo(() => {
    if (!query.trim()) return [];
    return filteredProducts.slice(0, 4);
  }, [query, filteredProducts]);

  if (!isMobileSearchOpen) return null;

  return (
    <div className="mobile-search-page-overlay">
      {/* Flipkart-Style Sticky Search Header */}
      <div className="mobile-search-topbar">
        {/* Back Button */}
        <button 
          className="mobile-search-back-btn"
          onClick={closeMobileSearch}
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>

        {/* Search Input Box with Flipkart Ergonomics */}
        <div className="mobile-search-input-pill">
          <Search size={18} className="mobile-search-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="mobile-search-native-input"
            placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePerformSearch(query);
              }
            }}
            aria-label="Search Bluez Luxoria"
          />

          {query && (
            <button 
              className="mobile-search-icon-btn" 
              onClick={handleClear}
              aria-label="Clear query"
            >
              <X size={16} />
            </button>
          )}

          <button 
            className={`mobile-search-icon-btn ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceSearch}
            title="Voice Search"
            aria-label="Voice Search"
          >
            {isListening ? (
              <MicOff size={17} style={{ color: 'var(--color-brand)' }} />
            ) : (
              <Mic size={17} />
            )}
          </button>
        </div>
      </div>

      {/* Voice Listening Ripple Indicator */}
      {isListening && (
        <div className="mobile-search-voice-banner">
          <div className="voice-wave-dot" />
          <div className="voice-wave-dot" />
          <div className="voice-wave-dot" />
          <span>Listening... Speak now</span>
        </div>
      )}

      {/* SEARCH BODY CONTENT */}
      <div className="mobile-search-scroll-body">

        {/* ---------------------------------------------------- */}
        {/* STATE A: NO QUERY ENTERED (Recent, Trending, Categories) */}
        {/* ---------------------------------------------------- */}
        {!query.trim() && (
          <>
            {/* 1. Recent Searches (Flipkart History) */}
            {recentSearches.length > 0 && (
              <div className="mobile-search-section">
                <div className="mobile-search-section-header">
                  <div className="mobile-search-title-with-icon">
                    <Clock size={16} style={{ color: 'var(--color-subtle)' }} />
                    <span className="mobile-search-section-title">Recent Searches</span>
                  </div>
                  <button 
                    className="mobile-search-clear-all-link"
                    onClick={clearAllRecent}
                  >
                    Clear All
                  </button>
                </div>

                <div className="mobile-search-recent-chips">
                  {recentSearches.map((term, i) => (
                    <div 
                      key={i} 
                      className="mobile-search-recent-chip"
                      onClick={() => {
                        setQuery(term);
                        handlePerformSearch(term);
                      }}
                    >
                      <Clock size={12} style={{ opacity: 0.6 }} />
                      <span className="chip-label">{term}</span>
                      <button 
                        className="chip-remove-btn"
                        onClick={(e) => removeRecentSearch(term, e)}
                        aria-label={`Remove ${term}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Trending Searches (Clean Text + Tag, No Icons) */}
            <div className="mobile-search-section">
              <div className="mobile-search-section-header">
                <span className="mobile-search-section-title">Trending on Bluez Luxoria</span>
              </div>

              <div className="mobile-search-trending-grid">
                {TRENDING_SEARCHES.map((item, idx) => (
                  <div 
                    key={idx}
                    className="mobile-search-trending-card"
                    onClick={() => {
                      setQuery(item.text);
                      handlePerformSearch(item.text);
                    }}
                  >
                    <span className="trending-text">{item.text}</span>
                    <span className="trending-badge">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Explore by Categories (Visual Grid) */}
            <div className="mobile-search-section" style={{ paddingBottom: '32px' }}>
              <div className="mobile-search-section-header">
                <span className="mobile-search-section-title">Browse Categories</span>
              </div>

              <div className="mobile-search-categories-scroll">
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                  const matchingProd = SAMPLE_PRODUCTS.find(p => p.category === cat.id);
                  const count = SAMPLE_PRODUCTS.filter(p => p.category === cat.id).length;
                  return (
                    <div 
                      key={cat.id} 
                      className="mobile-search-cat-card"
                      onClick={() => {
                        setCategory(cat.id);
                        setSearch('');
                        closeMobileSearch();
                      }}
                    >
                      <div className="cat-card-image-wrap">
                        <img 
                          src={matchingProd?.images[0] || '/taupe-knit-polo.jpg'} 
                          alt={cat.label} 
                          className="cat-card-img"
                        />
                      </div>
                      <div className="cat-card-info">
                        <span className="cat-card-title">{cat.label}</span>
                        <span className="cat-card-count">{count} Designs</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ---------------------------------------------------- */}
        {/* STATE B: ACTIVE QUERY (Typeahead Suggestions & Live Previews) */}
        {/* ---------------------------------------------------- */}
        {query.trim() && !showAllResults && (
          <div className="mobile-search-typeahead-container">
            {/* Suggestions list */}
            {searchSuggestions.length > 0 && (
              <div className="mobile-search-suggestions-list">
                {searchSuggestions.map((sug, sIdx) => (
                  <div 
                    key={sIdx}
                    className="mobile-search-suggestion-row"
                    onClick={() => {
                      setQuery(sug.text);
                      handlePerformSearch(sug.text);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Search size={15} style={{ color: 'var(--color-subtle)' }} />
                      <span className="suggestion-text">
                        <strong>{query}</strong>
                        {sug.text.toLowerCase().startsWith(query.toLowerCase()) 
                          ? sug.text.slice(query.length)
                          : ` (${sug.text})`
                        }
                      </span>
                    </div>
                    {sug.category && (
                      <span className="suggestion-category-tag">in {sug.category}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Instant Product Previews */}
            {previewProducts.length > 0 && (
              <div className="mobile-search-preview-section">
                <div className="mobile-search-preview-header">
                  <span>Matching Garments ({filteredProducts.length})</span>
                  <button 
                    className="view-all-results-link"
                    onClick={() => setShowAllResults(true)}
                  >
                    View all <ChevronRight size={14} />
                  </button>
                </div>

                <div className="mobile-search-preview-cards">
                  {previewProducts.map(prod => (
                    <div 
                      key={prod.id} 
                      className="mobile-search-product-row"
                      onClick={() => handleSelectProduct(prod)}
                    >
                      <div className="product-row-image-wrap">
                        <img src={prod.images[0]} alt={prod.title} className="product-row-img" />
                      </div>

                      <div className="product-row-details">
                        <span className="product-row-brand">{prod.brand} • {prod.atelierLocation}</span>
                        <h4 className="product-row-title">{prod.title}</h4>
                        <div className="product-row-bottom">
                          <span className="product-row-price">{formatPrice(prod.price)}</span>
                          {prod.isGuestFavorite && (
                            <span className="product-row-badge">
                              <Sparkles size={10} /> Member Pick
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Primary Full Results Button */}
                <button 
                  className="mobile-search-full-results-btn"
                  onClick={() => setShowAllResults(true)}
                >
                  <Search size={16} />
                  <span>See all {filteredProducts.length} results for "{query}"</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STATE C: FULL RESULTS GRID (Flipkart Results View) */}
        {/* ---------------------------------------------------- */}
        {query.trim() && showAllResults && (
          <div className="mobile-search-results-screen">
            {/* Filter & Sort Sticky Action Bar */}
            <div className="mobile-search-results-toolbar">
              <div className="results-count-text">
                <strong>{filteredProducts.length}</strong> items found for "<em>{query}</em>"
              </div>

              <div className="results-actions-cluster">
                <button 
                  className="results-filter-pill-btn"
                  onClick={() => {
                    closeMobileSearch();
                    setFilterModalOpen(true);
                  }}
                >
                  <SlidersHorizontal size={14} />
                  <span>Filter</span>
                </button>

                <select 
                  className="results-sort-select"
                  value={filters.sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Quick Category Chips */}
            <div className="mobile-search-quick-cats">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`quick-cat-btn ${activeTabCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTabCategory(cat.id);
                    setCategory(cat.id);
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid (2-Column Mobile Layout) */}
            {filteredProducts.length > 0 ? (
              <div className="mobile-search-grid">
                {filteredProducts.map(prod => {
                  const isFavorited = isInWishlist(prod.id);
                  return (
                    <div 
                      key={prod.id} 
                      className="mobile-search-grid-card"
                      onClick={() => handleSelectProduct(prod)}
                    >
                      {/* Thumbnail & Wishlist */}
                      <div className="grid-card-image-wrap">
                        <img src={prod.images[0]} alt={prod.title} className="grid-card-img" />
                        
                        <button
                          className={`grid-card-heart ${isFavorited ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          aria-label="Save to Wishlist"
                        >
                          <Heart size={16} fill={isFavorited ? '#FF385C' : 'none'} stroke={isFavorited ? '#FF385C' : '#121214'} />
                        </button>

                        {prod.isGuestFavorite && (
                          <div className="grid-card-favorite-tag">
                            ★ Top Rated
                          </div>
                        )}
                      </div>

                      {/* Info & Price */}
                      <div className="grid-card-content">
                        <span className="grid-card-brand">{prod.brand}</span>
                        <h4 className="grid-card-title">{prod.title}</h4>
                        <div className="grid-card-price-row">
                          <span className="grid-card-price">{formatPrice(prod.price)}</span>
                          {prod.originalPrice && (
                            <span className="grid-card-original-price">{formatPrice(prod.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Zero Results State */
              <div className="mobile-search-empty-state">
                <div className="empty-state-icon-box">
                  <Search size={32} style={{ opacity: 0.4 }} />
                </div>
                <h3>No results found for "{query}"</h3>
                <p>Try searching for keywords like "Polo", "Cashmere", "T-Shirt", or "Denim"</p>
                <button 
                  className="btn btn-dark btn-pill"
                  style={{ marginTop: '16px', padding: '10px 24px' }}
                  onClick={() => {
                    setQuery('');
                    setSearch('');
                    setShowAllResults(false);
                  }}
                >
                  Explore All Collections
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
