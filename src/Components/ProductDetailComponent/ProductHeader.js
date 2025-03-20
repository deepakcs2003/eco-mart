import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

const ProductHeader = ({ product }) => {
  const discount = product.regularPrice && product.price 
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100) 
    : 0;

  return (
    <div className="product-header p-3 border-b">
      {/* Product Title - Important #1 */}
      <h1 className="text-lg font-semibold mb-1">{product.name}</h1>
      
      {/* Price Section - Important #2 */}
      <div className="price-container flex items-baseline mb-2">
        <span className="text-lg font-bold mr-2">
          {product.currencyRaw || ''}{product.price}
        </span>
        {product.regularPrice && (
          <>
            <span className="text-sm text-gray-500 line-through mr-2">
              {product.currencyRaw || ''}{product.regularPrice}
            </span>
            <span className="text-sm text-green-600 font-medium">
              {discount}% off
            </span>
          </>
        )}
      </div>

      {/* Availability - Important #3 */}
      {product.availability && (
        <div className="mb-2">
          <span className={`px-2 py-0.5 rounded text-xs ${product.availability === 'InStock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.availability === 'InStock' ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      )}

      {/* Top 2 Product Details - Important #4 */}
      <div className="important-details text-xs mb-2">
        <div className="flex flex-wrap gap-x-4">
          {product.size && (
            <div>
              <span className="text-gray-600">Size:</span> <span className="font-medium">{product.size}</span>
            </div>
          )}
          {product.material && (
            <div>
              <span className="text-gray-600">Material:</span> <span className="font-medium">{product.material}</span>
            </div>
          )}
        </div>
      </div>

      {/* External Link - Important #5 */}
      {product.url && (
        <a 
          href={product.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
        >
          Visit Website <FaExternalLinkAlt className="ml-1 text-xs" />
        </a>
      )}
    </div>
  );
};

export default ProductHeader;