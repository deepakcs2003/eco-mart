// const axios = require("axios");
// require("dotenv").config();



// // Amazon Scraper
// const scrapeAmazon = async (searchQuery) => {
//     try {
//         const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}&sort=featured-rank`;

//         const response = await axios.post(
//             "https://api.zyte.com/v1/extract",
//             {
//                 "url": url,
//                 "productList": true,
//                 "productListOptions": { "extractFrom": "httpResponseBody" }
//             },
//             {
//                 auth: { username: process.env.ZYTE_API_KEY },
//             }
//         );

//         // console.log(response.data.productList.products);

//         return {
//             success: true,
//             site: 'amazon',
//             products: response.data.productList.products.map(product => ({
//                 ...product,
//                 source: 'amazon',
//                 price: product.price || (product.price_range?.min || null)
//             }))
//         };
//     } catch (error) {
//         console.error("Amazon scraping failed:", error);
//         return { success: false, site: 'amazon', error: error.message, products: [] };
//     }
// };

// // Flipkart Scraper
// const scrapeFlipkart = async (searchQuery) => {
//     try {
//         const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}&sort=popularity`;

//         const response = await axios.post(
//             "https://api.zyte.com/v1/extract",
//             {
//                 "url": url,
//                 "productList": true,
//                 "productListOptions": { "extractFrom": "httpResponseBody" }
//             },
//             {
//                 auth: { username: process.env.ZYTE_API_KEY },
//             }
//         );
//         // console.log(response.data.productList.products);
//         return {
//             success: true,
//             site: 'flipkart',
//             products: response.data.productList.products.map(product => ({
//                 ...product,
//                 source: 'flipkart',
//                 price: product.price || (product.price_range?.min || null)
//             }))
//         };
//     } catch (error) {
//         return { success: false, site: 'flipkart', error: error.message, products: [] };
//     }
// };

// // Myntra Scraper
// const scrapeMyntra = async (searchQuery) => {
//     try {
//         const url = `https://www.myntra.com/${encodeURIComponent(searchQuery)}?sort=popularity`;

//         const response = await axios.post(
//             "https://api.zyte.com/v1/extract",
//             {
//                 "url": url,
//                 "productList": true,
//                 "productListOptions": { "extractFrom": "httpResponseBody" }
//             },
//             {
//                 auth: { username: process.env.ZYTE_API_KEY },
//             }
//         );
//         // console.log(response.data.productList.products);
//         return {
//             success: true,
//             site: 'myntra',
//             products: response.data.productList.products.map(product => ({
//                 ...product,
//                 source: 'myntra',
//                 price: product.price || (product.price_range?.min || null)
//             }))
//         };
//     } catch (error) {
//         return { success: false, site: 'myntra', error: error.message, products: [] };
//     }
// };

// // Ajio Scraper
// const scrapeWalmart = async (searchQuery) => {
//     try {
//         const url = `https://www.walmart.com/search?q=${encodeURIComponent(searchQuery)}&sort=relevance`;

//         const response = await axios.post(
//             "https://api.zyte.com/v1/extract",
//             {
//                 "url": url,
//                 "productList": true,
//                 "productListOptions": { "extractFrom": "httpResponseBody" }
//             },
//             {
//                 auth: { username: process.env.ZYTE_API_KEY },
//             }
//         );
//         return {
//             success: true,
//             site: 'walmart',
//             products: response.data.productList.products.map(product => ({
//                 ...product,
//                 source: 'walmart',
//                 price: product.price || (product.price_range?.min || null)
//             }))
//         };
//     } catch (error) {
//         return { success: false, site: 'walmart', error: error.message, products: [] };
//     }
// };

// // JioMart Scraper
// const scrapeJioMart = async (searchQuery) => {
//     try {
//         const url = `https://www.jiomart.com/search?q=${encodeURIComponent(searchQuery)}`;

//         const response = await axios.post(
//             "https://api.zyte.com/v1/extract",
//             {
//                 "url": url,
//                 "productList": true,
//                 "productListOptions": { "extractFrom": "httpResponseBody" }
//             },
//             {
//                 auth: { username: process.env.ZYTE_API_KEY },
//             }
//         );
//         return {
//             success: true,
//             site: 'jiomart',
//             products: response.data.productList.products.map(product => ({
//                 ...product,
//                 source: 'jiomart',
//                 price: product.price || (product.price_range?.min || null)
//             }))
//         };
//     } catch (error) {
//         return { success: false, site: 'jiomart', error: error.message, products: [] };
//     }
// };

// // Snapdeal Scraper
// const scrapeSnapdeal = async (searchQuery) => {
//     try {
//         const url = `https://www.snapdeal.com/search?keyword=${encodeURIComponent(searchQuery)}&sort=plrty`;

//         const response = await axios.post(
//             "https://api.zyte.com/v1/extract",
//             {
//                 "url": url,
//                 "productList": true,
//                 "productListOptions": { "extractFrom": "httpResponseBody" }
//             },
//             {
//                 auth: { username: process.env.ZYTE_API_KEY },
//             }
//         );

//         return {
//             success: true,
//             site: 'snapdeal',
//             products: response.data.productList.products.map(product => ({
//                 ...product,
//                 source: 'snapdeal',
//                 price: product.price || (product.price_range?.min || null)
//             }))
//         };
//     } catch (error) {
//         return { success: false, site: 'snapdeal', error: error.message, products: [] };
//     }
// };

// // Tata CLiQ Scraper
// const scrapeAliBaba= async (searchQuery) => {
//     try {
//         const url = `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&CatId=&SearchText=${encodeURIComponent(searchQuery)}`;

//         const response = await axios.post(
//             "https://api.zyte.com/v1/extract",
//             {
//                 "url": url,
//                 "productList": true,
//                 "productListOptions": { "extractFrom": "httpResponseBody" }
//             },
//             {
//                 auth: { username: process.env.ZYTE_API_KEY },
//             }
//         );

//         return {
//             success: true,
//             site: 'Alibaba',
//             products: response.data.productList.products.map(product => ({
//                 ...product,
//                 source: 'Alibaba',
//                 price: product.price || (product.price_range?.min || null)
//             }))
//         };
//     } catch (error) {
//         return { success: false, site: 'Alibaba', error: error.message, products: [] };
//     }
// };

// // Main scraping controller
// const scrapeAll = async (searchQuery, sites = []) => {
//     const scrapers = {
//         amazon: scrapeAmazon,
//         flipkart: scrapeFlipkart,
//         myntra: scrapeMyntra,
//         walmart: scrapeWalmart,
//         jiomart: scrapeJioMart,
//         snapdeal: scrapeSnapdeal,
//         alibaba: scrapeAliBaba
//     };

//     const results = {};
//     const selectedSites = sites.length > 0 ? sites : Object.keys(scrapers);

//     for (const site of selectedSites) {
//         if (scrapers[site]) {
//             results[site] = await scrapers[site](searchQuery);
//         }
//     }

//     return results;
// };

// // Express route handler
// const scrapeProducts = async (req, res) => {
//     try {
//         const searchQuery = req.query.search?.trim();
//         if (!searchQuery) {
//             return res.status(400).json({
//                 success: false,
//                 error: "Search query is required"
//             });
//         }

//         const sites = req.query.sites?.split(',').filter(Boolean) || [];
//         const results = await scrapeAll(searchQuery, sites);
//         // console.log(results)
//         // Aggregate all products
//         const allProducts = Object.values(results)
//             .filter(result => result.success)
//             .flatMap(result => result.products);

//         // Prepare failed sites information
//         const failedSites = Object.entries(results)
//             .filter(([_, result]) => !result.success)
//             .map(([site, result]) => ({
//                 site,
//                 error: result.error
//             }));

//         // console.log(allProducts)
//         res.json({
//             success: true,
//             searchQuery,
//             totalProducts: allProducts.length,
//             products: allProducts,
//             failedSites,
//             timestamp: new Date().toISOString()
//         });

//     } catch (error) {
//         console.error("Scraping failed:", error);
//         res.status(500).json({
//             success: false,
//             error: "Internal server error",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

// module.exports = {
//     scrapeProducts
// };
const axios = require('axios');
require('dotenv').config();

const ecoFriendlyKeywords = [
    "eco-friendly", "sustainable", "biodegradable", "compostable", "recycled", "reusable", "zero waste",
    "plastic-free", "organic", "natural", "renewable", "non-toxic", "energy-efficient", "carbon neutral",
    "green certified", "eco-conscious", "upcycled", "fair trade", "ethically sourced", "eco-safe",
    "solar-powered", "wind-powered", "water-saving", "vegan", "cruelty-free", "low carbon footprint",
    "recyclable", "minimalist design", "sustainable packaging", "fsc certified", "eco-friendly materials",
    "green energy", "handmade", "plant-based", "bamboo", "hemp", "cork", "wheat straw", "eco-leather",
    "upcycled plastic", "eco-resin", "seaweed-based", "algae-based", "bioplastic", "eco-rubber",
    "organic cotton", "eco-wood", "solar rechargeable", "sustainably harvested", "non-pvc", "eco-felt",
    "tree-free", "wild grass fiber", "eco-foam", "reclaimed materials", "zero emissions", "green manufacturing",
    "low energy consumption", "soy ink", "water-based ink", "eco-safe cleaning", "sustainable electronics",
];

const scrapeProducts = async (req, res) => {
    try {
        const userQuery = req.query.search ? req.query.search.trim() : "";
        const searchQuery = `eco-friendly ${userQuery}`.trim();

        const urls = [
            { url: `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`, source: "Flipkart" },
            { url: `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}&sort=featured-rank`, source: "Amazon" },
            { url: `https://www.walmart.com/search?q=${encodeURIComponent(searchQuery)}&sort=relevance`, source: "Walmart" },
            { url: `https://www.meesho.com/search?q=${encodeURIComponent(searchQuery)}`, source: "Meesho" },
            { url: `https://www.nykaa.com/search/result/?q=${encodeURIComponent(searchQuery)}`, source: "Nykaa" },
            { url: `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&sort=featured-rank`, source: "Amazon USA" },
            { url: `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=${encodeURIComponent(searchQuery)}`, source: "Alibaba" },
            { url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}`, source: "eBay" },
        ];

        const client = axios.create();
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Transfer-Encoding", "chunked"); // Enable streaming response

        res.write(JSON.stringify({ success: true, searchQuery, data: [], loading: true }) + "\n");

        // Function to fetch product data
        const fetchProductData = async ({ url, source }) => {
            try {
                const response = await client.post(
                    "https://api.zyte.com/v1/extract",
                    { url, "productList": true, "productListOptions": { "extractFrom": "browserHtml" } },
                    { auth: { username: process.env.ZYTE_API_KEY } }
                );
        
                let products = (response.data?.productList?.products || []).map(product => ({
                    ...product,
                    source, // Include source name in each product object
                }));
        
                // Apply filter: Only keep products with eco-friendly keywords
                products = products.filter(product => 
                    ecoFriendlyKeywords.some(keyword => 
                        product.name?.toLowerCase().includes(keyword) || 
                        product.description?.toLowerCase().includes(keyword)
                    )
                );
        
                return { source, data: products };
            } catch (err) {
                console.error(`Error scraping ${source}:`, err.message);
                return { source, data: [], error: err.message };
            }
        };
        

        // Function to process URLs with a worker pool
        async function* processUrlsWithPool(urls, concurrency = 5) {
            let index = 0;
            const activeRequests = new Set();

            while (index < urls.length || activeRequests.size > 0) {
                while (activeRequests.size < concurrency && index < urls.length) {
                    const requestPromise = fetchProductData(urls[index]).then(result => {
                        activeRequests.delete(requestPromise);
                        return result;
                    });

                    activeRequests.add(requestPromise);
                    index++;
                }

                if (activeRequests.size > 0) {
                    yield await Promise.race(activeRequests);
                }
            }
        }

        // Process URLs using a worker pool and stream results
        for await (const result of processUrlsWithPool(urls, 5)) {
            res.write(JSON.stringify({ 
                success: true, 
                searchQuery, 
                source: result.source,  // Include the source name in the response
                data: result.data 
            }) + "\n");
        }

        res.write(JSON.stringify({ success: true, searchQuery, data: [], loading: false }) + "\n");
        res.end();

    } catch (error) {
        console.error("Scraping failed:", error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
        });
    }
};

module.exports = { scrapeProducts };
