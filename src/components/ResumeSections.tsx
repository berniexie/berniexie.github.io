import { Expand, Minimize } from 'lucide-react'
import ConcertsSection from '../ConcertsSection'
import TravelGlobe from '../TravelGlobe'
import type { ResumeSection } from '../types/resume'
import EducationList from './EducationList'
import WorkExperience from './WorkExperience'

interface ResumeSectionsProps {
  sections: ResumeSection[]
  stickyStates: Record<string, boolean>
  showDetails: boolean
  onToggleDetails: () => void
}

function ResumeSections({
  sections,
  stickyStates,
  showDetails,
  onToggleDetails,
}: ResumeSectionsProps) {
  return (
    <>
      {sections.map((section) => {
        const isStuck = stickyStates[section.id]
        const isWorkSection = section.id === 'work-experience'

        return (
          <div key={section.id} className="my-12">
            <hr className="border-[var(--color-border)] my-0" />
            <div
              id={section.id}
              className={`scroll-mt-24 sticky top-0 py-4 border-b border-[var(--color-border)] mb-6 z-10 transition-all duration-300 flex justify-between items-center ${
                isStuck ? 'bg-[var(--color-bg)]/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
              }`}
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

            {section.id === 'travels' && <TravelGlobe />}

            {section.id === 'concerts' && <ConcertsSection />}
          </div>
        )
      })}
    </>
  )
}

export default ResumeSections
