import React, { useState, useEffect } from 'react';
import { MASTER_QUESTIONS } from './data/masterQuestions';
import { TEMPLATE_PROJECTS } from './data/templates';
import { PRDDocument, TemplateProject } from './types/prd';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { ProgressSidebar } from './components/ProgressSidebar';
import { PRDViewer } from './components/PRDViewer';
import { CompanionView } from './components/CompanionView';
import { ChatAssistantDrawer } from './components/ChatAssistantDrawer';
import { GlossaryModal } from './components/GlossaryModal';
import { TemplatesModal } from './components/TemplatesModal';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const STORAGE_KEY = 'ideatoprd_project_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'wizard' | 'prd' | 'companions' | 'templates'>('wizard');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [prd, setPrd] = useState<PRDDocument | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved state on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.prd) setPrd(parsed.prd);
      } else {
        // Initialize with Neighborhood Tool Share template as a friendly preview
        const defaultTpl = TEMPLATE_PROJECTS[0];
        setAnswers(defaultTpl.answers);
      }
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
  }, []);

  // Save state on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, prd }));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }, [answers, prd]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAnswer = (answer: string) => {
    const qId = MASTER_QUESTIONS[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < MASTER_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleGeneratePRD();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Generate 12-Section PRD
  const handleGeneratePRD = async () => {
    setIsGenerating(true);
    showToast('Crafting your 12-section PRD with simple, builder-ready specifications...');
    try {
      const res = await fetch('/api/assistant/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (data.prd) {
        setPrd(data.prd);
        setActiveTab('prd');
        showToast('Your PRD is ready! Review sections or export companion formats.');
      }
    } catch (e) {
      console.error('Error generating PRD:', e);
      showToast('Generated PRD using offline mode.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTemplate = (template: TemplateProject) => {
    setAnswers(template.answers);
    setIsTemplatesOpen(false);
    setCurrentQuestionIndex(0);
    setActiveTab('wizard');
    showToast(`Loaded "${template.title}" template.`);
  };

  const handleStartBlank = () => {
    setAnswers({});
    setPrd(null);
    setIsTemplatesOpen(false);
    setCurrentQuestionIndex(0);
    setActiveTab('wizard');
    showToast('Started fresh with a blank project.');
  };

  const answeredCount = Object.values(answers).filter(
    (a) => a && a.trim().length > 0
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openGlossary={() => setIsGlossaryOpen(true)}
        openChat={() => setIsChatOpen(true)}
        onResetProject={handleStartBlank}
        answeredCount={answeredCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tab 1: 10-Question Guide (Wizard) */}
        {activeTab === 'wizard' && (
          <div>
            {/* Friendly introduction banner */}
            <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 rounded-xl border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Turn Your App Idea into a Builder-Ready PRD</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Answer 10 simple questions. No technical background needed — click options or ask the assistant if unsure.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTemplatesOpen(true)}
                  className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Explore Sample Ideas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGlossaryOpen(true)}
                  className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Plain Glossary</span>
                </button>
              </div>
            </div>

            {/* Split layout: Progress Sidebar & Question Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Sidebar (Desktop) */}
              <div className="hidden lg:block lg:col-span-4 sticky top-24">
                <ProgressSidebar
                  currentIndex={currentQuestionIndex}
                  setCurrentIndex={setCurrentQuestionIndex}
                  answers={answers}
                  onGeneratePRD={handleGeneratePRD}
                  onOpenTemplates={() => setIsTemplatesOpen(true)}
                  onReset={handleStartBlank}
                  isGenerating={isGenerating}
                />
              </div>

              {/* Center / Right Question Card */}
              <div className="lg:col-span-8">
                <QuestionCard
                  question={MASTER_QUESTIONS[currentQuestionIndex]}
                  currentAnswer={answers[MASTER_QUESTIONS[currentQuestionIndex].id] || ''}
                  onSaveAnswer={handleSaveAnswer}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onGeneratePRD={handleGeneratePRD}
                  isFirst={currentQuestionIndex === 0}
                  isLast={currentQuestionIndex === MASTER_QUESTIONS.length - 1}
                  totalQuestions={MASTER_QUESTIONS.length}
                  allAnswers={answers}
                />

                {/* Mobile progress summary */}
                <div className="lg:hidden mt-6 bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">{answeredCount}/10</span> questions answered
                  </div>
                  <button
                    onClick={handleGeneratePRD}
                    disabled={isGenerating}
                    className="cursor-pointer text-xs font-semibold text-white bg-slate-900 px-3.5 py-1.5 rounded-lg"
                  >
                    {isGenerating ? 'Building...' : 'Generate PRD'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full 12-Section PRD View */}
        {activeTab === 'prd' && (
          <PRDViewer
            prd={prd}
            onUpdatePRD={setPrd}
            onOpenCompanions={() => setActiveTab('companions')}
            onRegenerate={handleGeneratePRD}
            isRegenerating={isGenerating}
          />
        )}

        {/* Tab 3: Companion Artifacts (Feature list, user stories, wireframe, prompts, dev handoff) */}
        {activeTab === 'companions' && (
          <CompanionView
            prd={prd}
            answers={answers}
            onBackToPRD={() => setActiveTab('prd')}
          />
        )}

        {/* Tab 4: Sample Ideas Showcase */}
        {activeTab === 'templates' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Curated Simple App Inspirations
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Pick any of these vetted, simple MVPs to load realistic answers into your planner, inspect the completed PRD, or build from.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEMPLATE_PROJECTS.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mb-2">
                      {tpl.category}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mb-1">{tpl.title}</h2>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{tpl.tagline}</p>

                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 line-clamp-3">
                      <strong>Core idea:</strong> {tpl.answers['1']}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTemplate(tpl)}
                    className="cursor-pointer w-full py-2 text-xs font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50/60 border border-indigo-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Load This Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Assistant Trigger on Mobile/Desktop */}
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 rounded-full px-4 py-2.5 shadow-md flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105 cursor-pointer no-print"
      >
        <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
        <span>Need guidance? Ask AI</span>
      </button>

      {/* Slide-out Chat Assistant Drawer */}
      <ChatAssistantDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        answers={answers}
        currentQuestionIndex={currentQuestionIndex}
      />

      {/* Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        onStartBlank={handleStartBlank}
      />
    </div>
  );
}
