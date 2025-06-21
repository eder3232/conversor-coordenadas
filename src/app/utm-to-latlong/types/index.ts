/**
 * Tipos TypeScript para el conversor UTM a LatLong
 */

// Tipos de coordenadas
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

// Tipos de datos de conversión
export interface ConversionRow {
  original: string[]
  utm: UTMCoordinate
  converted: LatLngCoordinate
  error?: string
}

// Tipos de configuración
export interface ColumnMapping {
  x: number | null
  y: number | null
}

export interface UTMConfig {
  zone: number | null
  hemisphere: 'N' | 'S' | null
  outputFormat: 'decimal' | 'dms'
}

// Tipos de estado de la UI
export interface UIState {
  isProcessing: boolean
  copySuccess: boolean
  errors: string[]
  totalRows: number
  validRows: number
}

// Tipos de eventos de la UI
export interface UIEvents {
  onDataPaste: (data: string) => void
  onParseData: () => void
  onColumnMapping: (xColumn: number, yColumn: number) => void
  onUTMConfig: (config: UTMConfig) => void
  onConvert: () => void
  onCopyResults: () => void
  onReset: () => void
  onRetry: () => void
}

// Tipos de props para componentes
export interface DataInputProps {
  onDataPaste: (data: string) => void
  onParseData: () => void
  isProcessing: boolean
  rawData: string
}

export interface ColumnMappingProps {
  parsedData: string[][]
  onColumnMapping: (xColumn: number, yColumn: number) => void
  currentMapping: ColumnMapping
}

export interface UTMConfigProps {
  onUTMConfig: (config: UTMConfig) => void
  currentConfig: UTMConfig
  isValid: boolean
}

export interface ResultsProps {
  convertedData: ConversionRow[]
  onCopyResults: () => void
  onReset: () => void
  copySuccess: boolean
  outputFormat: 'decimal' | 'dms'
}

export interface ErrorDisplayProps {
  errors: string[]
  onRetry: () => void
  onReset: () => void
}

export interface LoadingStateProps {
  message: string
  progress?: number
}

export interface StatsProps {
  totalRows: number
  validRows: number
  errors: string[]
}

// Tipos de formato de datos
export type DataFormat = 'csv' | 'tsv' | 'space-separated'

export interface DataFormatConfig {
  delimiter: string
  hasHeaders: boolean
}

// Tipos de validación
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Tipos de configuración de exportación
export interface ExportConfig {
  format: 'csv' | 'tsv' | 'json'
  includeHeaders: boolean
  includeOriginalData: boolean
  includeUTMData: boolean
}
