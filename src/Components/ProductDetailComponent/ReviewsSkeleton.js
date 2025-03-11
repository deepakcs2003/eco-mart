import React from 'react';

const ReviewsSkeleton = ({ colors="blue", count = 3 }) => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-48"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      
      {Array(count).fill(0).map((_, index) => (
        <div 
          key={index} 
          className="p-4 rounded-lg"
          style={{ backgroundColor: `${colors.neutral2}50` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="flex items-center gap-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-24 mt-3"></div>
        </div>
      ))}
    </div>
  );
};
export default ReviewsSkeleton;

