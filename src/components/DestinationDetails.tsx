import type { Destination, RouteItem } from '../types'

interface DestinationDetailsProps {
  destination: Destination
  onBack: () => void
}

function formatMoney(min?: number, max?: number) {
  if (min == null || max == null) return 'Not specified'
  return `BDT ${min.toLocaleString()} - ${max.toLocaleString()}`
}

function renderRoute(route: RouteItem, index: number) {
  return (
    <div key={`${route.mode}-${index}`} className="detail-route-card">
      <div className="detail-route-card__head">
        <span className="route-mode">{route.mode}</span>
        <strong>{route.route}</strong>
      </div>
      <div className="detail-route-card__meta">
        {route.duration && <span>Duration: {route.duration}</span>}
        {route.vehicle_type && <span>Vehicle: {route.vehicle_type}</span>}
        {route.capacity && <span>Capacity: {route.capacity}</span>}
        {route.cost_range_bdt && <span>Cost: {formatMoney(route.cost_range_bdt.min, route.cost_range_bdt.max)}</span>}
      </div>
      {route.operators && route.operators.length > 0 && (
        <p className="detail-muted">Operators: {route.operators.join(', ')}</p>
      )}
    </div>
  )
}

export default function DestinationDetails({ destination, onBack }: DestinationDetailsProps) {
  const budget = destination.pricing?.average_budget_per_day_bdt
  const coordinates = destination.location.coordinates
  const mapsUrl = `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`

  return (
    <div className="details-page">
      <button className="ghost-button" onClick={onBack}>
        ← Back to all destinations
      </button>

      <section className="details-hero">
        <div className="details-hero__content">
          <p className="section-kicker">Destination guide</p>
          <h1>{destination.name}</h1>
          <p className="details-summary">{destination.description}</p>

          <div className="chip-row">
            {destination.categories.map((category) => (
              <span key={category} className="chip chip--light">
                {category.replace(/_/g, ' ')}
              </span>
            ))}
          </div>

          <div className="details-quick-stats">
            <div>
              <span>Location</span>
              <strong>
                {destination.location.district}, {destination.location.division}
              </strong>
            </div>
            <div>
              <span>Travel time</span>
              <strong>{destination.transport?.from_dhaka?.estimated_travel_time ?? 'Check route details'}</strong>
            </div>
            <div>
              <span>Budget</span>
              <strong>{budget ? formatMoney(budget.min, budget.max) : 'Varies'}</strong>
            </div>
            <div>
              <span>Rating</span>
              <strong>
                {destination.ratings?.average?.toFixed(1) ?? 'N/A'}
                {destination.ratings?.total_reviews ? ` · ${destination.ratings.total_reviews} reviews` : ''}
              </strong>
            </div>
          </div>
        </div>

        <aside className="details-hero__panel">
          <div className="details-panel-card">
            <span className="details-panel-card__label">Best time to visit</span>
            <strong>{destination.best_time_to_visit?.season ?? 'Year-round'}</strong>
            {destination.best_time_to_visit?.months && (
              <p>{destination.best_time_to_visit.months.join(', ')}</p>
            )}
          </div>
          <div className="details-panel-card">
            <span className="details-panel-card__label">Coordinates</span>
            <strong>
              {coordinates.latitude}, {coordinates.longitude}
            </strong>
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              Open in maps
            </a>
          </div>
        </aside>
      </section>

      <section className="details-grid">
        <div className="detail-section detail-section--wide">
          <div className="detail-section__head">
            <h2>Getting there from Dhaka</h2>
            <p>Distance, time, routes, and common transport options.</p>
          </div>
          <div className="detail-facts-grid">
            <div className="detail-fact-card">
              <span>Distance</span>
              <strong>{destination.transport?.from_dhaka?.distance_km ? `${destination.transport.from_dhaka.distance_km} km` : 'Not specified'}</strong>
            </div>
            <div className="detail-fact-card">
              <span>Estimated time</span>
              <strong>{destination.transport?.from_dhaka?.estimated_travel_time ?? 'Not specified'}</strong>
            </div>
          </div>
          <div className="detail-routes-grid">
            {destination.transport?.from_dhaka?.routes?.length ? (
              destination.transport.from_dhaka.routes.map(renderRoute)
            ) : (
              <div className="empty-card">Detailed route information is not available yet for this destination.</div>
            )}
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section__head">
            <h2>Highlights</h2>
          </div>
          {destination.highlights?.length ? (
            <ul className="detail-list">
              {destination.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <div className="empty-card">Highlights will be added soon.</div>
          )}
        </div>

        <div className="detail-section">
          <div className="detail-section__head">
            <h2>Activities</h2>
          </div>
          {destination.activities?.length ? (
            <ul className="detail-list">
              {destination.activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <div className="empty-card">No activities listed yet.</div>
          )}
        </div>

        <div className="detail-section">
          <div className="detail-section__head">
            <h2>Nearby places</h2>
          </div>
          {destination.nearby_places?.length ? (
            <div className="nearby-grid">
              {destination.nearby_places.map((place) => (
                <div className="nearby-card" key={place.name}>
                  <strong>{place.name}</strong>
                  <span>{place.distance_km} km away</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-card">Nearby place data is not available yet.</div>
          )}
        </div>

        <div className="detail-section">
          <div className="detail-section__head">
            <h2>Accommodation</h2>
          </div>
          {destination.accommodation?.popular_places?.length ? (
            <div className="nearby-grid">
              {destination.accommodation.popular_places.map((place) => (
                <div className="nearby-card" key={place.name}>
                  <strong>{place.name}</strong>
                  <span>{place.type ?? 'Stay option'}</span>
                  <span>
                    {place.price_range_bdt
                      ? formatMoney(place.price_range_bdt.min, place.price_range_bdt.max)
                      : 'Price not specified'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-card">Accommodation data is limited for this destination.</div>
          )}
        </div>

        <div className="detail-section detail-section--wide">
          <div className="detail-section__head">
            <h2>Travel planning</h2>
          </div>
          <div className="detail-facts-grid">
            <div className="detail-fact-card">
              <span>Daily budget</span>
              <strong>{budget ? formatMoney(budget.min, budget.max) : 'Budget varies'}</strong>
              {destination.pricing?.notes && <p>{destination.pricing.notes}</p>}
            </div>
            <div className="detail-fact-card">
              <span>Road condition</span>
              <strong>{destination.accessibility?.road_condition ?? 'Not specified'}</strong>
              {destination.accessibility?.vehicle_required && <p>Vehicle: {destination.accessibility.vehicle_required}</p>}
            </div>
            <div className="detail-fact-card">
              <span>Suitable for</span>
              <strong>{destination.accessibility?.suitable_for?.join(', ') ?? 'General travelers'}</strong>
            </div>
            <div className="detail-fact-card">
              <span>Not recommended for</span>
              <strong>{destination.accessibility?.not_recommended_for?.join(', ') ?? '—'}</strong>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section__head">
            <h2>Seasonal weather</h2>
          </div>
          <div className="weather-grid">
            {destination.weather?.summer && (
              <div className="weather-card">
                <span>Summer</span>
                <strong>{destination.weather.summer.temperature_c ?? '—'}°C</strong>
                <p>{destination.weather.summer.condition}</p>
              </div>
            )}
            {destination.weather?.monsoon && (
              <div className="weather-card">
                <span>Monsoon</span>
                <strong>{destination.weather.monsoon.temperature_c ?? '—'}°C</strong>
                <p>{destination.weather.monsoon.condition}</p>
              </div>
            )}
            {destination.weather?.winter && (
              <div className="weather-card">
                <span>Winter</span>
                <strong>{destination.weather.winter.temperature_c ?? '—'}°C</strong>
                <p>{destination.weather.winter.condition}</p>
              </div>
            )}
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section__head">
            <h2>Safety & emergency</h2>
          </div>
          <div className="detail-stack">
            <div className="detail-note-card">
              <strong>Registration</strong>
              <p>{destination.safety?.requires_registration ? 'Required before entry in some cases.' : 'No registration info provided.'}</p>
            </div>
            {destination.safety?.notes && (
              <div className="detail-note-card">
                <strong>Safety note</strong>
                <p>{destination.safety.notes}</p>
              </div>
            )}
            <div className="detail-note-card">
              <strong>Emergency</strong>
              <p>Helpline: {destination.emergency?.helpline ?? '999'}</p>
              {destination.emergency?.nearest_police_station && <p>Police: {destination.emergency.nearest_police_station}</p>}
              {destination.emergency?.medical_facility && <p>Medical: {destination.emergency.medical_facility}</p>}
            </div>
          </div>
        </div>

        <div className="detail-section detail-section--wide">
          <div className="detail-section__head">
            <h2>Travel tips</h2>
          </div>
          {destination.travel_tips?.length ? (
            <div className="tips-grid">
              {destination.travel_tips.map((tip) => (
                <div className="tip-card" key={tip}>
                  {tip}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-card">Travel tips are not available yet.</div>
          )}
        </div>
      </section>
    </div>
  )
}
