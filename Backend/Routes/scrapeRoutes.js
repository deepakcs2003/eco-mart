const express = require('express');
const { scrapeProducts } = require('../Controller/scrapeController');
const { productDetail } = require('../Controller/ProductDetailController');
const { getReviews } = require('../Controller/reviewController');
const { scrapeAndStoreProducts } = require('../Controller/scrapeBrandedController');
const getBrandedProduct = require('../Controller/getBrandedProduct');

const router = express.Router();

router.get('/scrape-product', scrapeProducts);

router.post('/product-detail',productDetail)

router.post("/getReviews", getReviews);

router.get("/scrape_branded",scrapeAndStoreProducts);

router.get("/getAllBrandedProduct",getBrandedProduct);
module.exports = router;
