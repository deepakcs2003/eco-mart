import React, { createContext, useState, useEffect } from "react";
import summaryApi from "../Common";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [allWishlistProducts, setAllWishlistProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchAllWishlistProducts = async () => {
    if (!token) return console.warn("⚠️ No token found. Cannot fetch wishlist.");
    
    try {
      const response = await fetch(summaryApi.getAllWishlistProducts.url, {
        method: summaryApi.getAllWishlistProducts.method,
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      
      const data = await response.json();
      setAllWishlistProducts(data.wishlist || []);
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (product) => {
    if (!product?.url || !token) return console.warn("⚠️ Invalid product or token missing.");
    try {
      const response = await fetch(summaryApi?.addToWishlist?.url, {
        method: summaryApi?.addToWishlist?.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product }),
      });
      
      if (!response.ok) throw new Error("Failed to add product to wishlist");
      
      await fetchAllWishlistProducts();
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productUrl) => {
    if (!productUrl || !token) return console.warn("⚠️ Invalid product URL or token missing.");

    try {
      const response = await fetch(summaryApi.deleteFromWishlist.url, {
        method: summaryApi.deleteFromWishlist.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productUrl }),
      });
      
      if (!response.ok) throw new Error("Failed to remove product from wishlist");
      
      await fetchAllWishlistProducts();
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider value={{
      addToWishlist,
      removeFromWishlist,
      allWishlistProducts,
      fetchAllWishlistProducts
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export { WishlistProvider, WishlistContext };
