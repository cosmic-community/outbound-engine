import { NextRequest, NextResponse } from 'next/server'
import { createOrFindUser, generateAIWorkflow, createEmailWorkflow } from '@/lib/cosmic'
import { WorkflowFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const formData: WorkflowFormData = await request.json();

    // Validate required fields
    const requiredFields = ['full_name', 'email_address', 'company_name', 'job_title', 'industry', 'goal', 'tone'];
    for (const field of requiredFields) {
      if (!formData[field as keyof WorkflowFormData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create or find user
    const user = await createOrFindUser(formData);

    // Generate AI workflow
    const generatedWorkflow = await generateAIWorkflow(formData);

    // Create email workflow record
    const workflow = await createEmailWorkflow(formData, generatedWorkflow);

    return NextResponse.json({
      success: true,
      workflow: {
        id: workflow.id,
        slug: workflow.slug,
        title: workflow.title,
        metadata: workflow.metadata
      }
    });

  } catch (error) {
    console.error('Error generating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to generate workflow' },
      { status: 500 }
    );
  }
}