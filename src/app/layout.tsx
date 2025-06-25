import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'eder3232 - Conversor de Coordenadas',
  description:
    'Convierte múltiples coordenadas de forma masiva desde Excel. LatLong ↔ UTM, conversión de datum WGS84/PSAD56',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* <Header />
        <main>{children}</main>
        <Footer /> */}
        <div className="pb-[438px]">
          <Header />
          <main className="mb-[438px] pt-6">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
