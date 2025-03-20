import React, { useContext, useEffect, useState } from 'react';
import { WishlistContext } from '../Context/WishlistContext';
import ProductDetail from '../Components/ProductDetail';
import LoadingSpinner from '../Components/LoadingSpinner';

const Wishlist = () => {
  const { allWishlistProducts, fetchAllWishlistProducts, removeFromWishlist } = useContext(WishlistContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductUrl, setSelectedProductUrl] = useState(null);
  console.log(allWishlistProducts)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchAllWishlistProducts();
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const handleRemoveItem = async (e,productUrl) => {
    e.stopPropagation(); // Prevent card click event
    await removeFromWishlist(productUrl);
    fetchAllWishlistProducts();
  };
  

  const handleVisitProduct = (e, url) => {
    e.stopPropagation(); // Prevent card click event
    window.open(url, '_blank');
  };

  const handleCardClick = (productUrl) => {
    setSelectedProductUrl(productUrl);
  };

  if (selectedProductUrl) {
    return <ProductDetail url={selectedProductUrl} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#A8B5A2]">
        <LoadingSpinner colors={{ primary: '#228B22', secondary: '#6B8E23' }} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl bg-white  ">
      <h1 className="text-2xl font-bold mb-6 text-[#228B22]">My Wishlist ({allWishlistProducts.length})</h1>
      
      {allWishlistProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#F5DEB3] rounded-lg shadow-md">
          <svg className="w-16 h-16 mx-auto text-[#6B8E23]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-[#8B5A2B]">Your wishlist is empty</h2>
          <p className="mt-2 text-[#8B5A2B]">Add items to your wishlist to keep track of products you love</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allWishlistProducts.map((product) => (
            <div 
              key={product._id} 
              className="border border-[#F5DEB3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer"
              onClick={() => handleCardClick(product.productUrl)}
            >
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-contain"
                />
                <button 
                  onClick={(e) => handleRemoveItem(e, product.productUrl)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-[#F5DEB3]"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-5 h-5 text-[#A52A2A]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-[#8B5A2B]">{product.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-[#228B22]">₹{product.price}</span>
                  {product.source && (
                    <span className="text-xs px-2 py-1 bg-[#F5DEB3] rounded text-[#8B5A2B]">
                      {product.source}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => handleVisitProduct(e, product.productUrl)}
                    className="flex-1 bg-[#228B22] text-white py-2 px-4 rounded hover:bg-[#6B8E23] transition-colors duration-300"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;