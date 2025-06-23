import Link from 'next/link'
import { ArrowRight, Zap, Mail, Target } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-primary-50 to-white py-20 lg:py-32">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Email Sequences
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Enter a few details.{' '}
            <span className="text-primary-600">Get a full email sequence.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto text-balance">
            Create personalized cold email workflows with AI in seconds. 
            No more generic templates or guesswork.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/create"
              className="btn btn-primary text-lg px-8 py-3"
            >
              Build My Sequence
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/about"
              className="btn btn-outline text-lg px-8 py-3"
            >
              Learn More
            </Link>
          </div>

          {/* Stats/Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">5-Step Sequences</h3>
              <p className="text-sm text-gray-600">Complete email workflows</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Goal-Oriented</h3>
              <p className="text-sm text-gray-600">Optimized for your objective</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI-Generated</h3>
              <p className="text-sm text-gray-600">Personalized content</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}