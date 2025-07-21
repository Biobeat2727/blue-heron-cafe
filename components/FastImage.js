import Image from "next/image";
import { useState } from "react";

const FastImage = ({ 
  src, 
  alt, 
  className = "", 
  onClick,
  ...props 
}) => {
  const [error, setError] = useState(false);

  // If image import failed or isn't valid, show fallback
  if (error || !src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-sm text-gray-500">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        onClick={onClick}
        onError={() => setError(true)}
        className="object-cover"
        priority
        {...props}
      />
    </div>
  );
};

export default FastImage;
