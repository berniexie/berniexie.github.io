import { lazy, Suspense } from 'react'
import { HOBBY_SECTIONS } from '../config/sections'

// Lazy load heavy components for better initial load performance
const TravelGlobe = lazy(() => import('../TravelGlobe'))
const ConcertsSection = lazy(() => import('../ConcertsSection'))
const PhotosSection = lazy(() => import('./PhotosSection'))

// Loading fallback component
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-pulse text-[var(--color-text-muted)] text-sm">Loading...</div>
    </div>
  )
}

function HobbySections() {
  return (
    <>
      {HOBBY_SECTIONS.map((section) => (
        <div key={section.id} className="my-12">
          {/* Gradient separator */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent opacity-60 mb-6" />
          <div id={section.id} className="scroll-mt-24 py-4 flex justify-between items-center">
            <h2 className="mt-0 text-base md:text-lg font-semibold tracking-tight text-[var(--color-text)] font-display uppercase flex items-center gap-3">
              {section.title}
            </h2>
          </div>

          {section.id === 'travels' && (
            <Suspense fallback={<SectionLoader />}>
              <TravelGlobe />
            </Suspense>
          )}

          {section.id === 'photos' && (
            <Suspense fallback={<SectionLoader />}>
              <PhotosSection />
            </Suspense>
          )}

          {section.id === 'concerts' && (
            <Suspense fallback={<SectionLoader />}>
              <ConcertsSection />
            </Suspense>
          )}
        </div>
      ))}
    </>
  )
}

export default HobbySections
