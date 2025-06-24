import { assign, createMachine, fromPromise } from 'xstate'
import {
  convertLatLngToUTM,
  detectAndRemoveHeaders,
  formatForClipboard,
  LatLngCoordinate,
  UTMCoordinate,
  ConversionRow,
} from '../utils'

interface MachineContext {
  // Datos de entrada
  rawData: string
  parsedData: string[][]

  // Configuración de columnas
  columnMapping: {
    lat: number | null
    lng: number | null
  }

  // Parámetros UTM
  utmZone: number | null

  // Datum de salida
  outputDatum: 'WGS84' | 'PSAD56'

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
  | { type: 'MAP_COLUMNS'; latColumn: number; lngColumn: number }
  | { type: 'SET_UTM_ZONE'; zone: number }
  | { type: 'SET_OUTPUT_DATUM'; datum: 'WGS84' | 'PSAD56' }
  | { type: 'CONVERT_COORDINATES' }
  | { type: 'COPY_TO_CLIPBOARD' }
  | { type: 'RESET' }
  | { type: 'RETRY' }
  | { type: 'CLEAR_ERRORS' }

export const latlongToUTMMachine = createMachine({
  id: 'latlongToUTMConverter',
  initial: 'idle',
  types: {} as {
    context: MachineContext
    events: MachineEvents
  },

  context: {
    rawData: '',
    parsedData: [],
    columnMapping: { lat: null, lng: null },
    utmZone: null,
    outputDatum: 'WGS84',
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
        columnMapping: { lat: null, lng: null },
        utmZone: null,
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
                lat: event.latColumn,
                lng: event.lngColumn,
              }),
            }),
            guard: ({ event }) =>
              event.latColumn !== event.lngColumn &&
              event.latColumn !== null &&
              event.lngColumn !== null &&
              event.latColumn >= 0 &&
              event.lngColumn >= 0,
          },
          {
            actions: assign({
              columnMapping: ({ event }) => ({
                lat: event.latColumn,
                lng: event.lngColumn,
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
        SET_OUTPUT_DATUM: {
          actions: assign({
            outputDatum: ({ event }) => event.datum,
          }),
        },
        CONVERT_COORDINATES: {
          target: 'converting',
          guard: ({ context }) => context.utmZone !== null,
        },
        RESET: {
          target: 'idle',
        },
      },
    },

    readyToConvert: {
      on: {
        SET_UTM_ZONE: {
          actions: assign({
            utmZone: ({ event }) => event.zone,
          }),
        },
        SET_OUTPUT_DATUM: {
          actions: assign({
            outputDatum: ({ event }) => event.datum,
          }),
        },
        CONVERT_COORDINATES: {
          target: 'converting',
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
          // Simular procesamiento async
          await new Promise((resolve) => setTimeout(resolve, 200))

          console.log('maquina de estado converting')
          console.log(input)

          const convertedData: ConversionRow[] = []
          let validRows = 0

          for (const row of input.parsedData) {
            try {
              // Extraer coordenadas LatLong de las columnas mapeadas
              const lat = parseFloat(row[input.columnMapping.lat!])
              const lng = parseFloat(row[input.columnMapping.lng!])

              if (isNaN(lat) || isNaN(lng)) {
                throw new Error('Coordenadas LatLong inválidas')
              }

              const latlng: LatLngCoordinate = {
                lat,
                lng,
              }

              // Convertir coordenadas
              const converted = convertLatLngToUTM(
                latlng,
                input.utmZone!,
                input.outputDatum
              )

              convertedData.push({
                original: row,
                latlng,
                converted,
              })

              validRows++
            } catch (error) {
              convertedData.push({
                original: row,
                latlng: { lat: 0, lng: 0 },
                converted: {
                  x: 0,
                  y: 0,
                  zone: input.utmZone!,
                  hemisphere: 'N',
                  datum: input.outputDatum,
                },
                error: (error as Error)?.message || 'Error desconocido',
              })
            }
          }

          return {
            convertedData,
            validRows,
          }
        }),
        input: ({ context }) => context,
        onDone: {
          target: 'results',
          actions: assign({
            convertedData: ({ event }) => event.output.convertedData,
            validRows: ({ event }) => event.output.validRows,
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

    results: {
      entry: assign({ copySuccess: false }),
      on: {
        COPY_TO_CLIPBOARD: {
          target: 'copying',
        },
        CONVERT_COORDINATES: {
          target: 'converting',
        },
        SET_OUTPUT_DATUM: {
          target: 'converting',
          actions: assign({
            outputDatum: ({ event }) => event.datum,
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
            input.outputDatum
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
                context.columnMapping.lat !== null &&
                context.columnMapping.lng !== null &&
                context.utmZone !== null
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
