
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-gray-500 font-light text-sm tracking-wide">
          Loading more photos...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
