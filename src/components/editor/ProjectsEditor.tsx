import React, { useState } from 'react';
import { Project } from '@/types/cv';
import { FolderGit2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectsEditorProps {
  projects: Project[];
  onChange: (updated: Project[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ projects, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: 'High-Impact Initiative',
      role: 'Core Architect',
      tools: ['Next.js', 'TypeScript', 'PostgreSQL'],
      description: 'Engineered a resilient distributed workflow system supporting 10k+ concurrent operations.',
      highlights: ['Designed event-driven pipeline reducing processing queue latency by 45%.']
    };
    onChange([newProj, ...projects]);
    setExpandedId(newProj.id);
  };

  const removeProject = (id: string) => {
    onChange(projects.filter(p => p.id !== id));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(projects.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  return (
    <div className="space-y-4 bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
          <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <FolderGit2 className="w-3.5 h-3.5" />
          </div>
          <span>Key Projects & Technical Initiatives ({projects.length})</span>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="btn-secondary flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium shrink-0 cursor-pointer"
        >
          <Plus className="w-3 h-3 text-slate-600" />
          <span className="hidden xs:inline">Add Project</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((proj, projIdx) => {
          const isExpanded = expandedId === proj.id;

          return (
            <div
              key={proj.id}
              className="border border-slate-200/90 rounded-lg bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all"
            >
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : proj.id)}
              >
                <div className="font-semibold text-xs text-slate-900 truncate flex items-center gap-2">
                  <span className="font-mono text-[10.5px] text-slate-400 font-medium">0{projIdx + 1}</span>
                  <span className="truncate">{proj.name || 'Project Name'}</span>
                  {proj.tools.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-500 font-normal ml-1 hidden sm:inline truncate">
                      [{proj.tools.join(', ')}]
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    title="Remove project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-3.5 pt-2.5 border-t border-slate-100 bg-slate-50/40 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={e => updateProject(proj.id, { name: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Project URL / Repository</label>
                      <input
                        type="url"
                        value={proj.url || ''}
                        onChange={e => updateProject(proj.id, { url: e.target.value })}
                        placeholder="https://github.com/org/repo"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Technologies & Tools (comma separated)</label>
                    <input
                      type="text"
                      value={proj.tools.join(', ')}
                      onChange={e => updateProject(proj.id, { tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="Next.js, TypeScript, PostgreSQL, AWS ECS"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none font-mono transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Executive Summary & Impact</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={e => updateProject(proj.id, { description: e.target.value })}
                      placeholder="Outline problem scope, technical approach, and measurable business result..."
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none leading-relaxed transition-all"
                    />
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
