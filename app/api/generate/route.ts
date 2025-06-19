import { NextRequest, NextResponse } from 'next/server'
import { createOrFindUser, generateWorkflow, createEmailWorkflow } from '@/lib/cosmic'
import { WorkflowGenerationRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, ...formData }: WorkflowGenerationRequest = body;

    // Validate required fields
    const requiredFields = [
      'prospect_full_name', 'prospect_email_address', 'prospect_company_name', 'prospect_job_title',
      'sender_full_name', 'sender_email_address', 'sender_company_name', 'sender_job_title',
      'industry', 'goal', 'tone'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
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

    // Validate API key
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required. Please provide your API key.' },
        { status: 400 }
      );
    }

    console.log('Starting workflow generation for:', formData.prospect_email_address);

    // Create or find user
    const user = await createOrFindUser(formData);
    console.log('User created/found:', user.id);

    // Map form data to WorkflowFormData format - this object now includes all required fields
    const workflowFormData = {
      // Required fields for WorkflowFormData interface
      full_name: formData.prospect_full_name || "",
      email_address: formData.prospect_email_address || "",
      company_name: formData.prospect_company_name || "",
      job_title: formData.prospect_job_title || "",
      
      // Additional fields
      industry: formData.industry || "",
      goal: formData.goal || "",
      tone: formData.tone || "",
      
      // Optional fields from the original object
      emailCount: formData.emailCount,
      prospect_full_name: formData.prospect_full_name || "",
      prospect_email_address: formData.prospect_email_address || "",
      prospect_company_name: formData.prospect_company_name || "",
      prospect_job_title: formData.prospect_job_title || "",
      sender_full_name: formData.sender_full_name || "",
      sender_email_address: formData.sender_email_address || "",
      sender_company_name: formData.sender_company_name || "",
      sender_job_title: formData.sender_job_title || "",
      company_bio: formData.company_bio
    };

    // Generate AI workflow using the provided API key
    const generatedWorkflow = await generateWorkflow(workflowFormData, apiKey);
    console.log('Workflow generated successfully');

    // Create email workflow record using the mapped data
    const workflow = await createEmailWorkflow(workflowFormData, generatedWorkflow);
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
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific OpenAI API errors
      if (errorMessage.includes('Invalid API key')) {
        statusCode = 401;
      } else if (errorMessage.includes('Rate limit')) {
        statusCode = 429;
      } else if (errorMessage.includes('quota')) {
        statusCode = 402;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}