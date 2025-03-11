const express = require('express');
const { scrapeProducts } = require('../Controller/scrapeController');
const { productDetail } = require('../Controller/ProductDetailController');
const { getReviews } = require('../Controller/reviewController');

const router = express.Router();

router.get('/scrape-product', scrapeProducts);

router.post('/product-detail',productDetail)

router.post("/getReviews", getReviews);
// router.post("/getFlipkartReviews",getFlipkartReviews)
module.exports = router;
