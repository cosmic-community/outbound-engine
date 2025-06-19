<!-- README_START -->
# Outbound Engine

![Outbound Engine](https://imgix.cosmicjs.com/logo-placeholder.png?w=800&h=400&fit=crop&auto=format,compress)

A powerful AI-driven email workflow generator that creates personalized cold email sequences in seconds. Simply enter a few details about your target prospect and campaign goals, and get a complete 5-step email sequence tailored to your industry, tone, and objectives.

## Features

- **AI-Powered Email Generation**: Create custom 4-5 step email sequences using advanced AI
- **Industry-Specific Templates**: Tailored content for Technology, Finance, Healthcare, and more
- **Multiple Campaign Goals**: Book demos, raise awareness, or close deals
- **Tone Customization**: Choose from Friendly, Professional, Direct, or Funny tones
- **Copy & Export**: Easily copy individual emails or export entire sequences
- **User Management**: Track and manage generated workflows
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Generation**: Get your email sequence in seconds

## Clone this Bucket

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket to get started instantly:

[![Clone this Bucket](https://img.shields.io/badge/Clone%20this%20Bucket-4F46E5?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=outbound-engine-production)

## Original Prompt

This application was built based on the following request:

> I want to build a web app called "Outbound Engine" that creates custom AI-generated email workflows based on a few user inputs. Please build both the frontend and backend for this app, using modern React (with Tailwind), and Cosmic for content management and storage. The app should include a homepage with hero section, input form with validation, results page displaying generated workflows, and AI integration using Cosmic's AI engine to generate cold email sequences.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Content Management**: [Cosmic](https://www.cosmicjs.com) CMS
- **AI Integration**: Cosmic AI Engine
- **Language**: TypeScript
- **Package Manager**: Bun
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket
- Environment variables set up

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Cosmic credentials to `.env.local`:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

5. Run the development server:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching App Settings
```typescript
import { cosmic } from '@/lib/cosmic'

const settings = await cosmic.objects
  .findOne({
    type: 'app-settings',
    slug: 'outbound-engine-settings'
  })
  .props(['title', 'metadata'])
```

### Creating a New Email Workflow
```typescript
const workflow = await cosmic.objects.insertOne({
  type: 'email-workflows',
  title: `${formData.company_name} - ${formData.goal}`,
  metadata: {
    full_name: formData.full_name,
    email_address: formData.email_address,
    company_name: formData.company_name,
    job_title: formData.job_title,
    industry: formData.industry,
    goal: formData.goal,
    tone: formData.tone,
    generated_workflow: aiGeneratedSteps,
    status: 'generated',
    generation_date: new Date().toISOString().split('T')[0]
  }
})
```

### Fetching User Workflows
```typescript
const workflows = await cosmic.objects
  .find({
    type: 'email-workflows',
    'metadata.email_address': userEmail
  })
  .props(['title', 'slug', 'metadata'])
  .sort('-created_at')
```

## Cosmic CMS Integration

This application uses [Cosmic](https://www.cosmicjs.com) as a headless CMS for:

- **App Settings**: Site configuration, hero content, and branding
- **Email Workflows**: Generated AI sequences and user data
- **Users**: User management and workflow tracking
- **AI Integration**: Leveraging Cosmic's AI engine for content generation

For more information about the Cosmic SDK, visit the [Cosmic docs](https://www.cosmicjs.com/docs).

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the application: `bun run build`
2. Upload the `out` folder to Netlify
3. Configure environment variables
4. Set up form handling if needed

### Other Platforms
This Next.js application can be deployed to any platform that supports Node.js applications.

<!-- README_END -->