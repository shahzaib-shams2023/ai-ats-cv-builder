import React, { useState } from 'react';
import { SkillCategory } from '@/types/cv';
import { Wrench, Plus, Trash2, X, Lock, Unlock } from 'lucide-react';

interface SkillsEditorProps {
  categories: SkillCategory[];
  isLocked: boolean;
  onToggleLock: () => void;
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  categories,
  isLocked,
  onToggleLock,
  onChange
}) => {
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>({});

  const addCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      name: 'Specialized Competencies',
      skills: ['Skill 1', 'Skill 2']
    };
    onChange([...categories, newCat]);
  };

  const removeCategory = (id: string) => {
    onChange(categories.filter(c => c.id !== id));
  };

  const updateCategoryName = (id: string, name: string) => {
    onChange(categories.map(c => (c.id === id ? { ...c, name } : c)));
  };

  const addSkillToCategory = (catId: string) => {
    const skillName = (newSkillInput[catId] || '').trim();
    if (!skillName) return;

    onChange(
      categories.map(c => {
        if (c.id === catId) {
          if (c.skills.includes(skillName)) return c;
          return { ...c, skills: [...c.skills, skillName] };
        }
        return c;
      })
    );

    setNewSkillInput({ ...newSkillInput, [catId]: '' });
  };

  const removeSkillFromCategory = (catId: string, skillIdx: number) => {
    onChange(
      categories.map(c => {
        if (c.id === catId) {
          return { ...c, skills: c.skills.filter((_, i) => i !== skillIdx) };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-4 bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
          <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <span>Technical & Professional Taxonomy</span>
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
            title={isLocked ? 'Protected from AI modification' : 'Lock skills taxonomy from automated AI edits'}
          >
            {isLocked ? <Lock className="w-3 h-3 text-amber-700" /> : <Unlock className="w-3 h-3 text-slate-500" />}
            <span className="hidden xs:inline">{isLocked ? 'LOCKED' : 'LOCK'}</span>
          </button>

          <button
            type="button"
            onClick={addCategory}
            className="btn-secondary flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium"
          >
            <Plus className="w-3 h-3 text-slate-600" />
            <span className="hidden xs:inline">Add Cluster</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={cat.name}
                onChange={e => updateCategoryName(cat.id, e.target.value)}
                placeholder="Cluster title (e.g. Languages & Frameworks, Cloud Architecture)"
                className="font-semibold text-xs text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 focus:border-slate-800 outline-none flex-1 transition-all"
              />
              <button
                type="button"
                onClick={() => removeCategory(cat.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                title="Remove cluster"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-white rounded-md border border-slate-200/80">
              {cat.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10.5px] font-mono font-medium bg-slate-50 text-slate-800 border border-slate-200/80 shadow-xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkillFromCategory(cat.id, sIdx)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {cat.skills.length === 0 && (
                <span className="text-[11px] text-slate-400 italic">No skills listed yet</span>
              )}
            </div>

            {/* Add skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput[cat.id] || ''}
                onChange={e => setNewSkillInput({ ...newSkillInput, [cat.id]: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkillToCategory(cat.id);
                  }
                }}
                placeholder="Add skill and press Enter (e.g. TypeScript, Distributed Systems)"
                className="flex-1 px-3 py-1 text-xs bg-white border border-slate-200 rounded-md focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none font-sans transition-all"
              />
              <button
                type="button"
                onClick={() => addSkillToCategory(cat.id)}
                className="btn-secondary px-3 py-1 text-xs font-medium cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

