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

// User Profile interface for form handling
export interface UserProfile {
  full_name: string;
  email_address: string;
  company_name: string;
  job_title: string;
  company_bio?: string;
  industry: IndustryKey;
  phone?: string;
  website?: string;
}

// Prospect interface for form handling
export interface ProspectData {
  full_name: string;
  email_address: string;
  company_name: string;
  job_title: string;
  industry: IndustryKey;
  linkedin_url?: string;
  notes?: string;
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

// Comprehensive form data interface that includes all fields used in the application
export interface WorkflowFormData {
  // Required core fields (matches CMS structure)
  full_name: string;
  email_address: string;
  company_name: string;
  job_title: string;
  industry: IndustryKey;
  goal: GoalKey;
  tone: ToneKey;
  
  // Optional sender information (for multi-step forms)
  sender_full_name?: string;
  sender_email_address?: string;
  sender_company_name?: string;
  sender_job_title?: string;
  
  // Optional prospect information (for multi-step forms)
  prospect_full_name?: string;
  prospect_email_address?: string;
  prospect_company_name?: string;
  prospect_job_title?: string;
  
  // Optional additional fields
  company_bio?: string;
  emailCount?: number;
}

// Extended form data interface for multi-step workflow generation
export interface ExtendedWorkflowFormData {
  // Prospect information
  prospect_full_name: string;
  prospect_email_address: string;
  prospect_company_name: string;
  prospect_job_title: string;
  
  // Sender information  
  sender_full_name: string;
  sender_email_address: string;
  sender_company_name: string;
  sender_job_title: string;
  
  // Campaign settings
  industry: IndustryKey;
  goal: GoalKey;
  tone: ToneKey;
  
  // Optional fields
  company_bio?: string;
}

// Form step enumeration
export enum FormStep {
  USER_PROFILE = 'user-profile',
  PROSPECT_INFO = 'prospect-info',
  API_KEY = 'api-key',
  CAMPAIGN_SETTINGS = 'campaign-settings',
  REVIEW = 'review'
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

// API Key validation interface
export interface ApiKeyValidation {
  isValid: boolean;
  error?: string;
}

// Workflow generation request interface
export interface WorkflowGenerationRequest extends ExtendedWorkflowFormData {
  apiKey: string;
  emailCount?: number;
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

// Form validation schemas (basic)
export const REQUIRED_FIELDS = {
  userProfile: ['full_name', 'email_address', 'company_name', 'job_title', 'industry'],
  prospectInfo: ['full_name', 'email_address', 'company_name', 'job_title'],
  campaignSettings: ['goal', 'tone']
} as const;