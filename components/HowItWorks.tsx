import { ArrowRight, Bot, FileText, Zap } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: 'Fill the Form',
      description: 'Provide your details, target industry, company information, and campaign goals in our simple form.',
    },
    {
      icon: Bot,
      title: 'AI Generation',
      description: 'Our AI analyzes your inputs and creates a personalized 5-step email sequence tailored to your specific needs.',
    },
    {
      icon: Zap,
      title: 'Copy & Use',
      description: 'Review, copy, edit, or export your sequences for immediate use in your email campaigns.',
    },
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get from idea to execution in just three simple steps. No technical knowledge required.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center relative">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-xl font-bold mb-6">
                    {index + 1}
                  </div>

                  {/* Arrow connector (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full">
                      <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}