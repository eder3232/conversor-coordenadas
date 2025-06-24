import { ConversionRow } from './types'

/**
 * Detecta y remueve encabezados de los datos parseados
 * @param data - Datos parseados en formato de matriz
 * @returns Datos limpios sin encabezados
 */
export function detectAndRemoveHeaders(data: string[][]): string[][] {
  if (data.length === 0) return data

  const firstRow = data[0]

  // Verificar si la primera fila contiene encabezados
  const hasHeaders = firstRow.some((cell) => {
    const cellLower = cell.toLowerCase().trim()
    return (
      cellLower.includes('lat') ||
      cellLower.includes('lng') ||
      cellLower.includes('long') ||
      cellLower.includes('latitude') ||
      cellLower.includes('longitude') ||
      cellLower.includes('coord') ||
      cellLower.includes('x') ||
      cellLower.includes('y')
    )
  })

  return hasHeaders ? data.slice(1) : data
}

/**
 * Formatea los datos convertidos para el portapapeles
 * @param data - Datos convertidos
 * @param datum - Datum de salida
 * @returns String formateado para CSV
 */
export function formatForClipboard(
  data: ConversionRow[],
  datum: 'WGS84' | 'PSAD56'
): string {
  if (data.length === 0) return ''

  // Crear encabezados
  const headers = [
    'Latitud Original',
    'Longitud Original',
    'X UTM',
    'Y UTM',
    'Zona UTM',
    'Hemisferio',
    'Datum',
  ]

  // Crear filas de datos
  const rows = data.map((row) => {
    const baseRow = [
      row.latlng.lat.toString(),
      row.latlng.lng.toString(),
      row.converted.x.toString(),
      row.converted.y.toString(),
      row.converted.zone.toString(),
      row.converted.hemisphere,
      row.converted.datum,
    ]

    return baseRow.join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}
