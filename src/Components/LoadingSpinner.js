import React from 'react';

const LoadingSpinner = ({ colors }) => (
  <div className="flex justify-center items-center h-64" style={{ backgroundColor: colors.neutral2 }}>
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
  </div>
);

export default LoadingSpinner;