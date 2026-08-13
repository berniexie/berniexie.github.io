import {
  useConcertsData,
  TasteEvolutionChart,
  GenreMixChart,
  VenuesTreemap,
  RatingsScatterChart,
  PerfectTensList,
  TopArtistsChart,
} from './concerts'

function ConcertsSection() {
  const { concerts, stats, error } = useConcertsData()

  if (error) {
    return (
      <div className="archive-fallback" role="status">
        <p className="meta-label">Archive unavailable</p>
        <p>The concert history could not be loaded. The rest of the site is still available.</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="archive-fallback" role="status">
        <p className="meta-label">Loading the archive</p>
        <p>Pulling fifteen years of setlists into view.</p>
      </div>
    )
  }

  const firstYear = stats.yearsData[0]?.year ?? 2012

  return (
    <div className="listening-archive">
      <p className="concert-intro">
        <strong>{stats.total} shows</strong> since {firstYear}, averaging{' '}
        <strong>{stats.avgRating.toFixed(1)} out of 10</strong>. I’ve seen{' '}
        <strong>{stats.topArtists[0]?.name ?? 'a lot of artists'}</strong> most often, and{' '}
        <strong>{stats.topRated.length} shows</strong> earned a perfect 10.
      </p>

      <TasteEvolutionChart
        yearsData={stats.yearsData}
        topGenresList={stats.topGenresList}
        concerts={concerts}
      />

      <details className="archive-disclosure">
        <summary>
          <span>More concert stats</span>
          <span aria-hidden="true">+</span>
        </summary>
        <div className="archive-disclosure__content">
          <GenreMixChart
            genrePieData={stats.genrePieData}
            concertsByGenre={stats.concertsByGenre}
            totalValidConcerts={stats.validConcerts.length}
          />
          <TopArtistsChart topArtists={stats.topArtists} />
          <VenuesTreemap venueTreemapData={stats.venueTreemapData} />
          <RatingsScatterChart scatterData={stats.scatterData} />
          <PerfectTensList topRated={stats.topRated} />
        </div>
      </details>
    </div>
  )
}

export default ConcertsSection
