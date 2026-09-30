import React, { useState, useEffect } from 'react';
import { MasterQuestion } from '../types/prd';
import {
  HelpCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';

interface QuestionCardProps {
  question: MasterQuestion;
  currentAnswer: string;
  onSaveAnswer: (answer: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onGeneratePRD: () => void;
  isFirst: boolean;
  isLast: boolean;
  totalQuestions: number;
  allAnswers: Record<string, string>;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentAnswer,
  onSaveAnswer,
  onNext,
  onPrev,
  onGeneratePRD,
  isFirst,
  isLast,
  totalQuestions,
  allAnswers,
}) => {
  const [answerText, setAnswerText] = useState(currentAnswer || '');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([]);
  const [suggestionTip, setSuggestionTip] = useState<string>('');
  const [complexityWarning, setComplexityWarning] = useState<{
    warning: string;
    alternative: string;
  } | null>(null);

  // Sync state when question changes
  useEffect(() => {
    setAnswerText(currentAnswer || '');
    setDynamicOptions([]);
    setSuggestionTip('');
    checkLocalComplexity(currentAnswer || '');
  }, [question.id, currentAnswer]);

  // Handle local text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setAnswerText(val);
    onSaveAnswer(val);
    checkLocalComplexity(val);
  };

  // Complexity radar for MVP simplicity
  const checkLocalComplexity = (text: string) => {
    const lower = text.toLowerCase();
    const complexTriggers = [
      {
        keyword: 'crypto',
        warning: 'Cryptocurrency & blockchain transactions involve complex wallets, gas fees, and legal regulations.',
        alternative: 'How about simple digital credits or standard Stripe checkout for version 1?'
      },
      {
        keyword: 'blockchain',
        warning: 'Smart contracts and decentralized ledgers make version 1 slow and costly to test.',
        alternative: 'Start with a standard open-source database like SQLite or Supabase first.'
      },
      {
        keyword: 'video call',
        warning: 'Real-time multi-person video streaming requires high server bandwidth and WebRTC servers.',
        alternative: 'How about audio notes or integration links to Zoom/Google Meet for version 1?'
      },
      {
        keyword: 'face recognition',
        warning: 'Biometric face recognition models require heavy machine learning infrastructure.',
        alternative: 'Start with standard photo uploads and simple manual verification.'
      },
      {
        keyword: 'machine learning model',
        warning: 'Training custom AI neural networks from scratch takes months of data preparation.',
        alternative: 'Use lightweight pre-built APIs or simple rule-based logic for your MVP.'
      },
      {
        keyword: 'custom payment gateway',
        warning: 'Building custom credit card processing requires strict PCI compliance and banking licenses.',
        alternative: 'Use simple hosted checkout links (Stripe or PayPal) that take 10 minutes to setup.'
      }
    ];

    const match = complexTriggers.find(t => lower.includes(t.keyword));
    if (match) {
      setComplexityWarning({
        warning: match.warning,
        alternative: match.alternative
      });
    } else {
      setComplexityWarning(null);
    }
  };

  // Suggest options / I don't know handler
  const handleSuggestOptions = async () => {
    setIsSuggesting(true);
    try {
      const res = await fetch('/api/assistant/suggest-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          questionText: question.question,
          contextAnswers: allAnswers,
        }),
      });
      const data = await res.json();
      if (data.options && data.options.length > 0) {
        setDynamicOptions(data.options);
        setSuggestionTip(data.explanation || 'Pick any option below to fill your answer:');
      } else {
        setDynamicOptions(question.suggestions);
        setSuggestionTip('Here are a few popular choices:');
      }
    } catch (e) {
      // Fallback
      setDynamicOptions(question.suggestions);
      setSuggestionTip('Here are a few simple starter choices:');
    } finally {
      setIsSuggesting(false);
    }
  };

  // Polish answer handler
  const handlePolishAnswer = async () => {
    if (!answerText.trim()) return;
    setIsPolishing(true);
    try {
      const res = await fetch('/api/assistant/refine-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.question,
          rawAnswer: answerText,
        }),
      });
      const data = await res.json();
      if (data.refined) {
        setAnswerText(data.refined);
        onSaveAnswer(data.refined);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSelectOption = (opt: string) => {
    let newText = opt;
    if (answerText.trim() && !answerText.includes(opt)) {
      newText = `${answerText.trim()}\n• ${opt}`;
    }
    setAnswerText(newText);
    onSaveAnswer(newText);
    checkLocalComplexity(newText);
  };

  const hasAnswer = answerText.trim().length > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Master Question {question.number} of {totalQuestions}
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500 font-medium">{question.title}</span>
        </div>

        {hasAnswer && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Answered</span>
          </div>
        )}
      </div>

      {/* Main Question Heading */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
        {question.question}
      </h2>

      {/* Why We Ask This Box */}
      <div className="mb-5 p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Why this matters: </span>
          <span>{question.whyWeAsk}</span>
        </div>
      </div>

      {/* Real-World Example */}
      <div className="mb-6 p-3.5 bg-amber-50/60 rounded-lg border border-amber-200/50 text-xs sm:text-sm text-amber-900 leading-relaxed flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950">Real-life example: </span>
          <span>{question.example}</span>
        </div>
      </div>

      {/* Quick Option Suggestions (Static or AI fetched) */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {suggestionTip || 'Easy Choices & Suggestions (Click to pick or add):'}
          </label>

          <button
            type="button"
            onClick={handleSuggestOptions}
            disabled={isSuggesting}
            className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSuggesting ? 'Thinking...' : "I don't know (Give me ideas)"}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(dynamicOptions.length > 0 ? dynamicOptions : question.suggestions).map(
            (suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(suggestion)}
                className="cursor-pointer text-left text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-200 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors leading-relaxed"
              >
                + {suggestion}
              </button>
            )
          )}
        </div>
      </div>

      {/* Answer Text Area */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="answer-input"
            className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Your Answer (In plain words):
          </label>

          {hasAnswer && (
            <button
              type="button"
              onClick={handlePolishAnswer}
              disabled={isPolishing}
              className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
              title="Polishes your phrasing into clean, simple English"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPolishing ? 'Polishing...' : 'Polish my answer'}</span>
            </button>
          )}
        </div>

        <textarea
          id="answer-input"
          value={answerText}
          onChange={handleChange}
          rows={4}
          placeholder={question.placeholder}
          className="w-full p-3.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 transition-all placeholder:text-slate-400 shadow-2xs"
        />

        <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
          <span>Be as casual as you like — no technical jargon needed.</span>
          <span>{answerText.length} characters</span>
        </div>
      </div>

      {/* Friendly Complexity Radar Warning */}
      {complexityWarning && (
        <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-200 text-xs sm:text-sm text-orange-950">
          <div className="flex items-center gap-2 font-semibold text-orange-900 mb-1">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span>Gentle MVP Simplification Tip</span>
          </div>
          <p className="mb-2 leading-relaxed">{complexityWarning.warning}</p>
          <div className="p-2.5 bg-white/80 rounded border border-orange-200 font-medium text-orange-900">
            <strong>Simpler recommendation:</strong> {complexityWarning.alternative}
          </div>
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            isFirst
              ? 'opacity-40 cursor-not-allowed text-slate-400'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-3">
          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="cursor-pointer px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>{hasAnswer ? 'Next Question' : 'Skip / Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onGeneratePRD}
              className="cursor-pointer px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate My 12-Section PRD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
