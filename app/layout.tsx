import type { Metadata } from 'next'
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Shell } from '@/components/layout/shell'
import './globals.css'

const _geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-sans',
});
const _geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
});
const _plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Ummat Systems - Academic Management Platform',
  description: 'Enterprise-grade academic management system for institutions',
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

import { PageTransition } from '@/components/layout/page-transition'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en"
      className={`${_geist.variable} ${_geistMono.variable} ${_plusJakarta.variable} bg-background`}
    >
      <body className="font-sans antialiased text-foreground overflow-hidden scrollbar-hide">
        <Shell>
          <PageTransition>
            {children}
          </PageTransition>
        </Shell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
