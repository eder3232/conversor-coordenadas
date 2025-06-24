import proj4 from 'proj4'
import { UTMCoordinate, LatLngCoordinate } from './types'

/**
 * Convierte coordenadas UTM a LatLong
 * @param utm - Coordenadas UTM a convertir
 * @param format - Formato de salida ('decimal' o 'dms')
 * @returns Coordenadas LatLong convertidas
 */
export function convertUTMToLatLng(
  utm: UTMCoordinate,
  format: 'decimal' | 'dms'
): LatLngCoordinate {
  try {
    // Validar parámetros de entrada
    if (!utm.zone || utm.zone < 1 || utm.zone > 60) {
      throw new Error(
        `Zona UTM inválida: ${utm.zone}. Debe estar entre 1 y 60.`
      )
    }

    if (!['N', 'S'].includes(utm.hemisphere)) {
      throw new Error(
        `Hemisferio inválido: ${utm.hemisphere}. Debe ser 'N' o 'S'.`
      )
    }

    // Definir el sistema de coordenadas UTM
    const utmProj = `+proj=utm +zone=${utm.zone} +datum=WGS84 +units=m +no_defs`

    // Si es hemisferio sur, agregar +south
    const utmProjWithHemisphere =
      utm.hemisphere === 'S' ? `${utmProj} +south` : utmProj

    // Sistema de coordenadas de destino (WGS84 en grados decimales)
    const wgs84Proj = '+proj=longlat +datum=WGS84 +no_defs'

    // Realizar la transformación
    const [lng, lat] = proj4(utmProjWithHemisphere, wgs84Proj, [utm.x, utm.y])

    // Validar resultados
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error(
        'Error en la conversión: coordenadas resultantes inválidas'
      )
    }

    if (lat < -90 || lat > 90) {
      throw new Error('Latitud resultante fuera del rango válido (-90 a 90)')
    }

    if (lng < -180 || lng > 180) {
      throw new Error('Longitud resultante fuera del rango válido (-180 a 180)')
    }

    const result: LatLngCoordinate = {
      lat: Number(lat.toFixed(8)),
      lng: Number(lng.toFixed(8)),
    }

    // Agregar formato DMS si se solicita
    if (format === 'dms') {
      result.latDMS = decimalToDMS(lat, 'lat')
      result.lngDMS = decimalToDMS(lng, 'lng')
    }

    return result
  } catch (error) {
    throw new Error(
      `Error en conversión UTM a Lat/Lng: ${
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
