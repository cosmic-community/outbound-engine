import Link from 'next/link'
import { AppSettings } from '@/types'
import { ArrowRight, Sparkles } from 'lucide-react'

interface HeroSectionProps {
  settings: AppSettings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const headline = settings.metadata?.hero_headline || 'Enter a few details. Get a full email sequence.';
  const subheadline = settings.metadata?.hero_subheadline || 'Generate custom AI-powered email workflows tailored to your industry, goals, and tone.';
  const ctaText = settings.metadata?.cta_button_text || 'Build My Sequence';

  return (
    <section className="relative bg-gradient-to-b from-background to-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Email Generation</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            {subheadline}
          </p>

          {/* CTA Button */}
          <Link 
            href="/generate"
            className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Stats/Social Proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <div className="text-muted-foreground">Email Steps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10+</div>
              <div className="text-muted-foreground">Industries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4</div>
              <div className="text-muted-foreground">Tone Options</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}