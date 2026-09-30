import React, { useState, useEffect } from 'react';
import { PRDDocument, CompanionTab } from '../types/prd';
import {
  ListChecks,
  UserCheck,
  Layout,
  Terminal,
  FileCode2,
  Copy,
  Check,
  Download,
  Sparkles,
  ArrowLeft,
  RotateCw
} from 'lucide-react';

interface CompanionViewProps {
  prd: PRDDocument | null;
  answers: Record<string, string>;
  onBackToPRD: () => void;
}

export const CompanionView: React.FC<CompanionViewProps> = ({
  prd,
  answers,
  onBackToPRD,
}) => {
  const [activeTab, setActiveTab] = useState<
    'feature-list' | 'user-stories' | 'wireframe-outline' | 'ai-builder-prompt' | 'dev-handoff'
  >('feature-list');

  const [cache, setCache] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch or generate companion format
  const loadFormat = async (tab: typeof activeTab, force = false) => {
    if (!force && cache[tab]) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/assistant/generate-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formatType: tab,
          prd,
          answers,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setCache((prev) => ({ ...prev, [tab]: data.content }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFormat(activeTab);
  }, [activeTab, prd]);

  const handleCopy = () => {
    const text = cache[activeTab] || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = cache[activeTab] || '';
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeTab}_${prd?.appName?.toLowerCase().replace(/\s+/g, '_') || 'app'}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    {
      id: 'feature-list' as const,
      label: 'Feature List',
      icon: ListChecks,
      desc: 'Prioritized MVP vs v2 breakdown table',
    },
    {
      id: 'user-stories' as const,
      label: 'User Story List',
      icon: UserCheck,
      desc: 'Agile stories with acceptance criteria',
    },
    {
      id: 'wireframe-outline' as const,
      label: 'Wireframe Outline',
      icon: Layout,
      desc: 'Screen-by-screen layout & button hierarchy',
    },
    {
      id: 'ai-builder-prompt' as const,
      label: 'AI Builder Prompt',
      icon: Terminal,
      desc: 'Ready to paste into Bolt, Lovable, Claude, Cursor',
    },
    {
      id: 'dev-handoff' as const,
      label: 'Developer Handoff',
      icon: FileCode2,
      desc: 'Simple open-source stack, schemas & Day 1 checklist',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToPRD}
            className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to 12-Section PRD</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Companion Builder Formats
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Turn your PRD into ready-to-use artifacts for developers, designers, or AI coding agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!cache[activeTab] || isLoading}
            className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!cache[activeTab] || isLoading}
            className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={() => loadFormat(activeTab, true)}
            disabled={isLoading}
            className="cursor-pointer p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Regenerate this format"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">{tab.label}</span>
              </div>
              <span className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Output Viewer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 sm:p-8 min-h-[380px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500 space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
            <p className="text-sm font-medium text-slate-700">
              Generating your {tabs.find((t) => t.id === activeTab)?.label}...
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Structuring requirements into clean, practical markdown formatted for immediate handoff.
            </p>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-mono bg-slate-50 p-6 rounded-lg border border-slate-200/80 overflow-x-auto">
            {cache[activeTab] || 'No content generated yet.'}
          </div>
        )}
      </div>
    </div>
  );
};
