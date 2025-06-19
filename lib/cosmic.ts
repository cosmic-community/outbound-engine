import { createBucketClient } from '@cosmicjs/sdk'
import { AppSettings, User, EmailWorkflow, WorkflowFormData, GeneratedWorkflow } from '@/types'
import { generateAIWorkflow, generateFallbackWorkflow } from '@/lib/openai'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get app settings
export async function getAppSettings(): Promise<AppSettings | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'app-settings',
      slug: 'outbound-engine-settings'
    }).props(['title', 'metadata']);
    
    return response.object as AppSettings;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch app settings');
  }
}

// Create or find user
export async function createOrFindUser(formData: WorkflowFormData): Promise<User> {
  try {
    // First try to find existing user by sender email
    const existingResponse = await cosmic.objects.findOne({
      type: 'users',
      'metadata.email_address': formData.sender_email_address
    }).props(['id', 'title', 'metadata']).depth(1);

    return existingResponse.object as User;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      // User doesn't exist, create new one
      try {
        const response = await cosmic.objects.insertOne({
          type: 'users',
          title: formData.sender_full_name,
          metadata: {
            full_name: formData.sender_full_name,
            email_address: formData.sender_email_address,
            company: formData.sender_company_name,
            job_title: formData.sender_job_title,
            workflows: [],
            registration_date: new Date().toISOString().split('T')[0]
          }
        });
        
        return response.object as User;
      } catch (createError) {
        console.error('Error creating user:', createError);
        throw new Error('Failed to create user');
      }
    }
    console.error('Error finding user:', error);
    throw new Error('Failed to find or create user');
  }
}

// Generate AI workflow using OpenAI
export async function generateWorkflow(
  formData: WorkflowFormData, 
  apiKey: string
): Promise<GeneratedWorkflow> {
  try {
    // Get app settings for company bio
    const appSettings = await getAppSettings();
    const companyBio = formData.company_bio || 
      appSettings?.metadata?.company_bio || 
      "We help businesses optimize their outreach and improve their sales processes with AI-powered solutions.";

    // Try to generate with OpenAI first
    try {
      return await generateAIWorkflow(formData, apiKey, companyBio);
    } catch (openaiError) {
      console.warn('OpenAI generation failed, using fallback:', openaiError);
      // If OpenAI fails, use fallback
      return generateFallbackWorkflow(formData);
    }

  } catch (error) {
    console.error('Error in generateWorkflow:', error);
    // Final fallback
    return generateFallbackWorkflow(formData);
  }
}

// Create email workflow
export async function createEmailWorkflow(
  formData: WorkflowFormData, 
  generatedWorkflow: GeneratedWorkflow
): Promise<EmailWorkflow> {
  try {
    const title = `${formData.prospect_company_name} - ${formData.goal.replace('-', ' ')}`;
    
    const response = await cosmic.objects.insertOne({
      type: 'email-workflows',
      title,
      metadata: {
        // Prospect information
        prospect_full_name: formData.prospect_full_name,
        prospect_email_address: formData.prospect_email_address,
        prospect_company_name: formData.prospect_company_name,
        prospect_job_title: formData.prospect_job_title,
        
        // Sender information
        sender_full_name: formData.sender_full_name,
        sender_email_address: formData.sender_email_address,
        sender_company_name: formData.sender_company_name,
        sender_job_title: formData.sender_job_title,
        
        // Campaign settings
        industry: {
          key: formData.industry,
          value: formData.industry
        },
        goal: {
          key: formData.goal,
          value: formData.goal
        },
        tone: {
          key: formData.tone,
          value: formData.tone
        },
        
        // Generated content
        generated_workflow: generatedWorkflow,
        status: {
          key: 'generated',
          value: 'Generated'
        },
        generation_date: new Date().toISOString().split('T')[0]
      }
    });

    return response.object as EmailWorkflow;
  } catch (error) {
    console.error('Error creating email workflow:', error);
    throw new Error('Failed to create email workflow');
  }
}

// Get workflow by slug
export async function getWorkflow(slug: string): Promise<EmailWorkflow | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'email-workflows',
      slug
    }).props(['title', 'slug', 'metadata']);

    return response.object as EmailWorkflow;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching workflow:', error);
    throw new Error('Failed to fetch workflow');
  }
}

// Get user workflows by email
export async function getUserWorkflows(email: string): Promise<EmailWorkflow[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'email-workflows',
        'metadata.sender_email_address': email
      })
      .props(['title', 'slug', 'metadata', 'created_at'])
      .sort('-created_at');

    return response.objects as EmailWorkflow[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching user workflows:', error);
    throw new Error('Failed to fetch user workflows');
  }
}