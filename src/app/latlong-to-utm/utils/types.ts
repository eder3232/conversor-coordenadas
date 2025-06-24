// Tipos para coordenadas LatLong y UTM
export interface LatLngCoordinate {
  lat: number
  lng: number
  latDMS?: string
  lngDMS?: string
}

export interface UTMCoordinate {
  x: number
  y: number
  zone: number
  hemisphere: 'N' | 'S'
  datum: 'WGS84' | 'PSAD56'
}

export interface ConversionRow {
  original: string[]
  latlng: LatLngCoordinate
  converted: UTMCoordinate
  error?: string
}
