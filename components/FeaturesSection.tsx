import { Zap, Target, Copy, Settings } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Generation',
      description: 'Advanced AI creates personalized email sequences tailored to your specific industry and goals.'
    },
    {
      icon: Target,
      title: 'Multiple Campaign Goals',
      description: 'Whether you want to book demos, raise awareness, or close deals, we have you covered.'
    },
    {
      icon: Copy,
      title: 'Copy & Export',
      description: 'Easily copy individual emails or export your entire sequence for immediate use.'
    },
    {
      icon: Settings,
      title: 'Customizable Tone',
      description: 'Choose from friendly, professional, direct, or funny tones to match your brand voice.'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything you need to create effective email sequences
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to help you generate and manage your outbound campaigns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}