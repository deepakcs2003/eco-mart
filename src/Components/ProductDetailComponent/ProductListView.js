import React from 'react';
import { FaShoppingCart, FaHeart, FaExternalLinkAlt } from 'react-icons/fa';

const ProductListView = ({ product, activeImage, handleSaveProduct, isProductSaved, colors }) => (
    <div className="p-2 sm:p-4">
        <div className="flex flex-col md:flex-row border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300" style={{ borderColor: colors.neutral2 }}>
            {/* Image container - takes full width on mobile, 1/3 on larger screens */}
            <div className="w-full md:w-1/3 p-2 sm:p-4 flex justify-center items-center">
                {product.images && product.images.length > 0 && (
                    <div className="w-36 h-36 sm:w-48 sm:h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={product.images[activeImage].url || "/api/placeholder/200/200"}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/api/placeholder/200/200";
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Content container - takes full width on mobile, 2/3 on larger screens */}
            <div className="w-full md:w-2/3 p-3 sm:p-4">
                {product.brand && (
                    <div className="text-xs sm:text-sm font-medium" style={{ color: colors.accent1 }}>
                        {product.brand.name}
                    </div>
                )}

                <h1 className="text-lg sm:text-xl font-bold my-1 sm:my-2" style={{ color: colors.neutral1 }}>{product.name}</h1>

                <div className="flex items-center gap-2 mb-2 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold" style={{ color: colors.primary }}>
                        {product.currencyRaw}{product.price}
                    </span>
                    <span className="text-xs sm:text-sm px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: product.availability === "InStock" ? colors.primary : colors.error, color: 'white' }}>
                        {product.availability === "InStock" ? "In Stock" : product.availability}
                    </span>
                </div>

                <p className="mb-3 sm:mb-4 text-xs sm:text-sm" style={{ color: colors.neutral1 }}>
                    {product.description && product.description.slice(0, 200)}
                    {product.description && product.description.length > 200 ? '...' : ''}
                </p>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {product.color && (
                        <span className="text-xs sm:text-sm px-2 py-1 rounded-full shadow-sm" style={{ backgroundColor: colors.neutral2, color: colors.neutral1 }}>
                            Color: {product.color}
                        </span>
                    )}

                    {product.size && (
                        <span className="text-xs sm:text-sm px-2 py-1 rounded-full shadow-sm" style={{ backgroundColor: colors.neutral2, color: colors.neutral1 }}>
                            Size: {product.size}
                        </span>
                    )}

                    {product.material && (
                        <span className="text-xs sm:text-sm px-2 py-1 rounded-full shadow-sm" style={{ backgroundColor: colors.neutral2, color: colors.neutral1 }}>
                            Material: {product.material}
                        </span>
                    )}
                </div>

                {/* Button container with responsive layout */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4">
                    <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-grow sm:flex-grow-0 sm:flex-1 flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium shadow-md transition duration-300 hover:shadow-lg"
                        style={{ backgroundColor: colors.accent1, color: 'white' }}
                    >
                        <FaShoppingCart className="mr-1 sm:mr-2 text-base sm:text-lg" />
                        Buy Product
                    </a>
                    <button
                        onClick={handleSaveProduct}
                        className="flex items-center justify-center p-2 rounded shadow-sm hover:shadow-md transition duration-300"
                        style={{
                            backgroundColor: isProductSaved ? colors.primary : colors.neutral2,
                            color: isProductSaved ? 'white' : colors.primary
                        }}
                    >
                        <FaHeart />
                    </button>
                    <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-grow sm:flex-grow-0 flex items-center justify-center px-2 sm:px-3 py-2 rounded text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition duration-300"
                        style={{ backgroundColor: colors.accent1, color: 'white' }}
                    >
                        Visit Site <FaExternalLinkAlt className="ml-1" />
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default ProductListView;