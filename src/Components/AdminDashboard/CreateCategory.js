import React, { useEffect, useState } from "react";
import axios from "axios";
import summaryApi from "../../Common";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState("");
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(summaryApi.getCategories.url);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subcategories for a specific category
  const fetchSubcategories = async (category) => {
    if (!category) {
      toast.error("Category is required");
      return;
    }
  
    setIsLoading(true);
    setSelectedCategory(category);
  
    try {
      const { url } = summaryApi.getSubcategories(category);
      const response = await axios.get(url);

      setSubcategoryList(response.data);
      toast.success(`Loaded subcategories for ${category}`);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Edit category function
  const handleEditCategory = (category) => {
    setCategoryName(category.name);
    // Format subcategories as comma-separated string for the textarea
    const subcategoriesString = Array.isArray(category.subcategories) 
      ? category.subcategories.map(sub => sub.name).join(", ")
      : "";
    setSubcategories(subcategoriesString);
    setEditCategory(category._id);
    setEditMode(true);
  };

  // Show delete confirmation
  const confirmDeleteCategory = (category) => {
    setDeleteConfirmation(category);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId) => {
    try {
      setIsLoading(true);
      
      // Assuming your API has a deleteCategory endpoint
      const { url, method } = summaryApi.deleteCategory(categoryId);
      
      await axios({
        method,
        url
      });
      
      toast.success("Category deleted successfully!");
      setDeleteConfirmation(null);
      fetchCategories(); // Refresh the list
      
      // If the deleted category was selected, clear the selection
      if (selectedCategory === deleteConfirmation.name) {
        setSelectedCategory("");
        setSubcategoryList([]);
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error("Failed to delete category");  
    } finally {
      setIsLoading(false);
    }
  };

  // Submit edit
  const handleUpdateCategory = async () => {
    try {
      if (!editCategory) {
        toast.error("No category selected for update");
        return;
      }

      setIsLoading(true);
      const { url, method } = summaryApi.updateCategory(editCategory); 

      // Format subcategories as an array of objects
      const subcategoryArray = subcategories
        .split(",")
        .map((s) => ({ name: s.trim() }))
        .filter((s) => s.name); // Remove empty values

      await axios({
        method,
        url,
        data: {
          name: categoryName,
          subcategories: subcategoryArray,
        },
      });

      toast.success("Category updated successfully!");
      setCategoryName("");
      setSubcategories("");
      setEditMode(false);
      setEditCategory(null);
      fetchCategories(); 
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      toast.error("Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setCategoryName("");
    setSubcategories("");
    setEditMode(false);
    setEditCategory(null);
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required!");
      return;
    }

    setIsLoading(true);
    try {
      // Format subcategories as an array of objects
      const subcategoryArray = subcategories
        .split(",")
        .map((s) => ({ name: s.trim() }))
        .filter((s) => s.name); // Remove empty values

      await axios.post(summaryApi.createCategory.url, {
        name: categoryName,
        subcategories: subcategoryArray
      });

      toast.success("Category added successfully!");
      setCategoryName("");
      setSubcategories("");
      fetchCategories(); // Refresh category list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Category Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add/Edit Category Panel */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              {editMode ? "Edit Category" : "Add New Category"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategories
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subcategories (comma separated)"
                  rows="3"
                  value={subcategories}
                  onChange={(e) => setSubcategories(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple subcategories with commas
                </p>
              </div>
              
              {editMode ? (
                <div className="flex space-x-3">
                  <button
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
                    onClick={handleUpdateCategory}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Update Category"}
                  </button>
                  <button
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
                  onClick={handleAddCategory}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Add Category"}
                </button>
              )}
            </div>
          </div>
          
          {/* Categories List Panel */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Categories</h2>
              <button 
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600"
                onClick={fetchCategories}
                disabled={isLoading}
              >
                Refresh
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-gray-50 rounded p-4 text-center">
                <p className="text-gray-500">No categories found. Add your first category.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subcategories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cat.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Array.isArray(cat.subcategories) 
                            ? cat.subcategories.length
                            : 0} subcategories
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className={`px-3 py-1 rounded-md text-sm font-medium mr-2 
                              ${selectedCategory === cat.name 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                            onClick={() => fetchSubcategories(cat.name)}
                          >
                            View Details
                          </button>
                          <button
                            className="px-3 py-1 rounded-md text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 mr-2"
                            onClick={() => handleEditCategory(cat)}
                            disabled={editMode || isLoading}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                            onClick={() => confirmDeleteCategory(cat)}
                            disabled={editMode || isLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Subcategories Panel - Shown when a category is selected */}
        {selectedCategory && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Subcategories for "{selectedCategory}"
              </h2>
              <button 
                className="text-sm px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100"
                onClick={() => setSelectedCategory("")}
              >
                Close
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading subcategories...</p>
              </div>
            ) : subcategoryList.length === 0 ? (
              <div className="bg-gray-50 rounded p-4 text-center">
                <p className="text-gray-500">No subcategories found for this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {subcategoryList.map((sub) => (
                  <div 
                    key={sub._id} 
                    className="bg-gray-50 p-3 rounded-md border border-gray-200"
                  >
                    <p className="text-gray-800">{sub.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the category "{deleteConfirmation.name}"? 
                This action cannot be undone and will remove all associated subcategories.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={cancelDelete}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => handleDeleteCategory(deleteConfirmation._id)}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCategory;