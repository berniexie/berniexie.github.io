import { useState } from 'react'
import './App.css'
import AsciiBackground from './AsciiBackground'
import InterestsSection from './InterestsSection'
import ProfileHeader from './components/ProfileHeader'
import ResumeSections from './components/ResumeSections'
import Sidebar from './components/Sidebar'
import { DownloadButton } from './components/DownloadButton'
import { useResumeData } from './hooks/useResumeData'
import { useSectionScroll } from './hooks/useSectionScroll'

function App() {
  const { resumeData, isLoading } = useResumeData()
  const [showDetails, setShowDetails] = useState(false)

  const { activeSection, stickyStates, handleSectionClick } = useSectionScroll({
    sections: resumeData?.sections || [],
  })

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
      <DownloadButton />

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
