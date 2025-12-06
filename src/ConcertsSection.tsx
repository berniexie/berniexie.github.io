import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Music, Star, Calendar, MapPin } from "lucide-react";

interface Concert {
  artist: string;
  date: string;
  venue: string;
  rating: number | null;
  tags: string[];
  status?: string;
}

function ConcertsSection() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    fetch("/concerts.json")
      .then((res) => res.json())
      .then((data: Concert[]) => setConcerts(data))
      .catch((err) => console.error("Failed to load concerts:", err));
  }, []);

  // Process data for charts
  const stats = useMemo(() => {
    if (concerts.length === 0) return null;

    const validConcerts = concerts.filter(
      (c) => c.rating !== null && c.status !== "cancelled"
    );

    // Concerts by year
    const byYear: Record<number, Concert[]> = {};
    concerts.forEach((c) => {
      const year = new Date(c.date).getFullYear();
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(c);
    });

    const yearsData = Object.entries(byYear)
      .map(([year, concerts]) => ({
        year: parseInt(year),
        count: concerts.length,
        avgRating:
          concerts.filter((c) => c.rating !== null).reduce((sum, c) => sum + (c.rating || 0), 0) /
            concerts.filter((c) => c.rating !== null).length || 0,
      }))
      .sort((a, b) => a.year - b.year);

    // Rating distribution (buckets: 1-2, 3-4, 5-6, 7-8, 9-10)
    const ratingBuckets = [
      { range: "1-4", count: 0 },
      { range: "5-6", count: 0 },
      { range: "7-8", count: 0 },
      { range: "9-10", count: 0 },
    ];
    validConcerts.forEach((c) => {
      const r = c.rating!;
      if (r <= 4) ratingBuckets[0].count++;
      else if (r <= 6) ratingBuckets[1].count++;
      else if (r <= 8) ratingBuckets[2].count++;
      else ratingBuckets[3].count++;
    });

    // Top genres (from tags, excluding city/venue tags)
    const genreCounts: Record<string, number> = {};
    concerts.forEach((c) => {
      c.tags
        .filter((t) => !t.startsWith("city:") && !t.startsWith("venue:") && !t.startsWith("festival:"))
        .forEach((tag) => {
          genreCounts[tag] = (genreCounts[tag] || 0) + 1;
        });
    });
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([genre, count]) => ({ genre, count }));

    // Top venues
    const venueCounts: Record<string, number> = {};
    concerts.forEach((c) => {
      venueCounts[c.venue] = (venueCounts[c.venue] || 0) + 1;
    });
    const topVenues = Object.entries(venueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Average rating
    const avgRating =
      validConcerts.reduce((sum, c) => sum + (c.rating || 0), 0) /
      validConcerts.length;

    // Top rated concerts
    const topRated = [...validConcerts]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    return {
      total: concerts.length,
      avgRating,
      yearsData,
      ratingBuckets,
      topGenres,
      topVenues,
      topRated,
      byYear,
    };
  }, [concerts]);

  if (!stats) return null;

  const filteredConcerts = selectedYear
    ? stats.byYear[selectedYear] || []
    : [];

  return (
    <div className="py-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Music size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
              Total Shows
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {stats.total}
          </p>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Star size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
              Avg Rating
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {stats.avgRating.toFixed(1)}
          </p>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
              Years Active
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {stats.yearsData.length}
          </p>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
              Top Venue
            </span>
          </div>
          <p className="text-xs font-medium text-[var(--color-text)] leading-tight">
            {stats.topVenues[0]?.[0]}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            {stats.topVenues[0]?.[1]} shows
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Concerts by Year */}
        <div className="p-4 rounded-lg border border-[var(--color-border)]">
          <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
            Concerts by Year
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.yearsData}>
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  axisLine={{ stroke: "var(--color-border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "var(--color-text)" }}
                  formatter={(value: number) => [value, "Shows"]}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={(data) => setSelectedYear(data.year)}
                >
                  {stats.yearsData.map((entry) => (
                    <Cell
                      key={entry.year}
                      fill={
                        selectedYear === entry.year
                          ? "var(--color-text)"
                          : "var(--color-text-muted)"
                      }
                      opacity={selectedYear === entry.year ? 1 : 0.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {selectedYear && (
            <button
              onClick={() => setSelectedYear(null)}
              className="mt-2 text-[10px] uppercase tracking-widest text-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="p-4 rounded-lg border border-[var(--color-border)]">
          <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
            Rating Distribution
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ratingBuckets} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  axisLine={{ stroke: "var(--color-border)" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="range"
                  tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [value, "Shows"]}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-text-muted)"
                  radius={[0, 4, 4, 0]}
                  opacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Genres + Top Rated / Selected Year */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Genres */}
        <div className="p-4 rounded-lg border border-[var(--color-border)]">
          <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
            Top Genres
          </h4>
          <div className="flex flex-wrap gap-2">
            {stats.topGenres.map(({ genre, count }) => (
              <span
                key={genre}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--color-text)]/5 text-[var(--color-text)] border border-[var(--color-border)]"
              >
                {genre}
                <span className="text-[var(--color-text-muted)]">{count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Top Rated or Selected Year Concerts */}
        <div className="p-4 rounded-lg border border-[var(--color-border)]">
          <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
            {selectedYear ? `${selectedYear} Concerts` : "Top Rated Shows"}
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {(selectedYear ? filteredConcerts : stats.topRated).map(
              (concert, i) => (
                <div
                  key={`${concert.artist}-${concert.date}-${i}`}
                  className="flex items-center justify-between gap-2 py-1.5 border-b border-[var(--color-border)] last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[var(--color-text)] truncate">
                      {concert.artist}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                      {concert.venue} •{" "}
                      {new Date(concert.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {concert.rating && (
                    <span
                      className={`text-xs font-bold flex-shrink-0 ${
                        concert.rating >= 9
                          ? "text-[var(--color-text)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {concert.rating}
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConcertsSection;
