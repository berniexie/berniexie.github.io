import { lazy, Suspense, type ReactNode } from 'react'
import { useNearViewport } from '../hooks/useNearViewport'

// Lazy load heavy components for better initial load performance
const TravelGlobe = lazy(() => import('../TravelGlobe'))
const ConcertsSection = lazy(() => import('../ConcertsSection'))
const PhotosSection = lazy(() => import('./PhotosSection'))

// Loading fallback component
function SectionLoader({ label }: { label: string }) {
  return (
    <div className="section-placeholder" role="status">
      <span>Loading {label}…</span>
    </div>
  )
}

function DeferredSection({
  children,
  label,
  minHeight,
}: {
  children: ReactNode
  label: string
  minHeight: string
}) {
  const { elementRef, isNearViewport } = useNearViewport()

  return (
    <div ref={elementRef} style={{ minHeight }}>
      {isNearViewport ? children : <SectionLoader label={label} />}
    </div>
  )
}

function HobbySections() {
  return (
    <>
      <section id="travels" className="content-section" aria-labelledby="travel-title">
        <header className="simple-section-heading">
          <div>
            <h2 id="travel-title">Travel</h2>
            <p>Places I’ve visited and rated. Select a destination to see the details.</p>
          </div>
        </header>

        <DeferredSection label="travel map" minHeight="min(720px, 90vw)">
          <Suspense fallback={<SectionLoader label="travel map" />}>
            <TravelGlobe />
          </Suspense>
        </DeferredSection>
      </section>

      <section id="photos" className="content-section" aria-labelledby="photos-title">
        <header className="simple-section-heading">
          <div>
            <h2 id="photos-title">Photography</h2>
            <p>A few favorite frames from trips and everyday life.</p>
          </div>
        </header>

        <DeferredSection label="photos" minHeight="680px">
          <Suspense fallback={<SectionLoader label="photos" />}>
            <PhotosSection />
          </Suspense>
        </DeferredSection>
      </section>

      <section id="concerts" className="content-section" aria-labelledby="concerts-title">
        <header className="simple-section-heading">
          <div>
            <h2 id="concerts-title">Concerts</h2>
            <p>Every show I can remember, going back to 2012.</p>
          </div>
        </header>
        <DeferredSection label="concert history" minHeight="620px">
          <Suspense fallback={<SectionLoader label="concert history" />}>
            <ConcertsSection />
          </Suspense>
        </DeferredSection>
      </section>
    </>
  )
}

export default HobbySections
