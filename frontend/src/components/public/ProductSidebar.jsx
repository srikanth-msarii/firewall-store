import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

export const ProductSidebar = ({ 
  brands, 
  selectedBrands, 
  onBrandChange, 
  inStockOnly, 
  onStockChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}) => {
  // 1. State for mobile toggle is still inside the sidebar
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <aside className="w-full">
      {/* 2. This button is only visible on mobile (lg:hidden) */}
      <button 
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        // --- THE FIX ---
        // 1. Removed `relative z-10`
        // 2. Added `mb-4` to create space *below* the button
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-900 lg:hidden mb-4"
      >
        <span className="flex items-center">
          <Filter size={18} className="mr-2 text-blue-600" />
          Show Filters
        </span>
        <ChevronDown 
          size={20} 
          className={`transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* 3. This content is hidden on mobile by default, always visible on desktop */}
      {/* --- THE FIX --- 
          4. Removed `mt-4` and `lg:mt-0`. The spacing is now handled
             by the button above on mobile, and the `mb-4` on the
             desktop title below.
      */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Desktop-only Title */}
        <h2 className="mb-4 hidden items-center text-xl font-semibold lg:flex">
          <Filter size={20} className="mr-2" />
          Filters
        </h2>

        {/* --- Price Range Filter --- */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-gray-800">By Price Range</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="min-price"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              id="max-price"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>

        {/* --- Brand Filter --- */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-gray-800">By Brand</h3>
          <ul className="space-y-2">
            {brands.map((brand) => (
              <li key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  value={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrandChange(brand)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-600">
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Stock Filter --- */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-gray-800">By Availability</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <input
                type="checkbox"
                id="stock-filter"
                checked={inStockOnly}
                onChange={(e) => onStockChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="stock-filter" className="ml-3 text-sm text-gray-600">
                In Stock Only
              </label>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

