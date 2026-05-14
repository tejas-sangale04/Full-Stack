import type { Metadata } from 'next'
import { Inter, Playfair_Display, Noto_Serif_Devanagari } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { SplashScreen } from '@/components/splash-screen'
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const _notoDevanagari = Noto_Serif_Devanagari({ subsets: ["devanagari"], variable: "--font-noto-devanagari" });

export const metadata: Metadata = {
  title: 'Vrundavan Hotels & Resorts',
  description: 'Experience luxury hospitality at Vrundavan Hotels & Resorts. Discover destinations, dining, and exclusive offers.',
  generator: 'v0.app',
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
      <body className={`${_inter.variable} ${_playfair.variable} ${_notoDevanagari.variable} font-sans antialiased`}>
        <Providers>
          <SplashScreen />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
