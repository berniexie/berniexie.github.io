import { Expand, Minimize } from 'lucide-react'
import { lazy, Suspense } from 'react'
import type { ResumeSection } from '../types/resume'
import EducationList from './EducationList'
import WorkExperience from './WorkExperience'

// Lazy load heavy components for better initial load performance
const TravelGlobe = lazy(() => import('../TravelGlobe'))
const ConcertsSection = lazy(() => import('../ConcertsSection'))

// Loading fallback component
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-pulse text-[var(--color-text-muted)] text-sm">Loading...</div>
    </div>
  )
}

interface ResumeSectionsProps {
  sections: ResumeSection[]
  showDetails: boolean
  onToggleDetails: () => void
}

function ResumeSections({
  sections,
  showDetails,
  onToggleDetails,
}: ResumeSectionsProps) {
  return (
    <>
      {sections.map((section) => {
        const isWorkSection = section.id === 'work-experience'

        return (
          <div key={section.id} className="my-12">
            <hr className="border-[var(--color-border)] my-0" />
            <div
              id={section.id}
              className="scroll-mt-24 py-4 border-b border-[var(--color-border)] mb-6 flex justify-between items-center"
            >
              <h2 className="mt-0 text-base md:text-lg font-semibold tracking-tight text-[var(--color-text)] font-display uppercase flex items-center gap-3">
                {section.title}
              </h2>

              {isWorkSection && (
                <button
                  onClick={onToggleDetails}
                  className="text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors px-3 py-1.5 rounded-full border border-[var(--color-accent)]/30 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                >
                  {showDetails ? (
                    <>
                      <Minimize size={12} /> Collapse Details
                    </>
                  ) : (
                    <>
                      <Expand size={12} /> Expand Details
                    </>
                  )}
                </button>
              )}
            </div>

            {section.jobs && <WorkExperience jobs={section.jobs} showDetails={showDetails} />}

            {section.items && <EducationList items={section.items} />}

            {section.id === 'travels' && (
              <Suspense fallback={<SectionLoader />}>
                <TravelGlobe />
              </Suspense>
            )}

            {section.id === 'concerts' && (
              <Suspense fallback={<SectionLoader />}>
                <ConcertsSection />
              </Suspense>
            )}
          </div>
        )
      })}
    </>
  )
}

export default ResumeSections

