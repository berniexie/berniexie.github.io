import type { ResumeSection } from '../types/resume'

interface SidebarProps {
  sections: ResumeSection[]
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

function Sidebar({ sections, activeSection, onSectionClick }: SidebarProps) {
  return (
    <aside className="hidden lg:flex fixed left-16 top-24 w-48 h-fit flex-col gap-8">
      <div>
        <div className="font-display font-bold text-xl tracking-tight mb-2">berniexie</div>
        <div className="font-body text-xs text-[var(--color-text-muted)]">
          Software Engineer
          <br />
          San Francisco, CA
        </div>
      </div>

      {sections.length > 0 && (
        <nav>
          <ul className="flex flex-col gap-2">
            {sections.map((section) => {
              const isActive = activeSection === section.id
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      onSectionClick(section.id)
                    }}
                    className={`text-sm uppercase tracking-widest transition-colors duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'text-[var(--color-text)] font-semibold'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {isActive && <span className="w-1 h-1 rounded-full bg-[var(--color-text)]" />}
                    {section.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </aside>
  )
}

export default Sidebar
