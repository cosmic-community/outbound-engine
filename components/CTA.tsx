import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section-padding bg-primary-600">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Start Creating Today
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to create your first email sequence?
          </h2>
          
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of sales professionals who are already using AI to create more effective email campaigns.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/create"
              className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Build My Sequence
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/sequences"
              className="btn border-white text-white hover:bg-primary-700 text-lg px-8 py-3"
            >
              View Examples
            </Link>
          </div>
          
          <p className="text-primary-200 text-sm mt-6">
            No credit card required • Generate unlimited sequences
          </p>
        </div>
      </div>
    </section>
  )
}