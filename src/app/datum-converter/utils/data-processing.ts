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
      cellLower.includes('x') ||
      cellLower.includes('y') ||
      cellLower.includes('easting') ||
      cellLower.includes('northing') ||
      cellLower.includes('coord') ||
      cellLower.includes('utm')
    )
  })

  return hasHeaders ? data.slice(1) : data
}

/**
 * Formatea los datos convertidos para el portapapeles
 * @param data - Datos convertidos
 * @param datum - Datum de salida
 * @param decimals - Número de decimales para formatear los valores
 * @returns String formateado para Excel
 */
export function formatForClipboard(
  data: ConversionRow[],
  datum: 'WGS84' | 'PSAD56',
  decimals: number = 2
): string {
  if (data.length === 0) return ''

  // Crear encabezados
  const headers = [
    'X UTM Original',
    'Y UTM Original',
    'Zona UTM',
    'Hemisferio',
    'Datum Original',
    'X UTM Convertido',
    'Y UTM Convertido',
    'Datum Convertido',
  ]

  // Crear filas de datos
  const rows = data.map((row) => {
    const baseRow = [
      row.utm.x.toFixed(decimals),
      row.utm.y.toFixed(decimals),
      row.utm.zone.toString(),
      row.utm.hemisphere,
      row.utm.datum,
      row.converted.x.toFixed(decimals),
      row.converted.y.toFixed(decimals),
      row.converted.datum,
    ]

    return baseRow.join('\t')
  })

  const csvData = [headers.join('\t'), ...rows].join('\n')

  console.log('Datos que se copiarán al clipboard:', csvData)

  console.log('convertedData antes de copiar:', data)

  return csvData
}
