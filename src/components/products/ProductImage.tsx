import React from 'react';
import OptimizedImage from '../common/OptimizedImage';
import { getOptimizedImageUrl, generateSrcSet } from '../../utils/imageOptimization';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PRODUCT_IMAGE_WIDTHS = [320, 640, 960];

export default function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const optimizedSrc = getOptimizedImageUrl(src, {
    width: 640,
    format: 'webp',
    quality: 80
  });

  const srcSet = generateSrcSet(src, PRODUCT_IMAGE_WIDTHS);

  return (
    <OptimizedImage
      src={optimizedSrc}
      alt={alt}
      className={`object-cover ${className}`}
      fallback={
        <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
          <span className="text-gray-400">No image available</span>
        </div>
      }
    />
  );
}