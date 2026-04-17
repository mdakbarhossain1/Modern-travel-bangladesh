export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Location {
  country: string
  division: string
  district: string
  upazila?: string
  coordinates: Coordinates
  elevation_m?: number
}

export interface NearbyPlace {
  name: string
  distance_km: number
}

export interface CostRange {
  min: number
  max: number
}

export interface RouteItem {
  mode: string
  route: string
  operators?: string[]
  duration?: string
  vehicle_type?: string
  cost_range_bdt?: CostRange
  capacity?: string
}

export interface TransportFromDhaka {
  distance_km?: number
  estimated_travel_time?: string
  routes?: RouteItem[]
}

export interface Transport {
  from_dhaka?: TransportFromDhaka
}

export interface AccommodationPlace {
  name: string
  type?: string
  price_range_bdt?: CostRange
}

export interface Accommodation {
  types?: string[]
  popular_places?: AccommodationPlace[]
}

export interface Pricing {
  average_budget_per_day_bdt?: CostRange
  notes?: string
}

export interface WeatherSeason {
  temperature_c?: string
  condition?: string
}

export interface Weather {
  summer?: WeatherSeason
  monsoon?: WeatherSeason
  winter?: WeatherSeason
}

export interface BestTimeToVisit {
  months?: string[]
  season?: string
  notes?: string
}

export interface Accessibility {
  road_condition?: string
  vehicle_required?: string
  suitable_for?: string[]
  not_recommended_for?: string[]
}

export interface Safety {
  requires_registration?: boolean
  checkpoints?: string[]
  notes?: string
}

export interface Emergency {
  nearest_police_station?: string
  helpline?: string
  medical_facility?: string
}

export interface Ratings {
  average?: number
  total_reviews?: number
}

export interface Seo {
  title?: string
  description?: string
  keywords?: string[]
}

export interface Media {
  thumbnail?: string
  gallery?: string[]
  video?: string
}

export interface Destination {
  id: number
  slug: string
  name: string
  type: string
  categories: string[]
  status: string
  location: Location
  description: string
  highlights?: string[]
  nearby_places?: NearbyPlace[]
  transport?: Transport
  accommodation?: Accommodation
  pricing?: Pricing
  weather?: Weather
  best_time_to_visit?: BestTimeToVisit
  activities?: string[]
  accessibility?: Accessibility
  safety?: Safety
  travel_tips?: string[]
  emergency?: Emergency
  ratings?: Ratings
  seo?: Seo
  media?: Media
  created_at?: string
  updated_at?: string
}

export interface Dataset {
  country: string
  total_destinations: number
  destinations: Destination[]
}
