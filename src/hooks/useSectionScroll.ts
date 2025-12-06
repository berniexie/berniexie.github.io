import { useEffect, useState, useCallback } from 'react'
import type { ResumeSection } from '../types/resume'

interface UseSectionScrollOptions {
  sections: ResumeSection[]
}

export function useSectionScroll({ sections }: UseSectionScrollOptions) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [stickyStates, setStickyStates] = useState<Record<string, boolean>>({})

  // Initialize active section when sections change
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id)
    }
  }, [sections, activeSection])

  // Handle scroll to update active section and sticky states
  useEffect(() => {
    if (sections.length === 0) return

    const handleScroll = () => {
      let currentSection = sections[0]?.id || ''
      const newStickyStates: Record<string, boolean> = {}

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          // Check if element is stuck (at top of viewport)
          const rect = element.getBoundingClientRect()
          newStickyStates[section.id] = rect.top <= 0

          if (window.scrollY >= element.offsetTop - 200) {
            currentSection = section.id
          }
        }
      }

      // If near bottom of page, set to last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        if (sections.length > 0) {
          currentSection = sections[sections.length - 1].id
        }
      }

      setStickyStates(newStickyStates)
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Handle clicking on a section in the sidebar
  const handleSectionClick = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  return {
    activeSection,
    stickyStates,
    handleSectionClick,
  }
}
