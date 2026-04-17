import { useEffect, useMemo, useState } from 'react'
import DestinationDetails from './components/DestinationDetails'
import DestinationCard from './components/DestinationCard'
import Filters from './components/Filters'
import type { Dataset, Destination } from './types'

function getBudgetMin(destination: Destination): number {
  return destination.pricing?.average_budget_per_day_bdt?.min ?? Number.MAX_SAFE_INTEGER
}

function getRating(destination: Destination): number {
  return destination.ratings?.average ?? 0
}

function getInitialSlug(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('destination')
}

function updateDestinationInUrl(slug: string | null) {
  const url = new URL(window.location.href)
  if (slug) {
    url.searchParams.set('destination', slug)
  } else {
    url.searchParams.delete('destination')
  }
  window.history.pushState({}, '', url)
}

export default function App() {
  const [data, setData] = useState<Dataset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedDivision, setSelectedDivision] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')
  const [selectedSlug, setSelectedSlug] = useState<string | null>(getInitialSlug())

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data.json')
        if (!response.ok) {
          throw new Error('Failed to load destination dataset')
        }
        const json = (await response.json()) as Dataset
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    const onPopState = () => setSelectedSlug(getInitialSlug())
    window.addEventListener('popstate', onPopState)
    void loadData()

    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const divisions = useMemo(() => {
    if (!data) return []
    return [...new Set(data.destinations.map((item) => item.location.division))].sort()
  }, [data])

  const categories = useMemo(() => {
    if (!data) return []
    return [...new Set(data.destinations.flatMap((item) => item.categories))].sort()
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []

    const query = search.trim().toLowerCase()
    const results = data.destinations.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        [item.name, item.location.district, item.location.division, item.description, item.slug]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesDivision = selectedDivision === 'all' || item.location.division === selectedDivision
      const matchesCategory = selectedCategory === 'all' || item.categories.includes(selectedCategory)

      return matchesSearch && matchesDivision && matchesCategory
    })

    const sorted = [...results]
    switch (sortBy) {
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'rating-desc':
        sorted.sort((a, b) => getRating(b) - getRating(a))
        break
      case 'budget-asc':
        sorted.sort((a, b) => getBudgetMin(a) - getBudgetMin(b))
        break
      case 'budget-desc':
        sorted.sort((a, b) => getBudgetMin(b) - getBudgetMin(a))
        break
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return sorted
  }, [data, search, selectedDivision, selectedCategory, sortBy])

  const featuredDestinations = useMemo(() => filtered.slice(0, 3), [filtered])

  const selectedDestination = useMemo(() => {
    if (!data || !selectedSlug) return null
    return data.destinations.find((destination) => destination.slug === selectedSlug) ?? null
  }, [data, selectedSlug])

  const handleOpenDetails = (slug: string) => {
    setSelectedSlug(slug)
    updateDestinationInUrl(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setSelectedSlug(null)
    updateDestinationInUrl(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-shell">
      {selectedDestination ? (
        <main>
          <DestinationDetails destination={selectedDestination} onBack={handleBack} />
        </main>
      ) : (
        <>
          <header className="hero-shell">
            <div className="hero-shell__backdrop" />
            <div className="hero-shell__content">
              <div className="hero-copy-block">
                <p className="section-kicker">Bangladesh travel explorer</p>
                <h1>Discover routes, budgets, seasons, and the best destinations in one modern travel guide.</h1>
                <p className="hero-copy">
                  Explore your custom 140-destination dataset with fast search, structured filters, route details,
                  and practical travel planning information.
                </p>
                <div className="hero-actions">
                  <a href="#browse" className="primary-button primary-button--link">
                    Browse destinations
                  </a>
                  <div className="hero-mini-note">Built with React + TypeScript and your structured JSON dataset.</div>
                </div>
              </div>

              <div className="hero-spotlight">
                <div className="hero-spotlight__card hero-spotlight__card--accent">
                  <span>Total destinations</span>
                  <strong>{data?.total_destinations ?? 0}</strong>
                </div>
                <div className="hero-spotlight__card">
                  <span>Divisions covered</span>
                  <strong>{divisions.length}</strong>
                </div>
                <div className="hero-spotlight__card">
                  <span>Travel categories</span>
                  <strong>{categories.length}</strong>
                </div>
              </div>
            </div>
          </header>

          <main id="browse">
            {loading && <div className="state-card">Loading destination dataset...</div>}
            {error && !loading && <div className="state-card error">{error}</div>}

            {data && !loading && (
              <>
                <Filters
                  search={search}
                  setSearch={setSearch}
                  selectedDivision={selectedDivision}
                  setSelectedDivision={setSelectedDivision}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  divisions={divisions}
                  categories={categories}
                  totalShown={filtered.length}
                  totalAll={data.total_destinations}
                />

                <section className="featured-strip">
                  <div className="featured-strip__intro">
                    <p className="section-kicker">Popular picks</p>
                    <h2>Great places to start</h2>
                    <p>Top results based on your current filters and sorting.</p>
                  </div>
                  <div className="featured-strip__grid">
                    {featuredDestinations.map((destination) => (
                      <button
                        key={destination.slug}
                        className="featured-tile"
                        onClick={() => handleOpenDetails(destination.slug)}
                      >
                        <span>{destination.location.division}</span>
                        <strong>{destination.name}</strong>
                        <p>{destination.best_time_to_visit?.season ?? 'Great all year'}</p>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="section-head">
                  <div>
                    <p className="section-kicker">All destinations</p>
                    <h2>Browse the full collection</h2>
                  </div>
                </section>

                <section className="card-grid">
                  {filtered.map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                      onOpen={handleOpenDetails}
                    />
                  ))}
                </section>
              </>
            )}
          </main>
        </>
      )}
    </div>
  )
}
