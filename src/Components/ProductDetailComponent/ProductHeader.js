import React from 'react';
import { FaThLarge, FaList, FaExternalLinkAlt } from 'react-icons/fa';

const ProductHeader = ({ product, viewMode, setViewMode, colors }) => (
  <>
    {/* Top Bar with View Toggle and External Link */}
    <div className="p-3 flex justify-between items-center" style={{ backgroundColor: colors.neutral2 }}>
      <div className="flex space-x-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded transition ${viewMode === 'grid' ? 'opacity-100' : 'opacity-60'}`}
          style={{ backgroundColor: viewMode === 'grid' ? colors.primary : 'transparent', color: viewMode === 'grid' ? 'white' : colors.neutral1 }}
        >
          <FaThLarge />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded transition ${viewMode === 'list' ? 'opacity-100' : 'opacity-60'}`}
          style={{ backgroundColor: viewMode === 'list' ? colors.primary : 'transparent', color: viewMode === 'list' ? 'white' : colors.neutral1 }}
        >
          <FaList />
        </button>
      </div>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-3 py-1 rounded-full text-sm font-medium"
        style={{ backgroundColor: colors.accent1, color: 'white' }}
      >
        Visit Website <FaExternalLinkAlt className="ml-1" />
      </a>
    </div>

    {/* Breadcrumbs */}
    <div className="p-4 text-sm" style={{ backgroundColor: colors.neutral2 }}>
      {product.breadcrumbs && (
        <div className="flex flex-wrap items-center" style={{ color: colors.neutral1 }}>
          {product.breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span className="hover:opacity-80 cursor-pointer font-medium">{crumb.name}</span>
              {index < product.breadcrumbs.length - 1 && <span className="mx-2">/</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  </>
);

export default ProductHeader;