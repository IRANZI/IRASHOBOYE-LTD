import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AppProviders } from '@/components/app-providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kolorex Establishment Limited',
  description: 'Dashboard for generating, tracking, and ranking codes.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <AppProviders>
          {children}
        </AppProviders>
        <Analytics />
      </body>
    </html>
  )
}
