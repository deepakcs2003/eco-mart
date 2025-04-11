const express = require("express");
const {removeFromWishlist, getAllWishlistProducts, addToWishlist } = require("../Controller/wishlistController");
const router = express.Router();

router.post("/AddToWishList", addToWishlist);
router.delete("/DeleteToWishList", removeFromWishlist);
router.get("/GetAllWishList",getAllWishlistProducts);
module.exports = router;
