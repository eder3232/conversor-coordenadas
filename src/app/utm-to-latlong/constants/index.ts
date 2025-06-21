/**
 * Constantes para el conversor UTM a LatLong
 */

// Configuración de zonas UTM
export const UTM_ZONES = {
  MIN: 1,
  MAX: 60,
  DEFAULT: 30,
} as const

// Configuración de hemisferios
export const HEMISPHERES = {
  NORTH: 'N' as const,
  SOUTH: 'S' as const,
} as const

// Formatos de salida
export const OUTPUT_FORMATS = {
  DECIMAL: 'decimal' as const,
  DMS: 'dms' as const,
} as const

// Formatos de datos de entrada
export const DATA_FORMATS = {
  CSV: 'csv',
  TSV: 'tsv',
  SPACE_SEPARATED: 'space-separated',
} as const

// Delimitadores
export const DELIMITERS = {
  CSV: ',',
  TSV: '\t',
  SPACE: ' ',
} as const

// Límites de datos
export const DATA_LIMITS = {
  MAX_ROWS: 10000,
  MAX_COLUMNS: 50,
  MAX_CELL_LENGTH: 1000,
} as const

// Mensajes de error
export const ERROR_MESSAGES = {
  INVALID_DATA_FORMAT: 'Formato de datos inválido',
  TOO_MANY_ROWS: `Máximo ${DATA_LIMITS.MAX_ROWS} filas permitidas`,
  TOO_MANY_COLUMNS: `Máximo ${DATA_LIMITS.MAX_COLUMNS} columnas permitidas`,
  INVALID_COORDINATES: 'Coordenadas UTM inválidas',
  INVALID_ZONE: 'Zona UTM debe estar entre 1 y 60',
  INVALID_HEMISPHERE: 'Hemisferio debe ser N o S',
  COLUMN_MAPPING_REQUIRED: 'Debe seleccionar columnas X e Y',
  UTM_CONFIG_REQUIRED: 'Debe configurar zona UTM y hemisferio',
  CONVERSION_FAILED: 'Error en la conversión de coordenadas',
  COPY_FAILED: 'Error al copiar al portapapeles',
} as const

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  DATA_PARSED: 'Datos parseados correctamente',
  COLUMNS_MAPPED: 'Columnas mapeadas correctamente',
  UTM_CONFIGURED: 'Configuración UTM guardada',
  CONVERSION_COMPLETE: 'Conversión completada',
  COPIED_TO_CLIPBOARD: 'Resultados copiados al portapapeles',
} as const

// Mensajes de información
export const INFO_MESSAGES = {
  PASTE_DATA: 'Pega tus datos CSV/TSV aquí',
  SELECT_COLUMNS: 'Selecciona las columnas que contienen las coordenadas X e Y',
  CONFIGURE_UTM: 'Configura la zona UTM y hemisferio',
  CONVERTING: 'Convirtiendo coordenadas...',
  PROCESSING: 'Procesando datos...',
} as const

// Configuración de UI
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  MAX_PREVIEW_ROWS: 10,
  MAX_ERROR_DISPLAY: 5,
} as const

// Configuración de exportación
export const EXPORT_CONFIG = {
  DEFAULT_FORMAT: 'csv',
  DEFAULT_DELIMITER: '\t',
  INCLUDE_HEADERS: true,
} as const

// Configuración de validación
export const VALIDATION_CONFIG = {
  MIN_COORDINATE_VALUE: -1000000,
  MAX_COORDINATE_VALUE: 10000000,
  MIN_LATITUDE: -90,
  MAX_LATITUDE: 90,
  MIN_LONGITUDE: -180,
  MAX_LONGITUDE: 180,
} as const

// Configuración de rendimiento
export const PERFORMANCE_CONFIG = {
  BATCH_SIZE: 100,
  PROCESSING_DELAY: 100,
  CONVERSION_DELAY: 200,
} as const
