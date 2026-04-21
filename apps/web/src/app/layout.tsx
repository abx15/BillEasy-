import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/providers/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = {
  title: {
    default: 'BillEasy - Smart Billing for Every Business',
    template: '%s | BillEasy'
  },
  description: 'Simple and powerful billing software designed for Indian small businesses. Generate invoices, manage customers, track payments, and grow your business.',
  keywords: ['billing software', 'invoicing', 'GST billing', 'Indian business', 'invoice generator'],
  authors: [{ name: 'BillEasy Team' }],
  openGraph: {
    title: 'BillEasy - Smart Billing for Every Business',
    description: 'Simple and powerful billing software designed for Indian small businesses',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BillEasy - Smart Billing for Every Business',
    description: 'Simple and powerful billing software designed for Indian small businesses',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
