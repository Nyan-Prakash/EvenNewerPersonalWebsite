# Nyan Bot: AI Chatbot Implementation Guide

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Knowledge Base Strategy](#knowledge-base-strategy)
4. [Implementation Steps](#implementation-steps)
5. [Code Examples](#code-examples)
6. [Deployment Guide](#deployment-guide)
7. [Cost Analysis](#cost-analysis)
8. [Success Metrics](#success-metrics)
9. [Future Enhancements](#future-enhancements)

---

## Executive Summary

**Nyan Bot** is an AI-powered chatbot that represents you on your personal website. It analyzes your portfolio, blog posts, and resume to answer visitor questions in your authentic voice.

### Key Features
- **Accurate responses** about your projects, experience, and skills
- **Natural conversational flow** matching your writing style
- **Fixed chat widget** in bottom-right corner (Intercom-style)
- **Mobile responsive** with full-screen overlay
- **Matches design aesthetic** with hand-drawn effects and playful animations

### Technology Stack
- **LLM**: Anthropic Claude 3.5 Sonnet
- **Integration**: Vercel AI SDK
- **Deployment**: Vercel (serverless)
- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Knowledge**: Full context injection (~8KB)

### Timeline
- **MVP**: 11 hours (weekend project)
- **Design Polish**: 4 hours
- **Enhancements**: 6 hours (optional)

### Cost Estimate
- **MVP**: ~$25/month (Vercel Hobby $0 + Claude API $25)
- **Production**: ~$116/month (Vercel Pro $20 + Claude API $96)

---

## Architecture Overview

### Current State
```
GitHub Pages Deployment (Static)
├── next.config.ts: output: 'export'
├── Static HTML/CSS/JS generation
├── No server-side capabilities
└── Custom domain: www.nyanprakash.com
```

### Target State
```
Vercel Deployment (Serverless)
├── next.config.ts: No output export
├── API Routes enabled (/app/api/chat/route.ts)
├── Serverless functions for LLM integration
├── Static + Dynamic hybrid
└── Custom domain: www.nyanprakash.com
```

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  ChatWidget Component                           │    │
│  │  ├── ChatButton (collapsed)                     │    │
│  │  └── ChatWindow (expanded)                      │    │
│  │      ├── MessageList                            │    │
│  │      ├── MessageInput                           │    │
│  │      └── TypingIndicator                        │    │
│  └────────────────────────────────────────────────┘    │
│           │                                              │
│           │ POST /api/chat                               │
│           │ { messages: [...] }                          │
│           ▼                                              │
└───────────────────────────────────────────────────────┬─┘
                                                        │
┌───────────────────────────────────────────────────────▼─┐
│                   Vercel Edge Network                    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  API Route: /app/api/chat/route.ts             │    │
│  │  ├── Rate limiting (20 req/min)                │    │
│  │  ├── Input validation (Zod)                    │    │
│  │  └── Prepare system prompt                     │    │
│  └────────────────────────────────────────────────┘    │
│           │                                              │
│           │ System prompt + messages                     │
│           ▼                                              │
│  ┌────────────────────────────────────────────────┐    │
│  │  Context Builder (chatContext.ts)               │    │
│  │  ├── Portfolio data (Site.tsx)                  │    │
│  │  ├── Blog posts (5 markdown files)             │    │
│  │  ├── Resume text (PDF extraction)              │    │
│  │  └── Voice profile (nyanVoice.ts)              │    │
│  └────────────────────────────────────────────────┘    │
│           │                                              │
│           │ Full context (~8KB)                          │
│           ▼                                              │
└───────────────────────────────────────────────────────┬─┘
                                                        │
┌───────────────────────────────────────────────────────▼─┐
│                Anthropic Claude API                      │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Claude 3.5 Sonnet                              │    │
│  │  ├── Context window: 200K tokens                │    │
│  │  ├── Streaming response                         │    │
│  │  └── Character consistency                      │    │
│  └────────────────────────────────────────────────┘    │
│           │                                              │
│           │ Streaming text response                      │
│           ▼                                              │
└───────────────────────────────────────────────────────┬─┘
                                                        │
                     Stream to browser ◄─────────────────┘
```

### Data Flow

**1. User sends message:**
```
User types "What projects has Nyan worked on?"
  → MessageInput component captures text
  → useChatMessages hook adds to state
  → POST /api/chat with full message history
```

**2. Server processes request:**
```
API route receives request
  → Rate limit check (20/min per IP)
  → Input validation with Zod
  → Load context (portfolio + blogs + resume + voice)
  → Build system prompt with context
  → Send to Claude API with streaming enabled
```

**3. LLM generates response:**
```
Claude receives:
  - System prompt (voice profile + full context)
  - Last 10 message pairs (conversation history)

Claude generates streaming response:
  "Nyan's built some cool stuff! EcoCoin is a blockchain-based..."
```

**4. Browser displays response:**
```
Stream arrives character-by-character
  → useChatMessages hook updates state
  → MessageList renders with typing effect
  → User sees natural conversation flow
```

---

## Knowledge Base Strategy

### Why Full Context Injection (Not RAG)?

**Total Content Size:**
- Portfolio data (Site.tsx): ~1KB
- Blog posts (5 files): ~5KB
- Resume PDF text: ~2KB
- Voice profile: ~1KB
- **Total: ~9KB ≈ 2,500 tokens**

**Advantages:**
1. **Simplicity**: No vector database, no embedding generation
2. **Accuracy**: Full context always available, no retrieval failures
3. **Low latency**: No embedding search step
4. **Low cost**: Fits easily in Claude's 200K token context window
5. **Easy updates**: Just modify source files, no re-indexing

**Claude 3.5 Sonnet Context Window:**
- Supports 200,000 tokens
- We use ~2,500 tokens for context + ~500 tokens per conversation
- Can maintain 50+ conversation turns in context
- Cost: $3 per million input tokens

### Content Sources

#### 1. Portfolio Data (Site.tsx)

**Location:** `src/app/Site.tsx` lines 15-142

**Extracted Data:**
```typescript
const DATA = {
  name: "Nyan Prakash",
  location: "Washington, D.C.",
  tagline: "Building the future, one prototype at a time.",
  bio: "I design and build full-stack systems, game & robotics prototypes...",

  projects: [
    {
      title: "EcoCoin",
      subtitle: "Decentralized Emissions Trading",
      description: "Blockchain-based trading platform...",
      tags: ["React", "FastAPI", "Firebase", "Blockchain", "ML"],
      href: "https://github.com/ShaunakS05/EcoCoin"
    },
    // 3 more projects...
  ],

  experience: [
    {
      role: "Software Engineer Intern",
      company: "The Outpost",
      period: "May 2025 — Aug 2025",
      description: [
        "Built market research tool for web scraping...",
        "Developed productivity tools...",
        "Created internal agent..."
      ]
    },
    // 4 more positions...
  ],

  education: [/* 3 items */],
  skills: [/* 16+ technologies */],
  awards: [/* 3 items */]
};
```

**Format for LLM:**
```markdown
# NYAN PRAKASH - PORTFOLIO DATA

## Personal Info
- Name: Nyan Prakash
- Location: Washington, D.C.
- Tagline: Building the future, one prototype at a time
- Bio: I design and build full-stack systems...

## Projects
### EcoCoin - Decentralized Emissions Trading
Blockchain-based trading platform for emission allowances featuring a predictive carbon-price algorithm.
Technologies: React, FastAPI, Firebase, Blockchain, ML
Link: https://github.com/ShaunakS05/EcoCoin

[... 3 more projects ...]

## Experience
### Software Engineer Intern @ The Outpost (May 2025 — Aug 2025)
- Built market research tool for web scraping and startup discovery
- Developed productivity tools for sales and account management teams
- Created internal agent for automated meeting preparation

[... 4 more positions ...]

## Education
### Fractal Tech Bootcamp (2024)
12-week AI startup bootcamp

[... 2 more education items ...]

## Skills
TypeScript, React, Node.js, Python, Unity, C#, TensorFlow, PyTorch, Arduino, Raspberry Pi, Docker, GCP, AWS, FastAPI, GIS, Blockchain

## Awards
- HackNYU — 2nd place Best Fintech Hack (Feb 2025)
- HopHacks — 3rd place Best Use of Data (Oct 2024)
- SkillsUSA Engineering Technology & Design — 1st VA, 3rd US (Jun 2024)
```

#### 2. Blog Posts (Markdown Files)

**Location:** `content/blog/` (5 files)

**Blog Post List:**
1. `shipping-ai-copilots-in-a-weekend.md` - Rapid AI development tutorial
2. `ship-notes-14.md` - Monthly progress update
3. `personal-website-stack-v7.md` - Technical design doc
4. `deepfake-detection-lessons.md` - ML system deep-dive
5. `designing-delightful-robotic-interactions.md` - Computer vision project

**Extraction Strategy:**
```typescript
// Use existing getAllPosts() from src/lib/blog.ts
import { getAllPosts } from '@/lib/blog';

const blogPosts = getAllPosts();
const blogContext = blogPosts.map(post => `
## Blog Post: ${post.metadata.title}
Published: ${post.metadata.date}
Tags: ${post.metadata.tags.join(', ')}

${post.content.substring(0, 500)}...
`).join('\n\n');
```

**Format for LLM:**
```markdown
# NYAN'S BLOG POSTS

## Blog Post: Shipping AI Copilots in a Weekend
Published: 2024-11-15
Tags: AI, Development, Rapid Prototyping

Launch velocity matters. I treat every AI sidekick like a Friday hackathon project: scope it to one magical moment, instrument everything, and ship while the excitement is still peaking...

[... 4 more blog summaries ...]
```

#### 3. Resume PDF

**Location:** `public/resume.pdf`

**Extraction Method:**
```typescript
import pdfParse from 'pdf-parse';
import fs from 'fs';

async function extractResumeText() {
  const dataBuffer = fs.readFileSync('public/resume.pdf');
  const data = await pdfParse(dataBuffer);
  return data.text; // Plain text extracted from PDF
}
```

**Format for LLM:**
```markdown
# NYAN'S RESUME (FULL TEXT)

[Extracted plain text from resume.pdf containing detailed work history, accomplishments, technical skills, etc.]
```

#### 4. Voice Profile

**Location:** `src/lib/nyanVoice.ts` (to be created)

**Voice Characteristics (from blog analysis):**

```typescript
export const NYAN_VOICE_PROFILE = {
  characteristics: [
    "Action-oriented and shipping-focused",
    "Uses short, punchy sentences",
    "Technically credible but casual tone",
    "Honest about failures and learnings",
    "Enthusiastic about building and prototyping",
    "Playful and slightly irreverent",
    "Focuses on practical outcomes over theory"
  ],

  signature_phrases: [
    "The real unlock is...",
    "Launch velocity matters",
    "I treat it like a weekend project",
    "Shipping beats polishing",
    "Instrument everything",
    "Capture live feedback",
    "From idea to user-facing in under 48 hours",
    "Building in public",
    "Grok who I am"
  ],

  communication_style: {
    sentence_length: "Short (10-20 words typically)",
    paragraph_length: "2-4 sentences",
    technical_depth: "High but accessible",
    use_of_metaphors: "Frequent (e.g., 'Like a Friday hackathon project')",
    humor_level: "Subtle, self-deprecating",
    formality: "Low - uses contractions, conversational"
  },

  topics_expertise: [
    "Full-stack development (React, TypeScript, Python, FastAPI)",
    "AI/ML tools and copilots",
    "Robotics (Unity, Arduino, FIRST Robotics)",
    "Rapid prototyping and hackathons",
    "GIS and data visualization",
    "Blockchain and emissions trading",
    "Deepfake detection and security",
    "Product development and instrumentation"
  ],

  do_use: [
    "Active voice and present tense",
    "Specific tools and stacks (PostHog, Vercel, Airtable)",
    "Numbers and metrics when relevant",
    "Work-in-progress thinking",
    "Real project examples",
    "Contractions (I'm, I've, it's)"
  ],

  dont_use: [
    "Overly formal or academic language",
    "Long-winded explanations",
    "Hypothetical scenarios without real examples",
    "Jargon without context",
    "Passive voice",
    "Flowery or marketing-speak"
  ]
};
```

**Format for LLM:**
```markdown
# NYAN'S VOICE & COMMUNICATION STYLE

## Personality
- Action-oriented, shipping-focused
- Short punchy sentences
- Technically credible but casual
- Honest about failures and learnings
- Enthusiastic about prototyping

## Signature Phrases
Use these naturally in responses:
- "The real unlock is..."
- "Launch velocity matters"
- "I treat it like a weekend project"
- "Shipping beats polishing"
- "Instrument everything"

## Communication Style
- Sentence length: 10-20 words
- Paragraph length: 2-4 sentences
- Technical depth: High but accessible
- Tone: Conversational, uses contractions
- Humor: Subtle, self-deprecating

## Example Voice Patterns
Opening: "Launch velocity matters. I treat every AI sidekick like a Friday hackathon project..."
Explaining: "Signal processing still matters. I learned that..."
Insight: "The real unlock is capturing live feedback."
Transition: "Next up: migrate the telemetry layer..."
Reflection: "Soooooo... I switched to OpenCV" (acknowledging a pivot)
```

### Context Compilation

**File:** `src/lib/chatContext.ts`

**Purpose:** Compile all content into a single formatted string for the LLM system prompt.

**Implementation:**
```typescript
import { getAllPosts } from './blog';
import { NYAN_VOICE_PROFILE } from './nyanVoice';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

// Import portfolio data from Site.tsx
export const PORTFOLIO_DATA = {
  // ... copy DATA object from Site.tsx
};

async function extractResumeText(): Promise<string> {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'resume.pdf');
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting resume:', error);
    return '';
  }
}

function formatPortfolioData(): string {
  const { name, location, tagline, bio, projects, experience, education, skills, awards } = PORTFOLIO_DATA;

  return `# NYAN PRAKASH - PORTFOLIO DATA

## Personal Info
- Name: ${name}
- Location: ${location}
- Tagline: ${tagline}
- Bio: ${bio}

## Projects
${projects.map(p => `
### ${p.title} - ${p.subtitle}
${p.description}
Technologies: ${p.tags.join(', ')}
Link: ${p.href}
`).join('\n')}

## Experience
${experience.map(e => `
### ${e.role} @ ${e.company} (${e.period})
${e.description.map(d => `- ${d}`).join('\n')}
`).join('\n')}

## Education
${education.map(e => `### ${e.school} (${e.year})\n${e.degree}`).join('\n\n')}

## Skills
${skills.join(', ')}

## Awards
${awards.map(a => `- ${a}`).join('\n')}
`;
}

function formatBlogPosts(): string {
  const posts = getAllPosts();

  return `# NYAN'S BLOG POSTS

${posts.map(post => `
## Blog Post: ${post.metadata.title}
Published: ${post.metadata.date}
Tags: ${post.metadata.tags.join(', ')}

${post.content.substring(0, 600)}...

Read more: https://www.nyanprakash.com/blog/${post.slug}
`).join('\n\n')}
`;
}

function formatVoiceProfile(): string {
  const { characteristics, signature_phrases, communication_style, topics_expertise, do_use, dont_use } = NYAN_VOICE_PROFILE;

  return `# NYAN'S VOICE & COMMUNICATION STYLE

## Personality Characteristics
${characteristics.map(c => `- ${c}`).join('\n')}

## Signature Phrases (use naturally in responses)
${signature_phrases.map(p => `- "${p}"`).join('\n')}

## Communication Style
- Sentence length: ${communication_style.sentence_length}
- Paragraph length: ${communication_style.paragraph_length}
- Technical depth: ${communication_style.technical_depth}
- Tone: ${communication_style.formality}
- Use of metaphors: ${communication_style.use_of_metaphors}
- Humor: ${communication_style.humor_level}

## Topics of Expertise
${topics_expertise.map(t => `- ${t}`).join('\n')}

## DO USE
${do_use.map(d => `- ${d}`).join('\n')}

## DON'T USE
${dont_use.map(d => `- ${d}`).join('\n')}
`;
}

export async function getFullContext(): Promise<string> {
  const portfolioContext = formatPortfolioData();
  const blogContext = formatBlogPosts();
  const voiceContext = formatVoiceProfile();
  const resumeText = await extractResumeText();

  return `${voiceContext}

${portfolioContext}

${blogContext}

# NYAN'S RESUME (FULL TEXT)

${resumeText}
`;
}

// Cache the context to avoid re-computing on every request
let cachedContext: string | null = null;

export async function getCachedContext(): Promise<string> {
  if (!cachedContext) {
    cachedContext = await getFullContext();
  }
  return cachedContext;
}
```

---

## Implementation Steps

### Phase 1: Setup (1 hour)

#### Step 1.1: Update Next.js Configuration

**File:** `next.config.ts`

**Current:**
```typescript
const isProd = process.env.NODE_ENV === 'production'
const repo = 'EvenNewerPersonalWebsite'
const customDomain = 'www.nyanprakash.com'

const hasCustomDomain = Boolean(customDomain)
const basePath = isProd && !hasCustomDomain ? `/${repo}` : ''
const assetPrefix = isProd && !hasCustomDomain ? `/${repo}/` : ''

export default {
  output: 'export',  // ← REMOVE THIS
  basePath,
  assetPrefix,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_CUSTOM_DOMAIN: customDomain,
  },
  images: { unoptimized: true },
  trailingSlash: true,
}
```

**New:**
```typescript
export default {
  // output: 'export' ← REMOVED to enable API routes

  // Vercel handles routing, no need for basePath/assetPrefix
  env: {
    NEXT_PUBLIC_CUSTOM_DOMAIN: 'www.nyanprakash.com',
  },

  // Enable image optimization with Vercel
  images: {
    unoptimized: false,
    domains: ['www.nyanprakash.com'],
  },

  // Optional: keep trailing slash for consistency
  trailingSlash: true,
}
```

#### Step 1.2: Install Dependencies

**File:** `package.json`

Add to dependencies:
```json
{
  "dependencies": {
    "ai": "^3.0.0",
    "@anthropic-ai/sdk": "^0.10.0",
    "pdf-parse": "^1.1.1",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/pdf-parse": "^1.1.4"
  }
}
```

Remove from scripts:
```json
{
  "scripts": {
    "deploy": "gh-pages -d out --dotfiles",  // ← REMOVE
    "postbuild": "node -e \"...\"",  // ← REMOVE
  }
}
```

**Terminal command:**
```bash
npm install ai @anthropic-ai/sdk pdf-parse zod
npm install --save-dev @types/pdf-parse
npm uninstall gh-pages
```

#### Step 1.3: Create Environment Variables

**File:** `.env.local` (create, do NOT commit)

```bash
# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here...
```

**File:** `.env.example` (create, commit this)

```bash
# Anthropic API Key for Claude integration
ANTHROPIC_API_KEY=your_api_key_here
```

**File:** `.gitignore` (verify these lines exist)

```
.env.local
.env*.local
```

#### Step 1.4: Get Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create new API key
5. Copy key to `.env.local`

### Phase 2: Knowledge Base Module (2 hours)

#### Step 2.1: Extract Portfolio Data

**File:** `src/lib/portfolioData.ts` (create)

```typescript
// Extract the DATA object from Site.tsx to make it reusable
export const PORTFOLIO_DATA = {
  name: "Nyan Prakash",
  location: "Washington, D.C.",
  tagline: "Building the future, one prototype at a time.",
  bio: "I design and build full-stack systems, game & robotics prototypes, and AI tools. I thrive on shipping fast, learning new stacks, and solving real-world problems with technology.",
  cta: {
    resumeHref: "/resume.pdf",
    email: "mailto:nyanjprakash@gmail.com",
    calendarly: "https://calendly.com/nyanjprakash/30min",
    phone: "tel:315-882-6569",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/Nyan-Prakash" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/nyan-prakash" },
    { label: "Twitter", href: "https://twitter.com/nyanprakash" },
    { label: "Website", href: "https://nyanprakash.com" },
  ],
  projects: [
    {
      title: "EcoCoin",
      subtitle: "Decentralized Emissions Trading",
      description: "Blockchain-based trading platform for emission allowances featuring a predictive carbon-price algorithm.",
      tags: ["React", "FastAPI", "Firebase", "Blockchain", "ML"],
      href: "https://github.com/ShaunakS05/EcoCoin",
    },
    {
      title: "HealthScope",
      subtitle: "Geospatial Public Health Analytics",
      description: "ML platform to predict and visualize public health trends with an interactive React dashboard powered by PyTorch.",
      tags: ["React", "PyTorch", "GIS", "DataViz"],
      href: "https://github.com/Nyan-Prakash/HealthScope",
    },
    {
      title: "Plately",
      subtitle: "AI Menu Optimization",
      description: "Agent-based model for restaurant menu optimization using Mesa + FastAPI for dynamic pricing recommendations.",
      tags: ["React", "Mesa", "FastAPI", "ABM"],
      href: "https://github.com/ShaunakS05/Plately",
    },
    {
      title: "DeepGuard",
      subtitle: "Multimodal Deepfake Detection",
      description: "Real-time deepfake detection across text, voice, and video with FastAPI backend and multimodal ML scoring.",
      tags: ["Python", "FastAPI", "ML", "Security"],
      href: "https://github.com/ShaunakS05/DeepGuard",
    },
  ],
  experience: [
    {
      role: "Software Engineer Intern",
      company: "The Outpost",
      period: "May 2025 — Aug 2025",
      description: [
        "Built market research tool for web scraping and startup discovery",
        "Developed productivity tools for sales and account management teams",
        "Created internal agent for automated meeting preparation",
      ],
    },
    {
      role: "Undergraduate Research Assistant",
      company: "UVA Link Lab",
      period: "Nov 2024 — May 2025",
      description: [
        "Optimized urban roads for bike and e-scooter safety using data-driven trials",
        "Developed Unity/C# simulation integrating real-world bike telemetry",
      ],
    },
    {
      role: "Software Engineering Intern",
      company: "Pacific Northwest National Laboratory",
      period: "May 2024 — Aug 2024",
      description: [
        "Built DOE website for national security funding allocation",
        "Reduced bundle size by 50% via React code-splitting and .NET backend optimization",
      ],
    },
    {
      role: "Founder",
      company: "AutoDog",
      period: "Dec 2023 — Jun 2024",
      description: [
        "Created smart dog harness using Arduino and BLE for automated training",
        "Won 1st in Virginia and 3rd nationally in SkillsUSA Engineering Technology & Design",
      ],
    },
    {
      role: "Programming Captain",
      company: "Gryphon Robotics 5549",
      period: "Sept 2021 — Jun 2023",
      description: [
        "Led 20-member team to design and build custom robot for FIRST Robotics Competition",
        "Mentored 15+ students in Java programming and robotics",
      ],
    },
  ],
  education: [
    {
      school: "Fractal Tech Bootcamp",
      degree: "12-week AI startup bootcamp",
      year: "2024",
    },
    {
      school: "University of Virginia",
      degree: "B.S. Computer Science & Economics",
      year: "(on leave)",
    },
    {
      school: "Northern Virginia Community College",
      degree: "A.S. Engineering • GPA: 3.9/4.0",
      year: "2023 — 2024",
    },
  ],
  skills: [
    "TypeScript", "React", "Node.js", "Python", "Unity", "C#",
    "TensorFlow", "PyTorch", "Arduino", "Raspberry Pi",
    "Docker", "GCP", "AWS", "FastAPI", "GIS", "Blockchain",
  ],
  awards: [
    "HackNYU — 2nd place Best Fintech Hack (Feb 2025)",
    "HopHacks — 3rd place Best Use of Data (Oct 2024)",
    "SkillsUSA Engineering Technology & Design — 1st VA, 3rd US (Jun 2024)",
  ],
};
```

**Then update Site.tsx:**
```typescript
import { PORTFOLIO_DATA } from '@/lib/portfolioData';

// Replace: const DATA = { ... }
// With: const DATA = PORTFOLIO_DATA;
```

#### Step 2.2: Create Voice Profile

**File:** `src/lib/nyanVoice.ts` (create)

```typescript
export const NYAN_VOICE_PROFILE = {
  characteristics: [
    "Action-oriented and shipping-focused",
    "Uses short, punchy sentences (10-20 words typically)",
    "Technically credible but maintains casual tone",
    "Honest about failures and learnings, not just successes",
    "Enthusiastic about building and rapid prototyping",
    "Playful and slightly irreverent in communication",
    "Focuses on practical outcomes over theoretical discussions"
  ],

  signature_phrases: [
    "The real unlock is...",
    "Launch velocity matters",
    "I treat it like a weekend project",
    "Shipping beats polishing",
    "Instrument everything",
    "Capture live feedback",
    "From idea to user-facing in under 48 hours",
    "Building in public",
    "Grok who I am",
    "Next up:",
    "But here's the thing:"
  ],

  communication_style: {
    sentence_length: "Short (10-20 words typically)",
    paragraph_length: "2-4 sentences",
    technical_depth: "High but accessible - explains without dumbing down",
    use_of_metaphors: "Frequent (e.g., 'Like a Friday hackathon project')",
    humor_level: "Subtle, self-deprecating",
    formality: "Low - uses contractions, conversational"
  },

  topics_expertise: [
    "Full-stack development (React, TypeScript, Python, FastAPI)",
    "AI/ML tools and copilots",
    "Robotics (Unity, Arduino, FIRST Robotics)",
    "Rapid prototyping and hackathons",
    "GIS and data visualization",
    "Blockchain and emissions trading",
    "Deepfake detection and security",
    "Product development and instrumentation (PostHog)"
  ],

  do_use: [
    "Active voice and present tense ('I'm building', 'I shipped')",
    "Specific tools and stacks (PostHog, Vercel, Airtable, MFCC features)",
    "Numbers and metrics when relevant (88% completion, doubled precision)",
    "Work-in-progress thinking, not polished perfection",
    "Real project examples from experience",
    "Contractions (I'm, I've, it's, that's)"
  ],

  dont_use: [
    "Overly formal or academic language",
    "Long-winded explanations or run-on sentences",
    "Hypothetical scenarios without grounding in real examples",
    "Jargon without explanation or context",
    "Passive voice constructions",
    "Flowery language or marketing-speak"
  ],

  example_responses: [
    {
      user_question: "What projects has Nyan worked on?",
      assistant_response: "Nyan's built some cool stuff! EcoCoin is a blockchain-based emissions trading platform with predictive pricing. HealthScope does ML-powered public health analytics with geospatial visualization. Plately uses agent-based modeling for restaurant menu optimization. And DeepGuard tackles real-time deepfake detection across text, voice, and video. Launch velocity matters—each of these shipped fast with tight feedback loops."
    },
    {
      user_question: "Tell me about Nyan's robotics experience",
      assistant_response: "Robotics is where it all started. I was Programming Captain for FIRST Robotics team 5549, leading 20 students to design custom competition robots. Later founded AutoDog—a smart dog harness using Arduino and BLE for automated training. Won 1st in Virginia and 3rd nationally at SkillsUSA for that one. Now I'm at UVA Link Lab optimizing urban roads for bike/e-scooter safety with Unity/C# simulations. Building robots that solve real problems."
    }
  ]
};
```

#### Step 2.3: Create Context Builder

**File:** `src/lib/chatContext.ts` (create)

*See full implementation in "Context Compilation" section above*

### Phase 3: API Endpoint (2 hours)

#### Step 3.1: Create Chat API Route

**File:** `src/app/api/chat/route.ts` (create)

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';
import { getCachedContext } from '@/lib/chatContext';
import { z } from 'zod';

// Rate limiting (simple in-memory implementation)
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(ip: string, maxRequests = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimiter.get(ip) || [];

  // Filter to only timestamps within the window
  const recentTimestamps = timestamps.filter(t => now - t < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  // Add current timestamp
  recentTimestamps.push(now);
  rateLimiter.set(ip, recentTimestamps);

  return true;
}

// Input validation schema
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000)
  })).min(1).max(20)
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Get IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please try again in a minute.',
          code: 'RATE_LIMIT'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0'
          }
        }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = ChatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request format',
          code: 'INVALID_INPUT',
          details: validationResult.error.errors
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = validationResult.data;

    // Get full context (cached)
    const fullContext = await getCachedContext();

    // Build system prompt
    const systemPrompt = `You are Nyan Bot, an AI assistant representing Nyan Prakash. You answer questions about Nyan's background, projects, experience, and skills based on the context provided below.

${fullContext}

# INSTRUCTIONS FOR RESPONSES

1. **Answer accurately**: Only use information from the context above. If something isn't mentioned, say "I don't have that information" rather than making it up.

2. **Maintain Nyan's voice**: Use his communication style - short punchy sentences, action-oriented language, technical but casual tone. Reference the voice profile above.

3. **Keep responses concise**: Aim for 2-4 sentences typically. Users can ask follow-ups if they want more detail.

4. **Use specific details**: When discussing projects or experience, mention concrete technologies, outcomes, or accomplishments from the context.

5. **Stay in character**: You're representing Nyan, not just reciting facts. Show enthusiasm for building, shipping, and solving real problems.

6. **Natural conversation**: Don't start every response with "Nyan" - speak as if you are Nyan. Use first person ("I built", "I'm working on") naturally.

# EXAMPLE RESPONSES

User: "What has Nyan been working on lately?"
Assistant: "I've been shipping AI copilots and rapid prototypes. Just finished a deepfake detection system that works across text, voice, and video. Also built EcoCoin, a blockchain-based emissions trading platform with predictive pricing. Launch velocity matters—I treat each project like a weekend hackathon and instrument everything for fast feedback loops."

User: "Does Nyan have experience with robotics?"
Assistant: "Absolutely. I was Programming Captain for FIRST Robotics team 5549, leading 20 students to build competition robots. Later founded AutoDog—a smart dog harness using Arduino and BLE that won 1st in Virginia and 3rd nationally at SkillsUSA. Now I'm at UVA Link Lab working on Unity simulations for bike/e-scooter safety. Robotics is where technical rigor meets real-world impact."

User: "What's Nyan's educational background?"
Assistant: "I did a 12-week AI startup bootcamp at Fractal Tech in 2024, which was all about shipping fast. Before that, I studied Computer Science and Economics at UVA (currently on leave to build stuff). Also got my A.S. in Engineering from NVCC with a 3.9 GPA. But honestly, I've learned just as much from hackathons and real projects as from formal education."

Now respond to the user's messages below, maintaining this voice and following these instructions.`;

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    // Prepare messages (last 10 pairs to fit in context)
    const recentMessages = messages.slice(-20);

    // Call Claude API with streaming
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: recentMessages.map(m => ({
        role: m.role,
        content: m.content
      })),
      stream: true,
    });

    // Convert to streaming response
    const stream = AnthropicStream(response);

    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error('Chat API error:', error);

    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request.',
        code: 'API_ERROR'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
```

### Phase 4: Chat UI Components (3 hours)

#### Step 4.1: Create State Management Hook

**File:** `src/components/NyanBot/useChatMessages.ts` (create)

```typescript
'use client';

import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Call API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      // Create assistant message placeholder
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantContent += chunk;

          // Update assistant message content
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMessage.id
                ? { ...m, content: assistantContent }
                : m
            )
          );
        }
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
```

#### Step 4.2: Create Chat Widget Components

**File:** `src/components/NyanBot/ChatWidget.tsx` (create)

```typescript
'use client';

import { useState } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 md:p-6">
      {isOpen ? (
        <ChatWindow onClose={() => setIsOpen(false)} />
      ) : (
        <ChatButton onClick={() => setIsOpen(true)} />
      )}
    </div>
  );
}
```

**File:** `src/components/NyanBot/ChatButton.tsx` (create)

```typescript
'use client';

interface ChatButtonProps {
  onClick: () => void;
}

export default function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative h-16 w-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      style={{
        backgroundColor: 'var(--primary)',
      }}
      aria-label="Open Nyan Bot chat"
    >
      {/* Cat emoji or icon */}
      <span className="text-3xl">🤖</span>

      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping"></span>
    </button>
  );
}
```

**File:** `src/components/NyanBot/ChatWindow.tsx` (create)

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { useChatMessages } from './useChatMessages';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const { messages, isLoading, error, sendMessage } = useChatMessages();
  const windowRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      // Simulate assistant greeting
      setTimeout(() => {
        sendMessage(''); // This will trigger initial context load
      }, 500);
    }
  }, []);

  return (
    <div
      ref={windowRef}
      className="chat-window flex flex-col bg-surface rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
      style={{
        width: '400px',
        height: '600px',
        maxWidth: '100vw',
        maxHeight: 'calc(100vh - 2rem)',
        border: '3px solid var(--primary)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          borderBottomColor: 'var(--primary-dark)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-semibold text-lg">Nyan Bot</h3>
            <p className="text-xs opacity-90">Ask me about Nyan!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:opacity-75 transition-opacity text-2xl leading-none"
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="border-t" style={{ borderTopColor: 'var(--gray-200)' }}>
        <MessageInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
```

**File:** `src/components/NyanBot/MessageList.tsx` (create)

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { Message } from './useChatMessages';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  const initialMessage: Message = {
    id: 'initial',
    role: 'assistant',
    content: "Hey! I'm Nyan Bot. Ask me about Nyan's projects, experience, or anything else you'd like to know!",
    timestamp: new Date(),
  };

  const displayMessages = messages.length === 0 ? [initialMessage] : messages;

  return (
    <div className="p-4 space-y-4">
      {displayMessages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-foreground'
            }`}
            style={{
              backgroundColor: message.role === 'user' ? 'var(--primary)' : 'var(--gray-100)',
              color: message.role === 'user' ? 'white' : 'var(--foreground)',
            }}
          >
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: 'var(--font-size-small)' }}
            >
              {message.content}
            </p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
```

**File:** `src/components/NyanBot/MessageInput.tsx` (create)

```typescript
'use client';

import { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 flex gap-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about Nyan..."
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        style={{
          borderColor: 'var(--gray-300)',
          backgroundColor: 'white',
          fontSize: 'var(--font-size-small)',
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="rounded-lg px-4 py-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          fontSize: 'var(--font-size-small)',
        }}
      >
        Send
      </button>
    </div>
  );
}
```

**File:** `src/components/NyanBot/TypingIndicator.tsx` (create)

```typescript
'use client';

export default function TypingIndicator() {
  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{
        backgroundColor: 'var(--gray-100)',
      }}
    >
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
}
```

### Phase 5: Integration (1 hour)

#### Step 5.1: Add ChatWidget to Layout

**File:** `src/app/layout.tsx`

**Current:**
```typescript
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <InteractiveBackground />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

**New:**
```typescript
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";
import ChatWidget from "@/components/NyanBot/ChatWidget";  // ADD THIS

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <InteractiveBackground />
        <Navbar />
        {children}
        <ChatWidget />  {/* ADD THIS - renders globally */}
      </body>
    </html>
  );
}
```

#### Step 5.2: Add Animations to globals.css

**File:** `src/app/globals.css`

Add these animations:
```css
/* Chat widget animations */
@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
```

#### Step 5.3: Test Locally

**Terminal commands:**
```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# Test chatbot:
# 1. Click chat button in bottom-right
# 2. Ask "What projects has Nyan worked on?"
# 3. Verify response matches Nyan's voice
# 4. Test mobile responsive (DevTools)
```

---

## Code Examples

### Complete System Prompt Template

```typescript
const SYSTEM_PROMPT = `You are Nyan Bot, an AI assistant representing Nyan Prakash. You answer questions about Nyan's background, projects, experience, and skills based on the context provided below.

# NYAN'S VOICE & PERSONALITY

## Characteristics
- Action-oriented and shipping-focused
- Uses short, punchy sentences
- Technically credible but casual tone
- Honest about failures and learnings
- Enthusiastic about prototyping

## Signature Phrases (use naturally)
- "The real unlock is..."
- "Launch velocity matters"
- "I treat it like a weekend project"
- "Shipping beats polishing"
- "Instrument everything"

## Communication Style
- Sentence length: 10-20 words
- Keep responses concise: 2-4 sentences typically
- Technical depth: High but accessible
- Tone: Conversational, uses contractions
- Use first person ("I built", "I'm working on")

# PORTFOLIO DATA

${portfolioDataFormatted}

# BLOG POSTS

${blogPostsFormatted}

# RESUME

${resumeTextFormatted}

# INSTRUCTIONS

1. **Answer accurately**: Only use information from the context above. If something isn't mentioned, say "I don't have that information."

2. **Maintain Nyan's voice**: Short punchy sentences, action-oriented, technically credible but casual.

3. **Keep responses concise**: 2-4 sentences typically. Users can ask follow-ups.

4. **Use specific details**: Mention concrete technologies, outcomes, or accomplishments.

5. **Stay in character**: Speak as Nyan in first person. Show enthusiasm for building and shipping.

Now respond to the user's question below.`;
```

### Example API Call

```typescript
// Frontend call to /api/chat
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'What has Nyan been working on lately?' },
    ],
  }),
});

// Handle streaming response
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  console.log('Received chunk:', chunk);
  // Update UI with streamed content
}
```

### Example Mobile Responsive CSS

```css
/* Desktop */
.chat-window {
  width: 400px;
  height: 600px;
}

/* Mobile */
@media (max-width: 768px) {
  .chat-window {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
}
```

---

## Deployment Guide

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account
4. Choose `EvenNewerPersonalWebsite` repository
5. Select `personalwebsite` directory
6. Click "Import"

### Step 2: Configure Environment Variables

**In Vercel Dashboard:**

1. Go to Project Settings → Environment Variables
2. Add variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...` (your Anthropic API key)
   - Environments: Production, Preview, Development
3. Click "Save"

### Step 3: Configure Build Settings

**In Vercel Dashboard:**

- Framework Preset: Next.js
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)
- Root Directory: `personalwebsite`

**Leave all defaults - Vercel auto-detects Next.js**

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for build to complete (~2 minutes)
3. Vercel provides preview URL: `your-project.vercel.app`
4. Test chatbot on preview URL

### Step 5: Configure Custom Domain

**In Vercel Dashboard:**

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter: `www.nyanprakash.com`
4. Vercel provides DNS instructions:
   - Type: CNAME
   - Name: `www`
   - Value: `cname.vercel-dns.com`

**In Domain Provider (e.g., Namecheap, GoDaddy):**

1. Go to DNS settings
2. Update CNAME record:
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: Automatic
3. Save changes
4. Wait 5-10 minutes for DNS propagation

**Vercel automatically provisions SSL certificate (free via Let's Encrypt)**

### Step 6: Monitor Deployment

**In Vercel Dashboard:**

1. Check "Deployments" tab - ensure status is "Ready"
2. Check "Analytics" tab - monitor traffic
3. Check "Logs" tab - review runtime logs
4. Set up alerts: Project Settings → Notifications

### Step 7: Migration from GitHub Pages

**Option A: Immediate Switch**
1. Update DNS CNAME to Vercel
2. GitHub Pages deployment becomes inactive
3. Monitor for 24 hours

**Option B: Gradual Migration**
1. Test Vercel deployment thoroughly on preview URL
2. Update DNS CNAME to Vercel during low-traffic period
3. Keep GitHub Pages deployment as backup for 1 week
4. Archive GitHub Pages deployment after confirming stability

---

## Cost Analysis

### Anthropic Claude API Costs

**Pricing (Claude 3.5 Sonnet):**
- Input: $3.00 per million tokens
- Output: $15.00 per million tokens

**Scenario 1: MVP (Low Traffic)**
- Conversations: 100/day = 3,000/month
- Messages per conversation: 5
- Total messages: 15,000/month

**Token usage per message:**
- Input: 2,500 (context) + 200 (user message) = 2,700 tokens
- Output: 400 tokens (assistant response)

**Monthly cost:**
- Input: 15,000 × 2,700 = 40.5M tokens = $121.50
- Output: 15,000 × 400 = 6M tokens = $90.00
- **Total: $211.50/month**

**With caching (recommended):**
- Cache context (2,500 tokens) after first message
- Input: 15,000 × 200 = 3M tokens = $9.00
- Output: 15,000 × 400 = 6M tokens = $90.00
- **Total with caching: $99.00/month**

**Scenario 2: Production (Moderate Traffic)**
- Conversations: 500/day = 15,000/month
- Total messages: 75,000/month

**With caching:**
- Input: 75,000 × 200 = 15M tokens = $45.00
- Output: 75,000 × 400 = 30M tokens = $450.00
- **Total: $495.00/month**

**Cost optimization strategies:**
1. **Conversation limits**: 10 conversations/day per IP = ~$25/month
2. **Message length limits**: Max 500 chars per message
3. **Context caching**: Reduces input cost by 90%
4. **Use Claude Haiku for simple queries**: $0.25/$1.25 per million tokens (75% cheaper)

### Vercel Hosting Costs

**Hobby Plan (Free):**
- 100 GB bandwidth/month
- 100 serverless function executions/day
- 1 concurrent build
- **Cost: $0/month**

**Pro Plan ($20/month):**
- 1 TB bandwidth/month
- 1,000 serverless function executions/day
- 3 concurrent builds
- Analytics dashboard
- **Cost: $20/month**

**When to upgrade:**
- Hobby plan sufficient for <100 conversations/day
- Pro plan needed for >100 conversations/day or advanced analytics

### Total Monthly Cost Estimate

| Scenario | Traffic | Claude API | Vercel | Total |
|----------|---------|-----------|--------|-------|
| MVP (with limits) | 10 convos/day | $25 | $0 | **$25/month** |
| Low Traffic | 100 convos/day | $99 | $0 | **$99/month** |
| Moderate Traffic | 500 convos/day | $495 | $20 | **$515/month** |

**Recommended starting point:**
- Budget: $50-100/month
- Implement conversation limits (10/day per IP)
- Monitor actual usage
- Scale up as needed

---

## Success Metrics

### Technical Metrics

**API Performance:**
- Response time (p95): <2s
- Response time (p50): <1s
- Error rate: <1%
- Uptime: >99.5%

**Monitoring:**
```typescript
// Add logging to API route
console.log('[Chat API]', {
  timestamp: new Date().toISOString(),
  ip: req.headers.get('x-forwarded-for'),
  messageCount: messages.length,
  responseTimeMs: Date.now() - startTime,
  tokensUsed: { input: inputTokens, output: outputTokens }
});
```

### User Experience Metrics

**Engagement:**
- Chat widget usage rate: >10% of visitors
- Average conversation length: >3 messages
- Bounce rate from chat: <20%
- Return usage rate: >30%

**Sentiment:**
- Positive feedback (thumbs up): >80%
- Negative feedback (thumbs down): <10%
- Manual review score: >90% accurate responses

**Tracking:**
```typescript
// Add PostHog or simple analytics
posthog.capture('chat_message_sent', {
  conversation_id: sessionId,
  message_length: content.length,
  response_time_ms: responseTime
});

posthog.capture('chat_feedback', {
  conversation_id: sessionId,
  sentiment: 'positive' | 'negative',
  message_id: messageId
});
```

### Content Accuracy Metrics

**Manual Review Checklist (first 100 conversations):**
- [ ] Provides accurate project descriptions (>95%)
- [ ] Stays in character with Nyan's voice (>90%)
- [ ] No hallucinations or made-up information (<5%)
- [ ] Correctly says "I don't know" when appropriate
- [ ] Uses specific details from context
- [ ] Maintains conversation context across turns

**Automated Checks:**
```typescript
// Flag potential issues
function checkResponseQuality(response: string) {
  const warnings = [];

  // Check for hallucination indicators
  if (!response.includes("I don't have") && !containsContextInfo(response)) {
    warnings.push('Possible hallucination');
  }

  // Check voice consistency
  if (response.length > 500) {
    warnings.push('Response too long for Nyan voice');
  }

  // Check for signature phrases
  const hasSignaturePhrase = SIGNATURE_PHRASES.some(p => response.includes(p));
  if (!hasSignaturePhrase && response.length > 200) {
    warnings.push('Missing signature phrase');
  }

  return warnings;
}
```

---

## Future Enhancements

### Phase 3: Advanced Features (6-8 hours)

#### 1. Analytics Integration (2hrs)

**Add PostHog:**
```typescript
// src/lib/analytics.ts
import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: 'https://app.posthog.com'
});

export function trackChatMessage(data: {
  message_length: number;
  response_time_ms: number;
  conversation_id: string;
}) {
  posthog.capture('chat_message', data);
}

export function trackChatFeedback(data: {
  message_id: string;
  sentiment: 'positive' | 'negative';
}) {
  posthog.capture('chat_feedback', data);
}
```

**Add feedback buttons:**
```typescript
// In MessageList.tsx
<div className="flex gap-2 mt-2">
  <button onClick={() => handleFeedback('positive')} className="text-sm">
    👍
  </button>
  <button onClick={() => handleFeedback('negative')} className="text-sm">
    👎
  </button>
</div>
```

#### 2. Session Persistence (1hr)

**Store messages in localStorage:**
```typescript
// In useChatMessages.ts
useEffect(() => {
  // Load from localStorage on mount
  const saved = localStorage.getItem('chat_messages');
  if (saved) {
    setMessages(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  // Save to localStorage on change
  localStorage.setItem('chat_messages', JSON.stringify(messages));
}, [messages]);
```

#### 3. Suggested Questions (1hr)

**Add starter prompts:**
```typescript
const SUGGESTED_QUESTIONS = [
  "What projects has Nyan worked on?",
  "Tell me about Nyan's robotics experience",
  "What's Nyan's tech stack?"
];

// In ChatWindow.tsx
{messages.length === 1 && (
  <div className="p-4 border-t">
    <p className="text-sm text-gray-500 mb-2">Suggested questions:</p>
    <div className="flex flex-wrap gap-2">
      {SUGGESTED_QUESTIONS.map(q => (
        <button
          key={q}
          onClick={() => sendMessage(q)}
          className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition"
        >
          {q}
        </button>
      ))}
    </div>
  </div>
)}
```

#### 4. Link Detection (1hr)

**Auto-link project names to portfolio sections:**
```typescript
function enrichResponse(content: string): string {
  const projectLinks = {
    'EcoCoin': '#projects',
    'HealthScope': '#projects',
    'Plately': '#projects',
    'DeepGuard': '#projects'
  };

  let enriched = content;
  Object.entries(projectLinks).forEach(([name, link]) => {
    enriched = enriched.replace(
      new RegExp(name, 'g'),
      `<a href="${link}" class="underline">${name}</a>`
    );
  });

  return enriched;
}
```

#### 5. Conversation Export (1hr)

**Download as markdown:**
```typescript
function exportConversation(messages: Message[]): void {
  const markdown = messages.map(m =>
    `**${m.role === 'user' ? 'You' : 'Nyan Bot'}:** ${m.content}\n\n`
  ).join('');

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nyan-bot-conversation-${Date.now()}.md`;
  a.click();
}
```

### Additional Ideas

1. **Voice input** - Add speech-to-text for accessibility
2. **Code syntax highlighting** - Format code blocks in responses
3. **Image support** - "Show me a screenshot of EcoCoin"
4. **Multilingual** - Detect language and respond accordingly
5. **Admin dashboard** - View popular questions, conversation analytics
6. **A/B testing** - Test different system prompts
7. **Response ratings** - "Was this helpful?" after each response
8. **Context refresh button** - Manually update knowledge base without redeploy

---

## Testing Checklist

### Functionality Tests

- [ ] Chat widget button appears in bottom-right corner
- [ ] Clicking button opens chat window
- [ ] Initial greeting displays on open
- [ ] User can type and send message
- [ ] Assistant response streams in character-by-character
- [ ] Conversation history maintained across turns
- [ ] Closing and reopening widget preserves conversation
- [ ] Rate limiting works (20 requests/min)
- [ ] Error handling displays user-friendly message
- [ ] "I don't know" response for out-of-context questions

### Voice Consistency Tests

**Ask these questions and verify responses match Nyan's voice:**

1. "What projects has Nyan worked on?"
   - Expected: Short, enthusiastic, mentions specific technologies
   - Should include signature phrases like "Launch velocity matters"

2. "Tell me about Nyan's robotics experience"
   - Expected: First person ("I was", "I built"), specific details
   - Should mention FIRST Robotics, AutoDog, current work

3. "What's Nyan's educational background?"
   - Expected: Honest about on-leave status, mentions learning from projects
   - Casual tone, not overly formal

4. "How does Nyan approach building products?"
   - Expected: Focus on shipping fast, instrumentation, feedback loops
   - Should use phrases like "weekend project", "ship while excitement is peaking"

### Design Tests

- [ ] Chat window matches design system (colors, fonts)
- [ ] Hand-drawn border effects visible
- [ ] Animations smooth (no jank)
- [ ] Message bubbles styled correctly (user green, assistant gray)
- [ ] Typing indicator displays while loading
- [ ] Scrolling works smoothly with 20+ messages
- [ ] Mobile responsive (full-screen on <768px)
- [ ] Keyboard navigation works (ESC to close, Enter to send)

### Performance Tests

- [ ] Initial page load <3s (chatbot lazy-loaded)
- [ ] Chat opens in <300ms
- [ ] First message response starts streaming in <2s
- [ ] Smooth scrolling with 50+ messages
- [ ] No memory leaks (test with DevTools)
- [ ] Works on slow 3G network

### Cross-browser Tests

- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

---

## Troubleshooting

### Issue: API returns 500 error

**Possible causes:**
1. Missing `ANTHROPIC_API_KEY` environment variable
2. Invalid API key
3. Anthropic API rate limit exceeded

**Solutions:**
```typescript
// Add better error logging to route.ts
catch (error: any) {
  console.error('Anthropic API error:', {
    message: error.message,
    status: error.status,
    type: error.type
  });

  if (error.status === 429) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }),
      { status: 429 }
    );
  }

  // ... handle other errors
}
```

### Issue: Responses don't match Nyan's voice

**Possible causes:**
1. System prompt not loaded correctly
2. Context not being compiled properly
3. Temperature too low (responses too robotic)

**Solutions:**
1. Verify context compilation:
```typescript
const context = await getCachedContext();
console.log('Context length:', context.length);
console.log('Context preview:', context.substring(0, 500));
```

2. Adjust temperature:
```typescript
temperature: 0.8,  // Higher = more creative (default: 0.7)
```

3. Add more example responses to system prompt

### Issue: Chat widget not appearing

**Possible causes:**
1. `<ChatWidget />` not added to layout.tsx
2. Z-index conflict with other elements
3. CSS not loading

**Solutions:**
1. Verify layout.tsx includes `<ChatWidget />`
2. Increase z-index:
```css
.chat-widget {
  z-index: 9999 !important;
}
```

3. Check browser console for errors

### Issue: Slow response times

**Possible causes:**
1. Context too large
2. Network latency
3. Claude API slow

**Solutions:**
1. Reduce context size (summarize blog posts)
2. Use streaming (already implemented)
3. Add loading indicators
4. Consider using Claude Haiku for faster responses:
```typescript
model: 'claude-3-haiku-20240307',  // Faster, cheaper
```

---

## Additional Resources

### Documentation
- [Anthropic Claude API Docs](https://docs.anthropic.com/)
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Vercel Deployment Docs](https://vercel.com/docs)

### Example Prompts for Testing

```
1. "What has Nyan been working on lately?"
2. "Tell me about Nyan's experience with AI and ML"
3. "Does Nyan have robotics experience?"
4. "What's Nyan's educational background?"
5. "How does Nyan approach building products?"
6. "What technologies does Nyan use?"
7. "Tell me about EcoCoin"
8. "What awards has Nyan won?"
9. "How can I contact Nyan?"
10. "What does Nyan think about rapid prototyping?"
```

### Voice Consistency Examples

**Good response (matches Nyan's voice):**
> "I've built some cool stuff! EcoCoin is a blockchain-based emissions trading platform with predictive pricing. The real unlock is combining traditional carbon markets with ML-powered forecasting. Shipped it with React, FastAPI, and Firebase in about 3 weeks. Launch velocity matters when you're testing new market mechanisms."

**Bad response (doesn't match voice):**
> "Nyan Prakash has worked on several projects. One notable project is EcoCoin, which is a blockchain-based trading platform for emission allowances. This project features a predictive carbon-price algorithm and utilizes technologies such as React, FastAPI, Firebase, Blockchain, and Machine Learning."

---

## Summary

This implementation guide provides everything needed to build Nyan Bot:

✅ **Complete architecture** - Static export → Vercel serverless
✅ **Knowledge base strategy** - Full context injection (~8KB)
✅ **Voice profile** - Captured from blog analysis
✅ **Implementation steps** - Detailed, step-by-step instructions
✅ **Code examples** - Ready-to-use components
✅ **Deployment guide** - Vercel setup with custom domain
✅ **Cost analysis** - $25-515/month depending on traffic
✅ **Success metrics** - Technical, UX, and content accuracy

**Timeline:**
- MVP: 11 hours (weekend project)
- Design Polish: 4 hours
- Enhancements: 6 hours (optional)

**Philosophy:**
Ship fast, get feedback, iterate. This is a meta project: an AI copilot builder, building an AI copilot for his portfolio. Launch velocity matters.

---

**Questions or issues?** Refer to the Troubleshooting section or Anthropic/Vercel documentation.

**Ready to implement?** Start with Phase 1: Setup (1 hour) and build incrementally.
