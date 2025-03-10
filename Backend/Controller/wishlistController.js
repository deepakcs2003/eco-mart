const Wishlist = require("../Models/Wishlist");
const addToWishlist = async (req, res) => {
  const { url, name, mainImage, price,source} = req.body?.product;
  console.log(req.body);

  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, products: [] });
    }

    if (!wishlist.products.some((item) => item.productUrl === url)) {
      wishlist.products.push({ 
        productUrl: url,  // Correct field name
        name, 
        image: mainImage?.url || "", // Ensure safe access to mainImage.url
        price,
        source
      });
      await wishlist.save();
    }

    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};


const removeFromWishlist = async (req, res) => {
  const { productUrl } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    console.log(productUrl);
    if (wishlist) {
      wishlist.products = wishlist.products.filter((item) => item.productUrl !== productUrl);
      await wishlist.save();
    }

    res.status(200).json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};
const getAllWishlistProducts = async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ userId: req.user.id });
  
      if (!wishlist) {
        return res.status(200).json({ wishlist: [] });
      }
  
      res.status(200).json({ wishlist: wishlist.products });
    } catch (error) {
      res.status(500).json({ message: "Error fetching wishlist", error });
    }
  };

module.exports = { addToWishlist, removeFromWishlist,getAllWishlistProducts};
