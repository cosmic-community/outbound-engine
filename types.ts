// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type_slug: string;
  created_at: string;
  modified_at: string;
}

// Email Sequence interface
export interface EmailSequence extends CosmicObject {
  type_slug: 'email-sequences';
  metadata: {
    sequence_name: string;
    sender_profile?: SenderProfile;
    prospect?: Prospect;
    email_count: number;
    frequency_days: number;
    tone: EmailTone;
    goal: EmailGoal;
    status?: SequenceStatus;
    generated_at?: string;
    started_at?: string;
  };
}

// Email Step interface
export interface EmailStep extends CosmicObject {
  type_slug: 'email-steps';
  metadata: {
    email_sequence?: EmailSequence;
    step_number: number;
    subject_line: string;
    email_body: string;
    send_delay_days?: number;
    status?: StepStatus;
    scheduled_send_date?: string;
    sent_at?: string;
    open_count?: number;
    click_count?: number;
  };
}

// Prospect interface
export interface Prospect extends CosmicObject {
  type_slug: 'prospects';
  metadata: {
    full_name: string;
    email_address: string;
    job_title?: string;
    company_name?: string;
    company_industry?: string;
    notes?: string;
    linkedin_url?: string;
    status?: ProspectStatus;
  };
}

// Sender Profile interface
export interface SenderProfile extends CosmicObject {
  type_slug: 'sender-profiles';
  metadata: {
    full_name: string;
    email_address: string;
    job_title: string;
    company_name: string;
    company_description?: string;
    phone_number?: string;
    linkedin_url?: string;
    active: boolean;
  };
}

// Email Template interface
export interface EmailTemplate extends CosmicObject {
  type_slug: 'email-templates';
  metadata: {
    template_name: string;
    template_category?: TemplateCategory;
    subject_template: string;
    body_template: string;
    variables?: {
      variables: string[];
    };
    tone?: EmailTone;
    goal?: EmailGoal;
    active: boolean;
  };
}

// Type literals for select-dropdown values
export type EmailTone = 'friendly' | 'direct' | 'formal' | 'funny';
export type EmailGoal = 'book_demo' | 'introduce_product' | 'close_deal' | 'network' | 'follow_up';
export type SequenceStatus = 'draft' | 'active' | 'paused' | 'completed';
export type StepStatus = 'draft' | 'scheduled' | 'sent' | 'failed';
export type ProspectStatus = 'new' | 'contacted' | 'responded' | 'qualified' | 'closed';
export type TemplateCategory = 'introduction' | 'follow_up' | 'demo_request' | 'closing' | 'nurture';

// Form interfaces
export interface EmailSequenceFormData {
  full_name: string;
  email_address: string;
  company_name: string;
  job_title: string;
  industry: string;
  goal: EmailGoal;
  tone: EmailTone;
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

export interface GeneratedSequenceStep {
  step_number: number;
  subject_line: string;
  email_body: string;
  timing: string;
}

export interface GeneratedSequence {
  steps: GeneratedSequenceStep[];
  metadata: {
    prospect_name: string;
    company_name: string;
    tone: EmailTone;
    goal: EmailGoal;
  };
}

// Type guards
export function isEmailSequence(obj: CosmicObject): obj is EmailSequence {
  return obj.type_slug === 'email-sequences';
}

export function isProspect(obj: CosmicObject): obj is Prospect {
  return obj.type_slug === 'prospects';
}

export function isSenderProfile(obj: CosmicObject): obj is SenderProfile {
  return obj.type_slug === 'sender-profiles';
}

export function isEmailTemplate(obj: CosmicObject): obj is EmailTemplate {
  return obj.type_slug === 'email-templates';
}

// Error types
export interface CosmicError extends Error {
  status?: number;
  code?: string;
}

export function isCosmicError(error: unknown): error is CosmicError {
  return error instanceof Error && 'status' in error;
}