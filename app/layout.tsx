import Script from 'next/script'
import type { Metadata } from 'next'
import './globals.css'
import { AnimatedBg } from '@/components/AnimatedBg'
import ConsentBanner from '@/components/ConsentBanner'
import Navbar from '@/components/Navbar'
import ChatBot from '@/components/ChatBot'
import { PIXELFORGE_CHAT_CONFIG } from '@/lib/chatbot-configs'
import CookieConsent from "../components/CookieConsent"
import Footer from "../components/Footer"
import BackToTop from '@/components/BackToTop'
import FeedbackWidget from '@/components/FeedbackWidget'
import { loadSiteTheme, buildThemeStyleTag, buildGa4Snippet, resolveGa4Id, isValidGa4Id, isWidgetHidden } from '@/lib/theme-loader'

import { MotionProvider } from "@infosiva/shared-ui/modern";
export const metadata: Metadata = {
  title: { default: 'PixelForge AI — Build & Play AI Games', template: '%s | PixelForge AI' },
  description: 'Describe a game in plain English. AI builds it in seconds. Play it instantly. No code, no downloads.',
  keywords: ['AI game builder', 'browser games', 'AI gaming', 'no code games', 'phaser games'],
  openGraph: {
    type: 'website',
    siteName: 'PixelForge AI',
    title: 'PixelForge AI — Build & Play AI Games',
    description: 'Describe a game. AI builds it. Play it instantly.',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  metadataBase: new URL('https://arcadeforge.app'),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await loadSiteTheme('pixelforge')

  const themeCSS = buildThemeStyleTag(theme, {
    background: '#070a08',
    primary: '#a3e635',
    secondary: '#22d3ee',
  })

  const ga4 = buildGa4Snippet(theme)

  return (
    <html lang="en" data-layout={theme?.layout?.archetype ?? 'media-gallery'}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <Script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
                  crossOrigin="anonymous"
                  strategy="afterInteractive"
                />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'PixelForge AI', url: 'https://arcadeforge.app', description: 'Describe a game in plain English. AI builds it in seconds. Play it instantly.' }) }} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root { --arcade-primary: #a3e635; --arcade-neon: #22d3ee; --bg: #070a08; --background: #070a08; }
          h1, h2, .arcade-title { font-family: 'Press Start 2P', monospace; letter-spacing: 0.02em; }
          .game-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; }
          ${themeCSS}
          :root { --arcade-primary: var(--theme-primary, #a3e635); }
        `}} />
      
</head>
      <body className="min-h-screen flex flex-col">
        {theme?.layout?.bgAnimation ? (
          theme.layout.bgAnimation !== "none" && <AnimatedBg theme={theme} />
        ) : (
          <>
            <div className="aurora aurora-primary" aria-hidden />
            <div className="aurora aurora-secondary" aria-hidden />
            <div className="aurora aurora-third" aria-hidden />
          </>
        )}
        <div className="grain" aria-hidden />
        <Navbar />
        <main className="flex-1"><MotionProvider>{children}</MotionProvider></main>
        <Footer siteName="PixelForge AI" tagline="Build & play browser games with AI. No downloads. No code." />
        {!isWidgetHidden(theme, 'chatbot') && <ChatBot config={PIXELFORGE_CHAT_CONFIG} />}
        {!isWidgetHidden(theme, 'backToTop') && <BackToTop accentColor="#a3e635" />}
        {!isWidgetHidden(theme, 'cookieConsent') && <CookieConsent />}
        {isValidGa4Id(resolveGa4Id(theme)) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${resolveGa4Id(theme)}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: ga4 }} />
          </>
        )}
        <FeedbackWidget siteName="PixelForge" accentColor="#a3e635" position="left" />
        <ConsentBanner />
      </body>
    </html>
  )
}
