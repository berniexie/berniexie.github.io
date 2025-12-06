import type { ResumeJob } from '../types/resume'

interface WorkExperienceProps {
  jobs: ResumeJob[]
  showDetails: boolean
}

function WorkExperience({ jobs, showDetails }: WorkExperienceProps) {
  return (
    <>
      {jobs.map((job, index) => (
        <div key={index}>
          <h3 className="text-base md:text-lg font-semibold mt-6 mb-2 text-[var(--color-text)] font-display">
            {job.company}
          </h3>
          <p className="text-[var(--color-text-muted)] leading-relaxed py-4 font-body text-xs md:text-sm max-w-2xl">
            <strong className="text-[var(--color-text)] font-medium">{job.title}</strong> |{' '}
            {job.period}
          </p>

          {job.summary && (
            <p className="text-[var(--color-text-muted)] leading-relaxed py-4 font-body text-xs md:text-sm">
              {job.summary}
            </p>
          )}

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showDetails ? 'max-h-[2000px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
            }`}
          >
            <ul className="space-y-2 pl-0 border-l border-[var(--color-border)] ml-1 pl-6">
              {job.details.map((detail, detailIndex) => (
                <li
                  key={detailIndex}
                  className="flex gap-4 text-[var(--color-text-muted)] font-body text-xs leading-relaxed group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text)] opacity-20 group-hover:opacity-100 transition-opacity mt-2.5 flex-shrink-0"></span>
                  <div className="flex-1">{detail}</div>
                </li>
              ))}
            </ul>
          </div>

          {index < (jobs.length ?? 0) - 1 && <hr className="border-[var(--color-border)] my-0" />}
        </div>
      ))}
    </>
  )
}

export default WorkExperience
