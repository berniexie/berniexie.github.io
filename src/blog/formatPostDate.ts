export function formatPostDate(date: string, style: 'short' | 'long' = 'long'): string {
  const parsedDate = new Date(`${date}T12:00:00`)

  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'short' ? 'short' : 'long',
    day: 'numeric',
  })
}
