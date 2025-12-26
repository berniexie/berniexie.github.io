import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { usePhotos, type PhotoMeta } from '../hooks/usePhotos'
import ReactMarkdown from 'react-markdown'
import { X, ChevronLeft, ChevronRight, Maximize2, Aperture, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { useDrag } from '@use-gesture/react'
import exifr from 'exifr'
import { ProgressiveImage } from './ProgressiveImage'

const INITIAL_DISPLAY_COUNT = 6

export default function PhotosSection() {
  const { albums } = usePhotos()
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null)
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number | null>(null)
  const [currentMeta, setCurrentMeta] = useState<PhotoMeta | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  // Track expand animation with a number that increments each expansion
  const expandCountRef = useRef(0)
  const [expandId, setExpandId] = useState(0)
  // Track aspect ratios for intelligent grid layout
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({})

  // Callback to track image aspect ratios as they load
  const handleImageLoad = useCallback((src: string, img: HTMLImageElement) => {
    const ratio = img.naturalWidth / img.naturalHeight
    setAspectRatios(prev => ({ ...prev, [src]: ratio }))
  }, [])

  // Calculate row span based on aspect ratio (portrait = 2 rows, landscape = 1 row)
  const getRowSpan = (src: string): number => {
    const ratio = aspectRatios[src]
    if (!ratio) return 1 // Default until loaded
    // Portrait photos (taller than wide) get 2 row spans
    if (ratio < 0.9) return 2
    return 1
  }

  // Default to portfolio or first album
  useEffect(() => {
    if (albums.length > 0 && !activeAlbumId) {
      // Prefer 'portfolio' if it exists, otherwise first
      const portfolio = albums.find(a => a.id === 'portfolio')
      setActiveAlbumId(portfolio ? portfolio.id : albums[0].id)
    }
  }, [albums, activeAlbumId])

  const activeAlbum = albums.find(a => a.id === activeAlbumId)

  const visiblePhotos = useMemo(() => {
    if (!activeAlbum) return []
    return isExpanded ? activeAlbum.photos : activeAlbum.photos.slice(0, INITIAL_DISPLAY_COUNT)
  }, [activeAlbum, isExpanded])

  // Handle expand with animation trigger
  const handleToggleExpand = () => {
    if (!isExpanded) {
      // Increment to trigger new animation keys
      expandCountRef.current += 1
      setExpandId(expandCountRef.current)
    }
    setIsExpanded(!isExpanded)
  }

  // Reset states when album changes
  useEffect(() => {
    setIsExpanded(false)
    expandCountRef.current = 0
    setExpandId(0)
  }, [activeAlbumId])

  // Load metadata when lightbox photo changes
  useEffect(() => {
    if (lightboxPhotoIndex === null || !activeAlbum) {
      setCurrentMeta(null)
      return
    }

    const photo = activeAlbum.photos[lightboxPhotoIndex]
    
    // Parse EXIF data
    exifr.parse(photo.src).then(meta => {
      setCurrentMeta(meta)
    }).catch(err => {
      console.warn('Could not parse EXIF:', err)
      setCurrentMeta(null)
    })
  }, [lightboxPhotoIndex, activeAlbum])

  const openLightbox = (index: number) => {
    setLightboxPhotoIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxPhotoIndex(null)
    document.body.style.overflow = 'auto'
  }

  const nextPhoto = () => {
    if (lightboxPhotoIndex === null || !activeAlbum) return
    setLightboxPhotoIndex((prev) => 
      prev === null ? null : (prev + 1) % activeAlbum.photos.length
    )
  }

  const prevPhoto = () => {
    if (lightboxPhotoIndex === null || !activeAlbum) return
    setLightboxPhotoIndex((prev) => 
      prev === null ? null : (prev - 1 + activeAlbum.photos.length) % activeAlbum.photos.length
    )
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxPhotoIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxPhotoIndex, activeAlbum])

  // Gestures for lightbox
  const bind = useDrag(({ swipe: [swipeX] }) => {
    if (swipeX === -1) {
      nextPhoto()
    } else if (swipeX === 1) {
      prevPhoto()
    }
  })

  // Format Shutter Speed (e.g., 0.004 -> 1/250)
  const formatShutterSpeed = (val?: number) => {
    if (!val) return ''
    if (val >= 1) return `${val}s`
    return `1/${Math.round(1/val)}`
  }

  if (!albums.length) return null

  return (
    <div className="space-y-8">
      {/* Album Selector - Only show if > 1 album */}
      {albums.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => {
                setActiveAlbumId(album.id)
                setIsExpanded(false)
              }}
              className={`
                snap-start flex-shrink-0 group relative overflow-hidden rounded-xl transition-all duration-300
                w-32 h-32 md:w-40 md:h-40 border-2
                ${activeAlbumId === album.id 
                  ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30 scale-105' 
                  : 'border-transparent opacity-70 hover:opacity-100 hover:scale-102'}
              `}
            >
              {album.coverPhoto ? (
                <ProgressiveImage 
                  src={album.coverPhoto} 
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-bg-alt)] flex items-center justify-center text-xs">
                  No Cover
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 pointer-events-none">
                <span className="text-white text-sm font-medium font-display leading-tight">
                  {album.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Active Album Content */}
      {activeAlbum && (
        <div className="animate-in fade-in duration-500 space-y-6">
          {/* Intro */}
          {activeAlbum.intro && (
            <div className="prose prose-invert prose-sm max-w-none text-[var(--color-text-muted)] bg-[var(--color-bg-alt)]/30 p-6 rounded-2xl border border-[var(--color-border)]">
              <ReactMarkdown>{activeAlbum.intro}</ReactMarkdown>
            </div>
          )}

          {/* Bento-style Grid - dense packing fills gaps, max-height clips overflow for clean edge */}
          <div 
            className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] max-h-[416px] overflow-hidden"
            style={{ gridAutoFlow: 'dense' }}
          >
            {visiblePhotos.map((photo, index) => {
              const isExpandedPhoto = index >= INITIAL_DISPLAY_COUNT
              const staggerIndex = index - INITIAL_DISPLAY_COUNT
              const staggerDelay = isExpandedPhoto ? Math.min(staggerIndex * 60, 400) : 0
              const rowSpan = getRowSpan(photo.src)

              return (
                <div 
                  // Use expandId in key for expanded photos to trigger animation on mount
                  key={isExpandedPhoto ? `${photo.src}-${expandId}` : photo.src}
                  className={`
                    group relative overflow-hidden rounded-xl bg-[var(--color-bg-alt)] cursor-pointer
                    ${isExpandedPhoto ? 'photo-reveal' : ''}
                  `}
                  style={{ 
                    '--reveal-delay': `${staggerDelay}ms`,
                    gridRow: `span ${rowSpan}`
                  } as React.CSSProperties}
                  onClick={() => openLightbox(index)}
                >
                  <ProgressiveImage
                    src={photo.src}
                    alt={`Photo ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onLoad={(e) => handleImageLoad(photo.src, e.currentTarget as HTMLImageElement)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                    <Maximize2 className="text-white drop-shadow-md" size={24} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Expand/Collapse Button */}
          {activeAlbum.photos.length > INITIAL_DISPLAY_COUNT && (
            <div className="flex justify-center pt-4 relative">
              {/* Fade overlay when collapsed */}
              {!isExpanded && (
                <div className="absolute -top-24 inset-x-0 h-24 bg-gradient-to-t from-[var(--color-bg)] to-transparent pointer-events-none" />
              )}
              
              <button
                onClick={handleToggleExpand}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all font-medium text-sm z-10 shadow-sm"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={16} /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} /> Show All ({activeAlbum.photos.length})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Overlay */}
      {lightboxPhotoIndex !== null && activeAlbum && (
        <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          
          {/* Main Image Area */}
          <div className="relative flex-1 flex items-center justify-center p-4 md:p-12 h-[70vh] md:h-full">
            {/* Navigation Controls */}
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:right-auto md:left-4 text-white/70 hover:text-white p-2 z-50 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={32} />
            </button>

            <button 
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 rounded-full hover:bg-white/10 transition-colors hidden md:block"
            >
              <ChevronLeft size={40} />
            </button>

            <button 
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 rounded-full hover:bg-white/10 transition-colors hidden md:block"
            >
              <ChevronRight size={40} />
            </button>

            {/* Image */}
            <div {...bind()} className="w-full h-full flex items-center justify-center touch-none">
               <img
                src={activeAlbum.photos[lightboxPhotoIndex].src}
                alt="Lightbox view"
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm select-none"
              />
            </div>
          </div>

          {/* Sidebar / Bottom Bar for Metadata */}
          <div className="w-full md:w-80 bg-[#1a1a1a] border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
            <div className="flex justify-between items-center text-white/50 text-xs uppercase tracking-widest font-semibold">
              <span>Photo Details</span>
              <span>{lightboxPhotoIndex + 1} / {activeAlbum.photos.length}</span>
            </div>

            {currentMeta ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {/* Camera Info */}
                {(currentMeta.Make || currentMeta.Model) && (
                  <div>
                    <h4 className="text-white text-lg font-medium font-display leading-tight mb-1">
                      {currentMeta.Model || 'Unknown Camera'}
                    </h4>
                    <p className="text-white/60 text-sm">{currentMeta.Make}</p>
                  </div>
                )}

                {/* Shot Settings Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 text-white/60 mb-1">
                      <Aperture size={14} />
                      <span className="text-[10px] uppercase tracking-wider">Aperture</span>
                    </div>
                    <span className="text-white font-mono">
                      {currentMeta.FNumber ? `f/${currentMeta.FNumber}` : '--'}
                    </span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 text-white/60 mb-1">
                      <Clock size={14} />
                      <span className="text-[10px] uppercase tracking-wider">Shutter</span>
                    </div>
                    <span className="text-white font-mono">
                      {formatShutterSpeed(currentMeta.ExposureTime) || '--'}
                    </span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 text-white/60 mb-1">
                      <span className="text-[10px] font-bold border border-white/40 rounded px-0.5">ISO</span>
                      <span className="text-[10px] uppercase tracking-wider">ISO</span>
                    </div>
                    <span className="text-white font-mono">
                      {currentMeta.ISO || '--'}
                    </span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                     <div className="flex items-center gap-2 text-white/60 mb-1">
                      <Calendar size={14} />
                      <span className="text-[10px] uppercase tracking-wider">Date</span>
                    </div>
                    <span className="text-white text-xs">
                      {currentMeta.DateTimeOriginal ? new Date(currentMeta.DateTimeOriginal).toLocaleDateString() : '--'}
                    </span>
                  </div>
                </div>

                {/* Lens Info */}
                {currentMeta.LensModel && (
                  <div className="pt-4 border-t border-white/10">
                    <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-1">Lens</span>
                    <p className="text-white/80 text-sm leading-relaxed">{currentMeta.LensModel}</p>
                  </div>
                )}
              </div>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-2 min-h-[200px]">
                 <Aperture size={32} className="opacity-50" />
                 <span className="text-sm">No EXIF data</span>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

