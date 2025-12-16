import { useState } from 'react'
import type { ResumeSection } from '../types/resume'

interface SidebarProps {
  sections: ResumeSection[]
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

function Sidebar({ sections, activeSection, onSectionClick }: SidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (sectionId: string) => {
    onSectionClick(sectionId)
    setIsMenuOpen(false)
  }

  const NavContent = () => {
    const isBlogActive = activeSection === 'blog'

    return (
      <>
        <div>
          <div className="font-display font-bold text-xl tracking-tight mb-2">berniexie</div>
          <div className="font-body text-xs text-[var(--color-text-muted)]">
            Software Engineer
            <br />
            San Francisco, CA
          </div>
        </div>

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
                      handleNavClick(section.id)
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
                  {/* Blog link right after Education */}
                  {section.id === 'education' && (
                    <a
                      href="#blog"
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick('blog')
                      }}
                      className={`text-sm uppercase tracking-widest transition-colors duration-200 flex items-center gap-2 mt-2 ${
                        isBlogActive
                          ? 'text-[var(--color-text)] font-semibold'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {isBlogActive && (
                        <span className="w-1 h-1 rounded-full bg-[var(--color-text)]" />
                      )}
                      Blog
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-2 rounded-md bg-[var(--color-bg)]/80 backdrop-blur-sm border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`xl:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer */}
        <aside
          className={`absolute left-0 top-0 h-full w-64 bg-[var(--color-bg)] border-r border-[var(--color-border)] p-8 flex flex-col gap-8 transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-md hover:bg-[var(--color-border)]/20 transition-colors"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <NavContent />
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden xl:flex fixed left-16 top-24 w-48 h-fit flex-col gap-8 z-40">
        <NavContent />
      </aside>
    </>
  )
}

export default Sidebar
