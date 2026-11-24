import React, { useState } from 'react';
import { CVDocument, TemplateId } from '@/types/cv';
import {
  FileText,
  UploadCloud,
  Plus,
  Copy,
  Trash2,
  Edit3,
  ShieldCheck,
  Briefcase,
  Clock,
  ArrowUpRight,
  Settings,
  Building2,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserSettings } from '@/lib/storage/cv-store';

interface DashboardViewProps {
  documents: CVDocument[];
  onOpenDocument: (docId: string) => void;
  onCreateNewDocument: (templateId?: TemplateId) => void;
  onUploadClick: () => void;
  onDuplicateDocument: (docId: string) => void;
  onRenameDocument: (docId: string, newName: string) => void;
  onDeleteDocument: (docId: string) => void;
  userSettings: UserSettings;
  onOpenSettings: () => void;
}

const TEMPLATE_PREVIEWS: Array<{
  id: TemplateId;
  name: string;
  tag: string;
  description: string;
  category: string;
}> = [
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    tag: 'Strict Corporate Standard',
    description: 'Clean monochrome single-column layout for strict corporate Applicant Tracking Systems.',
    category: 'Corporate'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    tag: 'Tech & High-Growth Startups',
    description: 'Crisp typography and slate dividers designed for high readability by human recruiters and ATS.',
    category: 'Modern'
  },
  {
    id: 'professional',
    name: 'Professional',
    tag: 'Executive & Finance',
    description: 'Executive navy headers, balanced horizontal rules, and structured accomplishment layout.',
    category: 'Executive'
  },
  {
    id: 'executive',
    name: 'Executive',
    tag: 'Director & Leadership',
    description: 'Traditional serif headers with a highlighted executive summary for senior leaders.',
    category: 'Executive'
  },
  {
    id: 'technical',
    name: 'Technical / Developer',
    tag: 'Engineers & DevOps',
    description: 'Monospace skill badges, prominent GitHub links, and deep project architecture focus.',
    category: 'Technical'
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    tag: 'Design & Product Strategy',
    description: 'Warm stone aesthetic with modern section markers while preserving 100% ATS readability.',
    category: 'Design'
  },
  {
    id: 'academic',
    name: 'Academic Curriculum Vitae',
    tag: 'Research & Faculty',
    description: 'Comprehensive research, grants, and education priority for academia and research labs.',
    category: 'Academic'
  }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  onOpenDocument,
  onCreateNewDocument,
  onUploadClick,
  onDuplicateDocument,
  onRenameDocument,
  onDeleteDocument,
  userSettings,
  onOpenSettings
}) => {
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const totalDocuments = documents.length;
  const scoredDocs = documents.filter(d => d.atsAnalysis?.overallScore);
  const avgATS = scoredDocs.length > 0
    ? Math.round(scoredDocs.reduce((acc, d) => acc + (d.atsAnalysis?.overallScore || 0), 0) / scoredDocs.length)
    : 85;

  const handleStartRename = (doc: CVDocument) => {
    setEditingDocId(doc.id);
    setRenameInput(doc.name);
  };

  const handleSaveRename = (docId: string) => {
    if (renameInput.trim()) {
      onRenameDocument(docId, renameInput.trim());
    }
    setEditingDocId(null);
  };

  const filteredDocs = documents.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.targetJob?.jobTitle && d.targetJob.jobTitle.toLowerCase().includes(q)) ||
      (d.targetJob?.company && d.targetJob.company.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col">
      {/* Precision Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs">
            CV
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-sm text-slate-900 tracking-tight leading-none truncate">
              AutoCV
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 hidden sm:inline-block">
              Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSettings}
            className="btn-ghost text-xs py-1.5 px-2.5 text-slate-600"
            title="AI Configuration & Model Settings"
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            type="button"
            onClick={onUploadClick}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            <UploadCloud className="w-3.5 h-3.5 shrink-0 text-slate-600" />
            <span className="hidden md:inline">Upload Existing CV</span>
            <span className="md:hidden hidden xs:inline">Upload CV</span>
            <span className="xs:hidden">Upload</span>
          </button>

          <button
            type="button"
            onClick={() => onCreateNewDocument()}
            className="btn-primary text-xs py-1.5 px-3.5"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">Create New CV</span>
            <span className="md:hidden hidden xs:inline">New CV</span>
            <span className="xs:hidden">New</span>
          </button>
        </div>
      </header>

      {/* Main Studio Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Studio Briefing Bar */}
        <section className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Candidate Dossiers & Resumes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Tailor your CV to specific job descriptions with 100% factual fidelity, inspect ATS keyword alignment, and export high-precision documents.
            </p>
          </div>

          {/* Integrated Metrics Strip */}
          <div className="flex items-center gap-3 sm:gap-6 bg-slate-50 p-3 sm:p-3.5 rounded-lg border border-slate-200/60 self-start md:self-auto">
            <div className="space-y-0.5">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Resumes
              </div>
              <div className="text-lg font-bold text-slate-900 leading-none">
                {totalDocuments}
              </div>
            </div>

            <div className="w-px h-7 bg-slate-200" />

            <div className="space-y-0.5">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Mapped Roles
              </div>
              <div className="text-lg font-bold text-slate-900 leading-none">
                {documents.filter(d => d.targetJob?.jobTitle).length}
              </div>
            </div>

            <div className="w-px h-7 bg-slate-200" />

            <div className="space-y-0.5">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                ATS Readiness
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-lg font-bold text-slate-900 leading-none">
                  {avgATS}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Saved Resumes Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Active CV Versions
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                ({filteredDocs.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter resumes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="text-xs py-1 px-2.5 pl-2 bg-white border border-slate-200 rounded-md focus:border-slate-800 focus:outline-none w-44 sm:w-56"
                />
              </div>

              <button
                type="button"
                onClick={() => onCreateNewDocument()}
                className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer px-2 py-1 hover:bg-slate-100 rounded"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>New</span>
              </button>
            </div>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-slate-800">
                {searchQuery ? 'No matching resumes found' : 'No resumes created yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try clearing your search query to see all versions.'
                  : 'Upload an existing CV to extract your experience or start with a fresh blank profile.'}
              </p>
              {!searchQuery && (
                <div className="pt-2 flex justify-center gap-2">
                  <button type="button" onClick={onUploadClick} className="btn-secondary text-xs">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload CV</span>
                  </button>
                  <button type="button" onClick={() => onCreateNewDocument()} className="btn-primary text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Blank Profile</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => {
                const atsScore = doc.atsAnalysis?.overallScore || 85;
                const isEditing = editingDocId === doc.id;
                const targetTitle = doc.targetJob?.jobTitle || 'General Position';
                const summaryExcerpt = doc.profile.professionalSummary || 'No professional summary provided yet.';

                return (
                  <div
                    key={doc.id}
                    onClick={() => onOpenDocument(doc.id)}
                    className="studio-card p-5 flex flex-col justify-between space-y-4 cursor-pointer group"
                  >
                    <div className="space-y-3">
                      {/* Card Top: Title & ATS Score */}
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        {isEditing ? (
                          <div className="flex-1 min-w-0" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={renameInput}
                              onChange={e => setRenameInput(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSaveRename(doc.id)}
                              onBlur={() => handleSaveRename(doc.id)}
                              autoFocus
                              className="text-sm font-semibold text-slate-900 w-full px-2 py-0.5 border border-slate-900 rounded outline-none"
                            />
                          </div>
                        ) : (
                          <h3 className="font-semibold text-sm text-slate-900 group-hover:text-slate-700 transition-colors truncate flex-1 min-w-0">
                            {doc.name || 'Untitled CV'}
                          </h3>
                        )}

                        <span
                          className={`shrink-0 px-2 py-0.5 text-[10.5px] font-semibold rounded-md border ${
                            atsScore >= 80
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : atsScore >= 60
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}
                        >
                          {atsScore}% ATS Match
                        </span>
                      </div>

                      {/* Position & Company info */}
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5 truncate">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{targetTitle}</span>
                        </div>
                        {doc.targetJob?.company && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate pl-5">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{doc.targetJob.company}</span>
                          </div>
                        )}
                      </div>

                      {/* Summary Excerpt */}
                      <p className="text-[11.5px] text-slate-500 line-clamp-2 leading-relaxed">
                        {summaryExcerpt}
                      </p>

                      {/* Meta Tags */}
                      <div className="flex items-center gap-2 pt-1 text-[10.5px] text-slate-400 border-t border-slate-100">
                        <span className="font-mono text-slate-500 uppercase tracking-tight">
                          {doc.templateId}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div
                      className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onOpenDocument(doc.id)}
                        className="text-slate-900 group-hover:text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Open Editor</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1 text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleStartRename(doc)}
                          className="p-1 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                          title="Rename resume"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicateDocument(doc.id)}
                          className="p-1 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                          title="Duplicate for another job"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {documents.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete "${doc.name}"?`)) onDeleteDocument(doc.id);
                            }}
                            className="p-1 hover:text-red-600 rounded hover:bg-slate-100 cursor-pointer"
                            title="Delete resume"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ATS-Compliant Template Showcase */}
        <section className="space-y-4 pt-4 border-t border-slate-200/80">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Architectural Templates
            </h2>
            <p className="text-xs text-slate-500">
              Every template is built with machine-verifiable heading hierarchies, single/dual column logic, and universal parser compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {TEMPLATE_PREVIEWS.map((tmpl) => (
              <div
                key={tmpl.id}
                className="studio-card p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="font-semibold text-xs text-slate-900">{tmpl.name}</span>
                    <span className="text-[9.5px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onCreateNewDocument(tmpl.id)}
                    className="btn-secondary w-full py-1.5 px-2.5 text-xs font-medium cursor-pointer text-center"
                  >
                    Select Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
