// File: src/components/ProductDetail/ProductInfo.jsx
import React from 'react';
import { FaShoppingCart, FaHeart, FaCheck, FaTag, FaLeaf, FaShippingFast, FaStar, FaExternalLinkAlt } from 'react-icons/fa';

const ProductInfo = ({ product, handleSaveProduct, isProductSaved, colors }) => (
  <div className="md:w-1/2 p-6">
    {/* Brand */}
    {product.brand && (
      <div className="text-sm font-medium mb-1" style={{ color: colors.accent1 }}>
        {product.brand.name}
      </div>
    )}

    {/* Product Name */}
    <h1 className="text-2xl font-bold mb-4" style={{ color: colors.neutral1 }}>{product.name}</h1>

    {/* Price */}
    <div className="flex items-center mb-6">
      <span className="text-3xl font-bold" style={{ color: colors.primary }}>
        {product.currencyRaw}{product.price}
      </span>
      <span className="ml-2 text-sm px-2 py-0.5 rounded-full flex items-center"
        style={{ backgroundColor: product.availability === "InStock" ? colors.primary : colors.error, color: 'white' }}>
        {product.availability === "InStock" ? <><FaCheck className="mr-1" /> In Stock</> : product.availability}
      </span>
    </div>

    {/* Quick Details */}
    <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg shadow-sm" style={{ backgroundColor: colors.neutral2 }}>
      {product.color && (
        <div className="flex items-start">
          <FaTag className="mt-1 mr-2" style={{ color: colors.secondary }} />
          <div>
            <span className="text-sm" style={{ color: colors.neutral1 }}>Color</span>
            <p className="font-medium" style={{ color: colors.neutral1 }}>{product.color}</p>
          </div>
        </div>
      )}

      {product.size && (
        <div className="flex items-start">
          <FaTag className="mt-1 mr-2" style={{ color: colors.secondary }} />
          <div>
            <span className="text-sm" style={{ color: colors.neutral1 }}>Size</span>
            <p className="font-medium" style={{ color: colors.neutral1 }}>{product.size}</p>
          </div>
        </div>
      )}

      {product.material && (
        <div className="flex items-start">
          <FaLeaf className="mt-1 mr-2" style={{ color: colors.secondary }} />
          <div>
            <span className="text-sm" style={{ color: colors.neutral1 }}>Material</span>
            <p className="font-medium" style={{ color: colors.neutral1 }}>{product.material}</p>
          </div>
        </div>
      )}

      {product.weight && (
        <div className="flex items-start">
          <FaShippingFast className="mt-1 mr-2" style={{ color: colors.secondary }} />
          <div>
            <span className="text-sm" style={{ color: colors.neutral1 }}>Weight</span>
            <p className="font-medium" style={{ color: colors.neutral1 }}>{product.weight.value} {product.weight.rawUnit}</p>
          </div>
        </div>
      )}
    </div>

    {/* Key Features */}
    <div className="mb-6 p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'white', border: `1px solid ${colors.neutral2}` }}>
      <h2 className="text-lg font-semibold mb-2 flex items-center" style={{ color: colors.primary }}>
        <FaStar className="mr-2" /> Key Features
      </h2>
      <ul className="space-y-3">
        {product.features && product.features.slice(0, 3).map((feature, index) => {
          const featureParts = feature.split(":");
          const title = featureParts[0];
          const description = featureParts[1] || feature;

          return (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-2 text-sm p-1 rounded-full" style={{ backgroundColor: colors.neutral2 }}>
                <FaCheck style={{ color: colors.secondary }} />
              </div>
              <div>
                {featureParts.length > 1 && (
                  <span className="font-medium block" style={{ color: colors.neutral1 }}>{title}:</span>
                )}
                <span className="text-sm" style={{ color: colors.neutral1 }}>{description}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>

    {/* Call to Action */}
    <div className="flex gap-4 mt-8">
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center px-4 py-3 rounded-lg text-sm font-medium shadow-md transition duration-300 hover:shadow-lg"
        style={{ backgroundColor: colors.accent1, color: 'white' }}
      >
        <FaShoppingCart className="mr-2 text-lg" />
        Buy Product
      </a>

      <button 
        onClick={handleSaveProduct}
        className="flex items-center justify-center p-3 rounded shadow-sm hover:shadow-md transition duration-300"
        style={{ 
          backgroundColor: isProductSaved ? colors.primary : colors.neutral2, 
          color: isProductSaved ? 'white' : colors.primary 
        }}
      >
        <FaHeart />
      </button>
    </div>
  </div>
);

export default ProductInfo;