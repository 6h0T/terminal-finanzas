import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'BloomArg - Cotizaciones en tiempo real',
  description: 'Panel de cotizaciones en tiempo real del mercado argentino y estadounidense. CEDEARs, acciones, bonos, letras y más. Actualización automática cada 30 segundos.',
  keywords: ['cotizaciones', 'mercado argentino', 'CEDEARs', 'acciones', 'bonos', 'bolsa', 'finanzas', 'dolar', 'blue', 'CCL', 'MEP', 'mercado USA', 'stocks'],
  authors: [{ name: 'gh0t', url: 'https://gh0t.art' }],
  creator: 'gh0t',
  publisher: 'gh0t',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://terminal-finanzas.vercel.app',
    title: 'BloomArg - Cotizaciones en tiempo real',
    description: 'Panel de cotizaciones en tiempo real del mercado argentino y estadounidense',
    siteName: 'BloomArg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BloomArg - Cotizaciones en tiempo real',
    description: 'Panel de cotizaciones en tiempo real del mercado argentino y estadounidense',
    creator: '@gh0t',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
