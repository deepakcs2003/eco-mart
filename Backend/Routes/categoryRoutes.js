const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getSubcategories,
  getProductsBySubcategory,
  getAllUsers,
  updateCategory,
  deleteCategory,
} = require("../Controller/categoryController");
const { isAdmin } = require("../Middleware/authMiddleware");

// Admin protected route to get all users
router.get("/allUsers", isAdmin,getAllUsers);

// Create a new category
router.post("/new", isAdmin,createCategory);

// Fetch all categories
router.get("/category", getCategories);

// Fetch subcategories based on category
router.get("/:category/subcategories", getSubcategories);

//update a category
router.put("/:categoryId",isAdmin,updateCategory);

//delete a category
router.delete("/:categoryId",isAdmin,deleteCategory);

// Fetch products under a specific subcategory
router.get("/:category/:subcategory/products", getProductsBySubcategory);

module.exports = router;
