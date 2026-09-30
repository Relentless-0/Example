export interface MasterQuestion {
  id: string; // '1' through '10'
  number: number;
  title: string;
  question: string;
  whyWeAsk: string;
  example: string;
  suggestions: string[];
  placeholder: string;
  helpTips?: string[];
}

export interface PRDSection {
  number: number;
  title: string;
  content: string;
}

export interface PRDDocument {
  appName: string;
  tagline: string;
  executiveSummary: string;
  sections: PRDSection[];
  answers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type CompanionTab =
  | 'prd'
  | 'feature-list'
  | 'user-stories'
  | 'wireframe-outline'
  | 'ai-builder-prompt'
  | 'dev-handoff';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface TemplateProject {
  id: string;
  title: string;
  tagline: string;
  category: string;
  answers: Record<string, string>;
}
