import proj4 from 'proj4'
import { LatLngCoordinate, UTMCoordinate } from './types'

/**
 * Convierte coordenadas LatLong a UTM
 * @param latlng - Coordenadas LatLong a convertir
 * @param utmZone - Zona UTM objetivo
 * @param datum - Datum de salida ('WGS84' o 'PSAD56')
 * @returns Coordenadas UTM convertidas
 */
export function convertLatLngToUTM(
  latlng: LatLngCoordinate,
  utmZone: number,
  datum: 'WGS84' | 'PSAD56'
): UTMCoordinate {
  try {
    // Validar parámetros de entrada
    if (latlng.lat < -90 || latlng.lat > 90) {
      throw new Error(
        `Latitud inválida: ${latlng.lat}. Debe estar entre -90 y 90.`
      )
    }

    if (latlng.lng < -180 || latlng.lng > 180) {
      throw new Error(
        `Longitud inválida: ${latlng.lng}. Debe estar entre -180 y 180.`
      )
    }

    if (!utmZone || utmZone < 1 || utmZone > 60) {
      throw new Error(`Zona UTM inválida: ${utmZone}. Debe estar entre 1 y 60.`)
    }

    // Definir el sistema de coordenadas de origen (WGS84 en grados decimales)
    const wgs84Proj = '+proj=longlat +datum=WGS84 +no_defs'

    // Definir el sistema de coordenadas UTM objetivo según el datum
    const utmDatum = datum === 'WGS84' ? 'WGS84' : 'PSAD56'
    const utmProj = `+proj=utm +zone=${utmZone} +datum=${utmDatum} +units=m +no_defs`

    // Determinar hemisferio basado en la latitud
    const hemisphere: 'N' | 'S' = latlng.lat >= 0 ? 'N' : 'S'

    // Si es hemisferio sur, agregar +south
    const utmProjWithHemisphere =
      hemisphere === 'S' ? `${utmProj} +south` : utmProj

    // Realizar la transformación
    const [x, y] = proj4(wgs84Proj, utmProjWithHemisphere, [
      latlng.lng,
      latlng.lat,
    ])

    // Validar resultados
    if (isNaN(x) || isNaN(y)) {
      throw new Error(
        'Error en la conversión: coordenadas resultantes inválidas'
      )
    }

    const result: UTMCoordinate = {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      zone: utmZone,
      hemisphere,
      datum,
    }

    return result
  } catch (error) {
    throw new Error(
      `Error en conversión Lat/Lng a UTM: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`
    )
  }
}

/**
 * Convierte grados decimales a formato DMS (Grados, Minutos, Segundos)
 * @param decimal - Valor decimal a convertir
 * @param type - Tipo de coordenada ('lat' para latitud, 'lng' para longitud)
 * @returns String en formato DMS
 */
export function decimalToDMS(decimal: number, type: 'lat' | 'lng'): string {
  const abs = Math.abs(decimal)
  const degrees = Math.floor(abs)
  const minutes = Math.floor((abs - degrees) * 60)
  const seconds = ((abs - degrees) * 60 - minutes) * 60

  const direction =
    type === 'lat' ? (decimal >= 0 ? 'N' : 'S') : decimal >= 0 ? 'E' : 'W'

  return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`
}
