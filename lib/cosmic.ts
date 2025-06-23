import { createBucketClient } from '@cosmicjs/sdk';
import { 
  EmailSequence, 
  EmailStep, 
  Prospect, 
  SenderProfile, 
  EmailTemplate,
  EmailSequenceFormData,
  GeneratedSequence,
  CosmicError,
  isCosmicError
} from '@/types';

// Initialize Cosmic client
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all email sequences
export async function getEmailSequences(): Promise<EmailSequence[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'email-sequences' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    return response.objects as EmailSequence[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email sequences');
  }
}

// Fetch email sequence by slug
export async function getEmailSequence(slug: string): Promise<EmailSequence | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'email-sequences',
        slug: slug
      })
      .depth(1);
    
    return response.object as EmailSequence;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch email steps for a sequence
export async function getEmailSteps(sequenceId: string): Promise<EmailStep[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'email-steps',
        'metadata.email_sequence': sequenceId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as EmailStep[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email steps');
  }
}

// Create prospect
export async function createProspect(data: {
  full_name: string;
  email_address: string;
  job_title?: string;
  company_name?: string;
  company_industry?: string;
}): Promise<Prospect> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'prospects',
      title: `${data.full_name} - ${data.job_title || 'Contact'}`,
      slug: `${data.full_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      metadata: {
        full_name: data.full_name,
        email_address: data.email_address,
        job_title: data.job_title || '',
        company_name: data.company_name || '',
        company_industry: data.company_industry || '',
        status: 'new'
      }
    });
    
    return response.object as Prospect;
  } catch (error) {
    console.error('Error creating prospect:', error);
    throw new Error('Failed to create prospect');
  }
}

// Get or create sender profile
export async function getActiveSenderProfile(): Promise<SenderProfile | null> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'sender-profiles',
        'metadata.active': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .limit(1);
    
    return response.objects.length > 0 ? response.objects[0] as SenderProfile : null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch sender profile');
  }
}

// Generate email sequence using AI
export async function generateEmailSequence(formData: EmailSequenceFormData): Promise<GeneratedSequence> {
  try {
    const prompt = `Create a professional 5-step cold email sequence for a ${formData.job_title} at ${formData.company_name} in the ${formData.industry} industry. 

The sender's details:
- Name: ${formData.full_name}
- Email: ${formData.email_address}
- Company: ${formData.company_name}

Requirements:
- Tone: ${formData.tone}
- Goal: ${formData.goal}
- Each email should be progressively more direct but still professional
- Include specific timing suggestions (Day 1, Day 4, Day 7, etc.)
- Each step should have a compelling subject line and body
- Personalize for the ${formData.industry} industry
- Focus on the goal: ${formData.goal}

Return the response in this exact JSON format:
{
  "steps": [
    {
      "step_number": 1,
      "subject_line": "Subject line here",
      "email_body": "Email body in HTML format with <p> tags",
      "timing": "Day 1 - Send immediately"
    },
    ...continue for 5 steps
  ]
}

Make sure each email builds on the previous one and moves closer to achieving the goal of ${formData.goal}.`;

    const aiResponse = await cosmic.ai.generateText({
      prompt: prompt,
      max_tokens: 2000
    });

    // Parse the AI response
    const responseText = aiResponse.text;
    
    // Try to extract JSON from the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Fallback: create a structured response from the text
      return createFallbackSequence(formData, responseText);
    }

    try {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!parsedResponse.steps || !Array.isArray(parsedResponse.steps)) {
        return createFallbackSequence(formData, responseText);
      }

      return {
        steps: parsedResponse.steps,
        metadata: {
          prospect_name: formData.full_name,
          company_name: formData.company_name,
          tone: formData.tone,
          goal: formData.goal
        }
      };
    } catch (parseError) {
      return createFallbackSequence(formData, responseText);
    }
  } catch (error) {
    console.error('Error generating email sequence:', error);
    throw new Error('Failed to generate email sequence');
  }
}

// Fallback function to create structured sequence from unstructured text
function createFallbackSequence(formData: EmailSequenceFormData, aiText: string): GeneratedSequence {
  // Split the text into logical sections and create a basic structure
  const sections = aiText.split(/Step \d+:|Email \d+:/i);
  const steps = [];
  
  for (let i = 1; i <= 5; i++) {
    const sectionText = sections[i] || `Email ${i} content for ${formData.goal}`;
    
    steps.push({
      step_number: i,
      subject_line: `Follow-up ${i} - ${formData.company_name}`,
      email_body: `<p>Hi ${formData.full_name},</p><p>${sectionText.substring(0, 200)}...</p><p>Best regards,<br/>Your Name</p>`,
      timing: `Day ${(i - 1) * 3 + 1} - ${i === 1 ? 'Send immediately' : 'Follow-up email'}`
    });
  }

  return {
    steps,
    metadata: {
      prospect_name: formData.full_name,
      company_name: formData.company_name,
      tone: formData.tone,
      goal: formData.goal
    }
  };
}

// Save generated sequence to Cosmic
export async function saveEmailSequence(
  sequence: GeneratedSequence,
  formData: EmailSequenceFormData,
  prospectId: string,
  senderProfileId?: string
): Promise<EmailSequence> {
  try {
    // Create the email sequence
    const sequenceResponse = await cosmic.objects.insertOne({
      type: 'email-sequences',
      title: `${sequence.metadata.prospect_name} - ${sequence.metadata.goal} Sequence`,
      slug: `${sequence.metadata.prospect_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      metadata: {
        sequence_name: `${sequence.metadata.prospect_name} - ${sequence.metadata.goal} Sequence`,
        sender_profile: senderProfileId || '',
        prospect: prospectId,
        email_count: sequence.steps.length,
        frequency_days: 3,
        tone: sequence.metadata.tone,
        goal: sequence.metadata.goal,
        status: 'draft',
        generated_at: new Date().toISOString()
      }
    });

    const savedSequence = sequenceResponse.object as EmailSequence;

    // Create email steps
    for (const step of sequence.steps) {
      await cosmic.objects.insertOne({
        type: 'email-steps',
        title: `Step ${step.step_number} - ${step.subject_line}`,
        slug: `${savedSequence.slug}-step-${step.step_number}`,
        metadata: {
          email_sequence: savedSequence.id,
          step_number: step.step_number,
          subject_line: step.subject_line,
          email_body: step.email_body,
          send_delay_days: (step.step_number - 1) * 3,
          status: 'draft'
        }
      });
    }

    return savedSequence;
  } catch (error) {
    console.error('Error saving email sequence:', error);
    throw new Error('Failed to save email sequence');
  }
}

// Get email templates
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'email-templates',
        'metadata.active': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as EmailTemplate[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email templates');
  }
}