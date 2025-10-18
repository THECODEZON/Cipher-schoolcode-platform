import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const subTextSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        {/* Main circular background */}
        <div className={`${sizeClasses[size]} bg-gray-700 rounded-full flex items-center justify-center`}>
          <span className="text-orange-500 font-bold text-xl">C</span>
        </div>
        
        {/* Key shaft extending from the circle */}
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-8 h-1 bg-gray-700"></div>
        
        {/* Key teeth */}
        <div className="absolute right-7 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white"></div>
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-white"></div>
        <div className="absolute right-9 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-white"></div>
        
        {/* Connecting line to text */}
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-gray-700"></div>
      </div>
      
      {showText && (
        <div className="ml-3">
          <h1 className={`${textSizeClasses[size]} font-bold text-gray-300`}>Cipher</h1>
          <h2 className={`${subTextSizeClasses[size]} font-medium text-gray-400`}>Schools</h2>
        </div>
      )}
    </div>
  );
};

export default Logo;
