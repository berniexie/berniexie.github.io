import { ChevronDown, ExternalLink } from 'lucide-react'
import { useId, useState } from 'react'
import type { ResumeJob } from '../types/resume'

interface JobItemProps {
  job: ResumeJob
  isExpanded: boolean
  onToggle: () => void
}

function JobItem({ job, isExpanded, onToggle }: JobItemProps) {
  const reactId = useId()
  const headingId = `work-heading-${reactId}`
  const detailsId = `work-details-${reactId}`
  const toggleLabelId = `work-toggle-${reactId}`
  const isFeatured = job.company.toLowerCase() === 'kestral'

  return (
    <li className="work-item">
      <article aria-labelledby={headingId}>
        <div className="work-item__summary">
          <div>
            <div className="work-item__heading">
              <h3 id={headingId}>{job.company}</h3>

              {isFeatured && <span className="work-item__current">Current</span>}

              {job.ycBatch && job.ycSlug && (
                <a
                  href={`https://www.ycombinator.com/companies/${job.ycSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work-item__yc"
                  aria-label={`${job.company} on Y Combinator, batch ${job.ycBatch}`}
                >
                  <img src="/yc-logo.svg" alt="" className="h-3.5 w-3.5 rounded-sm" />
                  YC {job.ycBatch}
                  <ExternalLink size={10} aria-hidden="true" />
                </a>
              )}
            </div>

            <p className="work-item__role">{job.title}</p>

            {job.summary && <p className="work-item__description">{job.summary}</p>}
          </div>

          <div className="work-item__meta">
            <time>{job.period}</time>

            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              aria-labelledby={`${toggleLabelId} ${headingId}`}
              className="work-item__toggle"
            >
              <span id={toggleLabelId}>{isExpanded ? 'Less' : 'More'}</span>
              <ChevronDown
                size={13}
                aria-hidden="true"
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        <div
          id={detailsId}
          role="region"
          aria-labelledby={headingId}
          hidden={!isExpanded}
          className="work-item__details"
        >
          <ul>
            {job.details.map((detail, detailIndex) => (
              <li key={detailIndex}>{detail}</li>
            ))}
          </ul>
        </div>
      </article>
    </li>
  )
}

interface WorkExperienceProps {
  jobs: ResumeJob[]
  showDetails: boolean
}

interface ExpansionState {
  baseline: boolean
  toggledJobs: Set<number>
}

function WorkExperience({ jobs, showDetails }: WorkExperienceProps) {
  const [expansionState, setExpansionState] = useState<ExpansionState>({
    baseline: showDetails,
    toggledJobs: new Set(),
  })

  // A global expand/collapse establishes the new baseline. Individual controls
  // then act as explicit exceptions without fighting the global control.
  const toggledJobs =
    expansionState.baseline === showDetails ? expansionState.toggledJobs : new Set<number>()

  const toggleJob = (index: number) => {
    setExpansionState((previous) => {
      const nextToggled =
        previous.baseline === showDetails ? new Set(previous.toggledJobs) : new Set<number>()

      if (nextToggled.has(index)) {
        nextToggled.delete(index)
      } else {
        nextToggled.add(index)
      }

      return { baseline: showDetails, toggledJobs: nextToggled }
    })
  }

  return (
    <ol id="work-experience-timeline" className="work-list">
      {jobs.map((job, index) => (
        <JobItem
          key={`${job.company}-${job.period}`}
          job={job}
          isExpanded={showDetails !== toggledJobs.has(index)}
          onToggle={() => toggleJob(index)}
        />
      ))}
    </ol>
  )
}

export default WorkExperience
