import { META_TAGS, GENRE_PRIORITY } from './constants'

/**
 * Get the primary genre for a concert based on tag hierarchy
 */
export function getPrimaryGenre(tags: string[]): string {
  // Filter out meta tags and location tags
  const genreTags = tags.filter(
    (t) =>
      !META_TAGS.has(t) &&
      !t.startsWith('city:') &&
      !t.startsWith('venue:') &&
      !t.startsWith('festival:'),
  )

  // Find the first matching genre in priority order
  for (const genre of GENRE_PRIORITY) {
    if (genreTags.includes(genre)) {
      return genre
    }
  }

  // Fallback
  if (tags.includes('electronic') || tags.includes('edm')) {
    return 'electronic'
  }
  return 'other'
}

/**
 * Get color for rating value (balanced taupe-friendly palette)
 */
export function getRatingColor(rating: number): string {
  if (rating >= 9) return '#0F6259'
  if (rating >= 8) return '#3D8278'
  if (rating >= 7) return '#76938B'
  if (rating >= 5) return '#A9864F'
  return '#E76F45'
}
