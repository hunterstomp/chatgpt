import React from 'react';

const Q10UXLogo = ({ size = 'medium', showText = true, className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`q10ux-logo ${className}`}>
      <div className={`q10ux-logo-block ${sizeClasses[size]}`}>
        <div className="relative z-10 text-white font-bold">
          <span className="block leading-none">Q</span>
          <span className="block text-xs leading-none -mt-1 ml-1">10</span>
        </div>
      </div>
      {showText && (
        <div className={`q10ux-logo-text ${textSizes[size]}`}>
          <span className="ux">UX</span>
          <span className="text-blue-500">.com</span>
        </div>
      )}
    </div>
  );
};

export default Q10UXLogo;
