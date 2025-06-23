import { CheckCircle } from 'lucide-react'

export default function AboutPage() {
  const features = [
    'AI-powered email sequence generation',
    'Personalized content based on industry and role',
    'Multiple tone options (Friendly, Professional, Direct, Funny)',
    'Goal-oriented sequences (Demo, Awareness, Closing)',
    'Copy and export functionality',
    'Sequence management and tracking'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About Outbound Engine
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We help sales professionals create personalized email sequences that convert prospects into customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Powered by AI, Designed for Results
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Outbound Engine uses advanced AI to create personalized email sequences that speak directly to your prospects. 
                No more generic templates or one-size-fits-all approaches.
              </p>
              <p className="text-lg text-gray-600">
                Simply provide a few details about yourself and your goal, and our AI will craft a complete 5-step 
                email sequence tailored to your industry, tone, and objective.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Key Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card bg-primary-50 border-primary-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div>
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    1
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fill the Form</h4>
                  <p className="text-gray-600">
                    Provide your details, target industry, and campaign goals
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    2
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Generation</h4>
                  <p className="text-gray-600">
                    Our AI creates a personalized 5-step email sequence
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    3
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Copy & Use</h4>
                  <p className="text-gray-600">
                    Copy, edit, or export your sequences for immediate use
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'About - Outbound Engine',
  description: 'Learn about Outbound Engine and how we help sales professionals create personalized email sequences with AI.'
}