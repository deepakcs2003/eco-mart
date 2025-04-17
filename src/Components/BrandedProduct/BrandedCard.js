import React from "react";

const BrandedCard = ({ brand, onClose }) => {
  if (!brand) return null;

  // Parse categories if they're in a comma-separated string
  const categories = Array.isArray(brand.categories)
    ? brand.categories
    : brand.categories?.split(",").map((cat) => cat.trim()) || [];

  return (
    <div className="bg-[#F5DEB3] shadow-xl rounded-lg overflow-hidden w-full max-w-xs mx-auto border-2 border-[#6B8E23]">
      {/* Top decorative bar */}
      <div className="h-1 sm:h-2 bg-[#228B22]"></div>

      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-[#F5DEB3] rounded-full p-1 sm:p-1.5 shadow-md hover:bg-[#A8B5A2] transition-colors duration-200 z-10 border border-[#8B5A2B]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B5A2B]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Brand header without pattern.svg */}
        <div className="h-36 sm:h-48 bg-gradient-to-b from-[#6B8E23] to-[#A8B5A2] flex items-center justify-center relative">
          <div className="bg-[#6B8E23] rounded-full p-1 shadow-lg border-2 sm:border-4 border-[#228B22]">
            <img
              src={brand.imageUrl || "/default-brand.png"}
              alt={brand.name}
              className="object-contain h-20 w-20 sm:h-28 sm:w-28 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-5">
        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-[#228B22] border-b-2 border-[#6B8E23] pb-1 sm:pb-2 text-center">
          {brand.name}
        </h3>

        {/* Description */}
        <div className="bg-[#A8B5A2]/20 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 border-l-4 border-[#317873]">
          <p className="text-[#8B5A2B] text-xs sm:text-sm italic">
            {brand.description || "No description available"}
          </p>
        </div>

        {/* Categories */}
        <div className="mb-3 sm:mb-5">
          <span className="font-semibold text-sm sm:text-base text-[#317873]">Categories:</span>
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-[#228B22] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs shadow-sm flex items-center"
                >
                  {category}
                </span>
              ))
            ) : (
              <span className="text-[#8B5A2B] text-xs sm:text-sm">No categories available</span>
            )}
          </div>
        </div>

        {/* Brand URL button */}
        {brand.brandUrl && (
          <a
            href={brand.brandUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-[#317873] text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-[#87CEEB] transition-colors duration-200 text-xs sm:text-sm w-full text-center shadow-md"
          >
            Visit Brand Website
          </a>
        )}
      </div>

      {/* Bottom decorative bar */}
      <div className="h-1 sm:h-2 bg-[#228B22]"></div>
    </div>
  );
};

export default BrandedCard;