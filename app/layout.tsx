import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Outbound Engine - AI-Powered Email Sequences',
  description: 'Enter a few details. Get a full email sequence. Create personalized cold email workflows with AI in seconds.',
  keywords: ['email sequences', 'sales automation', 'AI email', 'cold outreach', 'sales tools'],
  authors: [{ name: 'Outbound Engine' }],
  creator: 'Outbound Engine',
  publisher: 'Outbound Engine',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://outbound-engine.vercel.app',
    title: 'Outbound Engine - AI-Powered Email Sequences',
    description: 'Enter a few details. Get a full email sequence. Create personalized cold email workflows with AI in seconds.',
    siteName: 'Outbound Engine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Outbound Engine - AI-Powered Email Sequences',
    description: 'Enter a few details. Get a full email sequence. Create personalized cold email workflows with AI in seconds.',
    creator: '@outboundengine',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}