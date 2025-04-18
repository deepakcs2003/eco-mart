import React, { useContext, useEffect, useState } from 'react';
import summaryApi from '../Common';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ProductImages from './ProductDetailComponent/ProductImages';
import ProductInfo from './ProductDetailComponent/ProductInfo';
import ProductTabs from './ProductDetailComponent/ProductTabs';
import { WishlistContext } from '../Context/WishlistContext';
import ProductReviews from './ProductDetailComponent/ProductReviews';
import ReviewsSkeleton from './ProductDetailComponent/ReviewsSkeleton';

const COLORS = {
  primary: '#228B22',       // Forest Green
  secondary: '#6B8E23',     // Olive Green
  background: '#A8B5A2',    // Sage Green
  accent1: '#317873',       // Deep Teal
  accent2: '#87CEEB',       // Sky Blue
  neutral1: 'black',        // Black (was Earthy Brown)
  neutral2: '#F5DEB3',      // Warm Beige
  error: '#A52A2A',         // Rustic Red
};

const ProductDetail = ({ url, source }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { addToWishlist, removeFromWishlist, fetchAllWishlistProducts, wishlistItems } = useContext(WishlistContext);
  
  // Track wishlist state directly within the component
  const [isInWishlist, setIsInWishlist] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);

  // Handle responsive layout detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    // Add listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch reviews when url and source change
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const response = await fetch(summaryApi.getReviews.url, {
          method: summaryApi.getReviews.method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ url, source })
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        console.log("Reviews response:", data)
        setReviews(data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
        // Don't set global error to avoid blocking the whole page
      } finally {
        setReviewLoading(false);
      }
    };

    if (url && source) {
      fetchReviews();
    }
  }, []);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(summaryApi.productDetail.url, {
        method: summaryApi.productDetail.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      setProduct(data.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProduct();
  }, [url]);

  // Check if the current product is in the wishlist
  useEffect(() => {
    // Check if this product exists in wishlistItems
    const checkWishlistStatus = () => {
      if (wishlistItems && wishlistItems.length > 0) {
        const found = wishlistItems.some(item => item.url === url);
        setIsInWishlist(found);
      } else {
        setIsInWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [wishlistItems, url]);

  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSaveProduct = async () => {
    if (!product) return;
    console.log(product)
    const productInfo = {
      url, // Using URL as the unique identifier
      price: product.price,
      image:product.mainImage.url,
      name: product.name,
      source: source
    };
    console.log(productInfo)
    try {
      if (isInWishlist) {
        // Remove product from wishlist
        await removeFromWishlist(url);
        setIsInWishlist(false);
      } else {
        // Add product to wishlist
        await addToWishlist(productInfo);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error handling wishlist:", error);
    }
  };

  if (loading && !product) return <LoadingSpinner/>;
  if (error) return <ErrorMessage error={error} colors={COLORS} />;
  if (!product) return <ErrorMessage message="No product data available" colors={COLORS} />;

  return (
    <div className="p-3 sm:p-5 md:p-8 mx-auto rounded-lg shadow-lg overflow-hidden max-w-screen-xl">
      {/* Responsive layout with consistent content across mobile and desktop */}
      <div className="mt-4">
        {isMobile ? (
          // Mobile view - content stacked vertically
          <div className="flex flex-col gap-4">
            {/* Product Images - Mobile Layout */}
            <ProductImages
              product={product}
              activeImage={activeImage}
              handleImageClick={handleImageClick}
              colors={COLORS}
            />

            {/* Product Information - Mobile Layout */}
            <ProductInfo
              product={product}
              handleSaveProduct={handleSaveProduct}
              isProductSaved={isInWishlist}
              colors={COLORS}
            />

            {/* Product Tabs - Mobile Layout */}
            <div className="mt-4">
              <ProductTabs
                product={product}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                colors={COLORS}
                isMobile={isMobile}
                reviews={reviews}
              />
            </div>

            {/* Reviews Section - Mobile Layout */}
            <div className="mt-4 rounded-lg" style={{ backgroundColor: 'rgba(168, 181, 162, 0.1)' }}>
              <h3 className="text-xl font-bold mb-4 px-2" style={{ color: COLORS.primary }}>
                Customer Reviews
              </h3>
              {reviewLoading ? (
                <ReviewsSkeleton />
              ) : (
                <ProductReviews reviews={reviews} colors={COLORS} />
              )}
            </div>
          </div>
        ) : (
          // Desktop view - content in grid/flex layout
          <div>
            <div className="flex flex-row gap-6">
              {/* Product Images - Desktop Layout */}
              <div className="w-1/2">
                <ProductImages
                  product={product}
                  activeImage={activeImage}
                  handleImageClick={handleImageClick}
                  colors={COLORS}
                />
              </div>

              {/* Product Information - Desktop Layout */}
              <div className="w-1/2">
                <ProductInfo
                  product={product}
                  handleSaveProduct={handleSaveProduct}
                  isProductSaved={isInWishlist}
                  colors={COLORS}
                />
              </div>
            </div>
            
            {/* Product Tabs - Desktop Layout */}
            <div className="mt-6">
              <ProductTabs
                product={product}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                colors={COLORS}
                isMobile={isMobile}
                reviews={reviews}
              />
            </div>

            {/* Reviews Section - Desktop Layout */}
            <div className="mt-6 rounded-lg" style={{ backgroundColor: 'rgba(168, 181, 162, 0.1)' }}>
              <h3 className="text-xl font-bold mb-4 px-4" style={{ color: COLORS.primary }}>
                Customer Reviews
              </h3>
              {reviewLoading ? (
                <ReviewsSkeleton />
              ) : (
                <ProductReviews reviews={reviews} colors={COLORS} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;