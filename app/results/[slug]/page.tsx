// app/results/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getWorkflow } from '@/lib/cosmic'
import WorkflowResults from '@/components/WorkflowResults'

interface ResultsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { slug } = await params;
  const workflow = await getWorkflow(slug);

  if (!workflow) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Your Email Sequence is Ready!</h1>
            <p className="text-muted-foreground">
              Here's your personalized 5-step email workflow. You can copy, edit, or export each step.
            </p>
          </div>
          
          <WorkflowResults workflow={workflow} />
        </div>
      </div>
    </div>
  );
}