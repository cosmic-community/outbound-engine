import Link from 'next/link'
import { AppSettings } from '@/types'
import { Target, User } from 'lucide-react'

interface NavigationProps {
  settings: AppSettings | null;
}

export default function Navigation({ settings }: NavigationProps) {
  const siteTitle = settings?.metadata?.site_title || 'Outbound Engine';

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">OE</span>
            </div>
            <span className="font-bold text-xl">{siteTitle}</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link 
              href="/prospect" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
              <Target className="w-4 h-4 mr-1" />
              Prospects
            </Link>
            <Link 
              href="/profile" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
              <User className="w-4 h-4 mr-1" />
              Profile
            </Link>
            <Link 
              href="/generate" 
              className="btn-primary"
            >
              Generate Sequence
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}