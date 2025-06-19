import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getAppSettings } from '@/lib/cosmic'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAppSettings();
  
  return {
    title: settings?.metadata?.site_title || 'Outbound Engine',
    description: settings?.metadata?.site_description || 'Generate custom AI-powered email workflows in seconds',
    keywords: ['email marketing', 'AI', 'cold email', 'sales', 'outreach'],
    authors: [{ name: 'Outbound Engine' }],
    openGraph: {
      title: settings?.metadata?.site_title || 'Outbound Engine',
      description: settings?.metadata?.site_description || 'Generate custom AI-powered email workflows in seconds',
      type: 'website',
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getAppSettings();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navigation settings={settings} />
          <main className="flex-1">
            {children}
          </main>
          <Footer settings={settings} />
        </div>
      </body>
    </html>
  )
}