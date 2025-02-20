import React, { useEffect, useState } from "react";
import summaryApi from "../Common";

const CategoriesPage = () => {
  const [companies] = useState([
    { id: 'amazon', name: 'Amazon' },
    { id: 'walmart', name: 'Walmart' },
    { id: 'flipkart', name: 'Flipkart' },
    { id: 'ebay', name: 'eBay' }
  ]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const VISIBLE_CATEGORIES = 5; // Number of categories to show initially

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(summaryApi.getCategories.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add event listener to close modal on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowAllCategories(false);
      }
    };

    if (showAllCategories) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showAllCategories]);

  const handleCompanyClick = (companyId) => {
    setSelectedCompany(companyId);
    setSelectedCategory(null);
    setSubcategories([]);
    setProducts([]);
  };

  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setShowAllCategories(false);
    setLoading(true);
    setError(null);

    try {
      const [subcategoryResponse, productResponse] = await Promise.all([
        fetch(summaryApi.getSubcategories(categoryName).url),
        fetch(`${summaryApi.getCategories.url}/${categoryName}/products?company=${selectedCompany}`)
      ]);

      if (!subcategoryResponse.ok || !productResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const subcategoriesData = await subcategoryResponse.json();
      const productsData = await productResponse.json();

      setSubcategories(subcategoriesData);
      setProducts(productsData.productList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryClick = async (subcategoryName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${summaryApi.getProductsBySubcategory(selectedCategory, subcategoryName).url}?company=${selectedCompany}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subcategory products");
      }
      const data = await response.json();
      setProducts(data.productList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Custom Modal Component
  const CategoryModal = () => {
    if (!showAllCategories) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowAllCategories(false)}
        />
        <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">All Categories</h3>
            <button 
              onClick={() => setShowAllCategories(false)}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`
                  p-3 rounded-lg text-left transition-all duration-200
                  ${selectedCategory === category.name 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Company Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Companies</h2>
        <div className="space-y-4">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => handleCompanyClick(company.id)}
              className={`
                w-full px-4 py-3 rounded-lg transition-all duration-200
                flex items-center space-x-3
                ${selectedCompany === company.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}
              `}
            >
              <span>{company.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {selectedCompany ? `${companies.find(c => c.id === selectedCompany).name} Products` : 'Select a Company'}
          </h2>

          {selectedCompany && (
            <>
              {/* Categories with More button */}
              <div className="relative mb-8">
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4 min-w-max px-4">
                    {categories.slice(0, VISIBLE_CATEGORIES).map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryClick(category.name)}
                        className={`
                          px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-105
                          ${selectedCategory === category.name 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-50 shadow'}
                        `}
                      >
                        {category.name}
                      </button>
                    ))}
                    {categories.length > VISIBLE_CATEGORIES && (
                      <button
                        onClick={() => setShowAllCategories(true)}
                        className="px-6 py-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 shadow"
                      >
                        More Categories ({categories.length - VISIBLE_CATEGORIES}+)
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories Modal */}
              <CategoryModal />

              {/* Rest of the components remain the same */}
              {/* Subcategories */}
              {selectedCategory && (
                <div className="relative mb-8">
                  <div className="overflow-x-auto pb-4">
                    <div className="flex space-x-4 min-w-max px-4">
                      {subcategories.map((subcategory) => (
                        <button
                          key={subcategory.name}
                          onClick={() => handleSubcategoryClick(subcategory.name)}
                          className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                        >
                          {subcategory.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Loading, Error, and Products sections remain the same */}
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center p-4 text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Products grid */}
          {!loading && products?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                  <div className="p-4">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={product.mainImage?.url}
                        alt={product.name}
                        className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-green-600">
                          {product.currencyRaw}
                          {product.price}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {product.regularPrice}
                        </span>
                      </div>
                    </div>
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products?.length === 0 && selectedCompany && (
            <p className="text-center text-gray-600 p-8">
              No products found. Try another category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;