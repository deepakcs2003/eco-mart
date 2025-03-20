import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import summaryApi from "../Common";
import ProductDetail from "../Components/ProductDetail";
import DraggableBackButton from "../Components/DraggableBackButton";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Components/ProductCard";
import ProductFilters from "../Components/ProductFilters";
import LoadingSpinner from "../Components/LoadingSpinner";

// Cache expiration time in milliseconds (e.g., 1 hour)
const CACHE_EXPIRATION = 60 * 60 * 1000;

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
  const {addToWishlist, removeFromWishlist, fetchAllWishlistProducts} = useContext(WishlistContext);

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "environmental friendly";
  };

  // Get available platforms from product data
  const availablePlatforms = productData.length > 0
    ? [...new Set(productData.map(product => product.source))]
    : [];

  // Helper functions for localStorage management
  const getCacheKey = (query) => `product_cache_${query}`;
  
  const getFromCache = (query) => {
    try {
      const cacheKey = getCacheKey(query);
      const cachedData = localStorage.getItem(cacheKey);
      
      if (!cachedData) return null;
      
      const { data, timestamp } = JSON.parse(cachedData);
      
      // Check if cache has expired
      if (Date.now() - timestamp > CACHE_EXPIRATION) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  };
  
  const saveToCache = (query, data) => {
    try {
      const cacheKey = getCacheKey(query);
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  // Load product data - with caching strategy
  useEffect(() => {
    const fetchProducts = async () => {
      const query = getSearchQuery();
      
      if (!query) return;
      
      // Try to get data from cache first
      const cachedData = getFromCache(query);
      
      if (cachedData && cachedData.length > 0) {
        console.log("Using cached data for:", query);
        setProductData(cachedData);
        setLoading(false);
        return;
      }
      
      // If not in cache or expired, fetch from API
      console.log("Fetching fresh data for:", query);
      setLoading(true);
      setProductData([]); // Clear previous results

      try {
        const response = await fetch(`${summaryApi.scrape_product.url}?search=${query}`);
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        
        let accumulatedData = [];

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
              accumulatedData = [...accumulatedData, ...jsonData.data];
              setProductData(accumulatedData);
            }
          } catch (error) {
            console.error("Error parsing JSON chunk:", error);
          }
        }
        
        // Save to cache when all data is received
        if (accumulatedData.length > 0) {
          saveToCache(query, accumulatedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    // Load user preferences from localStorage
    const loadUserPreferences = () => {
      try {
        // Load currency preference
        const savedCurrency = localStorage.getItem('preferred_currency');
        if (savedCurrency) {
          setCurrencyType(savedCurrency);
        }
        
        // Load platforms preference
        const savedPlatforms = localStorage.getItem('selected_platforms');
        if (savedPlatforms) {
          setSelectedPlatforms(JSON.parse(savedPlatforms));
        }
        
        // Load wishlist
        fetchAllWishlistProducts().then(data => {
          if (data) setWishlist(data);
        });
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    };

    loadUserPreferences();
    fetchProducts();
    
    // Save initial scroll position when component mounts
    const savedListPosition = localStorage.getItem('listScrollPosition');
    if (savedListPosition && !selectedProductUrl) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedListPosition, 10));
      }, 100);
    }
  }, [location.search]); // Only re-run when search query changes

  // Save user preferences when they change
  useEffect(() => {
    localStorage.setItem('preferred_currency', currencyType);
  }, [currencyType]);
  
  useEffect(() => {
    localStorage.setItem('selected_platforms', JSON.stringify(selectedPlatforms));
  }, [selectedPlatforms]);

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
  const toggleWishlist = async (product) => {
    if (!product || !product.url) {
        console.error("❌ toggleWishlist received invalid product:", product);
        return;
    }

    console.log("🔄 Toggling wishlist for:", product.url);

    const isInWishlist = wishlist.some(item => item?.url === product?.url);

    if (isInWishlist) {
        setWishlist(wishlist.filter(item => item?.url !== product?.url));
        await removeFromWishlist(product?.url);
    } else {
        setWishlist([...wishlist, product]);
        await addToWishlist(product); // Ensure this gets a valid product
    }

    await fetchAllWishlistProducts();
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
  const [listScrollPosition, setListScrollPosition] = useState(0);

  const handleProductSelect = (url) => {
    // Save current scroll position before showing product details
    setListScrollPosition(window.scrollY);
    localStorage.setItem('listScrollPosition', window.scrollY.toString());
    
    // Navigate to product detail
    setSelectedProductUrl(url);
    
    // Scroll to top when viewing new product
    window.scrollTo(0, 0);
  };
  
  // Handle back to products list
  const handleBackToProducts = () => {
    // Remember which product we're coming from
    const currentProduct = selectedProductUrl;
    localStorage.setItem(`scrollPosition_${currentProduct}`, window.scrollY.toString());
    
    // Navigate back to product list
    setSelectedProductUrl(null);
    
    // Restore list scroll position after state update
    setTimeout(() => {
      const savedPosition = localStorage.getItem('listScrollPosition');
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    }, 0);
  };
  
  // Restore scroll position when returning to a previously viewed product
  useEffect(() => {
    if (selectedProductUrl) {
      const savedProductPosition = localStorage.getItem(`scrollPosition_${selectedProductUrl}`);
      if (savedProductPosition) {
        window.scrollTo(0, parseInt(savedProductPosition, 10));
      }
    } else {
      // Restore list position
      const savedListPosition = localStorage.getItem('listScrollPosition');
      if (savedListPosition) {
        window.scrollTo(0, parseInt(savedListPosition, 10));
      }
    }
  }, [selectedProductUrl]);
  
  // Main render
  if (selectedProductUrl) {
    // Find the selected product to get its source
    const selectedProduct = productData.find(product => product.url === selectedProductUrl);
    
    return (
      <div className="min-h-screen bg-[#A8B5A2] font-sans">
        <DraggableBackButton onBackClick={handleBackToProducts} />
        <ProductDetail url={selectedProductUrl} source={selectedProduct?.source} />
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
          {/* Filters Component */}
          <ProductFilters
            currencyType={currencyType}
            setCurrencyType={setCurrencyType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availablePlatforms={availablePlatforms}
            selectedPlatforms={selectedPlatforms}
            togglePlatform={togglePlatform}
            resetFilters={resetFilters}
            getMaxPrice={getMaxPrice}
          />

          {/* Product Grid */}
          <div className="w-full">
            <>
              <div className="mb-4 text-[#317873]">
                <span className="font-semibold">{filteredProducts.length}</span> products found
              </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={`${product.url}-${index}`}
                      product={product}
                      isInWishlist={wishlist.some(item => item.url === product.url)}
                      currencyType={currencyType}
                      exchangeRate={exchangeRate}
                      onCardClick={handleProductSelect}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg p-8 text-center">
                  <LoadingSpinner />
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