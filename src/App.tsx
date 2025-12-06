import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import './App.css'
import AsciiBackground from './AsciiBackground'
import InterestsSection from './InterestsSection'
import ProfileHeader from './components/ProfileHeader'
import ResumeSections from './components/ResumeSections'
import Sidebar from './components/Sidebar'
import type { ResumeData } from './types/resume'

function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string>('')
  const [showDetails, setShowDetails] = useState(false)
  const [stickyStates, setStickyStates] = useState<Record<string, boolean>>({})

  const handleSectionClick = (sectionId: string) => {
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
  }

  useEffect(() => {
    fetch('/resume.json')
      .then((res) => res.json())
      .then((data: ResumeData) => {
        setResumeData(data)
        if (data.sections.length > 0) {
          setActiveSection(data.sections[0].id)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load resume:', err)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!resumeData) return

    const handleScroll = () => {
      let currentSection = resumeData.sections[0]?.id || ''
      const newStickyStates: Record<string, boolean> = {}

      for (const section of resumeData.sections) {
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

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        if (resumeData.sections.length > 0) {
          currentSection = resumeData.sections[resumeData.sections.length - 1].id
        }
      }

      setStickyStates(newStickyStates)
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [resumeData])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!resumeData) return null

  return (
    <div className="min-h-screen relative selection:bg-[var(--color-text)] selection:text-[var(--color-bg)]">
      <AsciiBackground />

      {/* Floating Download Button - Minimalist */}
      <a
        href="/resume.md"
        download="Bernard_Xie_Resume.md"
        className="fixed bottom-8 right-8 z-50 group hidden md:flex items-center gap-3 bg-[var(--color-bg)] pl-4 pr-3 py-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-text)] transition-all hover:shadow-lg"
      >
        <span className="text-xs font-medium uppercase tracking-wider">Download Resume</span>
        <div className="bg-[var(--color-text)] text-[var(--color-bg)] p-1.5 rounded-full flex items-center justify-center">
          <Download size={14} strokeWidth={3} />
        </div>
      </a>

      {/* Mobile Floating Button */}
      <a
        href="/resume.md"
        download="Bernard_Xie_Resume.md"
        className="fixed bottom-6 right-6 z-50 md:hidden bg-[var(--color-text)] text-[var(--color-bg)] p-4 rounded-full shadow-xl flex items-center justify-center"
      >
        <Download size={20} />
      </a>

      {/* Main Layout */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Sidebar
          sections={resumeData.sections}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />

        {/* Content Area */}
        <main className="lg:col-span-9 lg:pl-12">
          <article className="max-w-none">
            <ProfileHeader
              name={resumeData.name}
              contact={resumeData.contact}
              summary={resumeData.summary}
            />

            {/* Fun Facts / Interests */}
            <InterestsSection />

            {/* <hr className="border-[var(--color-border)] my-0" /> */}

            <ResumeSections
              sections={resumeData.sections}
              stickyStates={stickyStates}
              showDetails={showDetails}
              onToggleDetails={() => setShowDetails(!showDetails)}
            />
          </article>

          <footer className="mt-16 pt-8 border-t border-[var(--color-border)] flex justify-between items-end text-xs text-[var(--color-text-muted)]">
            <div>
              <p>&copy; {new Date().getFullYear()}</p>
            </div>
            <div className="text-right">
              <p>Designed & Engineered</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
