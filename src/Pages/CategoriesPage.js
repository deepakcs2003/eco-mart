import React, { useContext, useEffect, useState } from "react";
import summaryApi from "../Common";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Components/ProductCard";
import DraggableBackButton from "../Components/DraggableBackButton";
import ProductDetail from "../Components/ProductDetail";
import { ChevronRight, Filter, RefreshCw, ShoppingBag, Leaf } from "lucide-react";

const CategoriesPage = () => {
  const [companies] = useState([
    { id: "amazon", name: "Amazon", logo: "/api/placeholder/50/50" },
    { id: "walmart", name: "Walmart", logo: "/api/placeholder/50/50" },
    { id: "flipkart", name: "Flipkart", logo: "/api/placeholder/50/50" },
    { id: "ebay", name: "eBay", logo: "/api/placeholder/50/50" },
  ]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryName, setSelectedSubCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProductUrl, setSelectedProductUrl] = useState(null);
  const [currencyType, setCurrencyType] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(83.5); // USD to INR approximate rate
  const [showSidebar, setShowSidebar] = useState(false);
  const [listScrollPosition, setListScrollPosition] = useState(0);

  const {addToWishlist, removeFromWishlist, fetchAllWishlistProducts} = useContext(WishlistContext);

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

  // Helper function to safely parse JSON responses
  const safeJsonParse = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON response:", text.substring(0, 100));
      throw new Error(`Server returned invalid JSON: ${text.substring(0, 100)}...`);
    }
  };

  // Fetch categories and brands on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch categories
        const categoriesResponse = await fetch(summaryApi.getCategories.url);

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
        
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories (${categoriesResponse.status}): ${categoriesResponse.statusText}`);
        }
        
        const categoriesData = await safeJsonParse(categoriesResponse);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Initial data fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [selectedProductUrl]);

  // Handle company selection
  const handleCompanyClick = (companyId) => {
    setSelectedCompany(companyId);
    setSelectedCategory(null);
    setSubcategories([]);
    setProducts([]);
    setSelectedSubCategory('');
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setShowSidebar(false); 
    }
  };

  // Handle category selection
  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setLoading(true);
    setError(null);
    setSubcategories([]); // Clear subcategories before fetching
    setProducts([]); // Clear products before fetching
    setSelectedSubCategory('');

    try {
      let url;
      if (typeof summaryApi.getSubcategories === 'function') {
        url = summaryApi.getSubcategories(categoryName).url;
      } else {
        url = `${summaryApi.getSubcategories.url}/${categoryName}`;
      }
      
      console.log("Fetching subcategories from:", url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subcategories (${response.status}): ${response.statusText}`);
      }

      const data = await safeJsonParse(response);
      setSubcategories(data);
    } catch (err) {
      console.error("Subcategories fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle subcategory selection
  const handleSubcategoryClick = async (subcategoryName) => {
    setSelectedSubCategory(subcategoryName);
    setLoading(true);
    setError(null);
    setProducts([]); // Clear products before fetching

    try {
      let url;
      if (typeof summaryApi.getProductsBySubcategory === 'function') {
        url = summaryApi.getProductsBySubcategory(selectedCategory, subcategoryName).url;
      }
      
      console.log("Fetching product subcategories from:", url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subcategories (${response.status}): ${response.statusText}`);
      }

      const data = await safeJsonParse(response);
      console.log("all product without brand:", data.productList);
      setProducts(data.productList);
    } catch (err) {
      console.error("Subcategories fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Add to wishlist functionality
  const toggleWishlist = (product) => {
    if (!product || !product.url) return; // Add validation
    
    const isInWishlist = wishlist.some(item => item.url === product.url);

    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.url !== product.url));
      removeFromWishlist(product.url);
      fetchAllWishlistProducts();
    } else {
      setWishlist([...wishlist, product]);
      addToWishlist(product);
      fetchAllWishlistProducts();
    }
  };

  const handleProductSelect = (url) => {
    // Save current scroll position before showing product details
    setListScrollPosition(window.scrollY);
    localStorage.setItem('listScrollPosition', window.scrollY.toString());
    
    // Navigate to product detail
    setSelectedProductUrl(url);
    
    // Scroll to top when viewing new product
    window.scrollTo(0, 0);
  };

  // Helper function to safely get name from category/subcategory object
  const getSafeName = (item) => {
    if (!item) return 'Unknown';
    if (typeof item === 'string') return item;
    if (typeof item.name === 'string') return item.name;
    return 'Unknown';
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  // Product Detail View
  if (selectedProductUrl) {
    return (
      <div className="min-h-screen bg-[#B5C4B1] font-sans">
        <DraggableBackButton onBackClick={handleBackToProducts} />
        <ProductDetail url={selectedProductUrl} />
      </div>
    );
  }
  
  // Main Categories View
  return (
    <div className="min-h-screen bg-[#B5C4B1] font-sans pb-8">
      {/* Header Bar */}
      <header className="bg-[#228B22] text-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Leaf className="mr-2" /> EcoMart Categories
          </h1>
          <button 
            className="md:hidden bg-[#317873] p-2 rounded-full hover:bg-[#6B8E23] transition-colors"
            onClick={toggleSidebar}
          >
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Mobile Sidebar Overlay */}
          {showSidebar && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Sidebar for Companies */}
          <aside className={`
            md:w-1/4 bg-[#F5DEB3] rounded-lg shadow-md p-5 border-l-4 border-[#8B5A2B]
            ${showSidebar ? 'fixed inset-y-0 right-0 w-3/4 z-30 transform translate-x-0' : 'fixed inset-y-0 right-0 w-3/4 z-30 transform translate-x-full'}
            md:static md:transform-none transition-transform duration-300 ease-in-out
            overflow-y-auto
          `}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#000000]">Companies</h2>
              <button 
                className="md:hidden text-[#8B5A2B] hover:text-[#000000]"
                onClick={toggleSidebar}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanyClick(company.id)}
                  className={`
                    flex items-center w-full p-3 rounded-lg transition-all duration-200
                    ${selectedCompany === company.id 
                      ? "bg-[#228B22] text-white border-l-4 border-[#317873]" 
                      : "bg-[#F5DEB3] hover:bg-[#6B8E23] hover:text-white text-[#000000]"}
                  `}
                >
                  <img src={company.logo} alt={company.name} className="w-6 h-6 mr-3 rounded-sm" />
                  <span className="font-medium">{company.name}</span>
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <div className="mt-8 border-t border-[#8B5A2B] pt-4">
              <h3 className="text-sm font-semibold text-[#8B5A2B] mb-2">Currency</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrencyType("INR")}
                  className={`px-3 py-1 rounded-md text-sm ${currencyType === "INR" ? "bg-[#228B22] text-white" : "bg-[#B5C4B1] text-[#000000]"}`}
                >
                  INR (₹)
                </button>
                <button 
                  onClick={() => setCurrencyType("USD")}
                  className={`px-3 py-1 rounded-md text-sm ${currencyType === "USD" ? "bg-[#228B22] text-white" : "bg-[#B5C4B1] text-[#000000]"}`}
                >
                  USD ($)
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full md:w-3/4 space-y-6">
            {/* Selected Filters Summary */}
            <div className="bg-[#F5DEB3] rounded-lg shadow-md p-4 border-l-4 border-[#317873]">
              <h2 className="text-lg font-semibold mb-3 text-[#000000]">Active Filters</h2>
              
              {!selectedCompany && !selectedCategory && !subcategoryName ? (
                <p className="text-[#8B5A2B] text-sm italic">No filters selected yet. Choose a company and category to start.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedCompany && (
                    <span className="px-3 py-1 bg-[#228B22] rounded-full text-white flex items-center text-sm font-medium">
                      <span className="mr-1">Company:</span> {companies.find(c => c.id === selectedCompany)?.name}
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-[#317873] rounded-full text-white flex items-center text-sm font-medium">
                      <span className="mr-1">Category:</span> {selectedCategory}
                    </span>
                  )}
                  {subcategoryName && (
                    <span className="px-3 py-1 bg-[#6B8E23] rounded-full text-white flex items-center text-sm font-medium">
                      <span className="mr-1">Subcategory:</span> {subcategoryName}
                    </span>
                  )}
                </div>
              )}
            </div>

            {loading && (
              <div className="bg-[#F5DEB3] rounded-lg shadow-md p-6 flex items-center justify-center">
                <RefreshCw className="animate-spin text-[#228B22] mr-2" />
                <p className="text-[#000000]">Loading...</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 mb-4 bg-[#F5DEB3] border border-[#A52A2A] rounded-lg">
                <h4 className="font-bold text-[#A52A2A]">Error Occurred</h4>
                <p className="text-[#A52A2A] text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Categories Section */}
            <div className="bg-[#F5DEB3] rounded-lg shadow-md p-5 border-l-4 border-[#228B22]">
              <h2 className="text-lg font-bold text-[#000000] mb-4">Categories</h2>
              
              {categories.length === 0 && !loading && !error ? (
                <p className="text-[#8B5A2B] py-3">No categories available</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => {
                    const categoryName = getSafeName(category);
                    return (
                      <button
                        key={index}
                        onClick={() => handleCategoryClick(categoryName)}
                        className={`
                          px-4 py-2 rounded-md transition-all duration-200
                          ${selectedCategory === categoryName 
                            ? "bg-[#317873] text-white shadow-md" 
                            : "bg-[#B5C4B1] text-[#000000] hover:bg-[#6B8E23] hover:text-white"}
                        `}
                      >
                        {categoryName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Subcategories Section */}
            {selectedCategory && (
              <div className="bg-[#F5DEB3] rounded-lg shadow-md p-5 border-l-4 border-[#6B8E23]">
                <h3 className="text-lg font-bold text-[#000000] mb-4">Subcategories</h3>
                
                {subcategories.length === 0 && !loading ? (
                  <p className="text-[#8B5A2B] py-3">No subcategories available</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map((subcategory, index) => {
                      const subName = getSafeName(subcategory);
                      return (
                        <button
                          key={index}
                          onClick={() => handleSubcategoryClick(subName)}
                          className={`
                            px-4 py-2 rounded-md transition-all duration-200
                            ${subcategoryName === subName 
                              ? "bg-[#6B8E23] text-white shadow-md" 
                              : "bg-[#B5C4B1] text-[#000000] hover:bg-[#317873] hover:text-white"}
                          `}
                        >
                          {subName}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Products Section */}
            <div className="bg-[#F5DEB3] rounded-lg shadow-md p-5 border-l-4 border-[#317873]">
              <h3 className="text-xl font-bold text-[#000000] mb-4 flex items-center">
                <ShoppingBag className="mr-2 text-[#228B22]" size={20} />
                Products
                {products.length > 0 && (
                  <span className="ml-2 text-sm bg-[#228B22] text-white px-2 py-1 rounded-full">
                    {products.length} found
                  </span>
                )}
              </h3>

              {products.length === 0 && !loading ? (
                <div className="py-10 text-center">
                  <p className="text-[#8B5A2B] mb-2">No products available yet</p>
                  <p className="text-sm text-[#8B5A2B]">Select a category and subcategory to view products</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product, index) => (
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
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;