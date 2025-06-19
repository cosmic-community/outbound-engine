import { NextRequest, NextResponse } from 'next/server'
import { createOrFindUser, generateAIWorkflow, createEmailWorkflow } from '@/lib/cosmic'
import { WorkflowFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, ...formData }: { apiKey?: string } & WorkflowFormData = body;

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

    // Validate environment variables
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY || !process.env.COSMIC_WRITE_KEY) {
      console.error('Missing Cosmic CMS environment variables');
      return NextResponse.json(
        { error: 'Server configuration error - missing CMS credentials' },
        { status: 500 }
      );
    }

    console.log('Starting workflow generation for:', formData.email_address);

    // Create or find user
    const user = await createOrFindUser(formData);
    console.log('User created/found:', user.id);

    // Generate AI workflow using the provided API key or environment variable
    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 400 }
      );
    }

    const generatedWorkflow = await generateAIWorkflow(formData, openaiApiKey);
    console.log('Workflow generated successfully');

    // Create email workflow record
    const workflow = await createEmailWorkflow(formData, generatedWorkflow);
    console.log('Workflow saved to CMS:', workflow.id);

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
    
    // Return more specific error messages
    let errorMessage = 'Failed to generate workflow';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}