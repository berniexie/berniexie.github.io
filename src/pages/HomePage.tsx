import { useState } from 'react'
import InterestsSection from '../InterestsSection'
import PageLayout from '../components/PageLayout'
import ProfileHeader from '../components/ProfileHeader'
import ResumeSections from '../components/ResumeSections'
import HobbySections from '../components/HobbySections'
import Sidebar from '../components/Sidebar'
import { useResumeData } from '../hooks/useResumeData'
import { useSectionScroll } from '../hooks/useSectionScroll'
import { HOBBY_SECTIONS } from '../config/sections'

function HomePage() {
  const { resumeData, isLoading } = useResumeData()
  const [showDetails, setShowDetails] = useState(false)

  // Combine resume sections with hobby sections for navigation
  const allSections = [
    ...(resumeData?.sections || []),
    ...HOBBY_SECTIONS,
  ]

  const { activeSection, handleSectionClick } = useSectionScroll({
    sections: allSections,
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
        sections={allSections}
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

          {/* Resume Content */}
          <ResumeSections
            sections={resumeData.sections}
            showDetails={showDetails}
            onToggleDetails={() => setShowDetails(!showDetails)}
          />

          {/* Hobby Sections */}
          <HobbySections />
        </article>
      </PageLayout>
    </>
  )
}

export default HomePage
