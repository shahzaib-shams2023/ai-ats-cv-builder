import React from 'react';
import { SectionSettings } from '@/types/cv';
import { ArrowUp, ArrowDown, Eye, EyeOff, LayoutGrid } from 'lucide-react';

interface SectionOrderManagerProps {
  settings: SectionSettings;
  onChange: (updated: SectionSettings) => void;
}

const SECTION_LABELS: Record<string, string> = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  skills: 'Technical Skills',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
  awards: 'Awards & Honors',
  languages: 'Languages'
};

export const SectionOrderManager: React.FC<SectionOrderManagerProps> = ({ settings, onChange }) => {
  const moveSection = (idx: number, direction: 'up' | 'down') => {
    const newOrder = [...settings.sectionOrder];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;

    const temp = newOrder[idx];
    newOrder[idx] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;

    onChange({
      ...settings,
      sectionOrder: newOrder
    });
  };

  const toggleVisibility = (key: string) => {
    onChange({
      ...settings,
      visibleSections: {
        ...settings.visibleSections,
        [key]: settings.visibleSections[key] === false ? true : false
      }
    });
  };

  const renameHeading = (key: string, name: string) => {
    onChange({
      ...settings,
      renamedHeadings: {
        ...(settings.renamedHeadings || {}),
        [key]: name
      }
    });
  };

  return (
    <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3.5">
      <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight pb-2.5 border-b border-slate-100">
        <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
          <LayoutGrid className="w-3.5 h-3.5" />
        </div>
        <span>Section Hierarchy & Sequence</span>
      </div>

      <p className="text-[11.5px] text-slate-500 leading-relaxed">
        Reorder sections to prioritize high-relevance qualifications, toggle visibility, or override standard section headings.
      </p>

      <div className="space-y-1.5">
        {settings.sectionOrder.map((key, idx) => {
          const isVisible = settings.visibleSections[key] !== false;
          const currentHeading = settings.renamedHeadings?.[key] || SECTION_LABELS[key] || key;

          return (
            <div
              key={key}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                isVisible
                  ? 'bg-white border-slate-200/90 text-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                  : 'bg-slate-50/60 border-slate-200/50 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 mr-2 min-w-0">
                <span className="font-mono text-[10px] text-slate-400 w-4 shrink-0 font-medium">0{idx + 1}</span>
                <input
                  type="text"
                  value={currentHeading}
                  onChange={e => renameHeading(key, e.target.value)}
                  className="font-medium text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 outline-none flex-1 min-w-0 py-0.5 truncate transition-colors"
                />
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, 'up')}
                  className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-20 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === settings.sectionOrder.length - 1}
                  onClick={() => moveSection(idx, 'down')}
                  className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-20 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleVisibility(key)}
                  className={`p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer ${isVisible ? 'text-slate-600' : 'text-slate-400'}`}
                  title={isVisible ? 'Hide Section from CV' : 'Include Section in CV'}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

