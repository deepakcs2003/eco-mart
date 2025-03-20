import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';

const BrandedProductCart = ({ products, selectedBrand, currencyType = "USD", exchangeRate = 1, onCardClick, onToggleWishlist, wishlistItems}) => {
  // console.log(wishlistItems);
  // Filter state
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Pagination state - now showing 50 products per page as requested
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
    neutral2: "#F5DEB3",     // Warm Beige
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
      <div className="text-center py-10" style={{ color: colors.text }}>
        <p className="text-lg" style={{ backgroundColor: colors.background, padding: '20px', borderRadius: '8px' }}>
          No products available
        </p>
      </div>
    );
  }
  
  const headerText = selectedBrand ? `Products from ${selectedBrand.name}` : "All Products";

  return (
    <div style={{ backgroundColor: colors.neutral2, borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div className="mb-4">
        <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary, borderBottom: `2px solid ${colors.secondary}`, paddingBottom: '10px' }}>
          {headerText}
        </h2>
        
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6" style={{ backgroundColor: colors.background, padding: '15px', borderRadius: '8px' }}>
          {/* Search input */}
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-3 pl-10 rounded-md border-2 focus:outline-none"
                style={{ borderColor: colors.primary }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke={colors.primary} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Price filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium whitespace-nowrap" style={{ color: colors.text }}>Price Range:</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border-2 rounded px-3 py-2 w-24 text-sm focus:outline-none"
              style={{ borderColor: colors.secondary }}
              min="0"
            />
            <span style={{ color: colors.text }}>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border-2 rounded px-3 py-2 w-24 text-sm focus:outline-none"
              style={{ borderColor: colors.secondary }}
              min="0"
            />
            <button 
              onClick={resetFilters}
              className="py-2 px-4 rounded font-medium transition-colors duration-200"
              style={{ 
                backgroundColor: colors.accent1, 
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* No products message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-10" style={{ backgroundColor: colors.background, borderRadius: '8px', padding: '30px' }}>
          <p className="text-lg mb-4" style={{ color: colors.text }}>No products match your filters</p>
          <button 
            onClick={resetFilters}
            className="mt-4 py-2 px-6 rounded font-medium transition-colors duration-200"
            style={{ 
              backgroundColor: colors.primary, 
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
      
      {/* Results summary */}
      {filteredProducts.length > 0 && (
        <div className="mb-4 text-sm" style={{ color: colors.neutral1, fontWeight: 'bold' }}>
          Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      )}
      
      {/* Product grid */}
      {currentProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                colorScheme={colors} // Pass color scheme to ProductCard
              />
            );
          })}
        </div>
      )}
      
      {/* Pagination */}
      {filteredProducts.length > productsPerPage && (
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center" 
             style={{ backgroundColor: colors.background, padding: '12px', borderRadius: '8px' }}>
          <div className="text-sm mb-4 sm:mb-0" style={{ color: colors.text, fontWeight: 'medium' }}>
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-l transition-colors duration-200`}
              style={{ 
                backgroundColor: currentPage === 1 ? '#e5e5e5' : colors.accent1,
                color: currentPage === 1 ? '#999' : 'white',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                border: 'none'
              }}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              // For pagination with many pages, show a sliding window
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else {
                // Calculate the window of page numbers to show
                let start = Math.max(1, currentPage - 2);
                let end = Math.min(totalPages, start + 4);
                
                if (end - start < 4) {
                  start = Math.max(1, end - 4);
                }
                
                pageNumber = start + index;
                if (pageNumber > totalPages) return null;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className="px-4 py-2 transition-colors duration-200"
                  style={{ 
                    backgroundColor: currentPage === pageNumber ? colors.primary : 'white',
                    color: currentPage === pageNumber ? 'white' : colors.text,
                    border: 'none',
                    cursor: 'pointer',
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
              className={`px-4 py-2 rounded-r transition-colors duration-200`}
              style={{ 
                backgroundColor: currentPage === totalPages ? '#e5e5e5' : colors.accent1,
                color: currentPage === totalPages ? '#999' : 'white',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                border: 'none'
              }}
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