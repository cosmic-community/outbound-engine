import SendEmailForm from '@/components/SendEmailForm'
import { getUserWorkflows } from '@/lib/cosmic'
import { Send, Mail, AlertCircle } from 'lucide-react'

export default async function SendPage() {
  // In a real app, you'd get user email from auth
  const workflows = await getUserWorkflows('demo@example.com').catch(() => [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Send className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Send Email Campaign</h1>
          </div>
          <p className="text-muted-foreground">
            Launch your email sequences and manage sending schedules
          </p>
        </div>

        {/* Warning Notice */}
        <div className="card border-orange-200 bg-orange-50 mb-8">
          <div className="card-content p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-orange-800">
                <h3 className="font-semibold mb-2">Email Sending Notice</h3>
                <p className="text-sm">
                  This feature requires email service integration (Gmail API, Outlook, SMTP, etc.). 
                  Currently showing demo interface - integrate with your preferred email service to enable sending.
                </p>
              </div>
            </div>
          </div>
        </div>

        {workflows.length > 0 ? (
          <SendEmailForm workflows={workflows} />
        ) : (
          <div className="card">
            <div className="card-content p-12 text-center">
              <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Email Sequences Found</h3>
              <p className="text-muted-foreground mb-6">
                You need to generate email sequences before you can send them
              </p>
              <a href="/generate" className="btn-primary">
                Generate Your First Sequence
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}