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
  { id: 'travels', title: 'Travels' },
  { id: 'photos', title: 'Photos' },
  { id: 'concerts', title: 'Concerts' },
]
