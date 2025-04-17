import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';

const BrandedProductCart = ({ products, selectedBrand, currencyType = "USD", exchangeRate = 1, onCardClick, onToggleWishlist, wishlistItems}) => {
  // Filter state
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Pagination state - showing 50 products per page
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(50);
  
  // Color scheme
  const colors = {
    primary: "#228B22",      // Forest Green
    secondary: "#6B8E23",    // Olive Green
    background: "#A8B5A2",   // Sage Green
    accent1: "#317873",      // Deep Teal
    accent2: "#87CEEB",      // Sky Blue
    neutral1: "#8B5A2B",     // Earthy Brown
    neutral2: "#F5DEB3",     // Warm Beige (background in screenshot)
    error: "#A52A2A",        // Rustic Red
    text: "#000000"          // Black text
  };
  
  // Apply filters and search
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let productsToFilter = products;
    
    // Brand filter
    if (selectedBrand) {
      productsToFilter = products.filter(product => {
        if (product.brand && typeof product.brand === 'object') {
          return product.brand._id === selectedBrand._id || 
                 product.brand.id === selectedBrand._id ||
                 product.brand.name.toLowerCase() === selectedBrand.name.toLowerCase();
        }
        return product.brand === selectedBrand._id || 
               product.brand === selectedBrand.name || 
               product.brand.toLowerCase() === selectedBrand.name.toLowerCase();
      });
    }
    
    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      productsToFilter = productsToFilter.filter(product => 
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }
    
    // Price filter
    if (minPrice !== '' || maxPrice !== '') {
      productsToFilter = productsToFilter.filter(product => {
        const productPrice = product.price * exchangeRate;
        const min = minPrice === '' ? 0 : parseFloat(minPrice);
        const max = maxPrice === '' ? Infinity : parseFloat(maxPrice);
        return productPrice >= min && productPrice <= max;
      });
    }
    
    setFilteredProducts(productsToFilter);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, selectedBrand, searchQuery, minPrice, maxPrice, exchangeRate]);
  
  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Reset all filters
  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  // If no products are available at all
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-6 px-4">
        <p className="text-lg bg-[#A8B5A2] p-4 sm:p-5 rounded-lg">
          No products available
        </p>
      </div>
    );
  }
  
  const headerText = selectedBrand ? `Products from ${selectedBrand.name}` : "All Products";

  return (
    <div className="bg-[#F5DEB3] rounded-lg p-1 sm:p-6 shadow-md">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-[#228B22] border-b-2 border-[#6B8E23] pb-2 sm:pb-3">
          {headerText}
        </h2>
        
        {/* Search and filter controls - Better aligned for mobile */}
        <div className="bg-[#A8B5A2] rounded-lg p-3 sm:p-4">
          {/* Search input */}
          <div className="mb-3 sm:mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 sm:py-3 pl-10 rounded-md border-2 border-[#228B22] focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="#228B22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Price filter - Better aligned like in screenshot */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium mr-1">Price Range:</span>
            <div className="flex flex-1 items-center gap-2 sm:max-w-md">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border-2 border-[#6B8E23] rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                min="0"
              />
              <span className="text-sm font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border-2 border-[#6B8E23] rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                min="0"
              />
            </div>
            <button 
              onClick={resetFilters}
              className="bg-[#317873] text-white py-2 px-4 rounded font-medium transition-colors duration-200 hover:bg-[#87CEEB] text-sm w-full sm:w-auto mt-2 sm:mt-0"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* No products message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-8 px-4 bg-[#A8B5A2] rounded-lg">
          <p className="text-lg mb-4">No products match your filters</p>
          <button 
            onClick={resetFilters}
            className="bg-[#228B22] text-white py-2 px-6 rounded font-medium transition-colors duration-200 hover:bg-[#6B8E23]"
          >
            Reset Filters
          </button>
        </div>
      )}
      
      {/* Results summary - Styled like in screenshot */}
      {filteredProducts.length > 0 && (
        <div className="mb-4 text-sm sm:text-base font-medium text-[#8B5A2B]">
          Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      )}
      
      {/* Product grid - More responsive breakpoints */}
      {currentProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {currentProducts.map(product => {
            const isInWishlist = wishlistItems.some(item => item.url === product.url);
            
            return (
              <ProductCard
                key={product._id}
                product={product}
                isInWishlist={isInWishlist}
                currencyType={currencyType}
                exchangeRate={exchangeRate}
                onCardClick={() => onCardClick(product)}
                onToggleWishlist={() => onToggleWishlist(product)}
                colorScheme={colors}
              />
            );
          })}
        </div>
      )}
      
      {/* Pagination - More mobile friendly */}
      {filteredProducts.length > productsPerPage && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center bg-[#A8B5A2] p-3 rounded-lg">
          <div className="text-xs sm:text-sm mb-3 sm:mb-0 font-medium">
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          
          <div className="flex items-center flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-l text-xs sm:text-sm ${
                currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#317873] text-white cursor-pointer hover:bg-[#87CEEB]'
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
              // For pagination with many pages, show a sliding window
              let pageNumber;
              if (totalPages <= 3) {
                pageNumber = index + 1;
              } else {
                // Calculate the window of page numbers to show
                let start = Math.max(1, currentPage - 1);
                let end = Math.min(totalPages, start + 2);
                
                if (end - start < 2) {
                  start = Math.max(1, end - 2);
                }
                
                pageNumber = start + index;
                if (pageNumber > totalPages) return null;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ${
                    currentPage === pageNumber 
                      ? 'bg-[#228B22] text-white' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  style={{
                    borderLeft: '1px solid #e5e5e5',
                    borderRight: '1px solid #e5e5e5'
                  }}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-r text-xs sm:text-sm ${
                currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#317873] text-white cursor-pointer hover:bg-[#87CEEB]'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandedProductCart;