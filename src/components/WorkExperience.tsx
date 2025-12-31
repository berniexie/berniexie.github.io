import { useState, type MouseEvent } from 'react'
import type { ResumeJob } from '../types/resume'

// YC logo badge
function YCBadge({ batch, companySlug }: { batch: string; companySlug: string }) {
  return (
    <a
      href={`https://www.ycombinator.com/companies/${companySlug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 ml-2 hover:opacity-80 transition-opacity"
      title={`Y Combinator ${batch}`}
      onClick={(e) => e.stopPropagation()}
    >
      <img src="/yc-logo.svg" alt="Y Combinator" className="w-4 h-4 rounded-sm" />
      <span className="text-[10px] font-mono text-[#F26522] font-bold">{batch}</span>
    </a>
  )
}

interface JobItemProps {
  job: ResumeJob
  isExpanded: boolean
  onToggle: () => void
}

function JobItem({ job, isExpanded, onToggle }: JobItemProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div>
      {/* Clickable header section with spotlight effect */}
      <button
        onClick={onToggle}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full text-left rounded-xl py-3 px-1 my-2 cursor-pointer transition-all duration-300 ease-out group relative overflow-hidden"
      >
        {/* Spotlight Overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, var(--color-accent-dim), transparent 40%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Content Container - z-index to sit above spotlight */}
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4 group-hover:translate-x-1 transition-transform duration-300">
          <div className="flex items-center gap-3">
            <h3 className="text-lg md:text-xl font-bold text-[var(--color-text)] font-display group-hover:text-[var(--color-accent)] transition-colors duration-300 flex items-center">
              {job.company}
              {job.ycBatch && job.ycSlug && (
                <YCBadge batch={job.ycBatch} companySlug={job.ycSlug} />
              )}
            </h3>
          </div>
          <div className="text-[var(--color-text-muted)] font-body text-xs md:text-sm flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
            <strong className="text-[var(--color-text)] font-semibold group-hover:text-[var(--color-accent)] transition-colors duration-300">
              {job.title}
            </strong>
            <span className="hidden md:inline">|</span>
            <span className="font-mono opacity-80">{job.period}</span>
          </div>
        </div>
      </button>

      {job.summary && (
        <p className="text-[var(--color-text-muted)] leading-relaxed py-2 font-body text-xs md:text-sm">
          {job.summary}
        </p>
      )}

      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExpanded ? 'max-h-[2000px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'
        }`}
      >
        <ul className="space-y-3 pl-0 border-l-2 border-[var(--color-border)] ml-3 pl-8 py-2">
          {job.details.map((detail, detailIndex) => (
            <li
              key={detailIndex}
              className="flex gap-4 text-[var(--color-text-muted)] font-body text-sm leading-relaxed group/item transition-all duration-500"
              style={{
                transitionDelay: isExpanded ? `${detailIndex * 50}ms` : '0ms',
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'translateX(0)' : 'translateX(-10px)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] opacity-40 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.5)]"></span>
              <div className="flex-1 group-hover/item:text-[var(--color-text)] transition-colors">
                {detail}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface WorkExperienceProps {
  jobs: ResumeJob[]
  showDetails: boolean
}

function WorkExperience({ jobs, showDetails }: WorkExperienceProps) {
  // Track expanded state per job (index-based)
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())

  const toggleJob = (index: number) => {
    setExpandedJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // A job is expanded if either globally expanded OR individually expanded
  const isJobExpanded = (index: number) => showDetails || expandedJobs.has(index)

  return (
    <>
      {jobs.map((job, index) => (
        <JobItem
          key={index}
          job={job}
          isExpanded={isJobExpanded(index)}
          onToggle={() => toggleJob(index)}
        />
      ))}
    </>
  )
}

export default WorkExperience
