import React from "react";

const ProductFilters = ({ 
  currencyType,
  setCurrencyType,
  priceRange,
  setPriceRange,
  availablePlatforms,
  selectedPlatforms,
  togglePlatform,
  resetFilters,
  getMaxPrice
}) => {
  return (
    <div className="w-full flex flex-col bg-white rounded-lg shadow-md p-5">
      <h2 className="text-xl font-bold text-[#317873] mb-4">Filters</h2>

      {/* Currency and Price Filter */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Currency Toggle */}
        <div className="w-full md:w-1/2">
          <h3 className="font-semibold text-[#6B8E23] mb-2">Currency</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrencyType("INR")}
              className={`px-3 py-1 rounded ${currencyType === "INR" ? 'bg-[#228B22] text-white' : 'bg-[#F5DEB3] text-[#8B5A2B]'}`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrencyType("USD")}
              className={`px-3 py-1 rounded ${currencyType === "USD" ? 'bg-[#228B22] text-white' : 'bg-[#F5DEB3] text-[#8B5A2B]'}`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="w-full md:w-1/2">
          <h3 className="font-semibold text-[#6B8E23] mb-2">Price Range</h3>
          <div className="flex justify-between text-sm text-[#8B5A2B] mb-1">
            <span>{currencyType === "INR" ? "₹" : "$"}{priceRange.min}</span>
            <span>{currencyType === "INR" ? "₹" : "$"}{priceRange.max}</span>
          </div>
          <input
            type="range"
            min="0"
            max={getMaxPrice()}
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            className="w-full h-2 bg-[#A8B5A2] rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Platform/Source Filter */}
      <div className="mt-4">
        <h3 className="font-semibold text-[#6B8E23] mb-2">Platform</h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          {availablePlatforms.map((platform) => (
            <div key={platform} className="flex items-center">
              <input
                type="checkbox"
                id={`platform-${platform}`}
                checked={selectedPlatforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
                className="w-4 h-4 text-[#228B22] bg-[#F5DEB3] border-[#8B5A2B] rounded focus:ring-[#317873]"
              />
              <label htmlFor={`platform-${platform}`} className="ml-2 text-[#8B5A2B]">
                {platform}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={resetFilters}
        className="w-full bg-[#317873] text-white py-2 rounded hover:bg-[#228B22] transition-colors mt-4"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ProductFilters;