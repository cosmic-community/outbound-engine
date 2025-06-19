'use client'

import { useState } from 'react'
import { EmailWorkflow, EmailStep } from '@/types'
import EmailSequenceEditor from '@/components/EmailSequenceEditor'
import { Copy, Check, RotateCcw, Download, Edit3, Send, Save } from 'lucide-react'
import Link from 'next/link'

interface WorkflowResultsProps {
  workflow: EmailWorkflow;
}

export default function WorkflowResults({ workflow }: WorkflowResultsProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editedSteps, setEditedSteps] = useState<EmailStep[]>([]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(id));
      
      // Remove the copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleCopyAll = async () => {
    if (!workflowSteps) return;

    const allEmailsText = workflowSteps.map((step, index) => 
      `EMAIL ${step.step}: ${step.subject}\n\n${step.body}\n\nTiming: ${step.timing}\n\n${'='.repeat(50)}\n\n`
    ).join('');

    await handleCopy(allEmailsText, 'all-emails');
  };

  const handleSaveEdits = async (steps: EmailStep[]) => {
    try {
      const response = await fetch('/api/update-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId: workflow.id,
          steps
        }),
      });

      if (response.ok) {
        setEditedSteps(steps);
        setIsEditing(false);
        // In a real app, you might want to show a success message
      }
    } catch (error) {
      console.error('Error saving edits:', error);
    }
  };

  const workflowSteps = editedSteps.length > 0 ? editedSteps : workflow.metadata?.generated_workflow?.steps;
  const workflowSummary = workflow.metadata?.generated_workflow?.summary;

  if (!workflowSteps) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">No workflow steps found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Workflow Info */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{workflow.title}</h2>
              <p className="text-muted-foreground">
                {workflowSummary || `${workflowSteps.length}-step email sequence`}
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Sequence
                  </button>
                  <button
                    onClick={handleCopyAll}
                    className="btn-outline"
                    disabled={copiedItems.has('all-emails')}
                  >
                    {copiedItems.has('all-emails') ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied All!
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Copy All Emails
                      </>
                    )}
                  </button>
                  <Link href="/send" className="btn-primary">
                    <Send className="w-4 h-4 mr-2" />
                    Send Campaign
                  </Link>
                </>
              )}
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-outline"
                >
                  Cancel Edit
                </button>
              )}
              <button
                onClick={() => window.location.href = '/generate'}
                className="btn-secondary"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Generate New
              </button>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Industry:</span>
              <p className="font-medium">{workflow.metadata?.industry?.value}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Goal:</span>
              <p className="font-medium">{workflow.metadata?.goal?.value}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tone:</span>
              <p className="font-medium">{workflow.metadata?.tone?.value}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Steps:</span>
              <p className="font-medium">{workflowSteps.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Sequence Editor */}
      <EmailSequenceEditor
        steps={workflowSteps}
        onSave={handleSaveEdits}
        isEditing={isEditing}
      />

      {/* Next Steps */}
      {!isEditing && (
        <div className="card">
          <div className="card-content">
            <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>✅ Your email sequence is ready to use</p>
              <p>✅ Edit individual emails to customize content</p>
              <p>✅ Copy emails to your preferred email tool</p>
              <p>✅ Use the Send feature to launch campaigns</p>
              <p>✅ Track your results and optimize based on performance</p>
            </div>
            <div className="flex space-x-3 mt-6">
              <Link href="/send" className="btn-primary">
                <Send className="w-4 h-4 mr-2" />
                Launch Campaign
              </Link>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Emails
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}