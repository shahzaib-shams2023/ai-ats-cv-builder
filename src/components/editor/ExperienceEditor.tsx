import React, { useState } from 'react';
import { WorkExperience } from '@/types/cv';
import { Briefcase, Plus, Trash2, Sparkles, Lock, Unlock, ChevronDown, ChevronUp } from 'lucide-react';

interface ExperienceEditorProps {
  experiences: WorkExperience[];
  isLocked: boolean;
  onToggleLock: () => void;
  onChange: (updated: WorkExperience[]) => void;
  onOpenAIRewrite: (text: string, context: string, onApply: (newText: string) => void) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experiences,
  isLocked,
  onToggleLock,
  onChange,
  onOpenAIRewrite
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      jobTitle: 'Senior Software Engineer',
      company: 'Enterprise Technology Co.',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      highlights: [
        'Architected high-throughput services reducing latency by 35% across mission-critical workflows.',
        'Partnered with product engineering to deliver quarterly roadmap commitments on schedule.'
      ],
      relevantSkills: []
    };
    onChange([newExp, ...experiences]);
    setExpandedId(newExp.id);
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter(e => e.id !== id));
  };

  const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
    onChange(
      experiences.map(e => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const addBullet = (expId: string) => {
    const exp = experiences.find(e => e.id === expId);
    if (!exp) return;
    const updatedHighlights = [...exp.highlights, 'Engineered fault-tolerant pipeline delivering verifiable performance gains.'];
    updateExperience(expId, { highlights: updatedHighlights });
  };

  const updateBullet = (expId: string, idx: number, val: string) => {
    const exp = experiences.find(e => e.id === expId);
    if (!exp) return;
    const updatedHighlights = [...exp.highlights];
    updatedHighlights[idx] = val;
    updateExperience(expId, { highlights: updatedHighlights });
  };

  const removeBullet = (expId: string, idx: number) => {
    const exp = experiences.find(e => e.id === expId);
    if (!exp) return;
    const updatedHighlights = exp.highlights.filter((_, i) => i !== idx);
    updateExperience(expId, { highlights: updatedHighlights });
  };

  const handleRewriteBullet = (exp: WorkExperience, idx: number) => {
    onOpenAIRewrite(
      exp.highlights[idx],
      `Bullet point for ${exp.jobTitle} at ${exp.company}`,
      (newText) => updateBullet(exp.id, idx, newText)
    );
  };

  return (
    <div className="space-y-4 bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
          <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <span>Professional History ({experiences.length})</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleLock}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded-md font-medium transition-all ${
              isLocked
                ? 'bg-amber-50 text-amber-800 border border-amber-300/80 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/50'
            }`}
            title={isLocked ? 'Protected from AI regeneration' : 'Lock experience records from automated AI rewrites'}
          >
            {isLocked ? <Lock className="w-3 h-3 text-amber-700" /> : <Unlock className="w-3 h-3 text-slate-500" />}
            <span className="hidden xs:inline">{isLocked ? 'LOCKED' : 'LOCK'}</span>
          </button>

          <button
            type="button"
            onClick={addExperience}
            className="btn-secondary flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium"
          >
            <Plus className="w-3 h-3 text-slate-600" />
            <span className="hidden xs:inline">Add Position</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {experiences.map((exp, expIdx) => {
          const isExpanded = expandedId === exp.id;

          return (
            <div
              key={exp.id}
              className="border border-slate-200/90 rounded-lg bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all"
            >
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50/70 gap-2 border-b border-transparent transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 min-w-0">
                  <span className="text-slate-400 font-mono text-[10.5px] shrink-0 font-medium">0{expIdx + 1}</span>
                  <span className="truncate">{exp.jobTitle || 'Role Title'}</span>
                  <span className="text-slate-300 shrink-0">•</span>
                  <span className="text-slate-600 truncate font-normal">{exp.company || 'Enterprise'}</span>
                  <span className="text-[10px] font-mono text-slate-400 ml-1 shrink-0 hidden sm:inline">
                    [{exp.startDate} - {exp.current ? 'Present' : exp.endDate}]
                  </span>
                </div>

                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    title="Remove experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-3.5 pt-3 border-t border-slate-100 bg-slate-50/40 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Position / Job Title</label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={e => updateExperience(exp.id, { jobTitle: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => updateExperience(exp.id, { company: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Location / Office</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={e => updateExperience(exp.id, { location: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={e => updateExperience(exp.id, { startDate: e.target.value })}
                          placeholder="2021"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">End Date</label>
                        <input
                          type="text"
                          disabled={exp.current}
                          value={exp.current ? 'Present' : exp.endDate}
                          onChange={e => updateExperience(exp.id, { endDate: e.target.value })}
                          placeholder="Present"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none font-mono disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id={`curr-${exp.id}`}
                      checked={exp.current}
                      onChange={e => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-800 cursor-pointer"
                    />
                    <label htmlFor={`curr-${exp.id}`} className="text-xs text-slate-700 cursor-pointer font-medium">
                      Current role (ongoing)
                    </label>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/70">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-semibold text-slate-800 uppercase font-mono tracking-wider">
                        Key Accomplishments & Metrics ({exp.highlights.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => addBullet(exp.id)}
                        className="text-[11px] font-mono text-slate-700 hover:text-slate-950 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> ADD BULLET
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.highlights.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-slate-400 mt-2 text-xs font-mono">•</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={e => updateBullet(exp.id, bIdx, e.target.value)}
                            className="flex-1 p-2.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none leading-relaxed font-sans transition-all"
                          />
                          <div className="flex flex-col gap-1 pt-0.5">
                            <button
                              type="button"
                              onClick={() => handleRewriteBullet(exp, bIdx)}
                              title="Enhance with AI"
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-slate-700" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBullet(exp.id, bIdx)}
                              title="Delete bullet"
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
