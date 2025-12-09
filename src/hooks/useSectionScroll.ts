import { useEffect, useState, useCallback, useRef } from 'react'
import type { ResumeSection } from '../types/resume'

interface UseSectionScrollOptions {
  sections: ResumeSection[]
}

export function useSectionScroll({ sections }: UseSectionScrollOptions) {
  const [activeSection, setActiveSection] = useState<string>('')
  const isScrollingRef = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Initialize active section when sections change
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id)
    }
  }, [sections, activeSection])

  // Use IntersectionObserver for efficient scroll detection
  useEffect(() => {
    if (sections.length === 0) return

    // Observer for active section detection (fires when section enters viewport)
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Skip updates during programmatic scrolling
        if (isScrollingRef.current) return

        // Find the most visible section
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        
        if (visibleEntries.length > 0) {
          // Get the entry closest to the top of the viewport
          const topEntry = visibleEntries.reduce((prev, curr) => {
            const prevRect = prev.boundingClientRect
            const currRect = curr.boundingClientRect
            return Math.abs(prevRect.top) < Math.abs(currRect.top) ? prev : curr
          })
          setActiveSection(topEntry.target.id)
        }
      },
      {
        rootMargin: '-100px 0px -50% 0px', // Trigger when section is in top half of viewport
        threshold: [0, 0.1, 0.5],
      }
    )

    // Observe all section elements
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observerRef.current?.observe(element)
      }
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [sections])

  // Handle clicking on a section in the sidebar
  const handleSectionClick = useCallback((sectionId: string) => {
    // Prevent scroll handler from overriding our selection
    isScrollingRef.current = true
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

      // Re-enable scroll handler after smooth scroll completes
      setTimeout(() => {
        isScrollingRef.current = false
      }, 800)
    } else {
      isScrollingRef.current = false
    }
  }, [])

  return {
    activeSection,
    handleSectionClick,
  }
}

