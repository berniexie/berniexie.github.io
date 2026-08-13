import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

interface NavSection {
  id: string
  title: string
}

interface SidebarProps {
  sections: NavSection[]
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

interface NavContentProps {
  sections: NavSection[]
  activeSection: string
  label: string
  onSelect: (sectionId: string) => void
}

function NavContent({ sections, activeSection, label, onSelect }: NavContentProps) {
  return (
    <nav className="site-navigation" aria-label={label}>
      <ul>
        {sections.map((section) => {
          const isActive = activeSection === section.id

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  onSelect(section.id)
                }}
              >
                <span>{section.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Sidebar({ sections, activeSection, onSectionClick }: SidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  useEffect(() => {
    if (!isMenuOpen) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) return

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )

      if (focusable.length === 0) return

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [closeMenu, isMenuOpen])

  const handleNavClick = (sectionId: string) => {
    onSectionClick(sectionId)
    closeMenu()
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="site-header__brand" href="#top" aria-label="Bernard Xie, back to top">
            Bernard Xie
          </a>

          <div className="site-header__desktop">
            <NavContent
              sections={sections}
              activeSection={activeSection}
              label="Page sections"
              onSelect={handleNavClick}
            />
          </div>

          <button
            ref={menuButtonRef}
            className="site-header__menu"
            type="button"
            aria-label="Open navigation menu"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            <span>Menu</span>
            <Menu aria-hidden="true" size={18} />
          </button>
        </div>
      </header>

      <div className="mobile-drawer" data-open={isMenuOpen} aria-hidden={!isMenuOpen}>
        <div className="mobile-drawer__backdrop" aria-hidden="true" onClick={closeMenu} />
        <aside
          id="mobile-navigation"
          ref={drawerRef}
          className="mobile-drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-navigation-title"
        >
          <div className="mobile-drawer__header">
            <p id="mobile-navigation-title">Menu</p>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
            >
              <X aria-hidden="true" size={20} />
            </button>
          </div>

          <NavContent
            sections={sections}
            activeSection={activeSection}
            label="Page sections"
            onSelect={handleNavClick}
          />
        </aside>
      </div>
    </>
  )
}

export default Sidebar
