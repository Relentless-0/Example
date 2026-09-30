import { TemplateProject } from '../types/prd';

export const TEMPLATE_PROJECTS: TemplateProject[] = [
  {
    id: 'tool-share',
    title: 'Neighborhood Tool Share',
    tagline: 'Lend and borrow DIY tools and lawn gear with verified neighbors',
    category: 'Community',
    answers: {
      '1': 'A friendly community web app where neighbors list garden and DIY tools they can lend, and neighbors can browse and request them.',
      '2': 'People spend hundreds of dollars on tools they only use once a year, while neighbors have those exact tools collecting dust in garages.',
      '3': 'Homeowners, renters, community gardeners, and DIY enthusiasts in residential neighborhoods.',
      '4': 'A web app that is responsive on both mobile phones and laptops.',
      '5': '1. Post an item with a photo, title, and availability. 2. Browse/search available tools with category filters. 3. Click "Request Borrow" to contact the owner.',
      '6': 'Phase 2: In-app chat messaging, damage protection deposit, and calendar booking reservation slots.',
      '7': 'Warm, approachable, community-oriented, with clean cards and friendly illustrations.',
      '8': 'Forest green accent, warm cream/slate neutral backgrounds, and clean high-contrast dark text.',
      '9': 'Both phones and desktop. Must work seamlessly when a neighbor is standing in their garage looking up a tool on mobile.',
      '10': 'No payment processing or credit cards in version 1 (free neighborly lending). No complex identity verification APIs.'
    }
  },
  {
    id: 'plant-care',
    title: 'Plant Care & Watering Reminder',
    tagline: 'Simple schedules and care cards so your houseplants never die',
    category: 'Lifestyle',
    answers: {
      '1': 'A simple plant watering and misting reminder app that helps beginners keep houseplants alive without overwhelming them with botanical jargon.',
      '2': 'People forget when they last watered their plants, or overwater them by mistake, leading to dead plants and wasted money.',
      '3': 'Everyday apartment dwellers, beginner plant parents, and busy professionals with 2 to 15 houseplants.',
      '4': 'Mobile-first web app that feels like a clean pocket companion.',
      '5': '1. Add a plant with a photo, nickname, and watering frequency (e.g. Every 7 days). 2. A "Needs Water Today" dashboard. 3. 1-tap "Watered!" button that resets the timer.',
      '6': 'Phase 2: Sunlight requirement guide, fertilizing reminders, and disease/yellow leaf symptom checker.',
      '7': 'Calm, refreshing, organic, and clean with relaxing botanical vibes and zero stress.',
      '8': 'Sage green, soft off-white canvas, slate gray text, and warm terracotta accents.',
      '9': 'Primarily mobile screens (touch-friendly with big tap buttons $\\ge 44\\text{px}$). Works on laptops too.',
      '10': 'No camera-based AI botanical disease diagnosis in v1. No complicated soil sensor hardware integrations.'
    }
  },
  {
    id: 'freelancer-invoice',
    title: 'Freelance Instant Invoicer',
    tagline: 'Fast, no-nonsense PDF invoicing without subscriptions or signup walls',
    category: 'Productivity',
    answers: {
      '1': 'A clean, fast web app for freelancers to type client info, add invoice line items, and generate a professional PDF invoice in 60 seconds.',
      '2': 'Solopreneurs and gig workers spend hours fiddling with messy Word/Excel templates or get trapped in expensive monthly software subscriptions just to bill a client.',
      '3': 'Freelance designers, writers, tutors, consultants, and handy workers who need to send 2-10 invoices a month.',
      '4': 'Web app (primarily desktop/laptop for easy typing, but previewable on phones).',
      '5': '1. Clean invoice form (Client name, date, invoice #, line items with rate & qty). 2. Automatic subtotal, tax, and total calculation. 3. Instant clean PDF download button.',
      '6': 'Phase 2: Save client directory, multi-currency support, payment link attachment (Stripe/PayPal), and invoice status tracker (Paid/Pending).',
      '7': 'Crisp, modern, professional, minimalist, and trustworthy. Strict typographic hierarchy.',
      '8': 'Neutral slate canvas (#0F172A), crisp border dividers, and subtle royal blue accent on the download button.',
      '9': 'Works best on web browsers (desktop/laptop) with full responsive support for quick phone checks.',
      '10': 'No complex double-entry bookkeeping, no payroll handling, and no mandatory account registration to create an invoice.'
    }
  },
  {
    id: 'habit-streak',
    title: '3-Habit Daily Streak Tracker',
    tagline: 'A distraction-free tracker focused strictly on 3 core daily habits',
    category: 'Health & Habits',
    answers: {
      '1': 'A minimal daily habit tracker that limits users to tracking just 3 core habits per day to prevent burnout and encourage consistent streaks.',
      '2': 'Most habit apps fail because they let users add 20 habits at once, leading to overwhelm, guilt, and abandoning the app within a week.',
      '3': 'People wanting to build simple daily routines (e.g. read 10 pages, drink water, take a walk) without gamified distractions or ads.',
      '4': 'Mobile-friendly web app that can be added to the phone home screen as a PWA.',
      '5': '1. Define 3 daily habits with custom icons/names. 2. Daily check-off checklist with satisfying tactile completion. 3. Streak counter and 30-day visual dot matrix.',
      '6': 'Phase 2: Daily reflection note (1 sentence), gentle evening reminder push notification, and data export to CSV.',
      '7': 'Zen, minimal, calming, and focused. Generous whitespace, smooth micro-interactions, no loud sounds or ads.',
      '8': 'Monochrome dark or light mode with subtle emerald green for completed streaks.',
      '9': 'Both mobile phones and laptops, with instant local persistence so it works offline.',
      '10': 'No social leaderboards, no competitive rankings, no intrusive banner ads, no heavy account setup.'
    }
  }
];
