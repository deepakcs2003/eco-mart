import React, { useContext, useEffect, useState } from "react";
import summaryApi from "../Common";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Components/ProductCard";
import DraggableBackButton from "../Components/DraggableBackButton";
import ProductDetail from "../Components/ProductDetail";

const CategoriesPage = () => {
  const [companies] = useState([
    { id: "amazon", name: "Amazon" },
    { id: "walmart", name: "Walmart" },
    { id: "flipkart", name: "Flipkart" },
    { id: "ebay", name: "eBay" },
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

    const {addToWishlist, removeFromWishlist, fetchAllWishlistProducts} = useContext(WishlistContext);

// Handle product selection
  const [listScrollPosition, setListScrollPosition] = useState(0);

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

  // Main render
  if (selectedProductUrl) {
    return (
      <div className="min-h-screen bg-[#A8B5A2] font-sans">
        <DraggableBackButton onBackClick={handleBackToProducts} />
        <ProductDetail url={selectedProductUrl} />
      </div>
    );
  }


    // Handle back to products list
    const handleBackToProducts = () => {
      // Remember which product we're coming from
      const currentProduct = selectedProductUrl;
      localStorage.setItem(`scrollPosition_${currentProduct}, window.scrollY.toString()`);
      
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

  // Handle company selection
  const handleCompanyClick = (companyId) => {
    setSelectedCompany(companyId);
    setSelectedCategory(null);
    setSubcategories([]);
    setProducts([]);
    setSelectedSubCategory('');
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
        url = summaryApi.getProductsBySubcategory(selectedCategory,subcategoryName).url;
      }
      
      console.log("Fetching product subcategories from:", url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subcategories (${response.status}): ${response.statusText}`);
      }

      const data = await safeJsonParse(response);
      console.log("all product without brand:",data.productList);
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
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar for Companies */}
        <aside className="w-full md:w-1/4 bg-gray-100 p-4 rounded mb-4 md:mb-0 md:mr-4">
          <h2 className="text-xl font-semibold mb-4">Companies</h2>
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => handleCompanyClick(company.id)}
              className={`block w-full py-2 px-4 mb-2 text-left rounded ${
                selectedCompany === company.id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {company.name}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4 p-4 bg-white rounded">
          {loading && <p className="p-2 bg-blue-100 rounded">Loading...</p>}
          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-300 rounded">
              <h4 className="font-bold text-red-700">Error:</h4>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Selected Filters Summary */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Current Filters</h2>
            <div className="flex flex-wrap gap-2">
              {selectedCompany && (
                <span className="px-3 py-1 bg-blue-100 rounded-full text-blue-800">
                  Company: {companies.find(c => c.id === selectedCompany)?.name}
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-blue-100 rounded-full text-blue-800">
                  Category: {selectedCategory}
                </span>
              )}
              {subcategoryName && (
                <span className="px-3 py-1 bg-green-100 rounded-full text-green-800">
                  Subcategory: {subcategoryName}
                </span>
              )}
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="flex flex-wrap">
              {categories.length === 0 && !loading && !error ? (
                <p className="text-gray-500">No categories available</p>
              ) : (
                categories.map((category, index) => {
                  const categoryName = getSafeName(category);
                  return (
                    <button
                      key={index}
                      onClick={() => handleCategoryClick(categoryName)}
                      className={`mr-2 mb-2 px-4 py-2 rounded ${
                        selectedCategory === categoryName ? "bg-blue-500 text-white" : "bg-blue-200"
                      }`}
                    >
                      {categoryName}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Subcategories Section */}
          {selectedCategory && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Subcategories</h3>
              <div className="flex flex-wrap">
                {subcategories.length === 0 && !loading ? (
                  <p className="text-gray-500">No subcategories available</p>
                ) : (
                  subcategories.map((subcategory, index) => {
                    const subcategoryName = getSafeName(subcategory);
                    return (
                      <button
                        key={index}
                        onClick={() => handleSubcategoryClick(subcategoryName)}
                        className={`mr-2 mb-2 px-4 py-2 rounded ${
                          subcategoryName === getSafeName(subcategory) ? "bg-green-500 text-white" : "bg-green-200"
                        }`}
                      >
                        {subcategoryName}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}



          {/* Products Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            {products.length === 0 && !loading ? (
              <p className="text-gray-500">No products available. Select filters to view products.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
  );
};

export default CategoriesPage;