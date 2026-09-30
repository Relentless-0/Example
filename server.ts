import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Suggest options when the user doesn't know or needs inspiration
app.post('/api/assistant/suggest-options', async (req: Request, res: Response) => {
  const { questionId, questionText, contextAnswers } = req.body;

  if (!ai) {
    return res.status(200).json({
      fallback: true,
      options: [
        'A clean and modern look with neutral colors',
        'Simple, one-click actions with no clutter',
        'Works smoothly on phones and laptops',
        'Quick signup or guest mode to try immediately'
      ],
      explanation: 'Here are a few popular and beginner-friendly choices to get you started.'
    });
  }

  try {
    const prompt = `You are a friendly, patient product planning assistant for non-technical beginners.
The user is answering Question #${questionId}: "${questionText}".
Context of their previous answers:
${JSON.stringify(contextAnswers, null, 2)}

The user clicked "I don't know" or "Suggest options".
Your job is to provide 3 to 4 very simple, practical, concrete options they can choose from, plus a 1-sentence friendly explanation.
Keep language non-technical, simple, and encouraging.

Respond in pure JSON matching this schema:
{
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "explanation": "Friendly 1-sentence tip"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating suggestions:', error);
    return res.status(200).json({
      fallback: true,
      options: [
        'Keep it simple with 2-3 core features first',
        'Make it responsive for both mobile and web',
        'Clean, calm style with friendly colors',
        'Save everything automatically without complicated steps'
      ],
      explanation: 'Here are a few practical starter options you can pick or customize.'
    });
  }
});

// 2. Refine / clarify an answer in simple terms
app.post('/api/assistant/refine-answer', async (req: Request, res: Response) => {
  const { questionText, rawAnswer } = req.body;

  if (!ai || !rawAnswer) {
    return res.json({ refined: rawAnswer });
  }

  try {
    const prompt = `You are a patient product planning assistant for non-technical users.
Question: "${questionText}"
User's draft answer: "${rawAnswer}"

Polish this answer into clear, simple, plain English without buzzwords or technical jargon.
Keep it concise (1 to 3 sentences maximum) and maintain the user's authentic intent.

Return JSON:
{
  "refined": "Polished simple answer"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error refining answer:', error);
    return res.json({ refined: rawAnswer });
  }
});

// 3. Complexity check for MVP features
app.post('/api/assistant/simplify-check', async (req: Request, res: Response) => {
  const { featureText } = req.body;

  if (!ai || !featureText) {
    return res.json({ isComplex: false, advice: '', simplifiedAlternative: '' });
  }

  try {
    const prompt = `You are a friendly product-planning mentor guiding a non-technical beginner to launch a small, simple Minimum Viable Product (MVP).
Evaluate this proposed feature or idea:
"${featureText}"

Check if this is too complex, expensive, slow, or risky for a simple first version (e.g., custom AI video models, real-time banking rails, complex multi-sided marketplace matching algorithms, hardware Bluetooth sync, custom crypto, etc.).

Return JSON:
{
  "isComplex": boolean,
  "gentleWarning": "Friendly, polite 1-2 sentence explanation of why this might be hard or slow to build in version 1",
  "simplifiedAlternative": "A simpler, practical alternative to build first"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in simplify check:', error);
    return res.json({ isComplex: false, gentleWarning: '', simplifiedAlternative: '' });
  }
});

// 4. Conversational Chat Assistant (for freeform Q&A and guidance)
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  const { messages, answers, currentQuestionIndex } = req.body;

  if (!ai) {
    return res.json({
      reply: "I'm here to help you turn your idea into a clear Product Requirements Document! You can answer the 10 questions on the left, or ask me anything if you're not sure about a term like 'MVP' or 'responsive'."
    });
  }

  try {
    const systemInstruction = `You are a helpful, very friendly, patient product-planning assistant for non-technical people.
Your goal is to help the user turn a rough app idea into a very detailed Product Requirements Document (PRD) for a simple app.
Your style:
- very simple
- very clear
- friendly
- guiding
- non-technical unless necessary (explain jargon with everyday analogies)
- patient with beginners
- do not overwhelm the user; keep replies focused and easy to digest (2-4 paragraphs or concise bullet points).
- If the user asks a question, explain simply and offer 2-3 easy options.
- If they are discussing features, help them separate must-haves from nice-to-haves and prefer open-source/simple tools.
- We have 10 master questions. The user is currently around question index ${currentQuestionIndex + 1}.
Current answers collected so far:
${JSON.stringify(answers, null, 2)}`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return res.json({ reply: response.text || "I'm ready whenever you'd like to continue!" });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return res.json({
      reply: "I'm right here with you! Feel free to ask any question about your app idea, or pick an option from the suggestions."
    });
  }
});

// 5. Generate Full 12-Section PRD
app.post('/api/assistant/generate-prd', async (req: Request, res: Response) => {
  const { answers } = req.body;

  const defaultTitle = answers['1']?.slice(0, 30) || 'My Simple App';

  if (!ai) {
    // Generate high quality fallback PRD structure
    const fallbackPRD = generateLocalPRD(answers);
    return res.json({ prd: fallbackPRD });
  }

  try {
    const prompt = `You are a senior product manager and friendly mentor for non-technical founders.
Generate a comprehensive, crystal-clear, highly detailed Product Requirements Document (PRD) for a simple application based strictly on these 10 answers:

1. App Idea: ${answers['1'] || 'Not specified'}
2. Problem to Solve: ${answers['2'] || 'Not specified'}
3. Target Users: ${answers['3'] || 'Not specified'}
4. App Type: ${answers['4'] || 'Web app'}
5. Main Features (Must-Haves): ${answers['5'] || 'Not specified'}
6. Extra / Nice-to-Have Features: ${answers['6'] || 'None for v1'}
7. Look & Feel: ${answers['7'] || 'Simple, clean, modern'}
8. Colors & Style: ${answers['8'] || 'Neutral slate with friendly accent'}
9. Screen & Device Support: ${answers['9'] || 'Responsive web (works on phones and laptops)'}
10. Constraints & Exclusions (What it should NOT do): ${answers['10'] || 'No complex enterprise integrations'}

You MUST structure the PRD into these EXACT 12 SECTIONS:
1. App Overview (Working title, short summary, problem statement, purpose)
2. User and Audience (Who it's for, main user needs, user pain points, simple user journey walkthrough)
3. Goals and Success (Main goals, what success looks like, 2-3 simple measurable outcomes)
4. Scope (What is included in v1, what is NOT in v1, must-have features, nice-to-have features)
5. Features and Functionality (For EACH main feature: what it does, who uses it, why it matters, inputs & outputs, possible edge cases, simple acceptance criteria)
6. UI/UX Requirements (General style, color direction, layout direction, navigation style, interactive parts, mobile behavior, web browser behavior, accessibility basics)
7. Platform and Compatibility (Web/mobile/both, browser support, phone screen support, offline/online needs)
8. Technical Preferences (Emphasize simple, beginner-friendly, and open-source tools: e.g. SQLite / PostgreSQL, React / Tailwind, Supabase / Firebase / LocalStorage, clear API routes. Avoid heavy enterprise tools.)
9. Data and Content (What data is stored, content created/uploaded, simple privacy rules)
10. Risks and Constraints (Things that may be tricky, budget/time limits, missing info, trade-offs)
11. Open Questions (Unclear items or decisions needing confirmation before coding)
12. Final Build Summary (Summary of what to build first, clear MVP sprint plan, best immediate next step)

STYLE GUIDELINES:
- Plain English, friendly, structured with markdown tables and bullet points.
- If the user didn't specify something, make a practical, realistic assumption and mark it as "(Assumption)".
- Keep the MVP practical, achievable in days/weeks, not months.

Return valid JSON with this schema:
{
  "appName": "string (creative, friendly working title)",
  "tagline": "string (1 short friendly sentence)",
  "executiveSummary": "string (2-3 sentences overview)",
  "sections": [
    {
      "number": 1,
      "title": "App Overview",
      "content": "markdown content..."
    },
    ... all 12 sections with their number, title, and rich markdown content
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ prd: parsed });
  } catch (error: any) {
    console.error('Error generating PRD with Gemini:', error);
    const fallbackPRD = generateLocalPRD(answers);
    return res.json({ prd: fallbackPRD });
  }
});

// 6. Generate Companion Formats (Feature List, User Stories, Wireframe, AI Prompt, Dev Handoff)
app.post('/api/assistant/generate-companion', async (req: Request, res: Response) => {
  const { formatType, prd, answers } = req.body;

  if (!ai) {
    const fallbackCompanion = generateLocalCompanion(formatType, answers, prd);
    return res.json({ content: fallbackCompanion });
  }

  try {
    let specificInstruction = '';
    if (formatType === 'feature-list') {
      specificInstruction = `Create a clean, prioritized Feature Breakdown Table.
Columns: Feature Name, Category (Core MVP vs v2 Nice-to-Have), User Benefit, Complexity (Low/Medium), Description.
Keep it simple, practical, and non-technical.`;
    } else if (formatType === 'user-stories') {
      specificInstruction = `Create a comprehensive User Story List in agile format:
"As a [user type], I want to [action], so that [benefit]."
For each story, provide 2-3 simple, plain-English Acceptance Criteria ("Given... When... Then..." or clear checklist items).`;
    } else if (formatType === 'wireframe-outline') {
      specificInstruction = `Create a clean, descriptive screen-by-screen Wireframe Outline.
Use ASCII boxes and plain English visual layouts showing:
- Main Landing / Dashboard Screen
- Item Detail / Form Screen
- Mobile Navigation Layout
- Call to Action placements and button labels.`;
    } else if (formatType === 'ai-builder-prompt') {
      specificInstruction = `Generate an ultra-high-quality, master prompt designed to be pasted directly into an AI App Builder (such as Bolt.new, Lovable, Claude Artifacts, Cursor, or AI Studio).
Include:
- System Role & High-Level Goal
- Key User Flows
- Design & Styling Directives (Tailwind CSS, clean neutral aesthetic, responsive layout)
- Open-Source / Simple Tech Stack recommendations
- Step-by-step build instructions for the AI.`;
    } else if (formatType === 'dev-handoff') {
      specificInstruction = `Create a clear Developer Handoff Note.
Include:
- Recommended simple, open-source stack (Frontend, Backend, Database, Styling)
- Core Data Models / JSON Schemas
- Essential API Endpoints (CRUD)
- Edge Cases & Validation rules
- Day 1 MVP build checklist.`;
    }

    const prompt = `You are a senior product engineer helping a non-technical founder hand off their app idea.
App Name: ${prd?.appName || answers['1']}
Summary: ${prd?.tagline || answers['2']}

User Answers:
${JSON.stringify(answers, null, 2)}

Task: ${specificInstruction}

Output format: Return formatted, beautifully structured Markdown text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ content: response.text || '' });
  } catch (error: any) {
    console.error('Error generating companion view:', error);
    const fallback = generateLocalCompanion(formatType, answers, prd);
    return res.json({ content: fallback });
  }
});

// Helper: Local fallback generator for 12-section PRD
function generateLocalPRD(answers: Record<string, string>) {
  const idea = answers['1'] || 'A simple, practical helper tool';
  const problem = answers['2'] || 'People need an easier, less cluttered way to get this done without complexity.';
  const users = answers['3'] || 'Everyday people, beginners, and small teams seeking simplicity.';
  const appType = answers['4'] || 'Web app (mobile-responsive)';
  const mustHaves = answers['5'] || 'Core item creation, easy viewing, editing, and simple search/filter.';
  const niceToHaves = answers['6'] || 'Sharing links, dark mode, export to PDF or CSV.';
  const lookFeel = answers['7'] || 'Simple, modern, calm, distraction-free.';
  const colors = answers['8'] || 'Slate neutrals with warm blue/indigo accent.';
  const platforms = answers['9'] || 'Responsive web browser that looks great on mobile phones and laptops.';
  const exclusions = answers['10'] || 'No complicated subscriptions, no enterprise bloat, no confusing multi-step workflows.';

  const appName = idea.split(' ').slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'QuickApp';

  return {
    appName,
    tagline: `The simple, stress-free way to ${problem.toLowerCase().replace(/^to\s+/, '')}`,
    executiveSummary: `${appName} is an intuitive ${appType.toLowerCase()} designed to solve ${problem.toLowerCase()}. Built with a laser focus on version 1 essentials, it provides immediate value with zero learning curve.`,
    sections: [
      {
        number: 1,
        title: 'App Overview',
        content: `### 1.1 Working Title
**${appName}**

### 1.2 Short Summary
${idea}

### 1.3 Problem Statement
${problem}
Currently, existing alternatives are either too complicated, require expensive subscriptions, or overwhelm users with features they never touch.

### 1.4 Purpose of the App
To give users a clean, lightweight, and reliable tool that does one primary job exceptionally well without friction or technical jargon.`
      },
      {
        number: 2,
        title: 'User and Audience',
        content: `### 2.1 Who the App is For
- **Primary Audience:** ${users}
- **Secondary Audience:** Anyone looking for a fast, no-nonsense solution without signing up for enterprise software.

### 2.2 Main User Needs
- Fast access from any phone or browser.
- Immediate clarity on what to do next.
- Safe, automatic saving of their inputs.

### 2.3 User Pain Points
- Overwhelming menus and settings in competing tools.
- Difficulty using existing tools on mobile screens.
- Fear of losing work or making mistakes.

### 2.4 User Journey (Simple Steps)
1. **Discovery:** User opens the app link and immediately sees a clean, friendly screen with an obvious starting action.
2. **First Action:** User inputs their first entry without needing to read a tutorial.
3. **Satisfaction:** The app confirms the entry, displays it clearly, and provides helpful quick actions (edit, delete, view).
4. **Return:** User visits again from their phone or laptop, and everything is right where they left it.`
      },
      {
        number: 3,
        title: 'Goals and Success',
        content: `### 3.1 Main Goals
- Enable users to complete their primary task in under 60 seconds.
- Deliver a zero-learning-curve experience that feels welcoming to beginners.
- Keep the technical architecture simple, low-cost, and easy to maintain.

### 3.2 What Success Looks Like
- Users complete their intended task on the very first try without asking for help.
- The app operates reliably with fast loading times (< 1 second).

### 3.3 Measurable Outcomes (Simple MVP Metrics)
- **Time to First Value:** < 90 seconds from first page load.
- **Task Completion Rate:** > 90% of initiated entries successfully saved.
- **Simplicity Score:** Zero required external dependencies or paid third-party APIs for core functionality.`
      },
      {
        number: 4,
        title: 'Scope',
        content: `### 4.1 Included in Version 1 (MVP)
- Core workflow: ${mustHaves}
- Responsive mobile & desktop interface.
- Local or lightweight persistent storage.
- Inline friendly guidance and confirmation messages.

### 4.2 NOT Included in Version 1 (Scope Boundaries)
- ${exclusions}
- Complex multi-tiered permission systems.
- Heavy background email marketing automation.
- Custom payment gateway integrations (unless strictly required).

### 4.3 Must-Have Features
1. **Core Data Entry:** Fast input form with helpful placeholder prompts.
2. **Overview List/Feed:** Scannable cards or clean table displaying all active items.
3. **Quick Edit & Delete:** 1-click controls with clear safety confirmation before deleting.
4. **Device Adaptability:** Automatically scales between mobile touch screens and widescreen monitors.

### 4.4 Nice-to-Have Features (Deferred to Version 2)
- ${niceToHaves}
- Custom tags and color badges.
- Export to PDF or spreadsheet format.`
      },
      {
        number: 5,
        title: 'Features and Functionality',
        content: `### Feature 1: Core Action & Data Management
- **What it does:** Allows users to create, view, edit, and organize their core records (${mustHaves}).
- **Who uses it:** Every active user.
- **Why it matters:** It is the primary engine of value for the entire application.
- **Inputs & Outputs:**
  - *Inputs:* User text, date, category selection, or toggle switches.
  - *Outputs:* Cleanly saved record shown immediately in the main view.
- **Possible Edge Cases:**
  - User submits blank fields $\\rightarrow$ Highlight the field with a friendly prompt ("Please give this a title").
  - User accidentally taps delete $\\rightarrow$ Show a gentle confirmation dialog ("Are you sure you want to remove this?").
- **Simple Acceptance Criteria:**
  - User can add a record in under 3 taps/clicks.
  - New records appear instantly in the feed without full page refresh.

### Feature 2: Clean Search & Quick Filters
- **What it does:** Lets users quickly locate specific entries by keyword or status.
- **Who uses it:** Users with more than 5 saved items.
- **Why it matters:** Keeps the app fast and usable as user data grows.
- **Inputs & Outputs:** Text search query $\\rightarrow$ Instantly filtered view.
- **Acceptance Criteria:** Results update live as the user types.`
      },
      {
        number: 6,
        title: 'UI/UX Requirements',
        content: `### 6.1 General Style
- **Aesthetic Direction:** ${lookFeel}. Clean, breathable whitespace, single-elevation cards, zero unnecessary clutter.

### 6.2 Color Direction
- **Palette:** ${colors}.
  - 60% Canvas: Neutral soft off-white or clean dark slate.
  - 30% Structural: Border lines (1px neutral), card backgrounds, scannable text.
  - 10% Accent: Purposeful brand color applied strictly to primary action buttons and active indicators.

### 6.3 Layout & Navigation
- Single-row clean header with brand title on the left and primary action button on the right.
- No confusing multi-level dropdowns; sticky or easy-to-reach primary navigation.

### 6.4 Mobile & Web Behavior
- **Mobile:** Touch targets $\\ge 44\\text{px}$, single-column stacked layout, no horizontal scrolling.
- **Web/Desktop:** Centered 1200px container or split view with sidebar, utilizing screen space cleanly.

### 6.5 Accessibility Basics
- High contrast text (WCAG AA compliant, $\\ge 4.5:1$).
- Clear focus rings for keyboard users.
- Visible text labels on all interactive buttons.`
      },
      {
        number: 7,
        title: 'Platform and Compatibility',
        content: `### 7.1 Target Platforms
- **Primary:** ${platforms}.

### 7.2 Browser Support
- Modern evergreen web browsers: Chrome, Safari, Firefox, Edge, Mobile Safari, Android Chrome.

### 7.3 Screen Sizes
- Optimized for mobile viewports (375px–430px) through full desktop monitors (1440px+).

### 7.4 Connectivity
- Online-first with local fallback caching so users don't lose typed text if their internet drops momentarily.`
      },
      {
        number: 8,
        title: 'Technical Preferences',
        content: `### 8.1 Open-Source & Simple Tooling Focus
- **Frontend:** React with TypeScript, styled with Tailwind CSS for predictable, maintainable design.
- **Backend / API:** Lightweight Node.js / Express or Vite proxy routes.
- **Data Persistence:** Start with browser \`localStorage\` or open-source SQLite / PostgreSQL (via Supabase or local file).
- **Hosting / Deploy:** Standard cloud container or serverless hosting (Cloud Run, Vercel, or Netlify).
- **Simplicity Rule:** No heavy enterprise microservices, Kubernetes clusters, or proprietary vendor locks.`
      },
      {
        number: 9,
        title: 'Data and Content',
        content: `### 9.1 Stored Data
- User-created records (titles, descriptions, timestamps, status flags).
- Minimal local preferences (theme, view mode).

### 9.2 Content Ownership & Safety
- Users retain 100% ownership of their content.
- No tracking pixels, intrusive analytics scripts, or selling of user behavior.`
      },
      {
        number: 10,
        title: 'Risks and Constraints',
        content: `### 10.1 Key Risks
- **Scope Creep:** Temptation to add complex features (${niceToHaves}) before the core workflow is tested.
- **Edge Case Confusion:** Handling empty states gracefully so the user never stares at a blank screen.

### 10.2 Trade-offs
- Prioritizing extreme simplicity and fast load times over endless customization settings.`
      },
      {
        number: 11,
        title: 'Open Questions',
        content: `1. Do users require cloud login/sync immediately, or is a private local-first experience preferable for day 1?
2. Should entries be easily exportable to standard formats (e.g. CSV, Markdown) from version 1?
3. What is the target domain name or brand identity to register?`
      },
      {
        number: 12,
        title: 'Final Build Summary',
        content: `### 12.1 What Should Be Built First (MVP)
Build a single responsive page with:
1. A clean header with the app title and a prominent "+ Add" button.
2. A streamlined modal or inline form to input a new record.
3. An organized feed displaying existing entries with edit and delete options.
4. Automatic persistence to storage.

### 12.2 Simple 3-Step Build Plan
- **Step 1 (UI Wireframe):** Lay out the responsive layout, cards, and input fields using Tailwind CSS.
- **Step 2 (State & Storage):** Hook up state management for Adding, Editing, and Deleting records with local persistence.
- **Step 3 (Refinement):** Add friendly empty states, search filtering, and polish mobile touch responsiveness.

### 12.3 Best Next Step
Copy the **AI Builder Prompt** or **Developer Handoff Note** from the export tabs and paste it into your favorite builder tool to begin building the working prototype!`
      }
    ]
  };
}

// Helper: Local fallback generator for companion views
function generateLocalCompanion(formatType: string, answers: Record<string, string>, prd: any) {
  const title = prd?.appName || answers['1'] || 'Simple App';
  const mustHaves = answers['5'] || 'Core item management';
  const niceToHaves = answers['6'] || 'Sharing and export';

  switch (formatType) {
    case 'feature-list':
      return `# Feature List Breakdown: ${title}

## Must-Have Features (Version 1 MVP)
| Feature | User Need | Complexity | Description |
| :--- | :--- | :--- | :--- |
| **Quick Entry Creation** | Fast input | Low | Simple form with title, notes, and instant save |
| **Visual Feed / List** | Immediate overview | Low | Scannable card grid or table displaying active items |
| **Inline Editing** | Fix typos | Low | Click-to-edit or modal update with instant sync |
| **Safe Deletion** | Clean up old data | Low | Delete button with 1-click confirmation prompt |
| **Responsive Mobile Layout** | Phone access | Medium | Clean touch-friendly view for screens 375px and up |

## Nice-to-Have Features (Version 2)
| Feature | User Need | Complexity | Description |
| :--- | :--- | :--- | :--- |
| **Quick Filter / Search** | Find items fast | Low | Live keyword search input across titles |
| **Data Export (CSV/PDF)** | Backups & sharing | Medium | 1-click export of user records |
| **Dark Mode Toggle** | Night-time viewing | Low | Gentle high-contrast dark theme |
| **Sharing Links** | Collaboration | High | Public read-only link generation |
`;

    case 'user-stories':
      return `# User Story List: ${title}

### Epic: Core Item Management
- **Story 1: Fast Creation**
  - **As a** user,
  - **I want to** quickly create a new item with a title and optional notes,
  - **So that** I can capture information in under 10 seconds without confusion.
  - *Acceptance Criteria:*
    - Given I am on the home screen, when I click "+ New", a simple input modal opens.
    - When I fill in a title and press "Save", the item appears immediately at the top of my list.
    - If I submit an empty title, I receive a gentle prompt asking for a name.

- **Story 2: Reviewing My Items**
  - **As a** user,
  - **I want to** see all my saved items in a clean, uncluttered layout,
  - **So that** I know exactly what needs my attention at a glance.
  - *Acceptance Criteria:*
    - Items display clearly with readable typography and creation dates.
    - If no items exist, an encouraging empty state invites me to add my first one.

- **Story 3: Editing and Updating**
  - **As a** user,
  - **I want to** edit any previously saved entry,
  - **So that** I can keep my information accurate and up to date.
  - *Acceptance Criteria:*
    - Clicking "Edit" populates the form with existing details.
    - Saving updates the item instantly without duplicating it.

- **Story 4: Safe Removal**
  - **As a** user,
  - **I want to** delete an item I no longer need,
  - **So that** my workspace remains organized.
  - *Acceptance Criteria:*
    - A confirmation banner prevents accidental deletions.
`;

    case 'wireframe-outline':
      return `# Wireframe & Layout Outline: ${title}

### 1. Main Dashboard View (Desktop 1200px)
\`\`\`
+-------------------------------------------------------------------------+
| [ Brand Logo / Title ]                        [ Search ]   [ + New Item ]|
+-------------------------------------------------------------------------+
|                                                                         |
|  Welcome back! Here are your active items:                              |
|                                                                         |
|  +---------------------------+  +---------------------------+           |
|  | Item Title #1             |  | Item Title #2             |           |
|  | Brief description text... |  | Brief description text... |           |
|  | [Edit]           [Delete] |  | [Edit]           [Delete] |           |
|  +---------------------------+  +---------------------------+           |
|                                                                         |
+-------------------------------------------------------------------------+
\`\`\`

### 2. Mobile Viewport (375px)
\`\`\`
+-----------------------------+
| [Title]        [+ New]      |
+-----------------------------+
| [ Search input...         ] |
+-----------------------------+
| +-------------------------+ |
| | Item Title #1           | |
| | Description text...     | |
| | [Edit]         [Delete] | |
| +-------------------------+ |
| +-------------------------+ |
| | Item Title #2           | |
| | Description text...     | |
| | [Edit]         [Delete] | |
| +-------------------------+ |
+-----------------------------+
\`\`\`
`;

    case 'ai-builder-prompt':
      return `# AI App Builder Master Prompt

> **Instructions:** Copy and paste the prompt below into an AI builder tool like Bolt.new, Lovable, Cursor, Claude Artifacts, or Google AI Studio.

\`\`\`markdown
You are an expert full-stack engineer and UI designer. Build a complete, functional web application called "${title}".

### Objective
${prd?.tagline || answers['2'] || 'Build a simple, responsive productivity app.'}

### Core Requirements
1. **Core Features:** ${mustHaves}
2. **UI/UX Direction:** Clean, modern, distraction-free aesthetic with generous whitespace and clear typographic hierarchy.
3. **Responsive Design:** Must look exceptional on mobile devices (375px width) and widescreen desktop (1200px+).
4. **Data Persistence:** Store items in browser localStorage (or SQLite/Supabase) so data persists across refreshes.
5. **Component Structure:**
   - Top navigation bar with brand mark and primary "+ New Item" CTA.
   - Clean search and filter input.
   - Interactive item list with friendly cards.
   - Modal dialog for creating and editing items.
   - Friendly empty state when no items exist.

### Tech Stack
- React 19 + TypeScript
- Tailwind CSS
- Lucide React icons
- Standard state management

Please generate complete, runnable code with working click handlers and clean error handling.
\`\`\`
`;

    case 'dev-handoff':
      return `# Developer Handoff Note: ${title}

## 1. Executive Summary
- **App Name:** ${title}
- **Target Audience:** ${answers['3'] || 'General users'}
- **Primary Goal:** ${answers['2'] || 'Solve user problem with minimal complexity'}

## 2. Recommended Tech Stack
- **Frontend:** React 19 + TypeScript, Tailwind CSS, Lucide Icons
- **Backend / Routing:** Express or Next.js App Router (if fullstack)
- **Database:** SQLite (local / embedded) or Supabase PostgreSQL (free tier)
- **State Management:** React useState / useReducer + localStorage persistence

## 3. Core Data Schema (JSON / TypeScript)
\`\`\`typescript
interface ItemRecord {
  id: string;            // UUID v4
  title: string;         // Required, max 120 chars
  description?: string;  // Optional markdown/prose
  status: 'active' | 'completed' | 'archived';
  category?: string;
  createdAt: string;     // ISO 8601 string
  updatedAt: string;     // ISO 8601 string
}
\`\`\`

## 4. REST Endpoints (if building with server)
- \`GET    /api/items\`         - Fetch all active items
- \`POST   /api/items\`         - Create a new item (validates title)
- \`PUT    /api/items/:id\`     - Update an existing item
- \`DELETE /api/items/:id\`     - Delete an item

## 5. MVP Checklist for Day 1
- [ ] Initialize repository with React + Tailwind
- [ ] Build responsive shell and Header
- [ ] Implement Item Form modal with input validation
- [ ] Render dynamic list with localStorage sync
- [ ] Implement search filtering
- [ ] Test mobile viewport on 375px screen
`;

    default:
      return '';
  }
}

// Serve Vite in development or static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
