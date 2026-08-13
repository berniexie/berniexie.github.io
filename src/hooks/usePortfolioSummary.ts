import { useEffect, useState } from 'react'

const CAREER_START_YEAR = 2016
const CONCERT_YEARS = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
]

export interface PortfolioTrip {
  city: string
  country: string
  coordinates: [number, number]
  score: number
  summary?: string
  isHome?: boolean
}

export interface TravelData {
  trips: PortfolioTrip[]
}

export interface LatestTravel {
  city: string
  country: string
  month: string
  year: number
}

interface TrendsData {
  lastTravel: LatestTravel
}

export interface PortfolioConcert {
  artist: string
  date: string
  venue: string
  rating: number | null
  tags: string[]
  status?: string
}

export interface PortfolioSummary {
  yearsBuilding: number
  placesLogged: number | null
  ratedShows: number | null
  latestTravel: LatestTravel | null
}

interface PortfolioSummaryState {
  data: PortfolioSummary | null
  isLoading: boolean
  error: Error | null
}

let travelDataPromise: Promise<TravelData> | null = null
let trendsDataPromise: Promise<TrendsData> | null = null
let concertDataPromise: Promise<PortfolioConcert[]> | null = null
let portfolioSummaryPromise: Promise<PortfolioSummary> | null = null
let cachedSummary: PortfolioSummary | null = null
let cachedError: Error | null = null

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function loadTravelData(): Promise<TravelData> {
  if (!travelDataPromise) {
    travelDataPromise = fetchJson<TravelData>('/travel.json').catch((error: unknown) => {
      travelDataPromise = null
      throw error
    })
  }

  return travelDataPromise
}

function loadTrendsData(): Promise<TrendsData> {
  if (!trendsDataPromise) {
    trendsDataPromise = fetchJson<TrendsData>('/trends.json').catch((error: unknown) => {
      trendsDataPromise = null
      throw error
    })
  }

  return trendsDataPromise
}

export function loadConcertData(): Promise<PortfolioConcert[]> {
  if (!concertDataPromise) {
    concertDataPromise = Promise.all(
      CONCERT_YEARS.map((year) => fetchJson<PortfolioConcert[]>(`/concerts/${year}.json`)),
    )
      .then((yearlyData) => yearlyData.flat())
      .catch((error: unknown) => {
        concertDataPromise = null
        throw error
      })
  }

  return concertDataPromise
}

export function loadPortfolioSummary(): Promise<PortfolioSummary> {
  if (!portfolioSummaryPromise) {
    portfolioSummaryPromise = Promise.allSettled([
      loadTravelData(),
      loadTrendsData(),
      loadConcertData(),
    ]).then(([travelResult, trendsResult, concertResult]) => {
      const errors = [travelResult, trendsResult, concertResult]
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map((result) => result.reason)

      cachedError =
        errors.length > 0 ? new Error('Some portfolio statistics could not be loaded') : null

      cachedSummary = {
        yearsBuilding: Math.max(0, new Date().getFullYear() - CAREER_START_YEAR),
        placesLogged: travelResult.status === 'fulfilled' ? travelResult.value.trips.length : null,
        ratedShows:
          concertResult.status === 'fulfilled'
            ? concertResult.value.filter(
                (concert) => concert.rating !== null && concert.status !== 'cancelled',
              ).length
            : null,
        latestTravel: trendsResult.status === 'fulfilled' ? trendsResult.value.lastTravel : null,
      }

      return cachedSummary
    })
  }

  return portfolioSummaryPromise
}

export function usePortfolioSummary(): PortfolioSummaryState {
  const [data, setData] = useState<PortfolioSummary | null>(cachedSummary)
  const [isLoading, setIsLoading] = useState(cachedSummary === null)
  const [error, setError] = useState<Error | null>(cachedError)

  useEffect(() => {
    let isActive = true

    loadPortfolioSummary()
      .then((summary) => {
        if (!isActive) return
        setData(summary)
        setError(cachedError)
      })
      .catch((loadError: unknown) => {
        if (!isActive) return
        setError(
          loadError instanceof Error ? loadError : new Error('Portfolio data failed to load'),
        )
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  return { data, isLoading, error }
}
