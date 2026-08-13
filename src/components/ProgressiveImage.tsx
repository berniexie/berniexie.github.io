import { useState } from 'react'
import type { ResponsivePhotoSources } from '../photos/photoManifest'

interface ProgressiveImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'srcSet'
> {
  sources: ResponsivePhotoSources
  alt: string
  className?: string
  imageClassName?: string
}

function toSrcSet(sources: ResponsivePhotoSources['avif' | 'webp']) {
  return Object.entries(sources)
    .map(([width, src]) => `${src} ${width}w`)
    .join(', ')
}

export function ProgressiveImage({
  sources,
  alt,
  className = '',
  imageClassName = '',
  onLoad,
  loading = 'lazy',
  decoding = 'async',
  sizes = '(min-width: 768px) 33vw, 50vw',
  ...props
}: ProgressiveImageProps) {
  const fallbackSrc = sources.webp[960]
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const isLoaded = loadedSrc === fallbackSrc

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoadedSrc(fallbackSrc)
    onLoad?.(event)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 bg-[var(--color-bg-alt)] transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />

      <picture className="block h-full w-full">
        <source type="image/avif" srcSet={toSrcSet(sources.avif)} sizes={sizes} />
        <source type="image/webp" srcSet={toSrcSet(sources.webp)} sizes={sizes} />
        <img
          src={fallbackSrc}
          srcSet={toSrcSet(sources.webp)}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          className={`block h-full w-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imageClassName}`}
          {...props}
        />
      </picture>
    </div>
  )
}
