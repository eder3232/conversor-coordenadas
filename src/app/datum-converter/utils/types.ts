// Tipos para coordenadas UTM
export interface UTMCoordinate {
  x: number
  y: number
  zone: number
  hemisphere: 'N' | 'S'
  datum: 'WGS84' | 'PSAD56'
}

export interface ConversionRow {
  original: string[]
  utm: UTMCoordinate
  converted: UTMCoordinate
  error?: string
}
