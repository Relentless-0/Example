import { MasterQuestion } from '../types/prd';

export const MASTER_QUESTIONS: MasterQuestion[] = [
  {
    id: '1',
    number: 1,
    title: 'Your Core App Idea',
    question: 'What is your app idea in one or two simple sentences?',
    whyWeAsk: 'Starting with a crisp, simple summary ensures we do not get distracted by bells and whistles before understanding the heart of the project.',
    example: 'For example: "A simple community board where neighbors can borrow and lend garden tools, ladders, and camping gear instead of buying them."',
    suggestions: [
      'A simple reminder app that tracks houseplant watering schedules with photo tips.',
      'A fast, no-fuss invoice generator for freelancers with clean PDF downloads.',
      'A neighborhood tool and lawn equipment sharing board for local communities.',
      'A minimal daily 3-habit tracker focusing on consistency and streak motivation.'
    ],
    placeholder: 'In one or two plain sentences, what do you want this app to do?',
    helpTips: [
      'Keep it focused on one main task.',
      'Pretend you are explaining it to a friend over coffee.',
      'Do not worry about technical terms here!'
    ]
  },
  {
    id: '2',
    number: 2,
    title: 'The Problem to Solve',
    question: 'What problem should this app solve, or what should it help people do?',
    whyWeAsk: 'Great apps solve a real annoyance or save people time. Clarifying the frustration helps us make the right design decisions later.',
    example: 'For example: "People spend hundreds of dollars on tools they only use once a year, and existing rental stores are complicated or expensive."',
    suggestions: [
      'Existing tools are bloated, expensive, and require a long learning curve.',
      'People forget routine tasks because current reminder apps are too noisy.',
      'Freelancers spend hours formatting simple invoices in spreadsheets or word processors.',
      'Locals have useful items sitting in garages while neighbors need them for one-off tasks.'
    ],
    placeholder: 'What pain or inconvenience does this remove from someone’s day?',
    helpTips: [
      'What are people doing right now to cope with this problem?',
      'Why is the current way annoying or slow?'
    ]
  },
  {
    id: '3',
    number: 3,
    title: 'Target Audience',
    question: 'Who will use the app? Please describe the main users as simply as you can.',
    whyWeAsk: 'Knowing who will touch the app determines how big the text should be, how friendly the words should feel, and what devices they use.',
    example: 'For example: "Homeowners, renters, and DIY hobbyists in suburban neighborhoods who want to save money and meet neighbors."',
    suggestions: [
      'Beginner plant parents who struggle to keep fiddle leaf figs and succulents alive.',
      'Freelancers, gig workers, and solopreneurs looking for quick billing without software subscriptions.',
      'Suburban neighbors, community garden members, and DIY enthusiasts.',
      'Busy students and professionals wanting a calm, distraction-free daily checklist.'
    ],
    placeholder: 'Describe your primary user in plain words (e.g., age, lifestyle, tech comfort)...',
    helpTips: [
      'Are they tech-savvy or total beginners?',
      'Will they use it in a rush or at a relaxed pace?'
    ]
  },
  {
    id: '4',
    number: 4,
    title: 'App Type',
    question: 'What type of app do you want: web app, mobile app, both, or not sure?',
    whyWeAsk: 'A web app opens in any browser (Safari, Chrome). A mobile app lives on your phone screen. Often, a mobile-friendly web app gives you both for the price of one!',
    example: 'For example: "Both: a web app that works effortlessly on phone screens and laptops."',
    suggestions: [
      'Web app that is mobile-friendly (recommended for beginners: works on phones and laptops instantly).',
      'Mobile-first web app (optimized for thumb taps and phone screens).',
      'Desktop-focused web app (better for spreadsheets, documents, or data entry).',
      'Not sure — please recommend the easiest, lowest-cost choice.'
    ],
    placeholder: 'Tell us which screen you imagine people using this on...',
    helpTips: [
      'Web apps don’t need app store approvals and can be updated instantly.',
      'Building a responsive web app is usually the fastest, easiest path for version 1.'
    ]
  },
  {
    id: '5',
    number: 5,
    title: 'Main Must-Have Features',
    question: 'What are the main things the app must do? Please list the most important features first.',
    whyWeAsk: 'For your first version (the "MVP"), we only want the absolute essentials that prove the app is valuable. We can always add more later.',
    example: 'For example: "1. Post an item with a photo and name. 2. Browse available items by category. 3. Click a button to send a borrow request message."',
    suggestions: [
      '1. Add/edit an item with a title and notes. 2. View all active items in a clean feed. 3. Search and mark items complete.',
      '1. Create an invoice with client name and line items. 2. Live preview the invoice. 3. Download as a clean PDF.',
      '1. Add a plant with sunlight and water frequency. 2. Today’s to-water checklist. 3. 1-tap "Watered!" button.',
      '1. Create 3 daily core habits. 2. Tap to check off. 3. View streak count and calendar history.'
    ],
    placeholder: 'List 2 to 4 must-have actions your users need on day one...',
    helpTips: [
      'If you could only build TWO buttons, which ones would they be?',
      'Aim for a small, practical MVP first.'
    ]
  },
  {
    id: '6',
    number: 6,
    title: 'Extra Nice-to-Have Features',
    question: 'Are there any extra features you want, even if they are not in the first version?',
    whyWeAsk: 'Saving your future dreams here keeps your first version fast and affordable to build, while ensuring you never lose your grand vision.',
    example: 'For example: "Later: In-app chat, insurance deposits, identity verification, and community review ratings."',
    suggestions: [
      'Push notifications, email reminders, and calendar synchronization.',
      'Export data to Excel/CSV, custom branding/logos, and multi-currency billing.',
      'User ratings, in-app messaging, and automatic geolocation proximity search.',
      'Dark mode theme, sound effects when completing a task, and friend leaderboards.'
    ],
    placeholder: 'What cool features would be fun to add after the basic app is working?',
    helpTips: [
      'It’s healthy to say "None for version 1 — let’s keep it laser-focused!"',
      'We will mark these clearly as "Phase 2" in your PRD.'
    ]
  },
  {
    id: '7',
    number: 7,
    title: 'Look & Feel',
    question: 'How should the app look and feel? For example: simple, modern, fun, serious, colorful, calm, luxury, or something else.',
    whyWeAsk: 'The vibe guides the fonts, spacing, and buttons. A calm health app needs soft curves; a professional invoicing tool needs crisp structure.',
    example: 'For example: "Friendly, warm, and community-oriented. Soft corners, plenty of breathing room, and zero confusing buttons."',
    suggestions: [
      'Simple, calm, and distraction-free with generous whitespace.',
      'Modern, crisp, and professional with clean lines and high readability.',
      'Warm, friendly, and approachable with playful touches and soft corners.',
      'Minimalist and fast, feeling like a high-quality native utility tool.'
    ],
    placeholder: 'Pick 2 or 3 adjectives that describe the vibe you want...',
    helpTips: [
      'Think about how you want the user to FEEL: relaxed, organized, energized?'
    ]
  },
  {
    id: '8',
    number: 8,
    title: 'Colors & Style Ideas',
    question: 'Do you have any color ideas, style ideas, or layout ideas for the app?',
    whyWeAsk: 'You don’t need hex codes! Simple ideas like "forest green and warm cream" or "clean dark slate with bright blue buttons" give builders clear direction.',
    example: 'For example: "Earth tones: sage green, soft slate gray, and clean white backgrounds with dark text for easy reading."',
    suggestions: [
      'Clean neutral slate with an energetic indigo or blue accent button.',
      'Earthy sage green, soft warm white, and charcoal text for a natural, calming tone.',
      'Classic high-contrast dark theme (deep slate background, crisp white typography).',
      'Not sure — please pick an accessible, timeless color palette.'
    ],
    placeholder: 'Share your color preferences, favorite apps you like, or layout thoughts...',
    helpTips: [
      'We follow the 60-30-10 rule: 60% clean canvas, 30% calm structural cards, 10% bold accent for buttons.'
    ]
  },
  {
    id: '9',
    number: 9,
    title: 'Screen & Device Support',
    question: 'Should the app work on a web browser, on phones, or both? Should it work well on small screens?',
    whyWeAsk: 'Over 60% of web traffic is on smartphones. Specifying screen requirements ensures buttons are large enough for thumbs and text doesn’t require zooming.',
    example: 'For example: "Both! It must feel natural on iPhone and Android phones, and scale gracefully to a widescreen laptop monitor."',
    suggestions: [
      'Both phones and computers: touch-friendly on mobile, spacious and organized on laptops.',
      'Primarily mobile phones (must have big buttons and single-column scrolling).',
      'Primarily desktop computers (for detailed typing or wide tables).',
      'Both, with offline support so users don’t lose drafts if internet drops.'
    ],
    placeholder: 'How will most people access this app on a normal day?',
    helpTips: [
      'We will specify touch targets $\\ge 44\\text{px}$ so thumbs never mis-tap!'
    ]
  },
  {
    id: '10',
    number: 10,
    title: 'Boundaries & Exclusions',
    question: 'Is there anything the app should not do, or anything that would make it too hard, too expensive, or too slow to build?',
    whyWeAsk: 'Setting strict boundaries is a superpower. Deciding what NOT to build protects your budget, timeline, and sanity.',
    example: 'For example: "No custom cryptocurrency, no paid merchant accounts for v1, no heavy video streaming, and no complex multi-factor logins."',
    suggestions: [
      'No complex logins or passwords required to test; let users start immediately in guest mode.',
      'No paid subscription walls or complicated third-party payment gateways for version 1.',
      'No heavy background video processing or custom AI model training.',
      'No confusing nested menus, popups, or multi-step checkout flows.'
    ],
    placeholder: 'What are you deliberately keeping OUT of version 1 to keep things simple?',
    helpTips: [
      'Simpler apps launch faster and have fewer bugs.',
      'Every feature you say NO to saves you days of development.'
    ]
  }
];
