import { useState, useRef, useEffect } from 'react'

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  className?: string
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

export function ProgressiveImage({ src, className, alt, onLoad, ...props }: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const prevSrcRef = useRef(src)

  // Only reset loading state when src actually changes
  useEffect(() => {
    if (prevSrcRef.current !== src) {
      setIsLoaded(false)
      prevSrcRef.current = src
    }
  }, [src])

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true)
    onLoad?.(e)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton - no animate-pulse to avoid flashing */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[var(--color-bg-alt)]" />
      )}
      
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  )
}
