import {
  useConcertsData,
  StatsCards,
  TasteEvolutionChart,
  GenreMixChart,
  VenuesTreemap,
  RatingsScatterChart,
  PerfectTensList,
  TopArtistsChart,
} from './concerts'

function ConcertsSection() {
  const { concerts, stats } = useConcertsData()

  if (!stats) return null

  return (
    <div className="py-6">
      {/* Summary Stats */}
      <StatsCards stats={stats} />

      {/* Main Chart: Taste Evolution (Line Chart) */}
      <TasteEvolutionChart
        yearsData={stats.yearsData}
        topGenresList={stats.topGenresList}
        concerts={concerts}
      />

      {/* Secondary Charts Row: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Composition */}
        <GenreMixChart
          genrePieData={stats.genrePieData}
          concertsByGenre={stats.concertsByGenre}
          totalValidConcerts={stats.validConcerts.length}
        />

        {/* Venues & Festivals Breakdown */}
        <VenuesTreemap venueTreemapData={stats.venueTreemapData} />
      </div>

      {/* Most Seen Artists (Full Width) */}
      <TopArtistsChart topArtists={stats.topArtists} />

      {/* All Ratings (Full Width) */}
      <RatingsScatterChart scatterData={stats.scatterData} />

      {/* Perfect 10s */}
      <PerfectTensList topRated={stats.topRated} />
    </div>
  )
}

export default ConcertsSection
