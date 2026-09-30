export interface GlossaryItem {
  term: string;
  pronunciation?: string;
  simpleDefinition: string;
  everydayAnalogy: string;
  whyItMatters: string;
}

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'PRD (Product Requirements Document)',
    simpleDefinition: 'A blueprint or recipe book for an app. It tells developers, designers, and AI builders exactly what the app should do and look like.',
    everydayAnalogy: 'Like architectural blueprints for building a house. Without one, the builder doesn’t know where to put the doors!',
    whyItMatters: 'Prevents expensive misunderstandings and keeps everyone focused on the same goal.'
  },
  {
    term: 'MVP (Minimum Viable Product)',
    simpleDefinition: 'The smallest, simplest version of an app that still solves the user’s main problem.',
    everydayAnalogy: 'Think of building a skateboard first before trying to build a Ferrari. It still gets the rider from point A to B quickly!',
    whyItMatters: 'Saves months of work and thousands of dollars by testing the idea before adding complex extras.'
  },
  {
    term: 'Responsive Design',
    simpleDefinition: 'A design that automatically shifts and resizes gracefully whether you view it on a tiny smartphone or a huge desktop monitor.',
    everydayAnalogy: 'Like water in different containers: it fits a small drinking cup or a wide bowl smoothly without spilling.',
    whyItMatters: 'Over half of your users will visit from a phone; responsive design guarantees nobody gets stuck.'
  },
  {
    term: 'Open-Source Tools',
    simpleDefinition: 'Software and code libraries that are free, publicly accessible, and maintained by a global community of developers.',
    everydayAnalogy: 'Like an open recipe shared freely by master chefs. You don’t have to pay rent to cook it or modify it.',
    whyItMatters: 'Keeps building costs close to zero and prevents getting locked into expensive proprietary software.'
  },
  {
    term: 'Acceptance Criteria',
    simpleDefinition: 'A simple checklist of things that MUST happen for a feature to be considered "done and working".',
    everydayAnalogy: 'Like a car inspection checklist: the headlights turn on, the brakes stop the car, and the door opens.',
    whyItMatters: 'Gives the developer or AI builder a crystal-clear test to verify their work.'
  },
  {
    term: 'Edge Cases',
    simpleDefinition: 'Unusual, unexpected, or tricky situations that might happen when people use your app.',
    everydayAnalogy: 'Like someone trying to submit an invoice with $0.00, or a user with a 100-letter name.',
    whyItMatters: 'Planning for edge cases prevents the app from crashing or showing ugly error screens.'
  },
  {
    term: 'User Story',
    simpleDefinition: 'A one-sentence description of a feature told from the perspective of the person who will use it.',
    everydayAnalogy: 'Formula: "As a [type of user], I want to [action], so that [benefit]."',
    whyItMatters: 'Keeps features focused on real human benefits rather than cold technical specifications.'
  },
  {
    term: 'Wireframe',
    simpleDefinition: 'A basic sketch or black-and-white outline showing where buttons, text, and pictures will sit on the screen.',
    everydayAnalogy: 'Like a floor plan or pencil sketch of a room before you paint the walls or buy furniture.',
    whyItMatters: 'Lets you arrange the layout without getting distracted by colors or logos.'
  }
];
