import Link from 'next/link'
import { SocialIcon } from 'react-social-icons'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Globe, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white absolute bottom-0 w-full">
      <div className="container mx-auto px-4 py-12">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">eder3232</h3>
                <Badge variant="secondary" className="text-xs">
                  Conversor
                </Badge>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md text-xl">
              Tecnología para un mundo mejor
            </p>
            <p className="text-gray-400 text-sm">
              Herramientas profesionales para conversiones geodésicas masivas.
              Simplificamos el trabajo de topógrafos, ingenieros y profesionales
              que necesitan convertir grandes volúmenes de coordenadas.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Conversores</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/latlong-to-utm"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  LatLong → UTM
                </Link>
              </li>
              <li>
                <Link
                  href="/utm-to-latlong"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  UTM → LatLong
                </Link>
              </li>
              <li>
                <Link
                  href="/datum-converter"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Conversor Datum
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto y redes sociales */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Síguenos</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <SocialIcon
                  network="tiktok"
                  url="https://tiktok.com/@eder3232"
                  fgColor="white"
                  bgColor="transparent"
                  style={{ width: 24, height: 24 }}
                />
                <span className="text-gray-300">@eder3232</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">eldebar.dk@gmail.com</span>
              </div>

              {/* <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div> */}

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Arequipa, Perú</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} eder3232. Todos los derechos reservados.
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Términos de Servicio
              </Link>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">Hecho con ❤️ en Perú</p>
          </div>
        </div>

        {/* Tecnologías utilizadas */}
        <div className="border-t border-gray-700 pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-2">
              Tecnologías utilizadas:
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>Next.js</span>
              <span>•</span>
              <span>React</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>proj4.js</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
