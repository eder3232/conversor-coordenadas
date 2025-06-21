import { assign, createMachine, fromPromise } from 'xstate'

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

export const utmConverterMachine = createMachine(
  {
    id: 'utmConverter',
    initial: 'idle',

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
    } as MachineContext,

    states: {
      idle: {
        entry: 'clearData',
        on: {
          PASTE_DATA: {
            target: 'dataInput',
            actions: 'assignRawData',
          },
        },
      },

      dataInput: {
        on: {
          PARSE_DATA: {
            target: 'parsingData',
          },
          PASTE_DATA: {
            actions: 'assignRawData',
          },
          RESET: {
            target: 'idle',
          },
        },
      },

      parsingData: {
        entry: 'setProcessing',
        exit: 'clearProcessing',
        invoke: {
          src: fromPromise(async ({ input }: { input: MachineContext }) => {
            // Simular procesamiento async
            await new Promise((resolve) => setTimeout(resolve, 100))

            const lines = input.rawData.trim().split('\n')
            const parsedData = lines.map((line: string) =>
              line
                .split(/\t|,|\s+/)
                .filter((cell: string) => cell.trim() !== '')
            )

            // Detectar y remover encabezados si existen
            const cleanedData = detectAndRemoveHeaders(parsedData)

            return {
              parsedData: cleanedData,
              totalRows: cleanedData.length,
            }
          }),
          onDone: {
            target: 'columnMapping',
            actions: 'assignParsedData',
          },
          onError: {
            target: 'error',
            actions: 'assignError',
          },
        },
      },

      columnMapping: {
        on: {
          MAP_COLUMNS: {
            target: 'parameterInput',
            actions: 'assignColumnMapping',
            guard: 'isValidColumnMapping',
          },
          RESET: {
            target: 'idle',
          },
        },
      },

      parameterInput: {
        on: {
          SET_UTM_ZONE: {
            actions: 'assignUTMZone',
          },
          SET_HEMISPHERE: {
            actions: 'assignHemisphere',
          },
          SET_OUTPUT_FORMAT: {
            target: 'readyToConvert',
            actions: 'assignOutputFormat',
            guard: 'areParametersValid',
          },
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
            actions: 'assignUTMZone',
          },
          SET_HEMISPHERE: {
            actions: 'assignHemisphere',
          },
          SET_OUTPUT_FORMAT: {
            actions: 'assignOutputFormat',
          },
          RESET: {
            target: 'idle',
          },
        },
      },

      converting: {
        entry: 'setProcessing',
        exit: 'clearProcessing',
        invoke: {
          src: fromPromise(async ({ input }: { input: MachineContext }) => {
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
                  utm: { x: 0, y: 0, zone: utmZone!, hemisphere: hemisphere! },
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
          onDone: {
            target: 'results',
            actions: 'assignConvertedData',
          },
          onError: {
            target: 'error',
            actions: 'assignError',
          },
        },
      },

      results: {
        entry: 'clearCopySuccess',
        on: {
          COPY_TO_CLIPBOARD: {
            target: 'copying',
          },
          CONVERT_COORDINATES: {
            target: 'converting',
          },
          SET_OUTPUT_FORMAT: {
            target: 'converting',
            actions: 'assignOutputFormat',
          },
          RESET: {
            target: 'idle',
          },
        },
      },

      copying: {
        invoke: {
          src: fromPromise(async ({ input }: { input: MachineContext }) => {
            const csvData = formatForClipboard(
              input.convertedData,
              input.outputFormat
            )
            await navigator.clipboard.writeText(csvData)
          }),
          onDone: {
            target: 'results',
            actions: 'setCopySuccess',
          },
          onError: {
            target: 'results',
            actions: 'assignError',
          },
        },
      },

      error: {
        on: {
          RETRY: [
            {
              target: 'parsingData',
              guard: 'canRetryParsing',
            },
            {
              target: 'converting',
              guard: 'canRetryConverting',
            },
            {
              target: 'idle',
            },
          ],
          CLEAR_ERRORS: {
            target: 'idle',
            actions: 'clearErrors',
          },
          RESET: {
            target: 'idle',
          },
        },
      },
    },
  },
  {
    actions: {
      clearData: assign({
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

      assignRawData: assign({
        rawData: ({ event }) => event.data,
        errors: [],
      }),

      assignParsedData: assign({
        parsedData: ({ event }) => event.output.parsedData,
        totalRows: ({ event }) => event.output.totalRows,
        errors: [],
      }),

      assignColumnMapping: assign({
        columnMapping: ({ event }) => ({
          x: event.xColumn,
          y: event.yColumn,
        }),
      }),

      assignUTMZone: assign({
        utmZone: ({ event }) => event.zone,
      }),

      assignHemisphere: assign({
        hemisphere: ({ event }) => event.hemisphere,
      }),

      assignOutputFormat: assign({
        outputFormat: ({ event }) => event.format,
      }),

      assignConvertedData: assign({
        convertedData: ({ event }) => event.output.convertedData,
        validRows: ({ event }) => event.output.validRows,
        errors: ({ event }) => event.output.errors || [],
      }),

      assignError: assign({
        errors: ({ context, event }) => [
          ...context.errors,
          event.error?.message || 'Error desconocido',
        ],
      }),

      clearErrors: assign({
        errors: [],
      }),

      setProcessing: assign({
        isProcessing: true,
      }),

      clearProcessing: assign({
        isProcessing: false,
      }),

      setCopySuccess: assign({
        copySuccess: true,
      }),

      clearCopySuccess: assign({
        copySuccess: false,
      }),
    },

    guards: {
      isValidColumnMapping: ({ event }: { event: any }) => {
        return (
          event.xColumn !== event.yColumn &&
          event.xColumn >= 0 &&
          event.yColumn >= 0
        )
      },

      areParametersValid: ({ context }: { context: MachineContext }) => {
        return (
          context.utmZone !== null &&
          context.utmZone >= 1 &&
          context.utmZone <= 60 &&
          context.hemisphere !== null
        )
      },

      canRetryParsing: ({ context }: { context: MachineContext }) => {
        return context.rawData.length > 0
      },

      canRetryConverting: ({ context }: { context: MachineContext }) => {
        return (
          context.parsedData.length > 0 &&
          context.columnMapping.x !== null &&
          context.columnMapping.y !== null &&
          context.utmZone !== null &&
          context.hemisphere !== null
        )
      },
    },
  }
)

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
  // Aquí iría la implementación real de conversión UTM a Lat/Lng
  // Por ahora retorno valores simulados
  const lat = 40.7128 + (Math.random() - 0.5) * 0.01
  const lng = -74.006 + (Math.random() - 0.5) * 0.01

  const result: LatLngCoordinate = { lat, lng }

  if (format === 'dms') {
    result.latDMS = decimalToDMS(lat, 'lat')
    result.lngDMS = decimalToDMS(lng, 'lng')
  }

  return result
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
