import './globals.css'
import { Providers } from '@/providers/Providers'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
