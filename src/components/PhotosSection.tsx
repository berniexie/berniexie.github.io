import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import { useDrag } from '@use-gesture/react'
import {
  Aperture,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Maximize2,
  X,
} from 'lucide-react'
import { usePhotos } from '../hooks/usePhotos'
import { ProgressiveImage } from './ProgressiveImage'

const INITIAL_DISPLAY_COUNT = 6
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function formatShutterSpeed(value?: number) {
  if (!value) return undefined
  if (value >= 1) return `${value}s`
  return `1/${Math.round(1 / value)}`
}

function formatCaptureDate(value?: string) {
  if (!value) return undefined

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export default function PhotosSection() {
  const { albums } = usePhotos()
  const [activeAlbumId, setActiveAlbumId] = useState(
    albums.find((album) => album.id === 'portfolio')?.id ?? albums[0]?.id ?? '',
  )
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandId, setExpandId] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const activeAlbum = albums.find((album) => album.id === activeAlbumId) ?? albums[0]
  const photoCount = activeAlbum?.photos.length ?? 0
  const currentPhoto =
    lightboxPhotoIndex === null ? undefined : activeAlbum?.photos[lightboxPhotoIndex]
  const isLightboxOpen = lightboxPhotoIndex !== null

  const visiblePhotos = useMemo(() => {
    if (!activeAlbum) return []
    return isExpanded ? activeAlbum.photos : activeAlbum.photos.slice(0, INITIAL_DISPLAY_COUNT)
  }, [activeAlbum, isExpanded])

  const closeLightbox = useCallback(() => {
    setLightboxPhotoIndex(null)
  }, [])

  const nextPhoto = useCallback(() => {
    if (photoCount === 0) return
    setLightboxPhotoIndex((index) => (index === null ? null : (index + 1) % photoCount))
  }, [photoCount])

  const previousPhoto = useCallback(() => {
    if (photoCount === 0) return
    setLightboxPhotoIndex((index) =>
      index === null ? null : (index - 1 + photoCount) % photoCount,
    )
  }, [photoCount])

  const openLightbox = (index: number, trigger: HTMLElement) => {
    lastFocusedRef.current = trigger
    setLightboxPhotoIndex(index)
  }

  const toggleExpanded = () => {
    if (!isExpanded) setExpandId((value) => value + 1)
    setIsExpanded((value) => !value)
  }

  useEffect(() => {
    if (!isLightboxOpen) return

    const bodyWasLocked = document.body.classList.contains('overflow-hidden')
    const appRoot = document.getElementById('root')
    const appWasInert = appRoot?.hasAttribute('inert') ?? false

    document.body.classList.add('overflow-hidden')
    appRoot?.setAttribute('inert', '')

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      window.cancelAnimationFrame(focusFrame)
      if (!bodyWasLocked) document.body.classList.remove('overflow-hidden')
      if (!appWasInert) appRoot?.removeAttribute('inert')

      const lastFocused = lastFocusedRef.current
      if (lastFocused?.isConnected) {
        window.requestAnimationFrame(() => lastFocused.focus())
      }
    }
  }, [isLightboxOpen])

  useEffect(() => {
    if (!currentPhoto) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeLightbox()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        nextPhoto()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        previousPhoto()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute('disabled'))

      if (focusable.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeLightbox, currentPhoto, nextPhoto, previousPhoto])

  const bindSwipe = useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX === -1) nextPhoto()
      if (swipeX === 1) previousPhoto()
    },
    { axis: 'x', filterTaps: true },
  )

  if (!activeAlbum) return null

  const lightbox = currentPhoto
    ? createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-dialog-title"
          aria-describedby="photo-dialog-description"
          tabIndex={-1}
          className="fixed inset-0 z-[100] grid min-h-0 grid-rows-[minmax(0,1fr)_auto] bg-black/95 backdrop-blur-md md:grid-cols-[minmax(0,1fr)_20rem] md:grid-rows-1"
        >
          <div className="relative flex min-h-0 items-center justify-center overflow-hidden p-3 sm:p-6 md:p-12">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Close photo viewer"
              className="absolute right-3 top-3 z-20 flex size-11 items-center justify-center rounded-full bg-black/35 text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-4 md:right-auto md:top-4"
            >
              <X size={26} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={previousPhoto}
              aria-label="Show previous photo"
              className="absolute left-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-4"
            >
              <ChevronLeft size={30} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={nextPhoto}
              aria-label="Show next photo"
              className="absolute right-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-4"
            >
              <ChevronRight size={30} aria-hidden="true" />
            </button>

            <div
              {...bindSwipe()}
              className="flex h-full w-full touch-none items-center justify-center"
            >
              <ProgressiveImage
                sources={currentPhoto.sources}
                alt={currentPhoto.alt}
                width={currentPhoto.width}
                height={currentPhoto.height}
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 768px) calc(100vw - 20rem), 100vw"
                className="h-full w-full"
                imageClassName="object-contain shadow-2xl select-none"
              />
            </div>
          </div>

          <aside className="max-h-[42vh] overflow-y-auto overscroll-contain border-t border-white/10 bg-[#171717] p-5 text-white md:max-h-none md:min-h-0 md:border-l md:border-t-0 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-widest text-white/55">
              <h2 id="photo-dialog-title">Photo details</h2>
              <span aria-live="polite">
                {(lightboxPhotoIndex ?? 0) + 1} / {photoCount}
              </span>
            </div>

            <p id="photo-dialog-description" className="mb-5 text-sm leading-relaxed text-white/85">
              {currentPhoto.alt}
            </p>

            {currentPhoto.meta ? (
              <div className="space-y-5">
                {(currentPhoto.meta.cameraMake || currentPhoto.meta.cameraModel) && (
                  <div>
                    <p className="font-display text-lg font-medium leading-tight text-white">
                      {currentPhoto.meta.cameraModel ?? 'Camera'}
                    </p>
                    {currentPhoto.meta.cameraMake && (
                      <p className="mt-1 text-sm text-white/60">{currentPhoto.meta.cameraMake}</p>
                    )}
                  </div>
                )}

                <dl className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <dt className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/60">
                      <Aperture size={14} aria-hidden="true" /> Aperture
                    </dt>
                    <dd className="font-mono text-white">
                      {currentPhoto.meta.aperture ? `f/${currentPhoto.meta.aperture}` : '--'}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <dt className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/60">
                      <Clock size={14} aria-hidden="true" /> Shutter
                    </dt>
                    <dd className="font-mono text-white">
                      {formatShutterSpeed(currentPhoto.meta.exposureTime) ?? '--'}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <dt className="mb-1 text-[10px] uppercase tracking-wider text-white/60">ISO</dt>
                    <dd className="font-mono text-white">{currentPhoto.meta.iso ?? '--'}</dd>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <dt className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/60">
                      <Calendar size={14} aria-hidden="true" /> Date
                    </dt>
                    <dd className="text-xs text-white">
                      {formatCaptureDate(currentPhoto.meta.capturedAt) ?? '--'}
                    </dd>
                  </div>
                </dl>

                {currentPhoto.meta.lensModel && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-white/45">Lens</p>
                    <p className="text-sm leading-relaxed text-white/80">
                      {currentPhoto.meta.lensModel}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-white/45">Camera settings are unavailable.</p>
            )}
          </aside>
        </div>,
        document.body,
      )
    : null

  return (
    <div className="space-y-8">
      {albums.length > 1 && (
        <div className="flex snap-x gap-4 overflow-x-auto pb-4" aria-label="Photo albums">
          {albums.map((album) => (
            <button
              key={album.id}
              type="button"
              onClick={() => {
                setActiveAlbumId(album.id)
                setIsExpanded(false)
                closeLightbox()
              }}
              aria-pressed={activeAlbumId === album.id}
              className={`group relative h-32 w-32 flex-shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] md:h-40 md:w-40 ${
                activeAlbumId === album.id
                  ? 'scale-[1.03] border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {album.coverPhoto ? (
                <ProgressiveImage
                  sources={album.coverPhoto.sources}
                  alt=""
                  width={album.coverPhoto.width}
                  height={album.coverPhoto.height}
                  sizes="160px"
                  className="h-full w-full"
                  imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-[var(--color-bg-alt)] text-xs">
                  No cover
                </span>
              )}
              <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 text-left font-display text-sm font-medium leading-tight text-white">
                {album.title}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {activeAlbum.intro && (
          <div className="prose prose-sm max-w-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)]/30 p-6 text-[var(--color-text-muted)]">
            <ReactMarkdown>{activeAlbum.intro}</ReactMarkdown>
          </div>
        )}

        <ul id="photo-gallery" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {visiblePhotos.map((photo, index) => {
            const isNewlyExpanded = index >= INITIAL_DISPLAY_COUNT
            const revealDelay = isNewlyExpanded
              ? Math.min((index - INITIAL_DISPLAY_COUNT) * 45, 360)
              : 0

            return (
              <li
                key={isNewlyExpanded ? `${photo.id}-${expandId}` : photo.id}
                className={isNewlyExpanded ? 'photo-reveal' : ''}
                style={{ '--reveal-delay': `${revealDelay}ms` } as React.CSSProperties}
              >
                <button
                  type="button"
                  onClick={(event) => openLightbox(index, event.currentTarget)}
                  aria-haspopup="dialog"
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--color-bg-alt)] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
                >
                  <ProgressiveImage
                    sources={photo.sources}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 768px) 30vw, 50vw"
                    className="h-full w-full"
                    imageClassName="object-cover"
                  />
                  <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100 group-focus-visible:bg-black/20 group-focus-visible:opacity-100">
                    <Maximize2 className="text-white drop-shadow-md" size={24} aria-hidden="true" />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {activeAlbum.photos.length > INITIAL_DISPLAY_COUNT && (
          <div className="flex justify-start pt-1">
            <button
              type="button"
              onClick={toggleExpanded}
              aria-expanded={isExpanded}
              aria-controls="photo-gallery"
              className="z-10 flex min-h-11 items-center gap-2 border-0 bg-transparent px-0 py-2 text-sm font-medium text-[var(--color-accent)] underline decoration-[var(--color-accent)]/30 underline-offset-4 transition-colors hover:text-[var(--color-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={16} aria-hidden="true" /> Show featured photos
                </>
              ) : (
                <>
                  <ChevronDown size={16} aria-hidden="true" /> View all {activeAlbum.photos.length}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {lightbox}
    </div>
  )
}
