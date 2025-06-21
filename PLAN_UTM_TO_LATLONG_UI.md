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

- [ ] Verificar dependencias de shadcn/ui instaladas
- [ ] Configurar componentes base necesarios
- [ ] Crear estructura de carpetas para componentes

### Fase 2: Componentes de UI Base

#### 2.1 Componente Principal de Conversión

**Archivo:** `src/app/utm-to-latlong/components/UTMConverter.tsx`

- [ ] Crear componente principal que use `useActor` de XState
- [ ] Implementar renderizado condicional basado en el estado actual
- [ ] Agregar manejo de eventos de la máquina

#### 2.2 Componente de Entrada de Datos

**Archivo:** `src/app/utm-to-latlong/components/DataInput.tsx`

- [ ] Textarea para pegar datos CSV/TSV
- [ ] Botón "Procesar Datos"
- [ ] Validación básica de formato
- [ ] Indicador de estado de carga

#### 2.3 Componente de Mapeo de Columnas

**Archivo:** `src/app/utm-to-latlong/components/ColumnMapping.tsx`

- [ ] Tabla de vista previa de datos parseados
- [ ] Selectores para columnas X e Y
- [ ] Validación de selección
- [ ] Botón "Continuar"

#### 2.4 Componente de Configuración UTM

**Archivo:** `src/app/utm-to-latlong/components/UTMConfig.tsx`

- [ ] Selector de zona UTM (1-60)
- [ ] Selector de hemisferio (N/S)
- [ ] Selector de formato de salida (Decimal/DMS)
- [ ] Validación de parámetros

#### 2.5 Componente de Resultados

**Archivo:** `src/app/utm-to-latlong/components/Results.tsx`

- [ ] Tabla de resultados con datos originales y convertidos
- [ ] Estadísticas (filas válidas, errores)
- [ ] Botón "Copiar al Portapapeles"
- [ ] Botón "Nueva Conversión"

#### 2.6 Componente de Errores

**Archivo:** `src/app/utm-to-latlong/components/ErrorDisplay.tsx`

- [ ] Lista de errores con detalles
- [ ] Botón "Reintentar"
- [ ] Botón "Limpiar Errores"

### Fase 3: Componentes de UI Auxiliares

#### 3.1 Componente de Estado de Carga

**Archivo:** `src/app/utm-to-latlong/components/LoadingState.tsx`

- [ ] Spinner con mensaje contextual
- [ ] Barra de progreso para operaciones largas

#### 3.2 Componente de Vista Previa de Datos

**Archivo:** `src/app/utm-to-latlong/components/DataPreview.tsx`

- [ ] Tabla con scroll para datos grandes
- [ ] Resaltado de columnas seleccionadas
- [ ] Información de filas totales

#### 3.3 Componente de Estadísticas

**Archivo:** `src/app/utm-to-latlong/components/Stats.tsx`

- [ ] Cards con métricas de conversión
- [ ] Indicadores de éxito/error

### Fase 4: Integración y Lógica de Negocio

#### 4.1 Hook Personalizado

**Archivo:** `src/app/utm-to-latlong/hooks/useUTMConverter.ts`

- [ ] Hook que encapsule la lógica de la máquina
- [ ] Métodos helper para eventos
- [ ] Estado derivado para UI

#### 4.2 Utilidades de Formato

**Archivo:** `src/app/utm-to-latlong/utils/formatters.ts`

- [ ] Formateo de coordenadas decimales
- [ ] Formateo de coordenadas DMS
- [ ] Formateo para CSV/TSV

### Fase 5: Página Principal

#### 5.1 Layout de la Página

**Archivo:** `src/app/utm-to-latlong/page.tsx`

- [ ] Integrar todos los componentes
- [ ] Layout responsivo con Tailwind
- [ ] Navegación entre estados
- [ ] Manejo de errores global

### Fase 6: Mejoras de UX

#### 6.1 Feedback Visual

- [ ] Transiciones suaves entre estados
- [ ] Animaciones de carga
- [ ] Indicadores de progreso
- [ ] Mensajes de confirmación

#### 6.2 Accesibilidad

- [ ] ARIA labels apropiados
- [ ] Navegación por teclado
- [ ] Contraste de colores
- [ ] Mensajes de error claros

#### 6.3 Responsividad

- [ ] Diseño mobile-first
- [ ] Tablas con scroll horizontal
- [ ] Componentes adaptativos

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
src/app/utm-to-latlong/
├── page.tsx                          # Página principal
├── store/
│   └── utm-to-latlong-store.tsx      # Máquina de estados (ya creada)
├── components/
│   ├── UTMConverter.tsx              # Componente principal
│   ├── DataInput.tsx                 # Entrada de datos
│   ├── ColumnMapping.tsx             # Mapeo de columnas
│   ├── UTMConfig.tsx                 # Configuración UTM
│   ├── Results.tsx                   # Resultados
│   ├── ErrorDisplay.tsx              # Manejo de errores
│   ├── LoadingState.tsx              # Estados de carga
│   ├── DataPreview.tsx               # Vista previa de datos
│   └── Stats.tsx                     # Estadísticas
├── hooks/
│   └── useUTMConverter.ts            # Hook personalizado
└── utils/
    └── formatters.ts                 # Utilidades de formato
```

## Componentes shadcn/ui a Utilizar

- **Card** - Para contenedores de secciones
- **Button** - Para todas las acciones
- **Textarea** - Para entrada de datos
- **Select** - Para selectores de columnas y configuraciones
- **Table** - Para mostrar datos y resultados
- **Badge** - Para indicadores de estado
- **Alert** - Para mensajes de error
- **Progress** - Para indicadores de progreso
- **Tabs** - Para organizar diferentes vistas
- **Toast** - Para notificaciones

## Consideraciones Técnicas

### Performance

- Usar `React.memo` para componentes pesados
- Implementar virtualización para tablas grandes
- Debounce en inputs de texto

### Estado

- La máquina de estados maneja toda la lógica de negocio
- Componentes solo manejan UI y eventos
- Estado local mínimo en componentes

### Error Handling

- Errores capturados en la máquina de estados
- UI muestra errores de forma amigable
- Opciones de recuperación claras

## Próximos Pasos

1. **Inmediato**: Crear el componente principal `UTMConverter.tsx`
2. **Corto plazo**: Implementar componentes de entrada de datos
3. **Mediano plazo**: Completar todos los componentes de UI
4. **Largo plazo**: Testing y optimización

## Métricas de Éxito

- [ ] Conversión exitosa de archivos CSV/TSV
- [ ] UI responsiva en todos los dispositivos
- [ ] Tiempo de respuesta < 2 segundos
- [ ] 0 errores de accesibilidad
- [ ] Cobertura de tests > 80%
