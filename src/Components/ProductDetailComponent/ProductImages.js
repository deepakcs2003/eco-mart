import React from 'react';

const ProductImages = ({ product, activeImage, handleImageClick, colors }) => (
  <div className="md:w-1/2 p-4">
    <div className="relative pb-4 rounded-lg overflow-hidden">
      {product.images && product.images.length > 0 && (
        <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={product.images[activeImage].url || "/api/placeholder/400/400"}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/400/400";
              }}
            />
          </div>
        </div>
      )}
    </div>

    {/* Thumbnail Gallery */}
    {product.images && product.images.length > 1 && (
      <div className="grid grid-cols-5 gap-2 mt-4">
        {product.images.slice(0, 5).map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-md overflow-hidden ${activeImage === index ? 'ring-2 ring-offset-2' : ''} shadow-sm hover:shadow-md transition-all duration-200`}
            style={{
              borderColor: colors.accent1,
              ...(activeImage === index ? { ringColor: colors.primary } : {})
            }}
            onClick={() => handleImageClick(index)}
          >
            <div className="aspect-w-1 aspect-h-1 bg-gray-100">
              <img
                src={image.url || "/api/placeholder/80/80"}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/api/placeholder/80/80";
                }}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ProductImages;