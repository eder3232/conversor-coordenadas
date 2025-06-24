# Plan de Implementación: UI del Conversor UTM a LatLong

## Resumen

Este documento describe el plan para implementar la interfaz de usuario del conversor de coordenadas UTM a LatLong utilizando la máquina de estados XState ya creada.

## Arquitectura de la Máquina de Estados

### Estados Principales:

1. **`idle`** - Estado inicial, esperando datos
2. **`dataInput`** - Datos pegados, listos para procesar
3. **`parsingData`** - Procesando y parseando datos
4. **`columnMapping`** - Seleccionando columnas X e Y
5. **`parameterInput`** - Configurando zona UTM y hemisferio
6. **`readyToConvert`** - Listo para convertir
7. **`converting`** - Procesando conversión
8. **`results`** - Mostrando resultados
9. **`copying`** - Copiando al portapapeles
10. **`error`** - Estado de error

## Plan de Implementación

### Fase 1: Configuración Base del Proyecto

- [x] Verificar dependencias de shadcn/ui instaladas
- [x] Configurar componentes base necesarios
- [x] Crear estructura de carpetas para componentes

### Fase 2: Componentes de UI Base

#### 2.1 Componente Principal de Conversión

**Archivo:** `src/app/utm-to-latlong/components/UTMConverter.tsx`

- [x] Crear componente principal que use `useActor` de XState
- [x] Implementar renderizado condicional basado en el estado actual
- [x] Agregar manejo de eventos de la máquina

#### 2.2 Componente de Entrada de Datos

**Archivo:** `src/app/utm-to-latlong/components/DataInput.tsx`

- [x] Textarea para pegar datos CSV/TSV (implementado en UTMConverter.tsx)
- [x] Botón "Procesar Datos" (implementado en UTMConverter.tsx)
- [x] Validación básica de formato (implementado en UTMConverter.tsx)
- [x] Indicador de estado de carga (implementado en UTMConverter.tsx)

#### 2.3 Componente de Mapeo de Columnas

**Archivo:** `src/app/utm-to-latlong/components/ColumnMapping.tsx`

- [x] Tabla de vista previa de datos parseados (implementado en UTMConverter.tsx)
- [x] Selectores para columnas X e Y (implementado en UTMConverter.tsx)
- [x] Validación de selección (implementado en UTMConverter.tsx)
- [x] Botón "Continuar" (implementado en UTMConverter.tsx)

#### 2.4 Componente de Configuración UTM

**Archivo:** `src/app/utm-to-latlong/components/UTMConfig.tsx`

- [x] Selector de zona UTM (1-60) (implementado en UTMConverter.tsx)
- [x] Selector de hemisferio (N/S) (implementado en UTMConverter.tsx)
- [x] Selector de formato de salida (Decimal/DMS) (implementado en UTMConverter.tsx)
- [x] Validación de parámetros (implementado en UTMConverter.tsx)

#### 2.5 Componente de Resultados

**Archivo:** `src/app/utm-to-latlong/components/Results.tsx`

- [x] Tabla de resultados con datos originales y convertidos (implementado en UTMConverter.tsx)
- [x] Estadísticas (filas válidas, errores) (implementado en UTMConverter.tsx)
- [x] Botón "Copiar al Portapapeles" (implementado en UTMConverter.tsx)
- [x] Botón "Nueva Conversión" (implementado en UTMConverter.tsx)

#### 2.6 Componente de Errores

**Archivo:** `src/app/utm-to-latlong/components/ErrorDisplay.tsx`

- [x] Lista de errores con detalles (implementado en UTMConverter.tsx)
- [x] Botón "Reintentar" (implementado en UTMConverter.tsx)
- [x] Botón "Limpiar Errores" (implementado en UTMConverter.tsx)

### Fase 3: Componentes de UI Auxiliares

#### 3.1 Componente de Estado de Carga

**Archivo:** `src/app/utm-to-latlong/components/LoadingState.tsx`

- [x] Spinner con mensaje contextual (implementado en UTMConverter.tsx)
- [x] Barra de progreso para operaciones largas (implementado en UTMConverter.tsx)

#### 3.2 Componente de Vista Previa de Datos

**Archivo:** `src/app/utm-to-latlong/components/DataPreview.tsx`

- [x] Tabla con scroll para datos grandes (implementado en UTMConverter.tsx)
- [x] Resaltado de columnas seleccionadas (implementado en UTMConverter.tsx)
- [x] Información de filas totales (implementado en UTMConverter.tsx)

#### 3.3 Componente de Estadísticas

**Archivo:** `src/app/utm-to-latlong/components/Stats.tsx`

- [x] Cards con métricas de conversión (implementado en UTMConverter.tsx)
- [x] Indicadores de éxito/error (implementado en UTMConverter.tsx)

### Fase 4: Integración y Lógica de Negocio

#### 4.1 Hook Personalizado

**Archivo:** `src/app/utm-to-latlong/hooks/useUTMConverter.ts`

- [ ] Hook que encapsule la lógica de la máquina
- [ ] Métodos helper para eventos
- [ ] Estado derivado para UI

#### 4.2 Utilidades de Formato

**Archivo:** `src/app/utm-to-latlong/utils/formatters.ts`

- [x] Formateo de coordenadas decimales (implementado en utm-to-latlong-store.tsx)
- [x] Formateo de coordenadas DMS (implementado en utm-to-latlong-store.tsx)
- [x] Formateo para CSV/TSV (implementado en utm-to-latlong-store.tsx)

### Fase 5: Página Principal

#### 5.1 Layout de la Página

**Archivo:** `src/app/utm-to-latlong/page.tsx`

- [x] Integrar todos los componentes
- [x] Layout responsivo con Tailwind
- [x] Navegación entre estados
- [x] Manejo de errores global

### Fase 6: Mejoras de UX

#### 6.1 Feedback Visual

- [x] Transiciones suaves entre estados (implementado con renderizado condicional)
- [x] Animaciones de carga (implementado con Loader2 y Progress)
- [x] Indicadores de progreso (implementado con Progress component)
- [x] Mensajes de confirmación (implementado con Alert y Badge)

#### 6.2 Accesibilidad

- [ ] ARIA labels apropiados
- [ ] Navegación por teclado
- [ ] Contraste de colores
- [ ] Mensajes de error claros

#### 6.3 Responsividad

- [x] Diseño mobile-first (implementado con Tailwind responsive classes)
- [x] Tablas con scroll horizontal (implementado con overflow-x-auto)
- [x] Componentes adaptativos (implementado con grid y flex responsive)

### Fase 7: Testing y Optimización

#### 7.1 Testing

- [ ] Tests unitarios para componentes
- [ ] Tests de integración para la máquina
- [ ] Tests de accesibilidad

#### 7.2 Optimización

- [ ] Lazy loading de componentes pesados
- [ ] Memoización de cálculos costosos
- [ ] Optimización de re-renders

## Estructura de Archivos Final

```

```
