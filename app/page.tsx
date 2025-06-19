import Link from 'next/link'
import { getUserWorkflows, getAppSettings } from '@/lib/cosmic'
import { Plus, Mail, Clock, Target } from 'lucide-react'

export default async function Dashboard() {
  const settings = await getAppSettings()
  
  // For now, we'll show a simple dashboard - in a real app you'd get user email from auth
  const recentWorkflows = await getUserWorkflows('demo@example.com').catch(() => [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Email Campaign Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your outbound email sequences and campaigns
            </p>
          </div>
          <Link href="/generate" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/generate" className="card hover:shadow-md transition-shadow">
            <div className="card-content p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Generate Sequence</h3>
                  <p className="text-sm text-muted-foreground">Create new email campaign</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/profile" className="card hover:shadow-md transition-shadow">
            <div className="card-content p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Profile</h3>
                  <p className="text-sm text-muted-foreground">Update company info</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/send" className="card hover:shadow-md transition-shadow">
            <div className="card-content p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Send Emails</h3>
                  <p className="text-sm text-muted-foreground">Launch campaigns</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Campaigns */}
        <div className="card">
          <div className="card-content p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
            {recentWorkflows.length > 0 ? (
              <div className="space-y-4">
                {recentWorkflows.slice(0, 5).map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{workflow.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {workflow.metadata?.goal?.value} • {workflow.metadata?.industry?.value}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(workflow.created_at).toLocaleDateString()}
                      </span>
                      <Link href={`/results/${workflow.slug}`} className="btn-outline btn-sm">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first email sequence to get started
                </p>
                <Link href="/generate" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Campaign
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-primary mb-2">Getting Started</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Set up your company profile and email signature</li>
            <li>Generate your first email sequence using AI</li>
            <li>Review and edit the generated emails</li>
            <li>Send your campaign to prospects</li>
            <li>Track responses and optimize</li>
          </ol>
        </div>
      </div>
    </div>
  )
}