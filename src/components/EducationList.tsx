import type { ResumeEducationItem } from '../types/resume'

interface EducationListProps {
  items: ResumeEducationItem[]
}

function EducationList({ items }: EducationListProps) {
  return (
    <>
      {items.map((item, index) => (
        <div key={index}>
          <h3 className="text-base md:text-lg font-semibold mt-6 mb-2 text-[var(--color-text)] font-display">
            {item.school}
          </h3>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-0.5 md:gap-2 py-4 font-body text-xs md:text-sm">
            <strong className="text-[var(--color-text)] font-semibold">{item.degree}</strong>
            <span className="text-[var(--color-text-muted)]">{item.period}</span>
          </div>
        </div>
      ))}
    </>
  )
}

export default EducationList
