// File: src/components/ProductDetail/index.jsx
import React, { useContext, useEffect, useState } from 'react';
import summaryApi from '../Common';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ProductHeader from './ProductDetailComponent/ProductHeader';
import ProductImages from './ProductDetailComponent/ProductImages';
import ProductInfo from './ProductDetailComponent/ProductInfo';
import ProductListView from './ProductDetailComponent/ProductListView';
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
  const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'list' : 'grid');
  const [savedProducts, setSavedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { addToWishlist, removeFromWishlist, fetchAllWishlistProducts, wishlistItems } = useContext(WishlistContext);

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  console.log(source)
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
        console.log(data)
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
  }, [url, source]);

  // Fetch product details
  useEffect(() => {
    if (!url) return;

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

    fetchProduct();
  }, [url]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Only auto-switch view mode when changing from desktop to mobile
      if (mobile && viewMode === 'grid') {
        setViewMode('list');
      }
    };

    // Set initial state
    handleResize();

    // Add listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Fetch saved products on component mount
  useEffect(() => {
    const loadSavedProducts = async () => {
      try {
        const products = await fetchAllWishlistProducts();
        setSavedProducts(products || []);
      } catch (err) {
        console.error("Error loading wishlist products:", err);
      }
    };

    loadSavedProducts();
  }, [fetchAllWishlistProducts]);

  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSaveProduct = async () => {
    if (!product) return;

    const productInfo = {
      url, // Using URL as the unique identifier
      price: product.price,
      mainImage: product.images?.length > 0 ? product.images[0].url : "/api/placeholder/400/400",
      name: product.name,
      source: source
    };

    // Check if the product is already saved
    const isAlreadySaved = isProductSaved(url);

    try {
      if (isAlreadySaved) {
        await removeFromWishlist(url);
        setSavedProducts(prev => prev.filter(item => item.url !== url));
      } else {
        await addToWishlist(productInfo);
        setSavedProducts(prev => [...prev, productInfo]);
      }

      // Refresh the wishlist after updating
      await fetchAllWishlistProducts();
    } catch (error) {
      console.error("Error handling wishlist:", error);
    }
  };

  const isProductSaved = (productUrl) => {
    return savedProducts.some(item => item.url === productUrl) ||
      (wishlistItems && wishlistItems.some(item => item.url === productUrl));
  };

  if (loading && !product) return <LoadingSpinner colors={COLORS} />;
  if (error) return <ErrorMessage error={error} colors={COLORS} />;
  if (!product) return <ErrorMessage message="No product data available" colors={COLORS} />;

  // Render reviews section with improved UI
  const renderReviews = () => {
    if (!reviews || reviews.length === 0) {
      return (
        <div className="text-center p-4 rounded-lg bg-opacity-70" style={{ backgroundColor: COLORS.neutral2, color: COLORS.neutral1 }}>
          <p className="text-lg">No reviews available for this product yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 p-2">
        <div className="mb-4">
          <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
            Customer Reviews ({reviews.length})
          </h3>
          <div className="h-1 w-20 mt-1" style={{ backgroundColor: COLORS.primary }}></div>
        </div>

        {reviews.map((review, index) => (
          <div
            key={index}
            className="p-4 rounded-lg shadow-md transition-all hover:shadow-lg"
            style={{ backgroundColor: COLORS.neutral2, borderLeft: `4px solid ${COLORS.primary}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-base" style={{ color: COLORS.neutral1 }}>
                {review.author || 'Anonymous User'}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-lg" style={{ color: star <= (review.rating || 0) ? COLORS.secondary : '#D3D3D3' }}>
                    ★
                  </span>
                ))}
                <span className="ml-2 font-medium" style={{ color: COLORS.neutral1 }}>
                  {review.rating || 0}/5
                </span>
              </div>
            </div>
            <p className="text-sm mb-2" style={{ color: COLORS.neutral1 }}>
              {review.content}
            </p>
            {review.date && (
              <p className="text-xs italic" style={{ color: COLORS.neutral1, opacity: 0.8 }}>
                Posted on {new Date(review.date).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-5 md:p-8 mx-auto rounded-lg shadow-lg overflow-hidden max-w-screen-xl">
      <ProductHeader
        product={product}
        viewMode={viewMode}
        setViewMode={setViewMode}
        colors={COLORS}
        isMobile={isMobile}
      />

      {viewMode === 'grid' ? (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            <ProductImages
              product={product}
              activeImage={activeImage}
              handleImageClick={handleImageClick}
              colors={COLORS}
            />

            <ProductInfo
              product={product}
              handleSaveProduct={handleSaveProduct}
              isProductSaved={isProductSaved(url)}
              colors={COLORS}
            />
          </div>
          {
            reviewLoading ? (
              <ReviewsSkeleton />
            ) : (
              <ProductReviews reviews={reviews} colors={COLORS} />
            )
          }

          <div className="mt-6">
            <ProductTabs
              product={product}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              colors={COLORS}
              isMobile={isMobile}
              reviews={reviews}
              renderReviews={renderReviews}
            />
          </div>
        </>
      ) : (
        <>
          <ProductListView
            product={product}
            activeImage={activeImage}
            handleSaveProduct={handleSaveProduct}
            isProductSaved={isProductSaved(url)}
            source={source}
            url={url}
            colors={COLORS}
          />

          {/* Improved standalone reviews section for list view */}
          <div className="mt-6 px-2 py-4 rounded-lg" style={{ backgroundColor: 'rgba(168, 181, 162, 0.1)' }}>
            <h3 className="text-xl font-bold mb-4 px-2" style={{ color: COLORS.primary }}>
              Customer Reviews
            </h3>
            {reviewLoading ? (
              <ReviewsSkeleton />
            ) : (
              <ProductReviews reviews={reviews} colors={COLORS} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetail;