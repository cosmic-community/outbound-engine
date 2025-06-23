import { Bot, Clock, Copy, Target, Users, Zap } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Generation',
      description: 'Our advanced AI analyzes your goals and creates personalized email sequences that resonate with your target audience.',
    },
    {
      icon: Target,
      title: 'Goal-Oriented Sequences',
      description: 'Whether you want to book demos, raise awareness, or close deals, our sequences are optimized for your specific objective.',
    },
    {
      icon: Users,
      title: 'Industry-Specific Content',
      description: 'Tailored messaging that speaks the language of your prospect\'s industry and understands their unique challenges.',
    },
    {
      icon: Clock,
      title: 'Perfect Timing',
      description: 'Each email includes optimal send timing recommendations to maximize open rates and engagement.',
    },
    {
      icon: Copy,
      title: 'Copy & Export',
      description: 'Easily copy individual emails or export entire sequences for use in your favorite email platform.',
    },
    {
      icon: Zap,
      title: 'Multiple Tones',
      description: 'Choose from friendly, professional, direct, or funny tones to match your brand voice and audience preferences.',
    },
  ]

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you create email sequences that convert prospects into customers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="card hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}