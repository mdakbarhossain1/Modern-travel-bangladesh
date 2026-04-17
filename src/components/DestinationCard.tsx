import type { Destination } from '../types'

interface DestinationCardProps {
  destination: Destination
  onOpen: (slug: string) => void
}

function formatBudget(destination: Destination): string {
  const budget = destination.pricing?.average_budget_per_day_bdt
  if (!budget) return 'Budget varies'
  return `BDT ${budget.min.toLocaleString()} - ${budget.max.toLocaleString()}`
}

function getPrimaryRoute(destination: Destination): string {
  const route = destination.transport?.from_dhaka?.routes?.[0]
  return route?.route ?? 'Route info not available'
}

export default function DestinationCard({ destination, onOpen }: DestinationCardProps) {
  return (
    <article className="destination-card">
      <div className="destination-card__glow" />
      <div className="destination-card__content">
        <div className="destination-card__top">
          <div>
            <p className="destination-card__meta">
              {destination.location.district}, {destination.location.division}
            </p>
            <h3>{destination.name}</h3>
          </div>
          <div className="rating-pill">★ {destination.ratings?.average?.toFixed(1) ?? 'N/A'}</div>
        </div>

        <div className="chip-row">
          {destination.categories.slice(0, 4).map((category) => (
            <span key={category} className="chip">
              {category.replace(/_/g, ' ')}
            </span>
          ))}
        </div>

        <p className="destination-card__description">{destination.description}</p>

        <div className="mini-stats">
          <div>
            <span>Budget</span>
            <strong>{formatBudget(destination)}</strong>
          </div>
          <div>
            <span>Travel time</span>
            <strong>{destination.transport?.from_dhaka?.estimated_travel_time ?? 'Check route'}</strong>
          </div>
          <div>
            <span>Best season</span>
            <strong>{destination.best_time_to_visit?.season ?? 'Year-round'}</strong>
          </div>
        </div>

        <div className="route-line">{getPrimaryRoute(destination)}</div>

        <button className="primary-button" onClick={() => onOpen(destination.slug)}>
          View details
        </button>
      </div>
    </article>
  )
}
