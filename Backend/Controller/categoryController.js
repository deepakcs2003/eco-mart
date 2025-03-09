const axios = require("axios");
const User = require('../Models/User');
const Category = require("../Models/Category");
require("dotenv").config();

exports.getAllUsers = async(req,res) =>{
  try{
  const users = await User.find();
  if(!users){
      return res.status(400).json({
          success:false,
          message:"No user found"
      })
  }

  res.status(200).json({
      success:true,
      data:users,
      message:"all users retrived"
  })
}catch (error) {
  console.error("Users not fetched by admin:", error);
  res.status(500).json({ 
    message: "Users not fetched by admin:", 
    error: error.message 
  });
}
}

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ 
        message: "Category already exists" 
      });
    }

    const category = new Category({
      name,
      subcategories: Array.isArray(subcategories) ? subcategories : [], 
    });

    await category.save();
    res.status(201).json({
       message: "Category created successfully", 
       category 
      });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ 
      message: "Error creating category", 
      error: error.message 
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("subcategories");

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ 
      message: "Categories not found", 
      error 
    });
  }
};


// Get subcategories of a category
exports.getSubcategories = async (req, res) => {
  try {
    const { category } = req.params; 

    const categoryData = await Category.findOne({ name: category });

    if (!categoryData) {
      return res.status(404).json({ 
        message: "Category not found" 
      });
    }

    if (!categoryData.subcategories || categoryData.subcategories.length === 0) {
      return res.status(404).json({ 
        message: "No subcategories found" 
      });
    }

    res.status(200).json(categoryData.subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ 
      message: "Error fetching subcategories", 
      error 
    });
  }
};


//edit a category
exports.updateCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;

    const formattedSubcategories = subcategories.map(sub => ({
      name: String(sub.name) 
    }));

    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ 
        message: "Category not found" 
      });
    }

    category.name = name;
    category.subcategories = formattedSubcategories;

    await category.save();
    res.json({ 
      message: "Category updated successfully", 
      category 
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error 
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ 
        message: "Category not found" 
      });
    }

    res.json({ 
      message: "Category deleted successfully", 
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error 
    });
  }
};

// Fetch products dynamically using category, subcategory, and company
exports.getProductsBySubcategory = async (req, res) => {
  try {
    const { categoryName, subcategoryName } = req.params;
    const { company } = req.query;

    // Construct the search query dynamically
    let searchQuery = `eco-friendly ${categoryName}`;
    if (subcategoryName) {
      searchQuery += ` ${subcategoryName}`;
    }
    searchQuery = searchQuery.trim();

    // Get the appropriate URL based on the selected company
    const getSearchUrl = (company, query) => {
      switch (company) {
        case 'walmart':
          return `https://www.walmart.com/search?q=${encodeURIComponent(query)}`;
        case 'amazon':
          return `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
        case 'ebay':
          return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
        case 'flipkart':
        default:
          return `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
      }
    };

    const searchUrl = getSearchUrl(company, searchQuery);

    // Send request to Zyte API
    const response = await axios.post(
      "https://api.zyte.com/v1/extract",
      {
        "url": searchUrl,
        "productList": true,
        "httpResponseBody": true,
        "productListOptions": { "extractFrom": "httpResponseBody" }
      },
      {
        auth: { username: process.env.ZYTE_API_KEY }
      }
    );

    const httpResponseBody = response.data.httpResponseBody
      ? Buffer.from(response.data.httpResponseBody, "base64").toString()
      : "No response body available";

    const productList = response.data.productList?.products || "No product data available";

    res.json({
      success: true,
      searchQuery,
      productList,
      rawHtml: httpResponseBody,
    });
  } catch (error) {
    console.error("Scraping failed:", error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};