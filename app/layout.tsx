import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lace Up for Kids | Donate Shoes, Support Families',
  description: 'Lace Up for Kids collects gently used shoes, trades them for funds, and donates proceeds to Ronald McDonald House to support families in need.',
  openGraph: {
    title: 'Lace Up for Kids | Donate Shoes, Support Families',
    description: 'Lace Up for Kids collects gently used shoes, trades them for funds, and donates proceeds to Ronald McDonald House to support families in need.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://laceupforkidsct.org',
    siteName: 'Lace Up for Kids',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lace Up for Kids | Donate Shoes, Support Families',
    description: 'Lace Up for Kids collects gently used shoes, trades them for funds, and donates proceeds to Ronald McDonald House to support families in need.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

