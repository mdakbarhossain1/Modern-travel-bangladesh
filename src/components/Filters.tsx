interface FiltersProps {
  search: string
  setSearch: (value: string) => void
  selectedDivision: string
  setSelectedDivision: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
  divisions: string[]
  categories: string[]
  totalShown: number
  totalAll: number
}

export default function Filters(props: FiltersProps) {
  const {
    search,
    setSearch,
    selectedDivision,
    setSelectedDivision,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    divisions,
    categories,
    totalShown,
    totalAll,
  } = props

  return (
    <section className="controls-panel">
      <div className="controls-panel__top">
        <div>
          <p className="section-kicker">Plan smarter</p>
          <h2>Find the right place faster</h2>
        </div>
        <div className="results-pill">
          Showing <strong>{totalShown}</strong> / {totalAll}
        </div>
      </div>

      <div className="controls-grid">
        <label>
          <span>Search</span>
          <input
            type="text"
            placeholder="Cox's Bazar, Sajek, Sylhet, waterfall..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label>
          <span>Division</span>
          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
            <option value="all">All divisions</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Category</span>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort by</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="rating-desc">Top rated</option>
            <option value="budget-asc">Lowest budget</option>
            <option value="budget-desc">Highest budget</option>
          </select>
        </label>
      </div>
    </section>
  )
}
