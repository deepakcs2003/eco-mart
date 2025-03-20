import React, { useContext, useEffect, useState } from "react";
import ShowAllBranded from "../Components/BrandedProduct/ShowAllBranded";
import BrandedCard from "../Components/BrandedProduct/BrandedCard";
import BrandedProductCart from "../Components/BrandedProduct/BrandedProductCart";
import { WishlistContext } from "../Context/WishlistContext";
import { fetchProducts } from "../API/getBrandedProductApiCall";
import summaryApi from "../Common";
import ProductDetail from "../Components/ProductDetail";

const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Home = () => {
  const [allBranded, setAllBranded] = useState([]);
  const [allBrandedProducts, setAllBrandedProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currencyType, setCurrencyType] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addToWishlist, removeFromWishlist, fetchAllWishlistProducts } =useContext(WishlistContext);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const productData = await fetchProducts();
        setAllBrandedProducts(shuffleArray(productData));
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const fetchBrandedProducts = async () => {
      try {
        const response = await fetch(summaryApi.getAllBrandeds.url, {
          method: summaryApi.getAllBrandeds.method,
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch branded products");

        const data = await response.json();
        setAllBranded(shuffleArray(data));
      } catch (error) {
        console.error("Error fetching branded products:", error);
      }
    };
    fetchBrandedProducts();
  }, []);

  // useEffect(() => {
  //   const getWishlistItems = async () => {
  //     try {
  //       const items = await fetchAllWishlistProducts();
  //       console.log(items);
  //       // Ensure items is an array
  //       setWishlist(Array.isArray(items) ? items : []);
  //     } catch (error) {
  //       console.error("Error fetching wishlist:", error);
  //       setWishlist([]);
  //     }
  //   };
  //   getWishlistItems();
  // }, [fetchAllWishlistProducts]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    window.scrollTo({
      top: document.getElementById("product-section")?.offsetTop - 100 || 0,
      behavior: "smooth",
    });
  };

  const handleProductCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleToggleWishlist = async (product) => {
    if (!product || !product.url) {
        console.error("❌ toggleWishlist received invalid product:", product);
        return;
    }

    console.log("🔄 Toggling wishlist for:", product.url);

    const isInWishlist = wishlist.some(item => item?.url === product?.url);

    if (isInWishlist) {
        setWishlist(wishlist.filter(item => item?.url !== product?.url));
        await removeFromWishlist(product?.url);
    } else {
        setWishlist([...wishlist, product]);
        await addToWishlist(product); // Ensure this gets a valid product
    }

    await fetchAllWishlistProducts();
};

  const closeBrandCard = () => {
    setSelectedBrand(null);
  };

  return (
    <div className="bg-[#A8B5A2] min-h-screen w-full">
      {/* If a product is selected, show ProductDetail */}
      {selectedProduct ? (
        <div className="min-h-screen bg-[#A8B5A2] font-sans">
          <button
            onClick={() => setSelectedProduct(null)}
            className="bg-[#317873] text-white py-2 px-4 rounded-lg hover:bg-[#87CEEB] transition-colors duration-200 text-sm w-full text-center shadow-md mb-4"
          >
            Back to Products
          </button>
          <ProductDetail url={selectedProduct.url} source={selectedProduct.brandName} />
        </div>
      ) : (
        <>
          {/* Brand scrollable bar */}
          <div className="bg-[#F5DEB3] py-4 shadow-md">
            <div className="container mx-auto px-4">
              <ShowAllBranded
                brands={allBranded}
                onBrandSelect={handleBrandSelect}
                selectedBrand={selectedBrand}
              />
            </div>
          </div>

          <div className="w-full px-4 py-6" id="product-section">
            <div className="flex flex-col md:flex-row gap-6 max-w-screen-2xl mx-auto">
              {/* Left sidebar - Brand card */}
              {selectedBrand && (
                <div className="md:w-1/4 lg:w-1/5">
                  <BrandedCard
                    brand={selectedBrand}
                    onClose={closeBrandCard}
                    className="bg-[#F5DEB3] border-[#8B5A2B] border rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Main content area - Products */}
              <div className={selectedBrand ? "md:w-3/4 lg:w-4/5" : "w-full"}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#317873]"></div>
                  </div>
                ) : (
                  <BrandedProductCart
                    products={allBrandedProducts || []}
                    selectedBrand={selectedBrand}
                    currencyType={currencyType}
                    exchangeRate={exchangeRate}
                    onCardClick={handleProductCardClick}
                    onToggleWishlist={handleToggleWishlist}
                    wishlistItems={Array.isArray(wishlist) ? wishlist : []}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;