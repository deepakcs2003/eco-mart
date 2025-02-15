const axios = require("axios");
require("dotenv").config();

// Function to scrape eco-friendly product data from Amazon using Zyte API
const scrapeProduct = async (req, res) => {
    try {
        // Get search keyword from query parameters and ensure "eco-friendly" is always included
        const userQuery = req.query.search ? req.query.search.trim() : "";
        const searchQuery = `eco-friendly ${userQuery}`.trim();

        // Construct Amazon search URL dynamically
        const flipkartSearchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;

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

module.exports = { scrapeProduct };
