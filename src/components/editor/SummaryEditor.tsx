import React from 'react';
import { Sparkles, Lock, Unlock, FileText } from 'lucide-react';

interface SummaryEditorProps {
  summary: string;
  isLocked: boolean;
  onToggleLock: () => void;
  onChange: (updated: string) => void;
  onOpenAIRewrite: (text: string, context: string, onApply: (newText: string) => void) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({
  summary,
  isLocked,
  onToggleLock,
  onChange,
  onOpenAIRewrite
}) => {
  const wordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleAIRewrite = () => {
    onOpenAIRewrite(
      summary,
      'Professional Summary',
      (newText) => onChange(newText)
    );
  };

  return (
    <div className="space-y-4 bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
          <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span>Executive Summary</span>
        </div>

        <div className="flex items-center gap-1.5 xs:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleLock}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded-md font-medium transition-all ${
              isLocked
                ? 'bg-amber-50 text-amber-800 border border-amber-300/80 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/50'
            }`}
            title={isLocked ? 'Protected from AI regeneration' : 'Lock to prevent automated AI rewriting'}
          >
            {isLocked ? <Lock className="w-3 h-3 text-amber-700" /> : <Unlock className="w-3 h-3 text-slate-500" />}
            <span className="hidden xs:inline">{isLocked ? 'LOCKED' : 'LOCK'}</span>
          </button>

          <button
            type="button"
            onClick={handleAIRewrite}
            className="btn-secondary flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium"
          >
            <Sparkles className="w-3 h-3 text-slate-600" />
            <span className="hidden xs:inline">AI Rewrite</span>
            <span className="xs:hidden">AI</span>
          </button>
        </div>
      </div>

      <div className="relative space-y-1.5">
        <textarea
          rows={4}
          value={summary || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Craft a concise 3-4 sentence professional summary highlighting core accomplishments, leadership impact, and specific technical competencies..."
          className="w-full p-3 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none leading-relaxed resize-y font-sans transition-all"
        />
        <div className="flex justify-between items-center text-[10.5px] font-mono text-slate-400 pt-0.5">
          <span>Target benchmark: 40-75 words</span>
          <span className={wordCount > 85 ? 'text-amber-600 font-semibold' : 'text-slate-500'}>
            {wordCount} words
          </span>
        </div>
      </div>
    </div>
  );
};

