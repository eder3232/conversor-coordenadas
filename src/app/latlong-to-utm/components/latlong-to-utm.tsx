'use client'

import { useActor } from '@xstate/react'
import { useRef } from 'react'
import { latlongToUTMMachine } from '../store/latlong-to-utm-store'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function LatLongToUTMConverter() {
  const [state, send] = useActor(latlongToUTMMachine)
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

  const handleMapColumns = (latColumn: number, lngColumn: number) => {
    send({ type: 'MAP_COLUMNS', latColumn, lngColumn })
  }

  const handleSetUTMZone = (zone: number) => {
    send({ type: 'SET_UTM_ZONE', zone })
  }

  const handleSetOutputDatum = (datum: 'WGS84' | 'PSAD56') => {
    send({ type: 'SET_OUTPUT_DATUM', datum })
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
              Conversor LatLong a UTM
            </CardTitle>
            <CardDescription>
              Pega tus datos CSV/TSV con coordenadas LatLong para convertirlas a
              UTM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                ref={textareaRef}
                placeholder="Pega aquí tus datos CSV/TSV con coordenadas LatLong..."
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
      // Número de columnas detectadas
      const columns = context.parsedData[0]?.length || 0
      // Estado local para saber qué columna es lat y cuál es lng
      const selectedLat = context.columnMapping.lat
      const selectedLng = context.columnMapping.lng

      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Mapeo de Columnas</CardTitle>
            <CardDescription>
              Selecciona en los encabezados qué columna corresponde a Latitud y
              Longitud
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-lg border">
                <Table className="min-w-full text-xs font-mono">
                  <TableHeader>
                    <TableRow>
                      {Array.from({ length: columns }).map((_, colIdx) => (
                        <TableHead key={colIdx} className="p-2 bg-muted">
                          <Select
                            value={
                              selectedLat === colIdx
                                ? 'lat'
                                : selectedLng === colIdx
                                ? 'lng'
                                : undefined
                            }
                            onValueChange={(value) => {
                              if (value === 'lat') {
                                // Si otra columna ya era lat, la desasigna
                                handleMapColumns(
                                  colIdx,
                                  selectedLng === colIdx
                                    ? -1
                                    : selectedLng ?? -1
                                )
                              } else if (value === 'lng') {
                                // Si otra columna ya era lng, la desasigna
                                handleMapColumns(
                                  selectedLat === colIdx
                                    ? -1
                                    : selectedLat ?? -1,
                                  colIdx
                                )
                              } else {
                                // Si se selecciona "Sin asignar"
                                handleMapColumns(
                                  selectedLat === colIdx
                                    ? -1
                                    : selectedLat ?? -1,
                                  selectedLng === colIdx
                                    ? -1
                                    : selectedLng ?? -1
                                )
                              }
                            }}
                          >
                            <SelectTrigger className="border rounded px-1 py-0.5 text-xs h-6">
                              <SelectValue placeholder="Sin asignar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lat">Latitud</SelectItem>
                              <SelectItem value="lng">Longitud</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {context.parsedData.slice(0, 8).map((row, rowIdx) => (
                      <TableRow key={rowIdx}>
                        {row.map((cell, colIdx) => (
                          <TableCell
                            key={colIdx}
                            className="p-2 border-t text-center"
                          >
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {context.parsedData.length > 8 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    ... y {context.parsedData.length - 8} filas más
                  </div>
                )}
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
      // Verificar si todos los parámetros están configurados
      const allParametersConfigured = context.utmZone !== null

      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Configuración UTM</CardTitle>
            <CardDescription>
              Configura la zona UTM objetivo para la conversión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Zona UTM Objetivo
                  </label>
                  <Select
                    value={context.utmZone?.toString() || undefined}
                    onValueChange={(value) => handleSetUTMZone(parseInt(value))}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Selecciona zona" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => i + 1).map(
                        (zone) => (
                          <SelectItem key={zone} value={zone.toString()}>
                            Zona {zone}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Datum de Salida</label>
                  <Select
                    value={context.outputDatum}
                    onValueChange={(value) =>
                      handleSetOutputDatum(value as 'WGS84' | 'PSAD56')
                    }
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Selecciona datum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WGS84">WGS84</SelectItem>
                      <SelectItem value="PSAD56">PSAD56</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
                {allParametersConfigured && (
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
              Procesando {context.totalRows} filas de coordenadas LatLong...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Convirtiendo coordenadas LatLong a UTM...
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
                        X: {row.converted.x.toFixed(2)}, Y:{' '}
                        {row.converted.y.toFixed(2)}, Zona: {row.converted.zone}
                        {row.converted.hemisphere}, Datum: {row.converted.datum}
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
      {/* Contenido principal */}
      {renderCurrentState()}
    </div>
  )
}
