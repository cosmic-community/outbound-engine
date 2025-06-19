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

// App Settings interface
export interface AppSettings extends CosmicObject {
  type_slug: 'app-settings';
  metadata: {
    site_title?: string;
    site_description?: string;
    hero_headline?: string;
    hero_subheadline?: string;
    cta_button_text?: string;
    about_content?: string;
    faq_content?: FAQItem[];
    social_links?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
    company_bio?: string;
  };
}

// FAQ Item interface
export interface FAQItem {
  question: string;
  answer: string;
}

// User interface
export interface User extends CosmicObject {
  type_slug: 'users';
  metadata: {
    full_name: string;
    email_address: string;
    company?: string;
    job_title?: string;
    workflows?: EmailWorkflow[];
    registration_date?: string;
  };
}

// Email Workflow interface
export interface EmailWorkflow extends CosmicObject {
  type_slug: 'email-workflows';
  metadata: {
    full_name: string;
    email_address: string;
    company_name: string;
    job_title: string;
    industry: IndustryOption;
    goal: GoalOption;
    tone: ToneOption;
    generated_workflow?: GeneratedWorkflow;
    status: WorkflowStatus;
    generation_date?: string;
  };
}

// Generated workflow structure
export interface GeneratedWorkflow {
  steps: EmailStep[];
  summary: string;
}

// Individual email step
export interface EmailStep {
  step: number;
  subject: string;
  body: string;
  timing: string;
  notes: string;
}

// Select dropdown option structure
export interface SelectOption {
  key: string;
  value: string;
}

// Type literals for select dropdown values
export type IndustryKey = 'tech' | 'finance' | 'healthcare' | 'retail' | 'manufacturing' | 'education' | 'real-estate' | 'consulting' | 'marketing' | 'other';
export type GoalKey = 'book-demo' | 'raise-awareness' | 'close-deal';
export type ToneKey = 'friendly' | 'professional' | 'direct' | 'funny';
export type WorkflowStatusKey = 'generated' | 'edited' | 'exported';

export type IndustryOption = SelectOption;
export type GoalOption = SelectOption;
export type ToneOption = SelectOption;
export type WorkflowStatus = SelectOption;

// Form data interface
export interface WorkflowFormData {
  full_name: string;
  email_address: string;
  company_name: string;
  job_title: string;
  industry: IndustryKey;
  goal: GoalKey;
  tone: ToneKey;
}

// API response interfaces
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

export interface CosmicSingleResponse<T> {
  object: T;
}

// Type guards
export function isAppSettings(obj: CosmicObject): obj is AppSettings {
  return obj.type_slug === 'app-settings';
}

export function isUser(obj: CosmicObject): obj is User {
  return obj.type_slug === 'users';
}

export function isEmailWorkflow(obj: CosmicObject): obj is EmailWorkflow {
  return obj.type_slug === 'email-workflows';
}

// Constants for dropdown options
export const INDUSTRY_OPTIONS: Record<IndustryKey, string> = {
  'tech': 'Technology',
  'finance': 'Finance',
  'healthcare': 'Healthcare',
  'retail': 'Retail',
  'manufacturing': 'Manufacturing',
  'education': 'Education',
  'real-estate': 'Real Estate',
  'consulting': 'Consulting',
  'marketing': 'Marketing',
  'other': 'Other'
};

export const GOAL_OPTIONS: Record<GoalKey, string> = {
  'book-demo': 'Book a Demo',
  'raise-awareness': 'Raise Awareness',
  'close-deal': 'Close Deal'
};

export const TONE_OPTIONS: Record<ToneKey, string> = {
  'friendly': 'Friendly',
  'professional': 'Professional',
  'direct': 'Direct',
  'funny': 'Funny'
};

export const STATUS_OPTIONS: Record<WorkflowStatusKey, string> = {
  'generated': 'Generated',
  'edited': 'Edited',
  'exported': 'Exported'
};