const SUPPORTED_FORMATS = ['webp', 'avif', 'jpeg'];

interface ImageTransformOptions {
  width?: number;
  height?: number;
  format?: string;
  quality?: number;
}

export function getOptimizedImageUrl(
  originalUrl: string, 
  options: ImageTransformOptions = {}
): string {
  try {
    const url = new URL(originalUrl);
    
    // Add transformation parameters
    if (options.width) url.searchParams.set('w', options.width.toString());
    if (options.height) url.searchParams.set('h', options.height.toString());
    if (options.format && SUPPORTED_FORMATS.includes(options.format)) {
      url.searchParams.set('fm', options.format);
    }
    if (options.quality) url.searchParams.set('q', options.quality.toString());

    return url.toString();
  } catch {
    // If URL parsing fails, return original URL
    return originalUrl;
  }
}

export function generateSrcSet(url: string, widths: number[]): string {
  return widths
    .map(width => {
      const optimizedUrl = getOptimizedImageUrl(url, { width });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}