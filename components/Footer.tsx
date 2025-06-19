import Link from 'next/link'
import { AppSettings } from '@/types'

interface FooterProps {
  settings: AppSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const socialLinks = settings?.metadata?.social_links;
  const siteTitle = settings?.metadata?.site_title || 'Outbound Engine';

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">OE</span>
              </div>
              <span className="font-bold text-xl">{siteTitle}</span>
            </div>
            <p className="text-muted-foreground mb-4">
              {settings?.metadata?.site_description || 'Generate custom AI-powered email workflows in seconds.'}
            </p>
            {socialLinks && (
              <div className="flex space-x-4">
                {socialLinks.twitter && (
                  <Link 
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Twitter
                  </Link>
                )}
                {socialLinks.linkedin && (
                  <Link 
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    LinkedIn
                  </Link>
                )}
                {socialLinks.github && (
                  <Link 
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    GitHub
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/generate" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Generate Sequence
              </Link>
              <Link 
                href="/about" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Built with ❤️ using</p>
              <Link 
                href="https://www.cosmicjs.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary transition-colors"
              >
                Cosmic CMS
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 {siteTitle}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}