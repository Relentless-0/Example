import React, { useState } from 'react';
import { PRDDocument, PRDSection } from '../types/prd';
import {
  Copy,
  Check,
  Download,
  Printer,
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  FileCode,
  Search,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface PRDViewerProps {
  prd: PRDDocument | null;
  onUpdatePRD: (updated: PRDDocument) => void;
  onOpenCompanions: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const PRDViewer: React.FC<PRDViewerProps> = ({
  prd,
  onUpdatePRD,
  onOpenCompanions,
  onRegenerate,
  isRegenerating,
}) => {
  const [copied, setCopied] = useState(false);
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  if (!prd) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-xs">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">
          PRD
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No PRD Generated Yet</h3>
        <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Answer the master questions in the guide, or pick a sample idea template to instantly produce a comprehensive 12-section Product Requirements Document!
        </p>
        <button
          onClick={onRegenerate}
          className="cursor-pointer px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-xs transition-colors inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate PRD with Current Answers</span>
        </button>
      </div>
    );
  }

  // Toggle single section expand/collapse
  const toggleSection = (sectionNum: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionNum]: prev[sectionNum] !== undefined ? !prev[sectionNum] : false,
    }));
  };

  // Start editing a section
  const handleStartEdit = (section: PRDSection) => {
    setEditingSection(section.number);
    setEditContent(section.content);
  };

  // Save edited section
  const handleSaveEdit = (sectionNum: number) => {
    const updatedSections = prd.sections.map((s) =>
      s.number === sectionNum ? { ...s, content: editContent } : s
    );
    onUpdatePRD({
      ...prd,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
    setEditingSection(null);
  };

  // Copy full PRD Markdown to clipboard
  const handleCopyMarkdown = () => {
    let fullMd = `# ${prd.appName} - Product Requirements Document (PRD)\n\n`;
    fullMd += `> ${prd.tagline}\n\n`;
    fullMd += `**Executive Summary:** ${prd.executiveSummary}\n\n`;
    fullMd += `---\n\n`;

    prd.sections.forEach((sec) => {
      fullMd += `## ${sec.number}. ${sec.title}\n\n${sec.content}\n\n---\n\n`;
    });

    navigator.clipboard.writeText(fullMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .md file
  const handleDownloadMarkdown = () => {
    let fullMd = `# ${prd.appName} - Product Requirements Document (PRD)\n\n`;
    fullMd += `> ${prd.tagline}\n\n`;
    fullMd += `**Executive Summary:** ${prd.executiveSummary}\n\n`;
    fullMd += `---\n\n`;

    prd.sections.forEach((sec) => {
      fullMd += `## ${sec.number}. ${sec.title}\n\n${sec.content}\n\n---\n\n`;
    });

    const blob = new Blob([fullMd], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${prd.appName.toLowerCase().replace(/\s+/g, '_')}_prd.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger print dialog for PDF export
  const handlePrint = () => {
    window.print();
  };

  // Filter sections by search query
  const filteredSections = prd.sections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls & Document Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-indigo-600 font-semibold uppercase tracking-wider">
              <span>Complete 12-Section Specification</span>
              <span>·</span>
              <span className="text-slate-400">Builder-Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {prd.appName}
            </h1>
            <p className="text-slate-600 text-sm mt-1">{prd.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Copy entire document as Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Download as .md file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              onClick={handlePrint}
              className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRegenerating ? 'Updating...' : 'Regenerate'}</span>
            </button>
          </div>
        </div>

        {/* Executive summary banner */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900 block mb-1">
            Executive Summary & Vision:
          </span>
          {prd.executiveSummary}
        </div>

        {/* Search & Companion Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search sections or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <button
            onClick={onOpenCompanions}
            className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors whitespace-nowrap self-end sm:self-auto"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Generate Feature List, User Stories & AI Prompts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 12 Document Sections */}
      <div className="space-y-4">
        {filteredSections.map((section) => {
          const isCollapsed = expandedSections[section.number] === false;
          const isEditing = editingSection === section.number;

          return (
            <div
              key={section.number}
              id={`section-${section.number}`}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              {/* Section Header */}
              <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                    {section.number}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 no-print">
                  {!isEditing ? (
                    <button
                      onClick={() => handleStartEdit(section)}
                      className="cursor-pointer p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit this section"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  ) : null}

                  <button
                    onClick={() => toggleSection(section.number)}
                    className="cursor-pointer p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                    title={isCollapsed ? 'Expand section' : 'Collapse section'}
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Section Content */}
              {!isCollapsed && (
                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={12}
                        className="w-full p-4 text-xs sm:text-sm font-mono border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingSection(null)}
                          className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={() => handleSaveEdit(section.number)}
                          className="cursor-pointer px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                      {section.content}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
