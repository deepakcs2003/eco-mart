const express = require("express");
const { createBranded, getAllBrandeds, updateBranded, deleteBranded } = require("../Controller/BrandedController");
const router = express.Router();

router.post('/newBranded',createBranded);

router.put('/updateBrand/:brandedId',updateBranded);

router.delete('/deleteBrand/:brandedId',deleteBranded);

router.get('/allbrandeds',getAllBrandeds);



module.exports = router;