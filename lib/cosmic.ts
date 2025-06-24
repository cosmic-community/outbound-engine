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
import { generateSequenceFromTemplate } from './emailGenerator';

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

// Generate email sequence using template-based generation
export async function generateEmailSequence(formData: EmailSequenceFormData): Promise<GeneratedSequence> {
  console.log('Starting email sequence generation for:', formData.full_name);

  try {
    // Use template-based generation for reliable results
    console.log('Using template-based generation...');
    const sequence = generateSequenceFromTemplate(formData);
    console.log('Email sequence generated successfully with', sequence.steps.length, 'steps');
    return sequence;
  } catch (error) {
    console.error('Error generating email sequence:', error);
    throw new Error('Failed to generate email sequence');
  }
}

// Save generated sequence to Cosmic
export async function saveEmailSequence(
  sequence: GeneratedSequence,
  formData: EmailSequenceFormData,
  prospectId: string,
  senderProfileId?: string
): Promise<EmailSequence> {
  try {
    console.log('Saving email sequence to Cosmic...');
    
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
    console.log('Email sequence saved with ID:', savedSequence.id);

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

    console.log('All email steps saved successfully');
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