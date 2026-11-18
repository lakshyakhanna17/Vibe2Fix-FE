import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export const ProductFilters = ({
  categories = [],
  filters,
  onChange,
  onReset,
}) => {
  const handleCategoryChange = (slug) => {
    onChange({
      ...filters,
      category: filters.category === slug ? '' : slug,
      page: 1,
    });
  };

  const handlePriceChange = (e) => {
    onChange({
      ...filters,
      maxPrice: e.target.value,
      page: 1,
    });
  };

  const handleRatingChange = (rating) => {
    onChange({
      ...filters,
      minRating: filters.minRating === rating ? '' : rating,
      page: 1,
    });
  };

  const handleInStockToggle = (e) => {
    onChange({
      ...filters,
      inStock: e.target.checked,
      page: 1,
    });
  };

  const handleSortChange = (e) => {
    onChange({
      ...filters,
      sort: e.target.value,
      page: 1,
    });
  };

  return (
    <aside className="w-full bg-bg-card rounded-3xl p-6 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Filters</h2>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] text-text-muted hover:text-white flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort selection */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
          Sort By
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={handleSortChange}
          className="w-full px-3.5 py-2.5 bg-bg-elevated rounded-xl text-xs text-text-primary focus:outline-none focus:bg-[#28282D] shadow-inner"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="popularity">Most Popular</option>
        </select>
      </div>

      {/* 3D Pop Category Pills Filter */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
          Categories
        </label>
        <div className="flex flex-wrap gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const slug = cat.slug || cat.categoryId;
            const isSelected = filters.category === slug;
            return (
              <button
                key={cat.categoryId || cat.id}
                type="button"
                onClick={() => handleCategoryChange(slug)}
                className={`px-3 py-1.5 rounded-full text-[11px] transition-all duration-150 ${
                  isSelected ? 'tab-3d-active' : 'tab-3d text-text-secondary'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Max Price
          </label>
          <span className="text-white font-bold font-mono">
            ₹{Number(filters.maxPrice || 50000).toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="50000"
          step="200"
          value={filters.maxPrice || 50000}
          onChange={handlePriceChange}
          className="w-full accent-white bg-bg-border h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-text-muted">
          <span>₹100</span>
          <span>₹50,000+</span>
        </div>
      </div>

      {/* Minimum Rating 3D Buttons */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[4, 3, 2, 1].map((rating) => {
            const isSelected = String(filters.minRating) === String(rating);
            return (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(rating)}
                className={`py-1.5 rounded-xl text-xs transition-all duration-150 ${
                  isSelected
                    ? 'tab-3d-active'
                    : 'tab-3d text-text-secondary'
                }`}
              >
                {rating}★+
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability / Stock Filter */}
      <div className="pt-2">
        <label className="flex items-center gap-2.5 text-xs text-text-secondary cursor-pointer hover:text-white transition">
          <input
            type="checkbox"
            checked={!!filters.inStock}
            onChange={handleInStockToggle}
            className="rounded bg-bg-elevated text-white focus:ring-0"
          />
          <span className="font-semibold text-xs">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
};
