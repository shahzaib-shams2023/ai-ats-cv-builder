import React from 'react';
import { Education } from '@/types/cv';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

interface EducationEditorProps {
  education: Education[];
  onChange: (updated: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ education, onChange }) => {
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      institution: 'University Name',
      location: 'City, State',
      startDate: '2018',
      endDate: '2022',
      gpa: '3.8/4.0',
      highlights: []
    };
    onChange([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(e => e.id !== id));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange(education.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  return (
    <div className="space-y-4 bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
          <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <span>Academic Credentials ({education.length})</span>
        </div>

        <button
          type="button"
          onClick={addEducation}
          className="btn-secondary flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium shrink-0 cursor-pointer"
        >
          <Plus className="w-3 h-3 text-slate-600" />
          <span className="hidden xs:inline">Add Education</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      <div className="space-y-3">
        {education.map((edu, eduIdx) => (
          <div key={edu.id} className="p-3.5 bg-slate-50/60 border border-slate-200 rounded-lg space-y-3 relative shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] text-slate-400 font-medium">0{eduIdx + 1}</span>
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                title="Remove credential"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Degree Title</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={e => updateEducation(edu.id, { degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Field of Study / Major</label>
                <input
                  type="text"
                  value={edu.fieldOfStudy || ''}
                  onChange={e => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Institution / University</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={e => updateEducation(edu.id, { institution: e.target.value })}
                  placeholder="e.g. Stanford University"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={edu.location || ''}
                  onChange={e => updateEducation(edu.id, { location: e.target.value })}
                  placeholder="e.g. Stanford, CA"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Start Year</label>
                  <input
                    type="text"
                    value={edu.startDate || ''}
                    onChange={e => updateEducation(edu.id, { startDate: e.target.value })}
                    placeholder="2018"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Completion Year</label>
                  <input
                    type="text"
                    value={edu.endDate || ''}
                    onChange={e => updateEducation(edu.id, { endDate: e.target.value })}
                    placeholder="2022"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Academic Honors / GPA (Optional)</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={e => updateEducation(edu.id, { gpa: e.target.value })}
                  placeholder="e.g. Magna Cum Laude, 3.9/4.0"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
