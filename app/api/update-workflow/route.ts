import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { EmailStep } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, steps }: { workflowId: string, steps: EmailStep[] } = body;

    if (!workflowId || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Missing required fields: workflowId and steps' },
        { status: 400 }
      );
    }

    // Get the existing workflow
    const existingWorkflow = await cosmic.objects.findOne({
      type: 'email-workflows',
      id: workflowId
    });

    if (!existingWorkflow.object) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Update the workflow with new steps
    const updatedWorkflow = await cosmic.objects.updateOne(workflowId, {
      metadata: {
        ...existingWorkflow.object.metadata,
        generated_workflow: {
          ...existingWorkflow.object.metadata.generated_workflow,
          steps: steps
        },
        status: {
          key: 'edited',
          value: 'Edited'
        }
      }
    });

    return NextResponse.json({
      success: true,
      workflow: updatedWorkflow.object
    });

  } catch (error) {
    console.error('Error updating workflow:', error);
    
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    );
  }
}