import React from 'react';
import { ATSAnalysisResult } from '@/types/cv';
import { ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, ArrowUpRight, TrendingUp } from 'lucide-react';

interface ATSAnalysisPanelProps {
  atsAnalysis?: ATSAnalysisResult;
  onRefreshScore: () => void;
  isRecalculating?: boolean;
}

export const ATSAnalysisPanel: React.FC<ATSAnalysisPanelProps> = ({
  atsAnalysis,
  onRefreshScore,
  isRecalculating = false
}) => {
  if (!atsAnalysis) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center space-y-3">
        <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center mx-auto border border-slate-200/70">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-slate-900 text-xs tracking-tight uppercase font-mono">ATS Diagnostics Standby</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Provide a target job specification to compute your ATS match score, verify keyword density, and diagnose parsing risks.
        </p>
      </div>
    );
  }

  const { overallScore, breakdown, matchedKeywords, missingKeywords, formattingWarnings, actionableSuggestions } = atsAnalysis;

  // SVG Gauge calculations
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, overallScore)) / 100) * circumference;

  const getScoreTheme = (score: number) => {
    if (score >= 80) return { stroke: '#059669', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80', label: 'OPTIMIZED' };
    if (score >= 60) return { stroke: '#d97706', badge: 'bg-amber-50 text-amber-800 border-amber-200/80', label: 'MODERATE MATCH' };
    return { stroke: '#e11d48', badge: 'bg-rose-50 text-rose-800 border-rose-200/80', label: 'NEEDS REVISION' };
  };

  const theme = getScoreTheme(overallScore);

  return (
    <div className="space-y-4">
      {/* Top Gauge & Index Card */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>ATS Readiness Index</span>
          </div>
          <button
            type="button"
            disabled={isRecalculating}
            onClick={onRefreshScore}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'CALCULATING...' : 'RE-INDEX'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 py-1">
          {/* Circular SVG Meter */}
          <div className="relative flex items-center justify-center w-22 h-22 shrink-0">
            <svg className="w-22 h-22 -rotate-90 transform" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 leading-none">
                {overallScore}
              </span>
              <span className="text-[9px] font-mono font-medium text-slate-400 mt-0.5 tracking-wider">
                / 100
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-1.5 w-full text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-between gap-2">
              <span className="font-semibold text-xs text-slate-900 tracking-tight">
                {overallScore >= 85 ? 'Strong ATS Alignment' : overallScore >= 70 ? 'Moderate Alignment' : 'Low Keyword Density'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${theme.badge}`}>
                {theme.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Calculated against enterprise parser rules (Workday, Greenhouse, Taleo) with keyword proximity weighting.
            </p>
          </div>
        </div>

        {/* Breakdown hairline bars */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-[11px]">
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-slate-600">
              <span className="text-[10px] uppercase">Keywords</span>
              <span className="font-semibold text-slate-900">{breakdown.keywordMatchScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full transition-all duration-500" style={{ width: `${breakdown.keywordMatchScore}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-mono text-slate-600">
              <span className="text-[10px] uppercase">Skills Gap</span>
              <span className="font-semibold text-slate-900">{breakdown.skillsMatchScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${breakdown.skillsMatchScore}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-mono text-slate-600">
              <span className="text-[10px] uppercase">Experience</span>
              <span className="font-semibold text-slate-900">{breakdown.experienceScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-700 h-full rounded-full transition-all duration-500" style={{ width: `${breakdown.experienceScore}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-mono text-slate-600">
              <span className="text-[10px] uppercase">Formatting</span>
              <span className="font-semibold text-slate-900">{breakdown.formattingScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-600 h-full rounded-full transition-all duration-500" style={{ width: `${breakdown.formattingScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Matched Keywords */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="font-semibold text-xs text-slate-900 tracking-tight flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Detected Keywords ({matchedKeywords.length})
          </span>
          <span className="text-[10px] font-mono text-slate-400">FOUND IN CV</span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
          {matchedKeywords.map((kw, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded"
              title={`Found in: ${kw.foundIn.join(', ')}`}
            >
              <span>{kw.keyword}</span>
              <span className="text-[9px] bg-emerald-200/60 px-1 rounded font-semibold text-emerald-900">{kw.count}</span>
            </span>
          ))}
          {matchedKeywords.length === 0 && (
            <span className="text-xs text-slate-400 italic">No exact target keywords detected yet</span>
          )}
        </div>
      </div>

      {/* Missing Keywords & Skills Gap */}
      {missingKeywords.length > 0 && (
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-semibold text-xs text-slate-900 tracking-tight flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Missing High-Yield Terms ({missingKeywords.length})
            </span>
            <span className="text-[10px] font-mono text-amber-700 font-medium">ADD IF APPLICABLE</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {missingKeywords.map((gap, i) => (
              <div key={i} className="p-2.5 bg-slate-50/70 rounded-lg border border-slate-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-slate-900">{gap.keyword}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    gap.importance === 'high' ? 'bg-rose-100 text-rose-800 border border-rose-200/80' : 'bg-slate-200/80 text-slate-700'
                  }`}>
                    {gap.importance} Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{gap.reason}</p>
                {gap.suggestedPlacement && (
                  <p className="text-[10px] text-slate-500 italic">Recommended in: {gap.suggestedPlacement}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formatting & Parsing Warnings */}
      {formattingWarnings.length > 0 && (
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2.5">
          <div className="pb-1.5 border-b border-slate-100">
            <span className="font-semibold text-xs text-slate-900 tracking-tight flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-700" />
              Parsing & Layout Guardrails ({formattingWarnings.length})
            </span>
          </div>

          <div className="space-y-2">
            {formattingWarnings.map((w, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/80 text-xs">
                <div className="font-medium text-slate-800 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${w.type === 'error' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  <span>{w.message}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{w.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Suggestions */}
      {actionableSuggestions.length > 0 && (
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2.5">
          <div className="pb-1.5 border-b border-slate-100">
            <span className="font-semibold text-xs text-slate-900 tracking-tight flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
              Tactical Optimization Steps
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-600">
            {actionableSuggestions.map((sug, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[11.5px] text-slate-700">{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

