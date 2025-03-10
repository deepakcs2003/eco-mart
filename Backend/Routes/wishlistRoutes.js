const express = require("express");
const authToken = require("../middleware/authMiddleware");
const { addToWishlist, removeFromWishlist, getAllWishlistProducts } = require("../Controller/wishlistController");
const router = express.Router();

router.post("/AddToWishList",authToken, addToWishlist);
router.delete("/DeteleToWishList",authToken, removeFromWishlist);
router.get("/GetAllWishList",authToken,getAllWishlistProducts);
module.exports = router;
