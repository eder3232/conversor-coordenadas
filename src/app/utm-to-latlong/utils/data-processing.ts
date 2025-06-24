import { ConversionRow } from './types'

/**
 * Detecta y remueve encabezados de los datos parseados
 * @param data - Array de arrays con los datos parseados
 * @returns Datos sin encabezados
 */
export function detectAndRemoveHeaders(data: string[][]): string[][] {
  if (data.length === 0) return data

  // Lógica simple: si la primera fila contiene texto que no son números
  const firstRow = data[0]
  const hasNonNumericValues = firstRow.some(
    (cell) => isNaN(parseFloat(cell)) && !/^\d+\.?\d*$/.test(cell)
  )

  return hasNonNumericValues ? data.slice(1) : data
}

/**
 * Formatea los datos convertidos para copiar al portapapeles
 * @param data - Array de filas convertidas
 * @param format - Formato de salida ('decimal' o 'dms')
 * @returns String formateado para el portapapeles
 */
export function formatForClipboard(
  data: ConversionRow[],
  format: 'decimal' | 'dms'
): string {
  const header =
    format === 'decimal' ? 'Latitud\tLongitud' : 'Latitud DMS\tLongitud DMS'

  const rows = data.map((row) => {
    if (row.error) return 'ERROR\tERROR'

    return format === 'decimal'
      ? `${row.converted.lat}\t${row.converted.lng}`
      : `${row.converted.latDMS}\t${row.converted.lngDMS}`
  })

  return [header, ...rows].join('\n')
}
