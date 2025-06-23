<!-- README_START -->
# Outbound Engine

🎯 **Enter a few details. Get a full email sequence.**

Outbound Engine is an AI-powered sales automation platform that creates personalized email workflows based on your target prospect information. Simply provide basic details about yourself and your goal, and our AI will generate a complete 5-step cold email sequence tailored to your needs.

## Features

- 🤖 **AI-Generated Email Sequences** - Create personalized 5-step email workflows instantly
- 📧 **Multiple Templates** - Choose from various tones (Friendly, Professional, Direct, Funny)
- 🎯 **Goal-Oriented** - Sequences optimized for booking demos, raising awareness, or closing deals
- 📋 **Copy & Export** - Easily copy individual emails or export entire sequences
- 💾 **Workflow Storage** - Save and manage your generated sequences
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- ⚡ **Real-time Generation** - Get your complete sequence in seconds

## Clone this Bucket

## Clone this Bucket

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket to get started instantly:

[![Clone this Bucket](https://img.shields.io/badge/Clone%20this%20Bucket-4F46E5?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=outbound-engine-production)

## Original Prompt

This application was built based on the following request:

> I want to build a web app called "Outbound Engine" that creates custom AI-generated email workflows based on a few user inputs. Please build both the frontend and backend for this app, using modern React (with Tailwind), and Cosmic for content management and storage.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Content Management**: [Cosmic](https://www.cosmicjs.com)
- **AI Integration**: Cosmic AI SDK for text generation
- **Package Manager**: Bun
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket
- Environment variables set up

### Installation

1. **Clone this repository**
```bash
git clone <repository-url>
cd outbound-engine
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Add your Cosmic credentials:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. **Run the development server**
```bash
bun run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Cosmic SDK Examples

### Fetching Email Templates
```typescript
import { cosmic } from '@/lib/cosmic'

const templates = await cosmic.objects.find({
  type: 'email-templates'
}).props(['title', 'slug', 'metadata']).depth(1)
```

### Creating Email Sequences
```typescript
await cosmic.objects.insertOne({
  type: 'email-sequences',
  title: 'New Email Sequence',
  metadata: {
    sequence_name: 'Demo Request Sequence',
    sender_profile: senderProfileId,
    prospect: prospectId,
    email_count: 5,
    frequency_days: 3,
    tone: 'friendly',
    goal: 'book_demo'
  }
})
```

### AI Text Generation
```typescript
const aiResponse = await cosmic.ai.generateText({
  prompt: `Create a 5-step cold email sequence for ${jobTitle} at ${companyName}...`,
  max_tokens: 1500
})
```

## Cosmic CMS Integration

This app leverages several Cosmic content models:

- **Email Sequences**: Main workflow records
- **Email Steps**: Individual emails in sequences
- **Prospects**: Target prospect information
- **Sender Profiles**: User/sender information
- **Email Templates**: Reusable email templates

All data is stored and managed through [Cosmic's headless CMS](https://www.cosmicjs.com/docs), providing a powerful admin interface for content management.

## Deployment Options

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

### Environment Variables for Production
Set these in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`
- `COSMIC_WRITE_KEY`

For more deployment options, see the [Cosmic docs](https://www.cosmicjs.com/docs).
<!-- README_END -->