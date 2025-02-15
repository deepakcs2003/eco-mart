const axios = require("axios");
const Category = require("../Models/Category");
require("dotenv").config();

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    console.log("Creating category...");
    const { name, subcategories } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name,
      subcategories: subcategories || [],
    });

    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ 
      message: "Categories not found", 
      error });
  }
};

// Get subcategories of a category
exports.getSubcategories = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category.subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Subcategories not found", error });
  }
};

// Fetch products dynamically using category & subcategory
exports.getProductsBySubcategory = async (req, res) => {
  try {
    const { categoryName, subcategoryName } = req.params;

    // Construct the search query dynamically
    let searchQuery = `eco-friendly ${categoryName}`;
    if (subcategoryName) {
      searchQuery += ` ${subcategoryName}`;
    }
    searchQuery = searchQuery.trim();

    // Construct Flipkart search URL
    const flipkartSearchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;

    // Send request to Zyte API (REMOVE httpResponseBody)
    const response = await axios.post(
                "https://api.zyte.com/v1/extract",
                {
                    "url": flipkartSearchUrl,
                    "productList": true,
                    "httpResponseBody": true, // Ensure response body is included
                    "productListOptions": { "extractFrom": "httpResponseBody" }
                },
                {
                    auth: { username: process.env.ZYTE_API_KEY } // Secure API key
                }
            );
    
        // ✅ Ensure `httpResponseBody` exists before using Buffer
        const httpResponseBody = response.data.httpResponseBody
            ? Buffer.from(response.data.httpResponseBody, "base64").toString()
            : "No response body available";

        // ✅ Correctly extract product list
        const productList = response.data.productList?.products || "No product data available";


        res.json({
            success: true,
            searchQuery, // Shows the final search term used
            productList,
            rawHtml: httpResponseBody, // Optional: Remove if not needed
        });
    } catch (error) {
        console.error("Scraping failed:", error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
        });
    }
};