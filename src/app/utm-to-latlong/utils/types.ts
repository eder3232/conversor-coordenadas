// Tipos para coordenadas UTM y LatLong
export interface UTMCoordinate {
  x: number
  y: number
  zone: number
  hemisphere: 'N' | 'S'
}

export interface LatLngCoordinate {
  lat: number
  lng: number
  latDMS?: string
  lngDMS?: string
}

export interface ConversionRow {
  original: string[]
  utm: UTMCoordinate
  converted: LatLngCoordinate
  error?: string
}
