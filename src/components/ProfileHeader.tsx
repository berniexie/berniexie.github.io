// import { Suspense, lazy } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { ResumeData } from '../types/resume'

// const BedroomScene = lazy(() => import('./BedroomScene'))

interface ProfileHeaderProps {
  name: string
  contact: ResumeData['contact']
  summary: string
}

function ProfileHeader({ name, contact, summary }: ProfileHeaderProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[var(--color-text)] font-display leading-[0.95] break-words">
          {name}
        </h1>

        {/* 3D Bedroom Scene - Large and Centered */}
        {/* <div className="w-full h-[36rem] md:h-[48rem] mt-4 relative">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-xs">
                <span className="animate-pulse">Loading room...</span>
              </div>
            }
          >
            <BedroomScene />
          </Suspense>
        </div> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-[var(--color-text-muted)] font-body mb-4">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-widest opacity-70 font-semibold">
            Contact
          </span>
          <div className="flex flex-col gap-2">
            <a
              href={`mailto:${contact.email}`}
              className="hover-link inline-flex items-center gap-1 w-fit text-[var(--color-text)]"
            >
              {contact.email} <ArrowUpRight size={10} />
            </a>
            <span className="text-[var(--color-text)]">{contact.phone}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-widest opacity-70 font-semibold">
            Social
          </span>
          <div className="flex flex-col gap-2">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-link inline-flex items-center gap-1 w-fit text-[var(--color-text)]"
            >
              LinkedIn <ArrowUpRight size={10} />
            </a>
            <a
              href={contact.x}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-link inline-flex items-center gap-1 w-fit text-[var(--color-text)]"
            >
              X <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* Gradient separator */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent opacity-60" />

      <p className="text-[var(--color-text-muted)] leading-relaxed py-4 font-body text-xs md:text-sm max-w-2xl">
        {summary}
      </p>
    </>
  )
}

export default ProfileHeader
