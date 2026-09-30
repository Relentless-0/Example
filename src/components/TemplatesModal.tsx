import React from 'react';
import { TEMPLATE_PROJECTS } from '../data/templates';
import { TemplateProject } from '../types/prd';
import { X, Sparkles, ArrowRight, Compass, Check } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateProject) => void;
  onStartBlank: () => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onStartBlank,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Sample App Ideas</h2>
              <p className="text-xs text-slate-500">
                Explore real pre-filled examples to see how a complete PRD comes together.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Curated Simple MVPs (Click any to load)
            </span>
            <button
              onClick={onStartBlank}
              className="cursor-pointer text-xs text-slate-500 hover:text-indigo-600 font-medium underline"
            >
              Start from blank scratch
            </button>
          </div>

          {TEMPLATE_PROJECTS.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className="cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {tpl.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tpl.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{tpl.tagline}</p>
              </div>

              <button
                type="button"
                className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-indigo-600 group-hover:text-white group-hover:bg-indigo-600 rounded-lg border border-indigo-200 group-hover:border-indigo-600 transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto"
              >
                <span>Load Idea</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Loading an idea replaces the current draft answers.
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
