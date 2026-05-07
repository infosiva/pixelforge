import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: { default: 'PixelForge AI — Build & Play AI Games', template: '%s | PixelForge AI' },
  description: 'Describe a game in plain English. AI builds it in seconds. Play it instantly. No code, no downloads.',
  keywords: ['AI game builder', 'browser games', 'AI gaming', 'no code games', 'phaser games'],
  openGraph: {
    type: 'website',
    siteName: 'PixelForge AI',
    title: 'PixelForge AI — Build & Play AI Games',
    description: 'Describe a game. AI builds it. Play it instantly.',
  },
  metadataBase: new URL('https://pixelforge.app'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="py-6 text-center text-xs text-white/20 border-t border-white/5">
          PixelForge AI — Build &amp; play browser games with AI. No downloads. No code.
        </footer>
      </body>
    </html>
  )
}
