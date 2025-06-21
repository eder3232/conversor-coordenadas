/**
 * Configuración de componentes shadcn/ui para el conversor UTM a LatLong
 * Este archivo documenta qué componentes están disponibles y cómo se usarán
 */

export const COMPONENTS_CONFIG = {
  // Componentes principales que usaremos
  main: {
    card: 'src/components/ui/card.tsx',
    button: 'src/components/ui/button.tsx',
    textarea: 'src/components/ui/textarea.tsx',
    select: 'src/components/ui/select.tsx',
    table: 'src/components/ui/table.tsx',
    badge: 'src/components/ui/badge.tsx',
    alert: 'src/components/ui/alert.tsx',
    progress: 'src/components/ui/progress.tsx',
    tabs: 'src/components/ui/tabs.tsx',
    toast: 'src/components/ui/sonner.tsx', // Sonner para notificaciones
  },

  // Componentes auxiliares
  auxiliary: {
    input: 'src/components/ui/input.tsx',
    label: 'src/components/ui/label.tsx',
    separator: 'src/components/ui/separator.tsx',
    skeleton: 'src/components/ui/skeleton.tsx',
    tooltip: 'src/components/ui/tooltip.tsx',
    scrollArea: 'src/components/ui/scroll-area.tsx',
  },

  // Componentes de navegación (si es necesario)
  navigation: {
    breadcrumb: 'src/components/ui/breadcrumb.tsx',
    navigationMenu: 'src/components/ui/navigation-menu.tsx',
  },
} as const

/**
 * Mapeo de componentes por funcionalidad
 */
export const COMPONENT_USAGE = {
  // Entrada de datos
  dataInput: ['textarea', 'button', 'card', 'alert'],

  // Mapeo de columnas
  columnMapping: ['table', 'select', 'button', 'card', 'badge'],

  // Configuración UTM
  utmConfig: ['select', 'button', 'card', 'label'],

  // Resultados
  results: ['table', 'button', 'card', 'badge', 'progress'],

  // Estados de carga
  loading: ['skeleton', 'progress', 'card'],

  // Errores
  errors: ['alert', 'button', 'card'],

  // Notificaciones
  notifications: ['toast'],
} as const

/**
 * Configuración de colores y temas
 */
export const THEME_CONFIG = {
  colors: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
  },

  spacing: {
    container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-8',
    card: 'p-6',
  },
} as const
