import React from 'react';
import { GLOSSARY_ITEMS } from '../data/glossary';
import { X, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Plain English Glossary</h2>
              <p className="text-xs text-slate-500">
                Tech buzzwords explained in everyday language with simple analogies.
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

        {/* Glossary List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {GLOSSARY_ITEMS.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span>{item.term}</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-2.5">
                {item.simpleDefinition}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-amber-950 flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[11px] text-amber-900 uppercase tracking-wider">
                      Everyday Analogy
                    </span>
                    <span>{item.everydayAnalogy}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200/60 text-indigo-950 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[11px] text-indigo-900 uppercase tracking-wider">
                      Why It Matters
                    </span>
                    <span>{item.whyItMatters}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
