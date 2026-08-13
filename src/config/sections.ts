/**
 * Site sections configuration
 * These are the "hobby" / "interest" sections that appear after the resume content.
 * They are defined in code rather than resume.json to keep resume data separate from site config.
 */

export interface HobbySection {
  id: string
  title: string
}

export const HOBBY_SECTIONS: HobbySection[] = [
  { id: 'travels', title: 'Travel' },
  { id: 'photos', title: 'Photography' },
  { id: 'concerts', title: 'Concerts' },
]

export const SITE_NAV_SECTIONS: HobbySection[] = [
  { id: 'work-experience', title: 'Work' },
  { id: 'travels', title: 'Travel' },
  { id: 'photos', title: 'Photos' },
  { id: 'concerts', title: 'Concerts' },
  { id: 'blog', title: 'Writing' },
]
