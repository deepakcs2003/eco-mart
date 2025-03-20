const express = require("express");
const {removeFromWishlist, getAllWishlistProducts, addToWishlist } = require("../Controller/wishlistController");
const { authToken }= require("../middleware/authMiddleware");
const router = express.Router();

router.post("/AddToWishList",authToken, addToWishlist);
router.delete("/DeleteToWishList",authToken, removeFromWishlist);
router.get("/GetAllWishList",authToken,getAllWishlistProducts);
module.exports = router;
