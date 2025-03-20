const BrandedProduct = require("../Models/BandedProduct"); // Fixed the typo in require statement

const getBrandedProduct = async (req, res) => {
    try {
        const products = await BrandedProduct.find(); // Fetch all products
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching branded products",
            error: error.message
        });
    }
};

module.exports = getBrandedProduct;
