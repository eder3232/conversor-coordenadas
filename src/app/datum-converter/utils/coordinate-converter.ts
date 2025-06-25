import proj4 from 'proj4'
import { UTMCoordinate } from './types'

// Definir los sistemas de coordenadas correctamente para Perú
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs')

// PSAD56 con parámetros específicos para Perú
proj4.defs(
  'EPSG:4248',
  '+proj=longlat +ellps=intl +towgs84=-279.0,175.0,-379.0,0,0,0,0 +no_defs'
)

// Función para obtener el código EPSG UTM correcto
function getUTMEPSG(zone: number, hemisphere: string, datum: string): string {
  if (datum === 'WGS84') {
    const baseCode = hemisphere === 'N' ? 32600 : 32700
    return `EPSG:${baseCode + zone}`
  } else {
    // Para PSAD56 en Perú con parámetros específicos
    return `+proj=utm +zone=${zone} +ellps=intl +towgs84=-279.0,175.0,-379.0,0,0,0,0 +units=m +no_defs${
      hemisphere === 'S' ? ' +south' : ''
    }`
  }
}

/**
 * Convierte coordenadas UTM a UTM cambiando el datum
 * Optimizado para Perú (zonas UTM 17S, 18S, 19S principalmente)
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

    // Validación específica para Perú (zonas comunes: 17S, 18S, 19S)
    if (utm.hemisphere === 'S' && (utm.zone < 17 || utm.zone > 19)) {
      console.warn(
        `Zona UTM ${utm.zone}S no es común en Perú. Las zonas típicas son 17S, 18S, 19S`
      )
    }

    // Si el datum es el mismo, no hay conversión necesaria
    if (utm.datum === targetDatum) {
      return {
        ...utm,
        datum: targetDatum,
      }
    }

    console.log('Iniciando conversión UTM a UTM (Perú)')
    console.log('UTM origen:', utm)
    console.log('Datum destino:', targetDatum)

    // Obtener las proyecciones UTM correctas
    const sourceUTMProj = getUTMEPSG(utm.zone, utm.hemisphere, utm.datum)
    const targetUTMProj = getUTMEPSG(utm.zone, utm.hemisphere, targetDatum)

    console.log('Proyecciones UTM (Perú):')
    console.log('Source:', sourceUTMProj)
    console.log('Target:', targetUTMProj)

    // Conversión directa entre sistemas UTM
    const [x, y] = proj4(sourceUTMProj, targetUTMProj, [utm.x, utm.y])

    console.log('Coordenadas convertidas:', { x, y })

    // Validar resultados
    if (isNaN(x) || isNaN(y)) {
      throw new Error(
        'Error en la conversión: coordenadas resultantes inválidas'
      )
    }

    const result = {
      x: x,
      y: y,
      zone: utm.zone,
      hemisphere: utm.hemisphere,
      datum: targetDatum,
    }

    console.log('Resultado final:', result)
    return result
  } catch (error) {
    console.error('Error en convertUTMToUTM:', error)
    throw new Error(
      `Error en conversión UTM a UTM: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`
    )
  }
}

// Función auxiliar para conversión de coordenadas geográficas (Perú)
export function convertLatLonDatum(
  lat: number,
  lon: number,
  sourceDatum: 'WGS84' | 'PSAD56',
  targetDatum: 'WGS84' | 'PSAD56'
): { lat: number; lon: number } {
  if (sourceDatum === targetDatum) {
    return { lat, lon }
  }

  const sourceProj = sourceDatum === 'WGS84' ? 'EPSG:4326' : 'EPSG:4248'
  const targetProj = targetDatum === 'WGS84' ? 'EPSG:4326' : 'EPSG:4248'

  const [newLon, newLat] = proj4(sourceProj, targetProj, [lon, lat])

  return {
    lat: newLat,
    lon: newLon,
  }
}

// Función auxiliar para validar si las coordenadas están dentro del territorio peruano
export function isWithinPeru(lat: number, lon: number): boolean {
  // Límites aproximados de Perú
  const peruBounds = {
    north: -0.038,
    south: -18.351,
    east: -68.677,
    west: -81.328,
  }

  return (
    lat >= peruBounds.south &&
    lat <= peruBounds.north &&
    lon >= peruBounds.west &&
    lon <= peruBounds.east
  )
}
