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

  const { activeSection, handleSectionClick } = useSectionScroll({
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

      {/* Sidebar - Fixed on the left */}
      <Sidebar
        sections={resumeData.sections}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />

      {/* Main Layout - Centered */}
      <div className="max-w-4xl mx-auto px-6 py-8 md:py-16">
        {/* Content Area */}
        <main>
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
              showDetails={showDetails}
              onToggleDetails={() => setShowDetails(!showDetails)}
            />
          </article>

          <footer className="mt-16 pt-8 border-t border-[var(--color-border)] flex justify-between items-end text-xs text-[var(--color-text-muted)]">
            <div>
              <p>&copy; {new Date().getFullYear()}</p>
            </div>
            <div className="flex-col justify-items-end items-end gap-3">
              <img 
                src="/round-cat.png" 
                alt="Cat" 
                className="w-16 h-16 animate-spin"
                style={{ animationDuration: '3s' }}
              />
              <p>Got the goods.</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
