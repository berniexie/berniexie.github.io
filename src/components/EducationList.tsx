import type { ResumeEducationItem } from '../types/resume'

interface EducationListProps {
  items: ResumeEducationItem[]
  sectionId?: string
  title?: string
}

function EducationList({
  items,
  sectionId = 'education',
  title = 'Education',
}: EducationListProps) {
  return (
    <section id={sectionId} aria-labelledby={`${sectionId}-heading`} className="education">
      <h3 id={`${sectionId}-heading`}>{title}</h3>

      <div className="education__list">
        {items.map((item) => (
          <article key={`${item.school}-${item.period}`}>
            <div>
              <h4>{item.school}</h4>
              <p>{item.degree}</p>
            </div>
            <time>{item.period}</time>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EducationList
