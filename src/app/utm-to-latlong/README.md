# Conversor UTM a LatLong

## Descripción

Este módulo implementa un conversor de coordenadas UTM (Universal Transverse Mercator) a coordenadas LatLong (Latitud/Longitud) con una interfaz de usuario moderna y una máquina de estados robusta.

## Estructura del Proyecto

```
src/app/utm-to-latlong/
├── README.md                    # Este archivo
├── page.tsx                     # Página principal
├── store/
│   └── utm-to-latlong-store.tsx # Máquina de estados XState
├── components/                  # Componentes de UI
├── hooks/                       # Hooks personalizados
├── utils/                       # Utilidades y helpers
├── types/                       # Definiciones de tipos TypeScript
├── constants/                   # Constantes del proyecto
└── config/                      # Configuración de componentes
```

## Arquitectura

### Máquina de Estados

La aplicación utiliza XState v5 para manejar el flujo de conversión:

- **`idle`** → Estado inicial
- **`dataInput`** → Entrada de datos
- **`parsingData`** → Procesamiento de datos
- **`columnMapping`** → Selección de columnas
- **`parameterInput`** → Configuración UTM
- **`readyToConvert`** → Listo para convertir
- **`converting`** → Procesando conversión
- **`results`** → Mostrando resultados
- **`copying`** → Copiando al portapapeles
- **`error`** → Estado de error

### Componentes de UI

Utilizamos shadcn/ui para los componentes base:

#### Componentes Principales

- `Card` - Contenedores de secciones
- `Button` - Acciones del usuario
- `Textarea` - Entrada de datos CSV/TSV
- `Select` - Selectores de configuración
- `Table` - Visualización de datos y resultados
- `Badge` - Indicadores de estado
- `Alert` - Mensajes de error
- `Progress` - Indicadores de progreso
- `Tabs` - Organización de vistas
- `Toast` - Notificaciones

#### Componentes Auxiliares

- `Input` - Campos de entrada
- `Label` - Etiquetas de formularios
- `Separator` - Separadores visuales
- `Skeleton` - Estados de carga
- `Tooltip` - Información contextual
- `ScrollArea` - Áreas con scroll

## Configuración

### Tipos TypeScript

Los tipos están definidos en `types/index.ts` e incluyen:

- Interfaces para coordenadas UTM y LatLong
- Tipos para datos de conversión
- Props para componentes
- Configuraciones de exportación

### Constantes

Las constantes están en `constants/index.ts`:

- Configuración de zonas UTM (1-60)
- Formatos de salida (Decimal/DMS)
- Límites de datos
- Mensajes de error y éxito
- Configuración de UI y rendimiento

### Configuración de Componentes

La configuración de shadcn/ui está en `config/components-config.ts`:

- Mapeo de componentes por funcionalidad
- Configuración de temas y colores
- Uso recomendado de componentes

## Flujo de Trabajo

1. **Entrada de Datos**

   - Usuario pega datos CSV/TSV
   - Validación de formato
   - Parseo de datos

2. **Mapeo de Columnas**

   - Vista previa de datos
   - Selección de columnas X e Y
   - Validación de selección

3. **Configuración UTM**

   - Selección de zona UTM (1-60)
   - Selección de hemisferio (N/S)
   - Formato de salida (Decimal/DMS)

4. **Conversión**

   - Procesamiento de coordenadas
   - Manejo de errores
   - Generación de resultados

5. **Resultados**
   - Visualización de datos convertidos
   - Estadísticas de conversión
   - Exportación de resultados

## Características

### ✅ Implementado

- [x] Máquina de estados XState v5
- [x] Estructura de carpetas
- [x] Tipos TypeScript
- [x] Constantes y configuración
- [x] Documentación base

### 🚧 En Desarrollo

- [ ] Componentes de UI
- [ ] Hook personalizado
- [ ] Utilidades de formato
- [ ] Página principal

### 📋 Pendiente

- [ ] Testing
- [ ] Optimización
- [ ] Accesibilidad
- [ ] Responsividad

## Uso

### Instalación de Dependencias

```bash
pnpm install
```

### Desarrollo

```bash
pnpm dev
```

### Construcción

```bash
pnpm build
```

## Tecnologías

- **Next.js 15** - Framework de React
- **XState v5** - Máquina de estados
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Estilos
- **TypeScript** - Tipado estático

## Contribución

1. Sigue la estructura de carpetas establecida
2. Usa los tipos TypeScript definidos
3. Implementa componentes con shadcn/ui
4. Mantén la consistencia con la máquina de estados
5. Documenta cambios importantes

## Licencia

Este proyecto es parte del conversor de coordenadas y sigue las mismas políticas de licencia.
