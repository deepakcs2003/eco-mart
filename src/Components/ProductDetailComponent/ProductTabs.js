import React from 'react';
import { MdDescription, MdBuild, MdReviews } from 'react-icons/md';

const ProductTabs = ({ product, activeTab, handleTabChange, colors }) => (
  <div className="border-t mt-8" style={{ borderColor: colors.neutral2 }}>
    <div className="flex border-b" style={{ borderColor: colors.neutral2 }}>
      <button
        className={`flex-1 font-medium py-3 px-4 flex items-center justify-center transition-colors duration-200`}
        style={{
          color: activeTab === 'description' ? colors.primary : colors.neutral1,
          borderBottom: activeTab === 'description' ? `2px solid ${colors.primary}` : 'none'
        }}
        onClick={() => handleTabChange('description')}
      >
        <MdDescription className="mr-2" /> Description
      </button>
      <button
        className={`flex-1 font-medium py-3 px-4 flex items-center justify-center transition-colors duration-200`}
        style={{
          color: activeTab === 'specifications' ? colors.primary : colors.neutral1,
          borderBottom: activeTab === 'specifications' ? `2px solid ${colors.primary}` : 'none'
        }}
        onClick={() => handleTabChange('specifications')}
      >
        <MdBuild className="mr-2" /> Specifications
      </button>
      <button
        className={`flex-1 font-medium py-3 px-4 flex items-center justify-center transition-colors duration-200`}
        style={{
          color: activeTab === 'reviews' ? colors.primary : colors.neutral1,
          borderBottom: activeTab === 'reviews' ? `2px solid ${colors.primary}` : 'none'
        }}
        onClick={() => handleTabChange('reviews')}
      >
        <MdReviews className="mr-2" /> Reviews
      </button>
    </div>

    <div className="p-6">
      {activeTab === 'description' && (
        <div className="prose max-w-none">
          <p style={{ color: colors.neutral1, lineHeight: '1.6' }}>
            {product.description}
          </p>
        </div>
      )}

      {activeTab === 'specifications' && (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
            {product.additionalProperties && product.additionalProperties.map((prop, index) => (
              <div key={index} className="flex py-2 border-b" style={{ borderColor: colors.neutral2 }}>
                <span className="w-1/2 text-sm font-medium capitalize" style={{ color: colors.neutral1 }}>{prop.name}</span>
                <span className="w-1/2 text-sm" style={{ color: colors.neutral1 }}>{prop.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="flex flex-col items-center justify-center py-8">
          {/* Reviews content goes here */}
        </div>
      )}
    </div>
  </div>
);

export default ProductTabs;