import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import ChatBot from '@/components/ChatBot'
import { PIXELFORGE_CHAT_CONFIG } from '@/lib/chatbot-configs'
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";

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
  metadataBase: new URL('https://arcadeforge.app'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --arcade-primary: #a855f7;
            --arcade-neon: #22d3ee;
            --arcade-yellow: #fbbf24;
            --bg: #050208;
          }
          html, body { background: #050208 !important; }
          h1, h2, .arcade-title { font-family: 'Press Start 2P', monospace !important; letter-spacing: 0.02em; }
          .game-title, nav .logo { font-family: 'Rajdhani', sans-serif !important; font-weight: 700; }
          /* Neon scan-line texture */
          body::after {
            content: '';
            position: fixed;
            inset: 0;
            background: repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 2px);
            pointer-events: none;
            z-index: 9999;
          }
        `}} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer siteName="PixelForge AI" tagline="Build & play browser games with AI. No downloads. No code." />
        <ChatBot config={PIXELFORGE_CHAT_CONFIG} />
      <CookieConsent />
      </body>
    </html>
  )
}
