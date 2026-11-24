import React, { useState } from 'react';
import { JobDescription } from '@/types/cv';
import { Target, Sparkles, Building2, Briefcase, AlertCircle, Loader2, Lock, CheckCircle2 } from 'lucide-react';

interface TargetJobPanelProps {
  job: JobDescription;
  onUpdateJob: (updated: JobDescription) => void;
  onTailorCV: () => void;
  isTailoring: boolean;
  lockedSectionsCount: number;
}

export const TargetJobPanel: React.FC<TargetJobPanelProps> = ({
  job,
  onUpdateJob,
  onTailorCV,
  isTailoring,
  lockedSectionsCount
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rawInput, setRawInput] = useState(job.rawText || '');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!rawInput.trim()) {
      setError('Please paste a job description first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: rawInput })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to analyze job description');
      }

      onUpdateJob({
        jobTitle: data.data.analysis.jobTitle,
        company: data.data.analysis.company,
        rawText: rawInput,
        analysis: data.data.analysis
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analysis = job.analysis;

  return (
    <div className="space-y-4">
      {/* Target Spec Input */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <Target className="w-3.5 h-3.5" />
            </div>
            <span>Target Role Specification</span>
          </div>

          {analysis && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              PARSED
            </span>
          )}
        </div>

        <p className="text-[11.5px] text-slate-500 leading-relaxed">
          Paste the job posting to deconstruct required competencies, extract target ATS keywords, and re-weight your experience.
        </p>

        <div>
          <textarea
            rows={5}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste job posting (title, requirements, qualifications, responsibilities)..."
            className="w-full p-3 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all leading-relaxed font-sans resize-y"
          />
        </div>

        {error && (
          <div className="p-2.5 text-xs text-red-700 bg-red-50/80 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            disabled={isAnalyzing || !rawInput.trim()}
            onClick={handleAnalyze}
            className="btn-secondary flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium"
          >
            {isAnalyzing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-slate-600" />
            ) : (
              <Target className="w-3.5 h-3.5 shrink-0 text-slate-600" />
            )}
            <span className="truncate">{isAnalyzing ? 'Extracting Keywords...' : 'Analyze Requirements'}</span>
          </button>

          {analysis && (
            <button
              type="button"
              disabled={isTailoring}
              onClick={onTailorCV}
              className="btn-primary flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium"
            >
              {isTailoring ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-slate-300" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              )}
              <span className="truncate">{isTailoring ? 'Optimizing CV...' : 'Tailor Entire CV'}</span>
            </button>
          )}
        </div>

        {lockedSectionsCount > 0 && (
          <div className="flex items-center gap-2 px-2.5 py-2 text-[11px] text-amber-800 bg-amber-50/80 rounded-md border border-amber-200/70">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>{lockedSectionsCount}</strong> section{lockedSectionsCount > 1 ? 's are' : ' is'} locked and will be protected from AI rewriting.
            </span>
          </div>
        )}
      </div>

      {/* Structured Role Analysis */}
      {analysis && (
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <h3 className="font-semibold text-xs text-slate-900 tracking-tight">
                  {analysis.jobTitle || 'Target Position'}
                </h3>
              </div>
              {analysis.company && (
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 ml-5">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  {analysis.company}
                </p>
              )}
            </div>

            {analysis.seniorityLevel && (
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded">
                {analysis.seniorityLevel}
              </span>
            )}
          </div>

          {/* Required Skills */}
          {analysis.requiredSkills.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider font-mono">
                  Primary Requirements ({analysis.requiredSkills.length})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ATS WEIGHT: HIGH</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.requiredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10.5px] font-medium font-mono bg-slate-50 text-slate-800 border border-slate-200 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Skills */}
          {analysis.preferredSkills.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-mono">
                Secondary & Preferred ({analysis.preferredSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.preferredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10.5px] font-normal text-slate-600 bg-slate-50 border border-slate-200/60 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Competencies */}
          {analysis.competencies.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider font-mono">
                Expected Competencies
              </span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {analysis.competencies.map((comp, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

