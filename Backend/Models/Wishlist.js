const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productUrl: {
        type: String, // Store product URL instead of ObjectId
        required: true,
      },
      name: String,
      image: String,
      price: Number,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      source:String
    },
  ],
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
