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
          <p className="text-[var(--color-text-muted)] leading-relaxed py-4 font-body text-xs md:text-sm max-w-2xl">
            <strong className="text-[var(--color-text)] font-medium">{item.degree}</strong> |{' '}
            {item.period}
          </p>
        </div>
      ))}
    </>
  )
}

export default EducationList

