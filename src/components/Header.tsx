import React from 'react';
import { BookOpen, FileText, Sparkles, Plus, Layers, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'wizard' | 'prd' | 'companions' | 'templates';
  setActiveTab: (tab: 'wizard' | 'prd' | 'companions' | 'templates') => void;
  openGlossary: () => void;
  openChat: () => void;
  onResetProject: () => void;
  answeredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openGlossary,
  openChat,
  onResetProject,
  answeredCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('wizard')}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              PRD
            </div>
            <span>IdeaToPRD</span>
          </button>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-normal">
            Product Planning Assistant for Non-Tech Builders
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'wizard'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            10-Question Guide
            {answeredCount > 0 && (
              <span className="ml-1.5 text-xs text-slate-400">({answeredCount}/10)</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('prd')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'prd'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Full PRD Document
          </button>
          <button
            onClick={() => setActiveTab('companions')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'companions'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Builder Exports
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'templates'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Sample Ideas
          </button>
          <button
            onClick={openGlossary}
            className="cursor-pointer hover:text-slate-900 transition-colors flex items-center gap-1 text-slate-500 hover:text-indigo-600"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Plain English Glossary</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openChat}
            className="cursor-pointer px-3 py-1.5 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 border border-indigo-200"
            title="Chat with your Product Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Ask Assistant</span>
            <span className="sm:hidden">Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('prd')}
            className="cursor-pointer px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View PRD</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-1.5 bg-slate-50 text-xs">
        <button
          onClick={() => setActiveTab('wizard')}
          className={`px-2 py-1 rounded font-medium ${activeTab === 'wizard' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Guide ({answeredCount}/10)
        </button>
        <button
          onClick={() => setActiveTab('prd')}
          className={`px-2 py-1 rounded font-medium ${activeTab === 'prd' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          PRD Doc
        </button>
        <button
          onClick={() => setActiveTab('companions')}
          className={`px-2 py-1 rounded font-medium ${activeTab === 'companions' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Exports
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-2 py-1 rounded font-medium ${activeTab === 'templates' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Ideas
        </button>
        <button
          onClick={openGlossary}
          className="px-2 py-1 text-slate-600 hover:text-indigo-600"
        >
          Glossary
        </button>
      </div>
    </header>
  );
};
