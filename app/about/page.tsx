import { getAppSettings } from '@/lib/cosmic'

export default async function AboutPage() {
  const settings = await getAppSettings();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="card">
            <div className="card-content">
              {settings?.metadata?.about_content ? (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: settings.metadata.about_content }}
                />
              ) : (
                <div>
                  <h1 className="text-3xl font-bold mb-6">About Outbound Engine</h1>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Outbound Engine uses advanced AI to create personalized email sequences that convert. 
                      Whether you're trying to book demos, raise awareness, or close deals, our intelligent 
                      system crafts the perfect outbound campaign for your specific needs.
                    </p>
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">How It Works</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Enter your details and goals</li>
                      <li>AI generates a custom 5-step email sequence</li>
                      <li>Copy, edit, or export your workflow</li>
                      <li>Start reaching your prospects effectively</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}