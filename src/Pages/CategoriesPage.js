import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import summaryApi from "../Common";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all categories on component mount
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

  // Handle category click
  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setLoading(true);
    setError(null);

    try {
      // Fetch subcategories
      const subcategoryResponse = await fetch(summaryApi.getSubcategories(categoryName).url);
      if (!subcategoryResponse.ok) {
        throw new Error("Failed to fetch subcategories");
      }
      const subcategoriesData = await subcategoryResponse.json();
      setSubcategories(subcategoriesData);

      // Fetch products of this category
      const productResponse = await fetch(`${summaryApi.getCategories.url}/${categoryName}/products`);
      // console.log("print products",productResponse.json());

      if (!productResponse.ok) {
        throw new Error("Failed to fetch products");
      }
      const productsData = await productResponse.json();
      // console.log("print heydata",productsData)

      setProducts(productsData.productList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle subcategory click
  const handleSubcategoryClick = async (subcategoryName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(summaryApi.getProductsBySubcategory(selectedCategory, subcategoryName).url);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li
              key={category.name}
              className="cursor-pointer bg-gray-100 p-3 rounded hover:bg-gray-200"
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
            </li>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </ul>

      {selectedCategory && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Subcategories</h3>
          <ul className="space-y-2">
            {subcategories.length > 0 ? (
              subcategories.map((subcategory) => (
                <li
                  key={subcategory.name}
                  className="cursor-pointer bg-blue-100 p-2 rounded hover:bg-blue-200"
                  onClick={() => handleSubcategoryClick(subcategory.name)}
                >
                  {subcategory.name}
                </li>
              ))
            ) : (
              <p>No subcategories found.</p>
            )}
          </ul>
        </div>
      )}

{products?.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {products.map((product, index) => (
      <div key={index} className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition-shadow">
        <img
          src={product.mainImage?.url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
        <h3 className="mt-3 text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-700 text-sm mt-2">
          <span className="font-bold text-green-600">{product.currencyRaw}</span> {product.price} 
          <span className="line-through text-gray-500 ml-2 text-sm">({product.regularPrice})</span>
        </p>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          View on Amazon
        </a>
      </div>
    ))}
  </div>
) : (
  <p className="text-center text-gray-600 mt-6">No products found. Try another keyword.</p>
)}

    </div>
  );
};

export default CategoriesPage;
