import { assign, createMachine, fromPromise } from 'xstate'
import proj4 from 'proj4'

// Tipos TypeScript
interface UTMCoordinate {
  x: number
  y: number
  zone: number
  hemisphere: 'N' | 'S'
}

interface LatLngCoordinate {
  lat: number
  lng: number
  latDMS?: string
  lngDMS?: string
}

interface ConversionRow {
  original: string[]
  utm: UTMCoordinate
  converted: LatLngCoordinate
  error?: string
}

interface MachineContext {
  // Datos de entrada
  rawData: string
  parsedData: string[][]

  // Configuración de columnas
  columnMapping: {
    x: number | null
    y: number | null
  }

  // Parámetros UTM
  utmZone: number | null
  hemisphere: 'N' | 'S' | null

  // Formato de salida
  outputFormat: 'decimal' | 'dms'

  // Resultados
  convertedData: ConversionRow[]

  // Estados de la aplicación
  errors: string[]
  isProcessing: boolean
  copySuccess: boolean

  // Metadatos
  totalRows: number
  validRows: number
}

type MachineEvents =
  | { type: 'PASTE_DATA'; data: string }
  | { type: 'PARSE_DATA' }
  | { type: 'MAP_COLUMNS'; xColumn: number; yColumn: number }
  | { type: 'SET_UTM_ZONE'; zone: number }
  | { type: 'SET_HEMISPHERE'; hemisphere: 'N' | 'S' }
  | { type: 'SET_OUTPUT_FORMAT'; format: 'decimal' | 'dms' }
  | { type: 'CONVERT_COORDINATES' }
  | { type: 'COPY_TO_CLIPBOARD' }
  | { type: 'RESET' }
  | { type: 'RETRY' }
  | { type: 'CLEAR_ERRORS' }

export const utmConverterMachine = createMachine({
  id: 'utmConverter',
  initial: 'idle',
  types: {} as {
    context: MachineContext
    events: MachineEvents
  },

  context: {
    rawData: '',
    parsedData: [],
    columnMapping: { x: null, y: null },
    utmZone: null,
    hemisphere: null,
    outputFormat: 'decimal',
    convertedData: [],
    errors: [],
    isProcessing: false,
    copySuccess: false,
    totalRows: 0,
    validRows: 0,
  },

  states: {
    idle: {
      entry: assign({
        rawData: '',
        parsedData: [],
        columnMapping: { x: null, y: null },
        utmZone: null,
        hemisphere: null,
        convertedData: [],
        errors: [],
        copySuccess: false,
        totalRows: 0,
        validRows: 0,
      }),
      on: {
        PASTE_DATA: {
          target: 'dataInput',
          actions: assign({
            rawData: ({ event }) => event.data,
            errors: [],
          }),
        },
      },
    },

    dataInput: {
      on: {
        PARSE_DATA: {
          target: 'parsingData',
        },
        PASTE_DATA: {
          actions: assign({
            rawData: ({ event }) => event.data,
            errors: [],
          }),
        },
        RESET: {
          target: 'idle',
        },
      },
    },

    parsingData: {
      entry: assign({ isProcessing: true }),
      exit: assign({ isProcessing: false }),
      invoke: {
        src: fromPromise(async ({ input }) => {
          // Simular procesamiento async
          await new Promise((resolve) => setTimeout(resolve, 100))

          console.log('maquina de estado parsingData')
          console.log(input)

          const lines = input.rawData.trim().split('\n')
          const parsedData = lines.map((line: string) =>
            line.split(/\t|,|\s+/).filter((cell: string) => cell.trim() !== '')
          )

          // Detectar y remover encabezados si existen
          const cleanedData = detectAndRemoveHeaders(parsedData)

          return {
            parsedData: cleanedData,
            totalRows: cleanedData.length,
          }
        }),
        input: ({ context }) => context,
        onDone: {
          target: 'columnMapping',
          actions: assign({
            parsedData: ({ event }) => event.output.parsedData,
            totalRows: ({ event }) => event.output.totalRows,
            errors: [],
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            errors: ({ context, event }) => [
              ...context.errors,
              (event.error as Error)?.message || 'Error desconocido',
            ],
          }),
        },
      },
    },

    columnMapping: {
      on: {
        MAP_COLUMNS: [
          {
            target: 'parameterInput',
            actions: assign({
              columnMapping: ({ event }) => ({
                x: event.xColumn,
                y: event.yColumn,
              }),
            }),
            guard: ({ event }) =>
              event.xColumn !== event.yColumn &&
              event.xColumn !== null &&
              event.yColumn !== null &&
              event.xColumn >= 0 &&
              event.yColumn >= 0,
          },
          {
            actions: assign({
              columnMapping: ({ event }) => ({
                x: event.xColumn,
                y: event.yColumn,
              }),
            }),
          },
        ],
        RESET: {
          target: 'idle',
        },
      },
    },

    parameterInput: {
      on: {
        SET_UTM_ZONE: {
          actions: assign({
            utmZone: ({ event }) => event.zone,
          }),
        },
        SET_HEMISPHERE: {
          actions: assign({
            hemisphere: ({ event }) => event.hemisphere,
          }),
        },
        SET_OUTPUT_FORMAT: [
          {
            target: 'readyToConvert',
            actions: assign({
              outputFormat: ({ event }) => event.format,
            }),
            guard: ({ context }) => {
              return (
                context.utmZone !== null &&
                context.utmZone >= 1 &&
                context.utmZone <= 60 &&
                context.hemisphere !== null
              )
            },
          },
        ],
        RESET: {
          target: 'idle',
        },
      },
    },

    readyToConvert: {
      on: {
        CONVERT_COORDINATES: {
          target: 'converting',
        },
        SET_UTM_ZONE: {
          actions: assign({
            utmZone: ({ event }) => event.zone,
          }),
        },
        SET_HEMISPHERE: {
          actions: assign({
            hemisphere: ({ event }) => event.hemisphere,
          }),
        },
        SET_OUTPUT_FORMAT: {
          actions: assign({
            outputFormat: ({ event }) => event.format,
          }),
        },
        RESET: {
          target: 'idle',
        },
      },
    },

    converting: {
      entry: assign({ isProcessing: true }),
      exit: assign({ isProcessing: false }),
      invoke: {
        src: fromPromise(async ({ input }) => {
          await new Promise((resolve) => setTimeout(resolve, 200))

          const {
            parsedData,
            columnMapping,
            utmZone,
            hemisphere,
            outputFormat,
          } = input
          const convertedData: ConversionRow[] = []
          const errors: string[] = []
          let validRows = 0

          parsedData.forEach((row: string[], index: number) => {
            try {
              const xValue = parseFloat(row[columnMapping.x!])
              const yValue = parseFloat(row[columnMapping.y!])

              if (isNaN(xValue) || isNaN(yValue)) {
                throw new Error(`Valores inválidos en fila ${index + 1}`)
              }

              const utm: UTMCoordinate = {
                x: xValue,
                y: yValue,
                zone: utmZone!,
                hemisphere: hemisphere!,
              }

              // Aquí iría la lógica real de conversión UTM a Lat/Lng
              const converted = convertUTMToLatLng(utm, outputFormat)

              convertedData.push({
                original: row,
                utm,
                converted,
              })

              validRows++
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Error desconocido'
              errors.push(`Fila ${index + 1}: ${errorMessage}`)
              convertedData.push({
                original: row,
                utm: {
                  x: 0,
                  y: 0,
                  zone: utmZone!,
                  hemisphere: hemisphere!,
                },
                converted: { lat: 0, lng: 0 },
                error: errorMessage,
              })
            }
          })

          return {
            convertedData,
            validRows,
            errors,
          }
        }),
        input: ({ context }) => context,
        onDone: {
          target: 'results',
          actions: assign({
            convertedData: ({ event }) => event.output.convertedData,
            validRows: ({ event }) => event.output.validRows,
            errors: ({ event }) => event.output.errors || [],
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            errors: ({ context, event }) => [
              ...context.errors,
              (event.error as Error)?.message || 'Error desconocido',
            ],
          }),
        },
      },
    },

    results: {
      entry: assign({ copySuccess: false }),
      on: {
        COPY_TO_CLIPBOARD: {
          target: 'copying',
        },
        CONVERT_COORDINATES: {
          target: 'converting',
        },
        SET_OUTPUT_FORMAT: {
          target: 'converting',
          actions: assign({
            outputFormat: ({ event }) => event.format,
          }),
        },
        RESET: {
          target: 'idle',
        },
      },
    },

    copying: {
      invoke: {
        src: fromPromise(async ({ input }) => {
          const csvData = formatForClipboard(
            input.convertedData,
            input.outputFormat
          )
          await navigator.clipboard.writeText(csvData)
        }),
        input: ({ context }) => context,
        onDone: {
          target: 'results',
          actions: assign({ copySuccess: true }),
        },
        onError: {
          target: 'results',
          actions: assign({
            errors: ({ context, event }) => [
              ...context.errors,
              (event.error as Error)?.message || 'Error desconocido',
            ],
          }),
        },
      },
    },

    error: {
      on: {
        RETRY: [
          {
            target: 'parsingData',
            guard: ({ context }) => context.rawData.length > 0,
          },
          {
            target: 'converting',
            guard: ({ context }) => {
              return (
                context.parsedData.length > 0 &&
                context.columnMapping.x !== null &&
                context.columnMapping.y !== null &&
                context.utmZone !== null &&
                context.hemisphere !== null
              )
            },
          },
          {
            target: 'idle',
          },
        ],
        CLEAR_ERRORS: {
          target: 'idle',
          actions: assign({ errors: [] }),
        },
        RESET: {
          target: 'idle',
        },
      },
    },
  },
})

// Funciones auxiliares
function detectAndRemoveHeaders(data: string[][]): string[][] {
  if (data.length === 0) return data

  // Lógica simple: si la primera fila contiene texto que no son números
  const firstRow = data[0]
  const hasNonNumericValues = firstRow.some(
    (cell) => isNaN(parseFloat(cell)) && !/^\d+\.?\d*$/.test(cell)
  )

  return hasNonNumericValues ? data.slice(1) : data
}

function convertUTMToLatLng(
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

function decimalToDMS(decimal: number, type: 'lat' | 'lng'): string {
  const abs = Math.abs(decimal)
  const degrees = Math.floor(abs)
  const minutes = Math.floor((abs - degrees) * 60)
  const seconds = ((abs - degrees) * 60 - minutes) * 60

  const direction =
    type === 'lat' ? (decimal >= 0 ? 'N' : 'S') : decimal >= 0 ? 'E' : 'W'

  return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`
}

function formatForClipboard(
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
