'use client'

import { useActor } from '@xstate/react'
import { useRef } from 'react'
import { utmConverterMachine } from '../store/utm-to-latlong-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  AlertCircle,
  Copy,
  RotateCcw,
  Upload,
  CheckCircle,
  Loader2,
} from 'lucide-react'

export function UTMConverter() {
  const [state, send] = useActor(utmConverterMachine)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Estados derivados para facilitar el renderizado
  const isIdle = state.matches('idle')
  const isDataInput = state.matches('dataInput')
  const isParsingData = state.matches('parsingData')
  const isColumnMapping = state.matches('columnMapping')
  const isParameterInput = state.matches('parameterInput')
  const isReadyToConvert = state.matches('readyToConvert')
  const isConverting = state.matches('converting')
  const isResults = state.matches('results')
  const isCopying = state.matches('copying')
  const isError = state.matches('error')

  // Contexto de la máquina
  const context = state.context

  // Handlers de eventos
  const handlePasteData = (data: string) => {
    send({ type: 'PASTE_DATA', data })
  }

  const handleParseData = () => {
    send({ type: 'PARSE_DATA' })
  }

  const handleMapColumns = (xColumn: number, yColumn: number) => {
    send({ type: 'MAP_COLUMNS', xColumn, yColumn })
  }

  const handleSetUTMZone = (zone: number) => {
    send({ type: 'SET_UTM_ZONE', zone })
  }

  const handleSetHemisphere = (hemisphere: 'N' | 'S') => {
    send({ type: 'SET_HEMISPHERE', hemisphere })
  }

  const handleSetOutputFormat = (format: 'decimal' | 'dms') => {
    send({ type: 'SET_OUTPUT_FORMAT', format })
  }

  const handleConvertCoordinates = () => {
    send({ type: 'CONVERT_COORDINATES' })
  }

  const handleCopyToClipboard = () => {
    send({ type: 'COPY_TO_CLIPBOARD' })
  }

  const handleReset = () => {
    send({ type: 'RESET' })
  }

  const handleRetry = () => {
    send({ type: 'RETRY' })
  }

  const handleClearErrors = () => {
    send({ type: 'CLEAR_ERRORS' })
  }

  // Renderizado del estado actual
  const renderCurrentState = () => {
    if (isIdle) {
      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Conversor UTM a LatLong
            </CardTitle>
            <CardDescription>
              Pega tus datos CSV/TSV con coordenadas UTM para convertirlas a
              LatLong
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                ref={textareaRef}
                placeholder="Pega aquí tus datos CSV/TSV con coordenadas UTM..."
                className="min-h-[200px]"
                value={context.rawData}
                onChange={(e) => handlePasteData(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleParseData}
                  disabled={!context.rawData.trim()}
                  className="w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Procesar Datos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (isDataInput) {
      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Datos Ingresados
            </CardTitle>
            <CardDescription>
              Revisa tus datos y procede con el procesamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={context.rawData}
                onChange={(e) => handlePasteData(e.target.value)}
                className="min-h-[200px]"
                placeholder="Modifica los datos si es necesario..."
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
                <Button onClick={handleParseData}>
                  <Upload className="h-4 w-4 mr-2" />
                  Procesar Datos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (isParsingData) {
      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Procesando Datos
            </CardTitle>
            <CardDescription>
              Analizando y parseando los datos ingresados...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={50} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Detectando formato y estructura de datos...
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (isColumnMapping) {
      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Mapeo de Columnas</CardTitle>
            <CardDescription>
              Selecciona las columnas que contienen las coordenadas X e Y
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Vista Previa de Datos</h4>
                <div className="text-sm text-muted-foreground">
                  {context.totalRows} filas detectadas
                </div>
                {context.parsedData.slice(0, 5).map((row, index) => (
                  <div key={index} className="text-xs font-mono mt-1">
                    {row.join(' | ')}
                  </div>
                ))}
                {context.parsedData.length > 5 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    ... y {context.parsedData.length - 5} filas más
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Columna X (Este)
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    onChange={(e) => {
                      const xColumn = parseInt(e.target.value)
                      if (context.columnMapping.y !== null) {
                        handleMapColumns(xColumn, context.columnMapping.y)
                      }
                    }}
                  >
                    <option value="">Selecciona columna X</option>
                    {context.parsedData[0]?.map((_, index) => (
                      <option key={index} value={index}>
                        Columna {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Columna Y (Norte)
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    onChange={(e) => {
                      const yColumn = parseInt(e.target.value)
                      if (context.columnMapping.x !== null) {
                        handleMapColumns(context.columnMapping.x, yColumn)
                      }
                    }}
                  >
                    <option value="">Selecciona columna Y</option>
                    {context.parsedData[0]?.map((_, index) => (
                      <option key={index} value={index}>
                        Columna {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (isParameterInput || isReadyToConvert) {
      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Configuración UTM</CardTitle>
            <CardDescription>
              Configura los parámetros de la zona UTM para la conversión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Zona UTM</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={context.utmZone || ''}
                    onChange={(e) => handleSetUTMZone(parseInt(e.target.value))}
                  >
                    <option value="">Selecciona zona</option>
                    {Array.from({ length: 60 }, (_, i) => i + 1).map((zone) => (
                      <option key={zone} value={zone}>
                        Zona {zone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Hemisferio</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={context.hemisphere || ''}
                    onChange={(e) =>
                      handleSetHemisphere(e.target.value as 'N' | 'S')
                    }
                  >
                    <option value="">Selecciona hemisferio</option>
                    <option value="N">Norte (N)</option>
                    <option value="S">Sur (S)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Formato de Salida
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={context.outputFormat}
                    onChange={(e) =>
                      handleSetOutputFormat(e.target.value as 'decimal' | 'dms')
                    }
                  >
                    <option value="decimal">Decimal</option>
                    <option value="dms">Grados, Minutos, Segundos</option>
                  </select>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
                {isReadyToConvert && (
                  <Button onClick={handleConvertCoordinates}>
                    <Upload className="h-4 w-4 mr-2" />
                    Convertir Coordenadas
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (isConverting) {
      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Convirtiendo Coordenadas
            </CardTitle>
            <CardDescription>
              Procesando {context.totalRows} filas de coordenadas UTM...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Convirtiendo coordenadas UTM a LatLong...
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (isResults) {
      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Conversión Completada
            </CardTitle>
            <CardDescription>
              {context.validRows} de {context.totalRows} filas convertidas
              exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">
                    {context.validRows}
                  </div>
                  <div className="text-sm text-green-700">
                    Conversiones Exitosas
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-red-600">
                    {context.totalRows - context.validRows}
                  </div>
                  <div className="text-sm text-red-700">Errores</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">
                    {context.totalRows}
                  </div>
                  <div className="text-sm text-blue-700">Total de Filas</div>
                </div>
              </div>

              {/* Vista previa de resultados */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Vista Previa de Resultados</h4>
                <div className="text-xs font-mono space-y-1">
                  {context.convertedData.slice(0, 3).map((row, index) => (
                    <div key={index} className="flex gap-4">
                      <span className="text-muted-foreground">
                        Fila {index + 1}:
                      </span>
                      <span>
                        {context.outputFormat === 'decimal'
                          ? `${row.converted.lat.toFixed(
                              6
                            )}, ${row.converted.lng.toFixed(6)}`
                          : `${row.converted.latDMS}, ${row.converted.lngDMS}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Nueva Conversión
                </Button>
                <Button onClick={handleCopyToClipboard} disabled={isCopying}>
                  {isCopying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Copiando...
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar al Portapapeles
                    </>
                  )}
                </Button>
              </div>

              {/* Mensaje de éxito al copiar */}
              {context.copySuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Datos copiados al portapapeles exitosamente
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }

    if (isError) {
      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error en la Conversión
            </CardTitle>
            <CardDescription>
              Se encontraron errores durante el procesamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {context.errors.length > 0
                    ? context.errors[0]
                    : 'Error desconocido'}
                </AlertDescription>
              </Alert>

              {context.errors.length > 1 && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">
                    Todos los errores:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {context.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClearErrors}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpiar Errores
                </Button>
                <Button onClick={handleRetry}>
                  <Upload className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header con estado actual */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conversor UTM a LatLong</h1>
          <p className="text-muted-foreground">
            Convierte coordenadas UTM a formato LatLong
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          {state.value as string}
        </Badge>
      </div>

      <Separator />

      {/* Contenido principal */}
      {renderCurrentState()}
    </div>
  )
}
