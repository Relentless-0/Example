import React from 'react';
import { MASTER_QUESTIONS } from '../data/masterQuestions';
import { Check, Sparkles, RotateCcw, Compass, FileCheck } from 'lucide-react';

interface ProgressSidebarProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  answers: Record<string, string>;
  onGeneratePRD: () => void;
  onOpenTemplates: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  currentIndex,
  setCurrentIndex,
  answers,
  onGeneratePRD,
  onOpenTemplates,
  onReset,
  isGenerating,
}) => {
  const answeredCount = Object.values(answers).filter(
    (a) => a && a.trim().length > 0
  ).length;
  const progressPercent = Math.round((answeredCount / MASTER_QUESTIONS.length) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Progress Overview Header */}
        <div className="pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              PRD Readiness
            </span>
            <span className="text-xs font-bold font-mono tabular-nums text-indigo-600">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {answeredCount} of 10 master questions answered
          </p>
        </div>

        {/* Question List */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 px-1">
            Master Questions (10 Max)
          </span>

          {MASTER_QUESTIONS.map((q, idx) => {
            const isAnswered = Boolean(answers[q.id]?.trim());
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2 ${
                  isCurrent
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-2xs font-semibold'
                    : isAnswered
                    ? 'text-slate-800 hover:bg-slate-50'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0 font-bold ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isAnswered ? <Check className="w-3 h-3" /> : q.number}
                  </span>
                  <span className="truncate">{q.title}</span>
                </div>

                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 mt-6 border-t border-slate-100 space-y-2.5">
        <button
          type="button"
          onClick={onGeneratePRD}
          disabled={isGenerating}
          className="cursor-pointer w-full py-2.5 px-4 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isGenerating ? 'Building PRD...' : 'Generate Full PRD'}</span>
        </button>

        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
          <button
            type="button"
            onClick={onOpenTemplates}
            className="cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 py-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Load Template</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 py-1"
            title="Start over with empty answers"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};
