const axios = require("axios");
const mongoose = require("mongoose");
const Branded = require("../Models/Branded");
const BandedProduct = require("../Models/BandedProduct");

const scrapeAndStoreProducts = async (req,res) => {
    try {
        // Fetch all branded data
        const brands = await Branded.find();
        
        for (const brand of brands) {
            for (let page = 1; page <= brand.pageNos; page++) {
                const pageUrl = `${brand.brandUrl}?page=${page}`;
                try {
                    const response = await axios.post(
                        "https://api.zyte.com/v1/extract",
                        {
                            "url": pageUrl,
                            "productList": true,
                            "productListOptions": { "extractFrom": "httpResponseBody" }
                        },
                        { auth: { username: 'f028cca6484c4176a811b72d63af562b' } }
                    );
                    
                    const productList = response.data.productList.products;
                    console.log(pageUrl,brand.pageNos);
                    // console.log(productList);
                    if (productList && productList.length > 0) {
                        for (const product of productList) {
                            await BandedProduct.findOneAndUpdate(
                                { url: product.url },
                                {
                                    name: product.name,
                                    price: parseFloat(product.price) || 0,
                                    currencyRaw: product.currencyRaw,
                                    currency: product.currency,
                                    mainImage: { url: product.mainImage?.url || "" },
                                    brandName: brand.name,
                                    brand: brand._id
                                },
                                { upsert: true, new: true }
                            );
                        }
                    }
                } catch (err) {
                    console.error(`Error scraping data for ${pageUrl}:`, err);
                }
            }
        }
        console.log("Scraping and storing completed!");
        return res.status(200).json({ 
            message: "Scraping completed successfully!", 
        });
    } catch (err) {
        console.error("Error fetching brands:", err);
    }
};

module.exports = { scrapeAndStoreProducts };
