const express = require('express');
const { scrapeProduct } = require('../Controller/scrapeController');

const router = express.Router();

router.get('/scrape-product', scrapeProduct);

module.exports = router;
