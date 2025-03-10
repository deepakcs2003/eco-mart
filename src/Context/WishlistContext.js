import React, { createContext, useState, useEffect } from "react";
import summaryApi from "../Common";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [allWishlistProducts, setAllWishlistProducts] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch all wishlist products from backend
  const fetchAllWishlistProducts = async () => {
    // console.log("i am deepak is allwidhlist")
    if (!token) return;
    try {
      const response = await fetch(summaryApi.GetAllWishList.url, {
        method:summaryApi.GetAllWishList.method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setAllWishlistProducts(data.wishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist products:", error);
    }
  };

  // Add to wishlist
  const addToWishlist = async (product) => {
    console.log("in wishlist section",product)
    console.log(token);
    // if (!wishlist.some((item) => item.productUrl === product.productUrl)) {
    //   const updatedWishlist = [...wishlist, product];
    //   setWishlist(updatedWishlist);
      if (token) {
        await fetch(summaryApi.AddToWishList.url, {
          method: summaryApi.AddToWishList.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product }),
        });
      }
    // }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productUrl) => {
    console.log(productUrl);
    if (token) {
      await fetch(summaryApi.DeteleToWishList.url, {
        method:summaryApi.DeteleToWishList.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productUrl }),
      });
    }
  };
  return (
    <WishlistContext.Provider value={{addToWishlist, removeFromWishlist, allWishlistProducts, fetchAllWishlistProducts }}>
      {children}
    </WishlistContext.Provider>
  );
};

export { WishlistProvider, WishlistContext };
