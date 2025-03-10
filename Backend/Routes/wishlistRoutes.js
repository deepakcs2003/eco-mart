const express = require("express");
const { addToWishlist, removeFromWishlist, getAllWishlistProducts } = require("../Controller/wishlistController");
const { isUser } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/AddToWishList",isUser, addToWishlist);
router.delete("/DeleteToWishList",isUser, removeFromWishlist);
router.get("/GetAllWishList",isUser,getAllWishlistProducts);
module.exports = router;
