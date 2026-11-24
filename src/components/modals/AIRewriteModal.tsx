import React, { useState } from 'react';
import { Sparkles, X, Check, Loader2 } from 'lucide-react';
import { RewriteMode } from '@/lib/ai/rewrite-section';

interface AIRewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  context: string;
  onApply: (newText: string) => void;
  targetRole?: string;
}

const MODES: Array<{ id: RewriteMode; label: string; desc: string }> = [
  { id: 'professional', label: 'Executive Polish', desc: 'Refined executive tone with active voice' },
  { id: 'more_impactful', label: 'Metric Impact', desc: 'Action verbs, metric-focused results' },
  { id: 'shorter', label: 'Tighten & Distill', desc: 'Eliminate filler, maximize signal' },
  { id: 'more_technical', label: 'Technical Depth', desc: 'Emphasize engineering depth and tools' },
  { id: 'senior_executive', label: 'Strategic Ownership', desc: 'Organizational scale, cross-functional leadership' },
  { id: 'ats_tailored', label: 'ATS Alignment', desc: 'Target job terminology integration' },
  { id: 'fix_grammar', label: 'Grammar & Clarity', desc: 'Correct syntax, tense, and precision' }
];

export const AIRewriteModal: React.FC<AIRewriteModalProps> = ({
  isOpen,
  onClose,
  originalText,
  context,
  onApply,
  targetRole
}) => {
  const [selectedMode, setSelectedMode] = useState<RewriteMode>('more_impactful');
  const [customPrompt, setCustomPrompt] = useState('');
  const [proposedText, setProposedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (mode: RewriteMode = selectedMode) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/rewrite-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalText,
          mode,
          jobContext: targetRole || 'Software Engineering',
          customInstructions: mode === 'custom' ? customPrompt : undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to rewrite text');
      }

      setProposedText(data.data.rewrittenText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rewriting failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (proposedText) {
      onApply(proposedText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200/90 space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/80">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 tracking-tight">AI Section Assistant</h3>
              <p className="text-[11px] text-slate-500 font-mono">TARGET: {context}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Mode Selector */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700 mb-2">
              Select Optimization Strategy
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedMode(m.id);
                    handleGenerate(m.id);
                  }}
                  className={`p-2.5 rounded-lg text-left border transition-all text-xs cursor-pointer ${
                    selectedMode === m.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-[11px] leading-tight">{m.label}</div>
                  <div className={`text-[10px] line-clamp-1 mt-0.5 ${selectedMode === m.id ? 'text-slate-300' : 'text-slate-500'}`}>
                    {m.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Original vs Proposed Preview */}
          <div className="space-y-3">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                Source Phrasing
              </span>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto font-sans">
                {originalText}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] font-mono uppercase tracking-wider font-semibold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Proposed Transformation
                </span>
                {proposedText && (
                  <span className="text-[10px] font-mono text-emerald-700 font-medium">Ready to apply</span>
                )}
              </div>

              {isLoading ? (
                <div className="p-8 bg-slate-50 border border-slate-200/90 rounded-lg flex flex-col items-center justify-center text-xs text-slate-700 gap-2.5">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                  <span className="font-medium text-xs">Transforming content with active metrics...</span>
                </div>
              ) : proposedText ? (
                <div className="p-3.5 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-900 leading-relaxed font-sans shadow-xs">
                  {proposedText}
                </div>
              ) : (
                <div className="p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                  Select a rewrite strategy above to generate an optimized version
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-2.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleGenerate(selectedMode)}
            className="btn-secondary flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            <span>{proposedText ? 'Re-generate' : 'Generate'}</span>
          </button>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost px-3 py-1.5 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!proposedText || isLoading}
              onClick={handleApply}
              className="btn-primary flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-medium disabled:opacity-40 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to CV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
