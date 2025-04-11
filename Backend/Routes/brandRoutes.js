const express = require("express");
const { createBranded, updateBranded, deleteBranded, getAllBrandeds } = require("../Controller/brandedController");
const router = express.Router();

router.post('/newBranded',createBranded);
     
router.put('/updateBrand/:brandedId',updateBranded);

router.delete('/deleteBrand/:brandedId',deleteBranded);

router.get('/allbrandeds',getAllBrandeds);



module.exports = router;