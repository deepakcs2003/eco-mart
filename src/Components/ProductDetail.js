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

const COLORS = {
  primary: '#228B22',       // Forest Green
  secondary: '#6B8E23',     // Olive Green
  background: '#A8B5A2',    // Sage Green
  accent1: '#317873',       // Deep Teal
  accent2: '#87CEEB',       // Sky Blue
  neutral1: 'black',      // Earthy Brown
  neutral2: '#F5DEB3',      // Warm Beige
  error: '#A52A2A',         // Rustic Red
};

const ProductDetail = ({ url,source }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'list' : 'grid');
  const [savedProducts, setSavedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const {addToWishlist, removeFromWishlist, fetchAllWishlistProducts} = useContext(WishlistContext);
  
  useEffect(() => {
    if (!url) return;

    const fetchProduct = async () => {
      try {
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
      
      // Auto switch view mode based on screen size, but don't override user preference if they've changed it
      if (mobile && viewMode === 'list') {
        setViewMode('grid');
      }
    };

    // Set initial state
    handleResize();
    
    // Add listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

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
  
    // Determine if the product is already saved
    const isAlreadySaved = savedProducts.some(item => item.url === productInfo.url);
  
    try {
      if (isAlreadySaved) {
        await removeFromWishlist(productInfo.url);
        setSavedProducts(prev => prev.filter(item => item.url !== productInfo.url));
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
  
  
  
  const isProductSaved = (url) => {
    return savedProducts.some(item => item.id === (url));
  };

  if (loading) return <LoadingSpinner colors={COLORS} />;
  if (error) return <ErrorMessage error={error} colors={COLORS} />;
  if (!product) return <ErrorMessage message="No product data available" colors={COLORS} />;

  // Mobile-optimized reviews section
  const renderMobileReviews = () => {
    if (!product.reviews || product.reviews.length === 0) {
      return (
        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.neutral2, color: COLORS.neutral1 }}>
          No reviews available for this product.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {product.reviews.map((review, index) => (
          <div 
            key={index} 
            className="p-3 rounded-lg shadow-sm"
            style={{ backgroundColor: COLORS.neutral2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm" style={{ color: COLORS.neutral1 }}>
                {review.author || 'Anonymous'}
              </span>
              <div className="flex items-center">
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: COLORS.primary, color: 'white' }}>
                  {review.rating}/5
                </span>
              </div>
            </div>
            <p className="text-sm" style={{ color: COLORS.neutral1 }}>
              {review.content}
            </p>
            {review.date && (
              <p className="text-xs mt-2 italic" style={{ color: COLORS.neutral1 }}>
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
              isProductSaved={isProductSaved()}
              colors={COLORS}
            />
          </div>
          
          <div className="mt-6">
            <ProductTabs 
              product={product}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              colors={COLORS}
              isMobile={isMobile}
              renderMobileReviews={renderMobileReviews}
            />
          </div>
        </>
      ) : (
        <>
          <ProductListView
            product={product}
            activeImage={activeImage}
            handleSaveProduct={handleSaveProduct}
            isProductSaved={isProductSaved()}
            colors={COLORS}
          />
          
          {/* Simple mobile-friendly reviews section for list view */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
                Customer Reviews ({product.reviews.length})
              </h3>
              {renderMobileReviews()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetail;