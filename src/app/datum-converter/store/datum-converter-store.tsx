import { assign, createMachine, fromPromise } from 'xstate'
import {
  UTMCoordinate,
  ConversionRow,
  convertUTMToUTM,
  detectAndRemoveHeaders,
  formatForClipboard,
} from '../utils'

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

  // Datums de conversión
  sourceDatum: 'WGS84' | 'PSAD56'
  targetDatum: 'WGS84' | 'PSAD56'

  // Resultados
  convertedData: ConversionRow[]

  // Estados de la aplicación
  errors: string[]
  isProcessing: boolean
  copySuccess: boolean

  // Metadatos
  totalRows: number
  validRows: number

  // Decimales para el clipboard
  clipboardDecimals: number
}

type MachineEvents =
  | { type: 'PASTE_DATA'; data: string }
  | { type: 'PARSE_DATA' }
  | { type: 'MAP_COLUMNS'; xColumn: number; yColumn: number }
  | { type: 'SET_UTM_ZONE'; zone: number }
  | { type: 'SET_HEMISPHERE'; hemisphere: 'N' | 'S' }
  | { type: 'SET_SOURCE_DATUM'; datum: 'WGS84' | 'PSAD56' }
  | { type: 'SET_TARGET_DATUM'; datum: 'WGS84' | 'PSAD56' }
  | { type: 'CONVERT_COORDINATES' }
  | { type: 'COPY_TO_CLIPBOARD' }
  | { type: 'RESET' }
  | { type: 'RETRY' }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_CLIPBOARD_DECIMALS'; decimals: number }

export const datumConverterMachine = createMachine({
  id: 'datumConverter',
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
    sourceDatum: 'WGS84',
    targetDatum: 'WGS84',
    convertedData: [],
    errors: [],
    isProcessing: false,
    copySuccess: false,
    totalRows: 0,
    validRows: 0,
    clipboardDecimals: 2,
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
        SET_SOURCE_DATUM: {
          actions: assign({
            sourceDatum: ({ event }) => event.datum,
          }),
        },
        SET_TARGET_DATUM: {
          actions: assign({
            targetDatum: ({ event }) => event.datum,
          }),
        },
        CONVERT_COORDINATES: {
          target: 'converting',
          guard: ({ context }) =>
            context.utmZone !== null &&
            context.hemisphere !== null &&
            context.sourceDatum !== context.targetDatum,
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
        SET_HEMISPHERE: {
          actions: assign({
            hemisphere: ({ event }) => event.hemisphere,
          }),
        },
        SET_SOURCE_DATUM: {
          actions: assign({
            sourceDatum: ({ event }) => event.datum,
          }),
        },
        SET_TARGET_DATUM: {
          actions: assign({
            targetDatum: ({ event }) => event.datum,
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
              // Extraer coordenadas UTM de las columnas mapeadas
              const x = parseFloat(row[input.columnMapping.x!])
              const y = parseFloat(row[input.columnMapping.y!])

              if (isNaN(x) || isNaN(y)) {
                throw new Error('Coordenadas UTM inválidas')
              }

              const utm: UTMCoordinate = {
                x,
                y,
                zone: input.utmZone!,
                hemisphere: input.hemisphere!,
                datum: input.sourceDatum,
              }

              console.log('Coordenadas UTM originales:', utm)
              console.log('Datum destino:', input.targetDatum)

              // Convertir coordenadas UTM a UTM con diferente datum
              const converted = convertUTMToUTM(utm, input.targetDatum)

              console.log('Coordenadas UTM convertidas:', converted)

              convertedData.push({
                original: row,
                utm,
                converted,
              })

              validRows++
            } catch (error) {
              console.error('Error en conversión:', error)
              convertedData.push({
                original: row,
                utm: {
                  x: 0,
                  y: 0,
                  zone: input.utmZone!,
                  hemisphere: input.hemisphere!,
                  datum: input.sourceDatum,
                },
                converted: {
                  x: 0,
                  y: 0,
                  zone: input.utmZone!,
                  hemisphere: input.hemisphere!,
                  datum: input.targetDatum,
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
        SET_SOURCE_DATUM: {
          actions: assign({
            sourceDatum: ({ event }) => event.datum,
          }),
        },
        SET_TARGET_DATUM: {
          actions: assign({
            targetDatum: ({ event }) => event.datum,
          }),
        },
        SET_CLIPBOARD_DECIMALS: {
          actions: assign({
            clipboardDecimals: ({ event }) => event.decimals,
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
            input.targetDatum,
            input.clipboardDecimals
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
