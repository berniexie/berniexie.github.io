import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import type { ResumeSection } from '../types/resume'
import EducationList from './EducationList'
import WorkExperience from './WorkExperience'

interface ResumeSectionsProps {
  sections: ResumeSection[]
  showDetails: boolean
  onToggleDetails: () => void
}

function ResumeSections({ sections, showDetails, onToggleDetails }: ResumeSectionsProps) {
  const workSection = sections.find((section) => section.jobs)
  const educationSection = sections.find((section) => section.items)

  if (!workSection?.jobs) return null

  return (
    <section id={workSection.id} aria-labelledby="work-heading" className="content-section">
      <header className="simple-section-heading">
        <div>
          <h2 id="work-heading">Work</h2>
          <p>
            I’ve been building software since 2016, from early-stage products to large teams. I’m
            currently the co-founder and CTO of Kestral.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleDetails}
          aria-expanded={showDetails}
          aria-controls="work-experience-timeline"
          className="simple-text-button"
        >
          {showDetails ? (
            <>
              <ChevronsDownUp size={13} aria-hidden="true" />
              Collapse details
            </>
          ) : (
            <>
              <ChevronsUpDown size={13} aria-hidden="true" />
              Expand details
            </>
          )}
        </button>
      </header>

      <WorkExperience jobs={workSection.jobs} showDetails={showDetails} />

      {educationSection?.items && (
        <EducationList
          items={educationSection.items}
          sectionId={educationSection.id}
          title={educationSection.title}
        />
      )}
    </section>
  )
}

export default ResumeSections
