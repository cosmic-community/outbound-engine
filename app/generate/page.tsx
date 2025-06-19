import { getAppSettings } from '@/lib/cosmic'
import WorkflowForm from '@/components/WorkflowForm'

export default async function GeneratePage() {
  const settings = await getAppSettings();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Generate Your Email Sequence</h1>
            <p className="text-muted-foreground">
              Fill out the form below and we'll create a personalized 5-step email workflow for your campaign.
            </p>
          </div>
          
          <div className="card">
            <div className="card-content">
              <WorkflowForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}