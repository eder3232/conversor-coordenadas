import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  MapPin,
  Copy,
  ArrowRight,
  Zap,
  Shield,
  Download,
  FileSpreadsheet,
  MousePointerClick,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Conversor de Coordenadas
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convierte múltiples coordenadas de forma masiva desde Excel. Copia,
            pega y obtén resultados instantáneos con conversiones precisas.
          </p>
        </div>
      </section>

      {/* Características principales */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">LatLong → UTM</CardTitle>
              <CardDescription>
                Convierte coordenadas de latitud y longitud a formato UTM
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/latlong-to-utm">
                <Button className="w-full group-hover:bg-blue-600 transition-colors">
                  Usar Conversor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">UTM → LatLong</CardTitle>
              <CardDescription>
                Convierte coordenadas UTM a latitud y longitud
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/utm-to-latlong">
                <Button className="w-full group-hover:bg-green-600 transition-colors">
                  Usar Conversor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Conversor de Datum</CardTitle>
              <CardDescription>
                Convierte UTM entre datums WGS84 y PSAD56
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/datum-converter">
                <Button className="w-full group-hover:bg-purple-600 transition-colors">
                  Usar Conversor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Características destacadas */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir nuestro conversor?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Diseñado para profesionales que necesitan convertir grandes
            volúmenes de coordenadas de forma eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Conversión Masiva</h3>
            <p className="text-gray-600 text-sm">
              Copia cientos de coordenadas desde Excel y conviértelas todas de
              una vez
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Copy className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Copiar y Pegar</h3>
            <p className="text-gray-600 text-sm">
              Un solo clic copia todos los resultados al portapapeles listos
              para Excel
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              Precisión Garantizada
            </h3>
            <p className="text-gray-600 text-sm">
              Utiliza proj4.js, biblioteca confiable con 400k+ descargas
              semanales
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <MousePointerClick className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Fácil de Usar</h3>
            <p className="text-gray-600 text-sm">
              Interfaz intuitiva que guía paso a paso en todo el proceso
            </p>
          </Card>
        </div>
      </section>

      {/* Flujo de trabajo */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-gray-600">
              Proceso simple de 4 pasos para convertir tus coordenadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Copia desde Excel</h3>
              <p className="text-gray-600 text-sm">
                Selecciona tus coordenadas en Excel y cópialas (Ctrl+C)
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Pega en el conversor
              </h3>
              <p className="text-gray-600 text-sm">
                Pega los datos en nuestro conversor (Ctrl+V)
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Configura parámetros
              </h3>
              <p className="text-gray-600 text-sm">
                Selecciona zona UTM, hemisferio y datum según necesites
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Copia resultados</h3>
              <p className="text-gray-600 text-sm">
                Haz clic en "Copiar" y pega directamente en Excel (Ctrl+V)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tecnología */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tecnología Confiable
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nuestro conversor utiliza <strong>proj4.js</strong>, una biblioteca
            JavaScript ampliamente utilizada y confiable para transformaciones
            de coordenadas geodésicas.
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Download className="mr-2 h-4 w-4" />
              400k+ descargas semanales
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Shield className="mr-2 h-4 w-4" />
              Ampliamente comprobada
            </Badge>
          </div>

          <p className="text-gray-600">
            Garantizamos precisión en todas las conversiones con algoritmos
            probados y validados por la comunidad.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 Conversor de Coordenadas. Herramienta profesional para
              conversiones geodésicas masivas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
