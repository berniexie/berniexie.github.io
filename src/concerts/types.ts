export interface Concert {
  artist: string
  date: string
  venue: string
  rating: number | null
  tags: string[]
  status?: string
}

export interface ConcertWithGenre extends Concert {
  primaryGenre: string
}

export interface ConcertWithTimestamp extends Concert {
  timestamp: number
}

// Tooltip payload types
export interface LineTooltipPayload {
  dataKey: string
  value: number
  color: string
  name: string
}

export interface PieTooltipPayload {
  name: string
  value: number
}

// Treemap types
export interface TreemapItem {
  name: string
  size: number
  type: string
  [key: string]: string | number
}

export interface TreemapCategory {
  name: string
  children: TreemapItem[]
  [key: string]: string | TreemapItem[]
}

// Artist stats for top artists chart
export interface ArtistStats {
  name: string
  count: number
  avgRating: number
  lastSeen: string
  concerts: Concert[]
}

// Stats returned from useConcertsData hook
export interface ConcertStats {
  total: number
  avgRating: number
  yearsData: YearData[]
  ratingBuckets: RatingBucket[]
  genrePieData: GenrePieItem[]
  venueTreemapData: TreemapCategory[]
  scatterData: ConcertWithTimestamp[]
  topVenues: [string, number][]
  topRated: Concert[]
  byYear: Record<number, Concert[]>
  topGenresList: string[]
  concertsByGenre: Record<string, Concert[]>
  validConcerts: Concert[]
  topArtists: ArtistStats[]
}

export interface YearData {
  year: number
  total: number
  [genre: string]: number
}

export interface RatingBucket {
  range: string
  count: number
}

export interface GenrePieItem {
  name: string
  value: number
  [key: string]: string | number
}
