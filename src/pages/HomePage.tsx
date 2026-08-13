import { useState } from 'react'
import InterestsSection from '../InterestsSection'
import PageLayout from '../components/PageLayout'
import ProfileHeader from '../components/ProfileHeader'
import ResumeSections from '../components/ResumeSections'
import HobbySections from '../components/HobbySections'
import RecentPosts from '../components/RecentPosts'
import Sidebar from '../components/Sidebar'
import { useResumeData } from '../hooks/useResumeData'
import { useSectionScroll } from '../hooks/useSectionScroll'
import { SITE_NAV_SECTIONS } from '../config/sections'

function HomePage() {
  const { resumeData, isLoading } = useResumeData()
  const [showDetails, setShowDetails] = useState(false)

  const { activeSection, handleSectionClick } = useSectionScroll({
    sections: SITE_NAV_SECTIONS,
  })

  if (isLoading) {
    return (
      <div className="page-loading" role="status">
        <span>Loading portfolio…</span>
      </div>
    )
  }

  if (!resumeData) return null

  return (
    <>
      <Sidebar
        sections={SITE_NAV_SECTIONS}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />

      <PageLayout>
        <article>
          <ProfileHeader
            name={resumeData.name}
            contact={resumeData.contact}
            summary={resumeData.summary}
          />

          <InterestsSection />
          <ResumeSections
            sections={resumeData.sections}
            showDetails={showDetails}
            onToggleDetails={() => setShowDetails(!showDetails)}
          />

          <HobbySections />
          <RecentPosts />
        </article>
      </PageLayout>
    </>
  )
}

export default HomePage
