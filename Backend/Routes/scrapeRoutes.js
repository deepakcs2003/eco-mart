const express = require('express');
const { scrapeProducts } = require('../Controller/scrapeController');
const { productDetail } = require('../Controller/ProductDetailController');

const router = express.Router();

router.get('/scrape-product', scrapeProducts);

router.post('/product-detail',productDetail)
module.exports = router;
