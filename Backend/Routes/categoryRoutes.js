const express = require("express");
const router = express.Router();
const {
  getCategories,
  getSubcategories,
  getProductsBySubcategory,
} = require("../Controller/categoryController");
const { createCategory } = require("../Controller/categoryController");


router.post("/new",createCategory)

router.get("/category", getCategories);

router.get("/:categoryName/subcategories", getSubcategories);

router.get("/:categoryName/:subcategoryName/products", getProductsBySubcategory);

module.exports = router;
