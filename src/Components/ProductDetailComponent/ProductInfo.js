// File: src/components/ProductDetail/ProductInfo.jsx
import React from 'react';
import { FaShoppingCart, FaHeart, FaCheck, FaTag, FaLeaf, FaShippingFast, FaStar, FaExternalLinkAlt } from 'react-icons/fa';

const ProductInfo = ({ product, handleSaveProduct, isProductSaved, colors }) => {
  if (!product) return null;

  // Safely access nested properties
  const brandName = product.brand?.name || '';
  const productName = product.name || 'Product Name Unavailable';
  const price = product.price || '0.00';
  const currency = product.currencyRaw || '$';
  const availability = product.availability || 'Unavailable';
  const color = product.color || '';
  const size = product.size || '';
  const material = product.material || '';
  const weight = product.weight ? `${product.weight.value} ${product.weight.rawUnit}` : '';
  const features = product.features || [];
  const productUrl = product.url || '#';

  return (
    <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col">
      {/* Brand Name */}
      {brandName && (
        <div 
          className="text-sm font-medium mb-1" 
          style={{ color: colors.accent1 }}
          aria-label="Brand"
        >
          {brandName}
        </div>
      )}

      {/* Product Name */}
      <h1 
        className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 break-words" 
        style={{ color: colors.neutral1 }}
      >
        {productName}
      </h1>

      {/* Price and Availability */}
      <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
        <span 
          className="text-2xl sm:text-3xl font-bold" 
          style={{ color: colors.primary }}
          aria-label={`Price: ${currency}${price}`}
        >
          {currency}{price}
        </span>
        <span 
          className="text-sm px-3 py-1 rounded-full flex items-center"
          style={{ 
            backgroundColor: availability === "InStock" ? colors.primary : colors.error, 
            color: 'white' 
          }}
          aria-label={`Availability: ${availability === "InStock" ? "In Stock" : availability}`}
        >
          {availability === "InStock" ? 
            <><FaCheck className="mr-1" aria-hidden="true" /> In Stock</> : 
            availability
          }
        </span>
      </div>

      {/* Quick Details */}
      {(color || size || material || weight) && (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6 p-3 md:p-4 rounded-lg shadow-sm" 
          style={{ backgroundColor: colors.neutral2 }}
        >
          {color && (
            <div className="flex items-start">
              <FaTag className="mt-1 mr-2 flex-shrink-0" style={{ color: colors.secondary }} aria-hidden="true" />
              <div>
                <span className="text-sm" style={{ color: colors.neutral1 }}>Color</span>
                <p className="font-medium" style={{ color: colors.neutral1 }}>{color}</p>
              </div>
            </div>
          )}

          {size && (
            <div className="flex items-start">
              <FaTag className="mt-1 mr-2 flex-shrink-0" style={{ color: colors.secondary }} aria-hidden="true" />
              <div>
                <span className="text-sm" style={{ color: colors.neutral1 }}>Size</span>
                <p className="font-medium" style={{ color: colors.neutral1 }}>{size}</p>
              </div>
            </div>
          )}

          {material && (
            <div className="flex items-start">
              <FaLeaf className="mt-1 mr-2 flex-shrink-0" style={{ color: colors.secondary }} aria-hidden="true" />
              <div>
                <span className="text-sm" style={{ color: colors.neutral1 }}>Material</span>
                <p className="font-medium" style={{ color: colors.neutral1 }}>{material}</p>
              </div>
            </div>
          )}

          {weight && (
            <div className="flex items-start">
              <FaShippingFast className="mt-1 mr-2 flex-shrink-0" style={{ color: colors.secondary }} aria-hidden="true" />
              <div>
                <span className="text-sm" style={{ color: colors.neutral1 }}>Weight</span>
                <p className="font-medium" style={{ color: colors.neutral1 }}>{weight}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key Features */}
      {features.length > 0 && (
        <div 
          className="mb-5 md:mb-6 p-4 rounded-lg shadow-sm flex-grow" 
          style={{ backgroundColor: 'white', border: `1px solid ${colors.neutral2}` }}
        >
          <h2 
            className="text-lg font-semibold mb-3 flex items-center" 
            style={{ color: colors.primary }}
          >
            <FaStar className="mr-2" aria-hidden="true" /> Key Features
          </h2>
          <ul className="space-y-3">
            {features.slice(0, 3).map((feature, index) => {
              const featureParts = feature.split(":");
              const title = featureParts[0]?.trim();
              const description = (featureParts[1] || feature)?.trim();

              return (
                <li key={index} className="flex items-start">
                  <div 
                    className="flex-shrink-0 mt-1 mr-2 text-sm p-1 rounded-full" 
                    style={{ backgroundColor: colors.neutral2 }}
                    aria-hidden="true"
                  >
                    <FaCheck style={{ color: colors.secondary }} />
                  </div>
                  <div className="flex-grow">
                    {featureParts.length > 1 && title && (
                      <span className="font-medium block" style={{ color: colors.neutral1 }}>{title}:</span>
                    )}
                    <span className="text-sm" style={{ color: colors.neutral1 }}>{description}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-auto">
        {/* Buy Product Button */}
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center px-4 py-3 rounded-lg text-base font-medium shadow-md transition duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ 
            backgroundColor: colors.accent1, 
            color: 'white',
            focusRingColor: colors.accent1 
          }}
          aria-label="Buy Product on External Website"
        >
          <FaShoppingCart className="mr-2 text-lg" aria-hidden="true" />
          Buy Product
          <FaExternalLinkAlt className="ml-2 text-sm" aria-hidden="true" />
        </a>

        {/* Wishlist Button */}
        <button
          onClick={handleSaveProduct}
          className="flex items-center gap-2 justify-center p-3 rounded-lg shadow-sm hover:shadow-md transition duration-300 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: isProductSaved ? colors.primary : 'white',
            color: isProductSaved ? 'white' : colors.primary,
            border: `1px solid ${isProductSaved ? colors.primary : colors.neutral2}`,
            focusRingColor: colors.primary
          }}
          aria-label={isProductSaved ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <FaHeart className="text-lg" aria-hidden="true" />
          <span className="whitespace-nowrap">
            {isProductSaved ? "Saved" : "Save Item"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;