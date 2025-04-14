import React, { useContext, useEffect, useState } from 'react';
import { WishlistContext } from '../Context/WishlistContext';
import ProductDetail from '../Components/ProductDetail';
import LoadingSpinner from '../Components/LoadingSpinner';

const Wishlist = () => {
  const { allWishlistProducts, fetchAllWishlistProducts, removeFromWishlist } = useContext(WishlistContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductUrl, setSelectedProductUrl] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchAllWishlistProducts();
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const handleRemoveItem = async (e, productUrl, productName) => {
    e.stopPropagation();
    setProductToRemove({ url: productUrl, name: productName });
    setShowConfirmModal(true);
  };
  
  const confirmRemove = async () => {
    await removeFromWishlist(productToRemove.url);
    await fetchAllWishlistProducts();
    setShowConfirmModal(false);
    setProductToRemove(null);
  };

  const handleVisitProduct = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  const handleCardClick = (productUrl) => {
    setSelectedProductUrl(productUrl);
  };

  if (selectedProductUrl) {
    return (
      <div className="bg-sage-100 min-h-screen">
        <div className="max-w-7xl mx-auto p-4">
          <button 
            onClick={() => setSelectedProductUrl(null)}
            className="mb-4 flex items-center text-brown-700 font-medium border-none bg-transparent cursor-pointer transition-colors duration-300 hover:text-green-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to My Wishlist
          </button>
          <ProductDetail url={selectedProductUrl} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-sage-100">
        <LoadingSpinner colors={{ primary: "#228B22", secondary: "#6B8E23" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-beige-100 rounded-xl shadow-lg overflow-hidden border border-green-600/20">
          {/* Header section */}
          <div className="bg-gradient-to-r from-green-700 to-olive-600 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-beige-100 mb-2">My Wishlist</h1>
                <p className="text-beige-100/90">Your collection of favorite products</p>
              </div>
              <span className="bg-beige-100 text-green-700 py-2 px-4 rounded-full font-bold shadow-md">
                {allWishlistProducts.length} {allWishlistProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {allWishlistProducts.length === 0 ? (
              <div className="text-center py-16 bg-sage-100 rounded-xl border border-green-600/20">
                <div className="w-24 h-24 mx-auto bg-teal-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-brown-700">Your wishlist is empty</h2>
                <p className="mt-3 text-brown-700/80 max-w-md mx-auto">Browse our products and add your favorites to the wishlist to keep track of items you love</p>
                <a 
                  href="/"
                  className="mt-8 bg-green-700 text-beige-100 py-3 px-8 rounded-full transition-colors duration-300 hover:bg-olive-600 flex items-center w-fit mx-auto shadow-md no-underline font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Continue Shopping
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allWishlistProducts.map((product) => (
                  <div 
                    key={product._id} 
                    className="bg-sage-100 rounded-xl overflow-hidden shadow-md transition-all duration-300 cursor-pointer transform hover:translate-y-[-0.25rem] hover:shadow-lg border border-green-600/20"
                    onClick={() => handleCardClick(product.productUrl)}
                  >
                    <div className="relative h-64 overflow-hidden bg-beige-100 flex items-center justify-center p-2">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                      <button 
                        onClick={(e) => handleRemoveItem(e, product.productUrl, product.name)}
                        className="absolute top-3 right-3 bg-beige-100 p-2 rounded-full shadow-md transition-colors duration-300 hover:bg-sage-100 z-10 border-none cursor-pointer"
                        aria-label="Remove from wishlist"
                      >
                        <svg className="w-5 h-5 text-red-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </button>
                      {product.source && (
                        <span className="absolute top-3 left-3 text-xs font-medium py-1 px-3 bg-teal-600 text-beige-100 rounded-full shadow-sm">
                          {product.source}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-3 text-brown-700 line-clamp-2 overflow-hidden">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-2xl font-bold text-green-700">₹{product.price}</span>
                        {product.discount && (
                          <span className="text-xs py-1 px-3 bg-sky-200 text-green-700 rounded-full font-bold shadow-sm">
                            {product.discount} OFF
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={(e) => handleVisitProduct(e, product.productUrl)}
                        className="w-full bg-green-700 text-beige-100 py-3 px-0 rounded-lg transition-colors duration-300 hover:bg-olive-600 flex items-center justify-center font-medium shadow-sm border-none cursor-pointer"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-beige-100 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-red-700/10 flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brown-700">Remove from Wishlist</h3>
            </div>
            <p className="text-brown-700 mb-6 pl-12">
              Are you sure you want to remove <span className="font-semibold">{productToRemove?.name}</span> from your wishlist?
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="py-2 px-5 border border-brown-700 text-brown-700 rounded-lg transition-colors duration-300 hover:bg-sage-100 font-medium bg-transparent cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRemove}
                className="py-2 px-5 bg-red-700 text-beige-100 rounded-lg transition-colors duration-300 hover:bg-red-700/80 font-medium shadow-sm border-none cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;