import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { CATEGORIES } from '../../data/products';

export const CategoryBar: React.FC = () => {
  const { filters, setCategory } = useFilter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-bar-wrapper">
      <div className="app-container">
        {/* Main Quick Action Category Tabs (Clean Minimal Text Pills, Zero Icons) */}
        <div className="category-bar">
          {/* Scroll Left Button */}
          <button 
            className="btn-icon" 
            style={{ width: '32px', height: '32px', flexShrink: 0 }}
            onClick={() => scroll('left')}
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Quick Action Category Pills */}
          <div className="category-scroll-container" ref={scrollRef}>
            {CATEGORIES.map(cat => {
              const isActive = filters.category === cat.id;

              return (
                <button
                  key={cat.id}
                  className={`category-item ${isActive ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                  type="button"
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button 
            className="btn-icon" 
            style={{ width: '32px', height: '32px', flexShrink: 0 }}
            onClick={() => scroll('right')}
            aria-label="Scroll categories right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
