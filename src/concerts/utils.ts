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
 * Get color for rating value
 */
export function getRatingColor(rating: number): string {
  if (rating >= 9) return '#8b5cf6' // Violet
  if (rating >= 8) return '#34d399' // Emerald
  if (rating >= 7) return '#22d3ee' // Cyan
  if (rating >= 5) return '#fbbf24' // Amber
  return '#f87171' // Red
}
