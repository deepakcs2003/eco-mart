import React from 'react';
import placeholder from "../Assist/placeholder.webp";

const ProductCard = ({
  product,
  isInWishlist,
  currencyType,
  exchangeRate,
  onCardClick,
  onToggleWishlist
}) => {
  // Format price with currency
  const formatPrice = (price, currencyRaw) => {
    if (!price) return "N/A";

    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;

    if (currencyType === "INR" && currencyRaw === "$") {
      return `₹${(numPrice * exchangeRate).toFixed(2)}`;
    } else if (currencyRaw === "$") {
      return `$${numPrice.toFixed(2)}`;
    } else {
      return `${currencyRaw || "₹"}${numPrice.toFixed(2)}`;
    }
  };

  // Mobile layout similar to the reference image (horizontal layout)
  const MobileLayout = () => (
    <div className="flex">
      {/* Left side - Image */}
      <div className="w-2/5 h-40 relative bg-white">
        <img
          src={product.mainImage?.url || placeholder}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholder;
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-sm"
        >
          {isInWishlist ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#A52A2A" stroke="#A52A2A" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          )}
        </button>
      </div>
      
      {/* Right side - Content */}
      <div className="w-3/5 p-3 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#228B22] line-clamp-2 mb-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-1">By {product?.source || product?.brandName}</p>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {product.description ? product.description.substring(0, 60) + (product.description.length > 60 ? '...' : '') : ''}
          </p>
        </div>
        
        <div>
          <div className="mb-2">
            <span className="text-base font-bold text-[#317873]">
              {formatPrice(product.price, product.currencyRaw)}
            </span>
            {product.regularPrice && (
              <span className="ml-2 text-xs line-through text-[#8B5A2B]">
                {formatPrice(product.regularPrice, product.currencyRaw)}
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(product.url, '_blank');
            }}
            className="w-full text-center bg-[#6B8E23] text-white py-1.5 rounded text-sm hover:bg-[#228B22] transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );

  // Desktop layout (vertical card)
  const DesktopLayout = () => (
    <>
      <div className="h-48 overflow-hidden bg-white relative">
        <img
          src={product.mainImage?.url || placeholder}
          alt={product.name}
          className="w-full h-full object-fit"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-sm"
        >
          {isInWishlist ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#A52A2A" stroke="#A52A2A" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="p-4 flex flex-col h-56">
        <h3 className="text-lg font-semibold text-[#228B22] line-clamp-2 h-14">{product.name}</h3>
        <div className="mt-auto">
          <div className="mb-1">
            <span className="text-lg font-bold text-[#317873]">
              {formatPrice(product.price, product.currencyRaw)}
            </span>
            {product.regularPrice && (
              <span className="ml-2 text-sm line-through text-[#8B5A2B]">
                {formatPrice(product.regularPrice, product.currencyRaw)}
              </span>
            )}
          </div>
          <div className="text-base font-semibold text-[#6B4226] mb-3">
            From: {product?.source || product?.brandName}
          </div>

          <div className="flex gap-2">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-[#6B8E23] text-white py-2 rounded hover:bg-[#228B22] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View Product
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`py-2 px-3 rounded ${isInWishlist
                ? 'bg-[#A52A2A] text-white'
                : 'bg-[#F5DEB3] text-[#8B5A2B]'} transition-colors`}
            >
              {isInWishlist ? "Remove" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
      onClick={() => onCardClick(product.url)}
    >
      {/* Responsive layout: Mobile (horizontal) vs Desktop (vertical) */}
      <div className="block sm:hidden">
        <MobileLayout />
      </div>
      <div className="hidden sm:block">
        <DesktopLayout />
      </div>
    </div>
  );
};

export default ProductCard;