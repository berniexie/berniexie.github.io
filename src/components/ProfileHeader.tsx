import { ArrowUpRight, Download } from 'lucide-react'
import type { ResumeData } from '../types/resume'

interface ProfileHeaderProps {
  name: string
  contact: ResumeData['contact']
  summary: string
}

function ProfileHeader({ name, contact }: ProfileHeaderProps) {
  return (
    <header id="top" className="simple-hero" aria-labelledby="portfolio-hero-title">
      <h1 id="portfolio-hero-title">{name}</h1>
      <p className="simple-hero__role">
        I’m a software engineer and co-founder based in San Francisco.
      </p>
      <p className="simple-hero__lede">
        I’m currently building Kestral. Outside work, I take photos, travel, see live music, and
        write occasionally.
      </p>

      <nav className="simple-hero__links" aria-label="Contact and profile links">
        <a href={`mailto:${contact.email}`}>
          Email <ArrowUpRight aria-hidden="true" size={14} />
        </a>
        <a href="/resume.md" download="Bernard_Xie_Resume.md">
          Résumé <Download aria-hidden="true" size={13} />
        </a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn <ArrowUpRight aria-hidden="true" size={13} />
        </a>
      </nav>
    </header>
  )
}

export default ProfileHeader
