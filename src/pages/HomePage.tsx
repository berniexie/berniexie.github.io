import { useState } from 'react'
import InterestsSection from '../InterestsSection'
import PageLayout from '../components/PageLayout'
import ProfileHeader from '../components/ProfileHeader'
import ResumeSections from '../components/ResumeSections'
import Sidebar from '../components/Sidebar'
import { useResumeData } from '../hooks/useResumeData'
import { useSectionScroll } from '../hooks/useSectionScroll'

function HomePage() {
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
    <>
      {/* Sidebar - Fixed on the left */}
      <Sidebar
        sections={resumeData.sections}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />

      <PageLayout showDownloadButton>
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
      </PageLayout>
    </>
  )
}

export default HomePage
