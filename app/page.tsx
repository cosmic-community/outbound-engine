import { getAppSettings } from '@/lib/cosmic'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'

export default async function HomePage() {
  const settings = await getAppSettings();

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Outbound Engine</h1>
          <p className="text-muted-foreground">Loading application settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection settings={settings} />
      <FeaturesSection />
    </div>
  );
}