import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import summaryApi from "../Common";
import placeholder from "../Assist/placeholder.webp";
import { useNavigate } from "react-router-dom";
import ProductDetail from "../Components/ProductDetail";
import { FaArrowLeft } from "react-icons/fa"; // Importing an icon from react-icons


export const Product = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currencyType, setCurrencyType] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(83.5); // USD to INR approximate rate
  const [selectedProductUrl, setSelectedProductUrl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "environmental friendly";
  };

  // Get available platforms from product data
  const availablePlatforms = productData.length > 0
    ? [...new Set(productData.map(product => product.source))]
    : [];

  useEffect(() => {
    const fetchProducts = async () => {
      const query = getSearchQuery();
      console.log("Searching for:", query);
      if (!query) return;

      setLoading(true);
      setProductData([]); // Clear previous results

      try {
        const response = await fetch(`${summaryApi.scrape_product.url}?search=${query}`);
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          try {
            const jsonData = JSON.parse(text);

            if (jsonData.loading === false) {
              setLoading(false);
            }

            if (jsonData.data && jsonData.data.length > 0) {
              setProductData(prevData => [...prevData, ...jsonData.data]);
            }
          } catch (error) {
            console.error("Error parsing JSON chunk:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  // Apply filters when productData, selectedPlatforms or priceRange changes
  useEffect(() => {
    if (productData.length > 0) {
      let filtered = [...productData];

      // Filter by platform
      if (selectedPlatforms.length > 0) {
        filtered = filtered.filter(product => selectedPlatforms.includes(product.source));
      }

      // Filter by price range - with additional validation
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price) || 0;
        // Convert to selected currency if needed
        const convertedPrice = currencyType === "INR" && product.currencyRaw === "$"
          ? price * exchangeRate
          : price;

        // Add validation to ensure no NaN or infinite values
        if (isNaN(convertedPrice)) return false;
        return convertedPrice >= priceRange.min && convertedPrice <= priceRange.max;
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [productData, selectedPlatforms, priceRange, currencyType, exchangeRate]);

  // Toggle platform selection in filter
  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  // Add to wishlist functionality
  const toggleWishlist = (product) => {
    if (!product || !product.url) return; // Add validation
    
    const isInWishlist = wishlist.some(item => item.url === product.url);

    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.url !== product.url));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Format price with currency
  const formatPrice = (price, currencyRaw) => {
    if (!price) return "N/A";

    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;

    if (currencyType === "INR" && currencyRaw === "$") {
      return `₹${(numPrice * exchangeRate).toFixed(2)}`;
    } else if (currencyRaw === "$") {
      return `$${numPrice.toFixed(2)}`;
    } else {
      return `${currencyRaw || "₹"}${numPrice.toFixed(2)}`;
    }
  };

  // Get max price from all products
  const getMaxPrice = () => {
    if (productData.length === 0) return 10000;
    const maxPrice = Math.max(...productData.map(p => {
      const price = parseFloat(p.price) || 0;
      return isNaN(price) ? 0 : price; // Ensure we don't get NaN
    }));
    return currencyType === "INR" ? maxPrice * exchangeRate : maxPrice;
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedPlatforms([]);
    setPriceRange({ min: 0, max: getMaxPrice() });
  };

  // Handle product selection
  const handleProductSelect = (productUrl) => {
    setSelectedProductUrl(productUrl);
  
  };

  // Handle back to products list
  const handleBackToProducts = () => {
    setSelectedProductUrl(null);
  };

  // If a product is selected, show the ProductDetails component
  if (selectedProductUrl) {

    return (
      <div className="min-h-screen bg-[#A8B5A2] font-sans">
      <button 
        onClick={handleBackToProducts}
        className="fixed top-20 left-4 px-4 py-2 bg-[#317873] text-white rounded hover:bg-[#228B22] transition-colors shadow-md z-50"
      >
      <FaArrowLeft />
      </button>
      <ProductDetail url={selectedProductUrl} />
    </div>
    
    );

  }

  return (
    <div className="min-h-screen bg-[#A8B5A2] font-sans">
      {/* Header */}
      <p className="text-center text-[#F5DEB3] mt-2">Results for: {getSearchQuery()}</p>

      {/* Main Content */}
      <div className="mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-col gap-6">
          {/* Filters Sidebar */}
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

          {/* Product Grid */}
          <div className="w-full">
            <>
              <div className="mb-4 text-[#317873]">
                <span className="font-semibold">{filteredProducts.length}</span> products found
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={`${product.url}-${index}`}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                      onClick={() => handleProductSelect(product.url)}
                    >
                      <div className="h-48 overflow-hidden bg-[#F5DEB3] relative">
                        <img
                          src={product.mainImage?.url || placeholder}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholder;
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent div click event
                            toggleWishlist(product);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-sm"
                        >
                          {wishlist.some(item => item.url === product.url) ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#A52A2A" stroke="#A52A2A" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="p-4 flex flex-col h-56">
                        <h3 className="text-lg font-semibold text-[#228B22] line-clamp-2 h-14">{product.name}</h3>
                        <div className="mt-auto">
                          <div className="mb-1">
                            <span className="text-lg font-bold text-[#317873]">
                              {formatPrice(product.price, product.currencyRaw)}
                            </span>
                            {product.regularPrice && (
                              <span className="ml-2 text-sm line-through text-[#8B5A2B]">
                                {formatPrice(product.regularPrice, product.currencyRaw)}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#8B5A2B] mb-3">
                            From: {product.source}
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={product.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-center bg-[#6B8E23] text-white py-2 rounded hover:bg-[#228B22] transition-colors"
                              onClick={(e) => e.stopPropagation()} // Prevent div click
                            >
                              View Product
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent div click event
                                toggleWishlist(product);
                              }}
                              className={`py-2 px-3 rounded ${wishlist.some(item => item.url === product.url)
                                ? 'bg-[#A52A2A] text-white'
                                : 'bg-[#F5DEB3] text-[#8B5A2B]'} transition-colors`}
                            >
                              {wishlist.some(item => item.url === product.url) ? "Remove" : "Add"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-[#8B5A2B] text-lg mb-4">No products found matching your filters.</p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#317873] text-white px-4 py-2 rounded hover:bg-[#228B22] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;