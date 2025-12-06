import { ArrowUpRight } from 'lucide-react'
import type { ResumeData } from '../types/resume'

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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-[var(--color-text-muted)] font-body mb-4">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-widest opacity-40 font-semibold">
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
          <span className="text-[10px] uppercase tracking-widest opacity-40 font-semibold">
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

      <hr className="border-[var(--color-border)] my-0" />

      <p className="text-[var(--color-text-muted)] leading-relaxed py-4 font-body text-xs md:text-sm max-w-2xl">
        {summary}
      </p>
    </>
  )
}

export default ProfileHeader
