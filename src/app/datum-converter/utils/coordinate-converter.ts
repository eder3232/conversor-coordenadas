import proj4 from 'proj4'
import { UTMCoordinate } from './types'

/**
 * Convierte coordenadas UTM a UTM cambiando el datum
 * @param utm - Coordenadas UTM de entrada
 * @param targetDatum - Datum objetivo ('WGS84' o 'PSAD56')
 * @returns Coordenadas UTM convertidas al nuevo datum
 */
export function convertUTMToUTM(
  utm: UTMCoordinate,
  targetDatum: 'WGS84' | 'PSAD56'
): UTMCoordinate {
  try {
    // Validar parámetros de entrada
    if (isNaN(utm.x) || isNaN(utm.y)) {
      throw new Error('Coordenadas UTM inválidas')
    }

    if (!utm.zone || utm.zone < 1 || utm.zone > 60) {
      throw new Error(
        `Zona UTM inválida: ${utm.zone}. Debe estar entre 1 y 60.`
      )
    }

    if (!utm.hemisphere || !['N', 'S'].includes(utm.hemisphere)) {
      throw new Error(
        `Hemisferio inválido: ${utm.hemisphere}. Debe ser 'N' o 'S'.`
      )
    }

    // Si el datum es el mismo, no hay conversión necesaria
    if (utm.datum === targetDatum) {
      return {
        ...utm,
        datum: targetDatum,
      }
    }

    // Definir el sistema de coordenadas UTM de origen
    const sourceUTMProj = `+proj=utm +zone=${utm.zone} +datum=${
      utm.datum
    } +units=m +no_defs${utm.hemisphere === 'S' ? ' +south' : ''}`

    // Definir el sistema de coordenadas UTM objetivo
    const targetUTMProj = `+proj=utm +zone=${
      utm.zone
    } +datum=${targetDatum} +units=m +no_defs${
      utm.hemisphere === 'S' ? ' +south' : ''
    }`

    // Realizar la transformación
    const [x, y] = proj4(sourceUTMProj, targetUTMProj, [utm.x, utm.y])

    // Validar resultados
    if (isNaN(x) || isNaN(y)) {
      throw new Error(
        'Error en la conversión: coordenadas resultantes inválidas'
      )
    }

    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      zone: utm.zone,
      hemisphere: utm.hemisphere,
      datum: targetDatum,
    }
  } catch (error) {
    throw new Error(
      `Error en conversión UTM a UTM: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`
    )
  }
}
