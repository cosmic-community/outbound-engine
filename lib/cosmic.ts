import { createBucketClient } from '@cosmicjs/sdk'
import { AppSettings, User, EmailWorkflow, WorkflowFormData, GeneratedWorkflow } from '@/types'

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
    // First try to find existing user
    const existingResponse = await cosmic.objects.findOne({
      type: 'users',
      'metadata.email_address': formData.email_address
    }).props(['id', 'title', 'metadata']).depth(1);

    return existingResponse.object as User;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      // User doesn't exist, create new one
      try {
        const response = await cosmic.objects.insertOne({
          type: 'users',
          title: formData.full_name,
          metadata: {
            full_name: formData.full_name,
            email_address: formData.email_address,
            company: formData.company_name,
            job_title: formData.job_title,
            workflows: [],
            registration_date: new Date().toISOString().split('T')[0]
          }
        });
        
        return response.object as User;
      } catch (createError) {
        throw new Error('Failed to create user');
      }
    }
    throw new Error('Failed to find or create user');
  }
}

// Generate AI workflow
export async function generateAIWorkflow(formData: WorkflowFormData): Promise<GeneratedWorkflow> {
  const prompt = `Create a 5-step cold email sequence for ${formData.job_title} at ${formData.company_name} in the ${formData.industry} industry. The tone should be ${formData.tone} and the goal is to ${formData.goal}. 

  Return the result as a JSON object with this exact structure:
  {
    "steps": [
      {
        "step": 1,
        "subject": "Email subject line",
        "body": "Email body content with proper formatting and line breaks",
        "timing": "When to send (e.g., 'Send immediately', 'Send 3 days after step 1')",
        "notes": "Brief note about the email strategy"
      }
    ],
    "summary": "Brief summary of the sequence strategy"
  }

  Make sure each email is personalized, relevant, and follows best practices for cold outreach. Include specific pain points and value propositions relevant to the industry and job title.`;

  try {
    // For demo purposes, return a mock workflow
    // In production, you would integrate with Cosmic AI or another AI service
    const mockWorkflow: GeneratedWorkflow = {
      steps: [
        {
          step: 1,
          subject: `Quick question about ${formData.company_name}'s ${formData.industry} strategy`,
          body: `Hi ${formData.full_name},\n\nI noticed ${formData.company_name} has been making moves in the ${formData.industry} space. As ${formData.job_title}, you're probably always looking for ways to optimize your processes and drive better results.\n\nI'd love to show you how other ${formData.industry} companies are achieving their goals with our solution. Would you be open to a brief conversation?\n\nBest regards,\n[Your Name]`,
          timing: "Send immediately",
          notes: "Introduction email focusing on industry-specific pain points"
        },
        {
          step: 2,
          subject: `${formData.company_name} + [Your Company]: Success story inside`,
          body: `Hi ${formData.full_name},\n\nI wanted to follow up on my previous email about optimizing ${formData.industry} operations.\n\nA similar company in your space was facing challenges with [specific pain point]. After implementing our solution, they:\n• Improved efficiency by 40%\n• Reduced costs by 25%\n• Increased customer satisfaction significantly\n\nWould you like to see how this could work for ${formData.company_name}?\n\nBest,\n[Your Name]`,
          timing: "Send 3 days after step 1",
          notes: "Social proof with specific benefits"
        },
        {
          step: 3,
          subject: `Last attempt: Quick chat about ${formData.company_name}?`,
          body: `Hi ${formData.full_name},\n\nI know you're incredibly busy, so I'll keep this brief.\n\nI've reached out a couple of times about how we're helping ${formData.industry} companies like yours achieve better results. If this isn't a priority right now, no worries at all.\n\nBut if you're interested in a quick 15-minute conversation, just reply with a time that works for you.\n\nOtherwise, I'll stop reaching out.\n\nBest,\n[Your Name]`,
          timing: "Send 1 week after step 2",
          notes: "Polite final attempt with clear exit"
        },
        {
          step: 4,
          subject: "Thought you'd find this interesting",
          body: `Hi ${formData.full_name},\n\nI came across this article about ${formData.industry} trends and thought of our previous conversation: [link to relevant article]\n\nThe section on [relevant topic] particularly reminded me of the challenges many ${formData.job_title}s face in today's market.\n\nIf you ever want to discuss how this applies to ${formData.company_name}, I'm here.\n\nBest,\n[Your Name]`,
          timing: "Send 2 weeks after step 3",
          notes: "Value-add content to stay top of mind"
        },
        {
          step: 5,
          subject: `Re: Quick question about ${formData.company_name}'s ${formData.industry} strategy`,
          body: `Hi ${formData.full_name},\n\nI hope things are going well at ${formData.company_name}!\n\nI'm checking in one final time about the conversation I mentioned. Several ${formData.industry} companies have reached out recently about similar challenges.\n\nIf you'd like to explore this for ${formData.company_name}, I'm happy to share some insights. Otherwise, I'll take you off my outreach list.\n\nWishing you continued success,\n[Your Name]`,
          timing: "Send 1 month after step 4",
          notes: "Final follow-up with seasonal context"
        }
      ],
      summary: `${formData.tone} 5-step sequence for ${formData.goal.replace('-', ' ')} targeting ${formData.industry} ${formData.job_title}`
    };

    return mockWorkflow;
  } catch (error) {
    throw new Error('Failed to generate AI workflow');
  }
}

// Create email workflow
export async function createEmailWorkflow(formData: WorkflowFormData, generatedWorkflow: GeneratedWorkflow): Promise<EmailWorkflow> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'email-workflows',
      title: `${formData.company_name} - ${formData.goal.replace('-', ' ')}`,
      metadata: {
        full_name: formData.full_name,
        email_address: formData.email_address,
        company_name: formData.company_name,
        job_title: formData.job_title,
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
    throw new Error('Failed to create email workflow');
  }
}

// Get workflow by slug
export async function getWorkflow(slug: string): Promise<EmailWorkflow | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'email-workflows',
      slug
    }).props(['title', 'metadata']);

    return response.object as EmailWorkflow;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch workflow');
  }
}

// Get user workflows
export async function getUserWorkflows(email: string): Promise<EmailWorkflow[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'email-workflows',
        'metadata.email_address': email
      })
      .props(['title', 'slug', 'metadata', 'created_at'])
      .sort('-created_at');

    return response.objects as EmailWorkflow[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch user workflows');
  }
}