// components/FastImage.js - Use for images that need to load immediately
import { useState } from "react";

const FastImage = ({ 
  src, 
  alt, 
  className = "", 
  onClick,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // ✅ Ensure path starts with /
  const fixedSrc = src?.startsWith("/") ? src : "/" + src;

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-sm text-gray-500">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={fixedSrc}
        alt={alt}
        loading="eager"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        onClick={onClick}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="w-4 h-4 border-2 rounded-full border-cyan-600 border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
};


export default FastImage;