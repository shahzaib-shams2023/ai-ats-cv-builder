import React, { useState, useEffect, useRef } from 'react';
import { CVDocument, CVProfile, SectionSettings, TemplateId, JobDescription, ATSAnalysisResult } from '@/types/cv';
import { ContactEditor } from './ContactEditor';
import { SummaryEditor } from './SummaryEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { EducationEditor } from './EducationEditor';
import { CertificationsAwardsEditor } from './CertificationsAwardsEditor';
import { SectionOrderManager } from './SectionOrderManager';
import { TargetJobPanel } from './TargetJobPanel';
import { ATSAnalysisPanel } from './ATSAnalysisPanel';
import { CVDocumentRenderer } from '../templates/CVDocumentRenderer';
import { AIRewriteModal } from '../modals/AIRewriteModal';
import { SettingsModal } from '../modals/SettingsModal';
import { UserSettings } from '@/lib/storage/cv-store';
import {
  ArrowLeft,
  Download,
  FileDown,
  Printer,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Target,
  ShieldCheck,
  Settings,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Copy,
  Layers,
  ChevronDown,
  Edit3,
  FileText
} from 'lucide-react';

interface CVEditorViewProps {
  document: CVDocument;
  onUpdateDocument: (doc: CVDocument) => void;
  onBackToDashboard: () => void;
  userSettings: UserSettings;
  onUpdateUserSettings: (settings: UserSettings) => void;
}

const TEMPLATES: Array<{ id: TemplateId; name: string; description: string }> = [
  { id: 'ats-classic', name: 'ATS Classic', description: 'Maximum ATS compatibility, single-column monochrome serif' },
  { id: 'modern-minimal', name: 'Modern Minimal', description: 'Clean slate tones, subtle dividers, optimal line height' },
  { id: 'professional', name: 'Professional', description: 'Corporate navy accents, structured executive alignment' },
  { id: 'executive', name: 'Executive', description: 'Traditional serif headers, highlighted executive profile' },
  { id: 'technical', name: 'Technical / Developer', description: 'Clean monospace accents, emphasized skill badges & links' },
  { id: 'creative', name: 'Creative Professional', description: 'Warm stone aesthetic, modern layout, 100% ATS readable' },
  { id: 'academic', name: 'Academic', description: 'Comprehensive curriculum vitae, education & publication emphasis' }
];

export const CVEditorView: React.FC<CVEditorViewProps> = ({
  document,
  onUpdateDocument,
  onBackToDashboard,
  userSettings,
  onUpdateUserSettings
}) => {
  // Current document state
  const [currentDoc, setCurrentDoc] = useState<CVDocument>(document);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // History for Undo / Redo
  const [history, setHistory] = useState<CVDocument[]>([document]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active navigation tabs
  const [activeLeftTab, setActiveLeftTab] = useState<'contact' | 'summary' | 'experience' | 'skills' | 'projects' | 'education' | 'certifications' | 'sections'>('summary');
  const [activeRightTab, setActiveRightTab] = useState<'job' | 'ats'>('job');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview' | 'ats'>('preview');

  // Preview & Zoom controls
  const [zoom, setZoom] = useState(1);

  // Modals state
  const [isAIRewriteOpen, setIsAIRewriteOpen] = useState(false);
  const [rewriteContext, setRewriteContext] = useState({ text: '', label: '', onApply: (newText: string) => {} });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Tailoring & ATS state
  const [isTailoring, setIsTailoring] = useState(false);
  const [isRecalculatingATS, setIsRecalculatingATS] = useState(false);

  // Sync prop changes
  useEffect(() => {
    setCurrentDoc(document);
  }, [document.id]);

  // Push new state to history & save
  const commitDocChange = (updated: CVDocument) => {
    setSaveStatus('saving');
    setCurrentDoc(updated);
    onUpdateDocument(updated);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(updated)));
    if (newHistory.length > 25) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setTimeout(() => {
      setSaveStatus('saved');
    }, 400);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentDoc(prev);
      onUpdateDocument(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentDoc(next);
      onUpdateDocument(next);
    }
  };

  const updateProfile = (profile: CVProfile) => {
    commitDocChange({
      ...currentDoc,
      profile,
      updatedAt: new Date().toISOString()
    });
  };

  const updateSettings = (sectionSettings: SectionSettings) => {
    commitDocChange({
      ...currentDoc,
      sectionSettings,
      updatedAt: new Date().toISOString()
    });
  };

  const updateTemplate = (templateId: TemplateId) => {
    commitDocChange({
      ...currentDoc,
      templateId,
      updatedAt: new Date().toISOString()
    });
  };

  const toggleSectionLock = (sectionKey: string) => {
    const currentLocked = currentDoc.sectionSettings.lockedSections || {};
    updateSettings({
      ...currentDoc.sectionSettings,
      lockedSections: {
        ...currentLocked,
        [sectionKey]: !currentLocked[sectionKey]
      }
    });
  };

  const openAIRewrite = (text: string, label: string, onApply: (newText: string) => void) => {
    setRewriteContext({ text, label, onApply });
    setIsAIRewriteOpen(true);
  };

  // Full Tailor CV Action
  const handleTailorCV = async () => {
    if (!currentDoc.targetJob.analysis) {
      return;
    }

    setIsTailoring(true);

    try {
      const res = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentDoc.profile,
          jobAnalysis: currentDoc.targetJob.analysis,
          lockedSections: currentDoc.sectionSettings.lockedSections,
          apiKey: userSettings.apiKey,
          provider: userSettings.llmProvider,
          model: userSettings.modelName
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to tailor CV');
      }

      commitDocChange({
        ...currentDoc,
        profile: data.data.tailoredProfile,
        atsAnalysis: data.data.atsAnalysis,
        updatedAt: new Date().toISOString()
      });

      setActiveRightTab('ats');
      setMobileTab('ats');
    } catch (err) {
      alert(`CV Tailoring error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsTailoring(false);
    }
  };

  // Recalculate ATS Score
  const handleRecalculateATS = async () => {
    if (!currentDoc.targetJob.analysis) return;
    setIsRecalculatingATS(true);

    try {
      const res = await fetch('/api/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentDoc.profile,
          jobAnalysis: currentDoc.targetJob.analysis
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        commitDocChange({
          ...currentDoc,
          atsAnalysis: data.data.atsAnalysis,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Failed to refresh ATS score:', err);
    } finally {
      setIsRecalculatingATS(false);
    }
  };

  // Export Handlers
  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    setIsExportMenuOpen(false);
    try {
      const res = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentDoc.profile,
          settings: currentDoc.sectionSettings,
          templateId: currentDoc.templateId,
          filename: `${currentDoc.name || 'Resume'}.docx`
        })
      });

      if (!res.ok) throw new Error('DOCX export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${(currentDoc.name || 'Resume').replace(/\s+/g, '_')}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`DOCX export failed: ${err instanceof Error ? err.message : 'Error'}`);
    }
  };

  const handleExportDoc = async () => {
    setIsExportMenuOpen(false);
    try {
      const res = await fetch('/api/export-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentDoc.profile,
          settings: currentDoc.sectionSettings,
          templateId: currentDoc.templateId,
          filename: `${currentDoc.name || 'Resume'}.doc`
        })
      });

      if (!res.ok) throw new Error('DOC export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${(currentDoc.name || 'Resume').replace(/\s+/g, '_')}.doc`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`DOC export failed: ${err instanceof Error ? err.message : 'Error'}`);
    }
  };

  const lockedSectionsCount = Object.values(currentDoc.sectionSettings.lockedSections || {}).filter(Boolean).length;

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="no-print h-14 bg-white border-b border-slate-200/80 px-2 sm:px-4 flex items-center justify-between shrink-0 z-30 gap-1.5 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-200 shrink-0" />

          {/* Editable Document Name */}
          <div className="flex items-center gap-1.5 min-w-0">
            <input
              type="text"
              value={currentDoc.name}
              onChange={(e) => commitDocChange({ ...currentDoc, name: e.target.value })}
              className="text-xs sm:text-sm font-semibold text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white px-1.5 py-1 rounded border border-transparent hover:border-slate-300 focus:border-slate-800 outline-none max-w-[100px] xs:max-w-[140px] sm:max-w-[200px] md:max-w-[280px] truncate transition-colors"
            />
            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium hidden md:inline-flex shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{saveStatus === 'saving' ? 'Saving' : 'Saved'}</span>
            </span>
          </div>
        </div>

        {/* Center / Toolbar Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Template Dropdown */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1 max-w-[110px] xs:max-w-[145px] sm:max-w-none hover:bg-slate-100/70 transition-colors">
            <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={currentDoc.templateId}
              onChange={(e) => updateTemplate(e.target.value as TemplateId)}
              className="text-xs bg-transparent text-slate-800 font-medium outline-none cursor-pointer truncate max-w-[80px] xs:max-w-[110px] sm:max-w-none"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200/80 rounded-lg p-0.5">
            <button
              type="button"
              disabled={historyIndex === 0}
              onClick={handleUndo}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden md:flex items-center bg-slate-50 border border-slate-200/80 rounded-lg p-0.5 text-xs text-slate-600">
            <button
              type="button"
              disabled={zoom <= 0.6}
              onClick={() => setZoom(Math.max(0.6, Number((zoom - 0.1).toFixed(1))))}
              className="p-1 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-mono text-slate-700">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              disabled={zoom >= 1.4}
              onClick={() => setZoom(Math.min(1.4, Number((zoom + 0.1).toFixed(1))))}
              className="p-1 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ATS Score Indicator */}
          {currentDoc.atsAnalysis?.overallScore && (
            <button
              type="button"
              onClick={() => {
                setActiveRightTab('ats');
                setIsRightSidebarOpen(true);
                setMobileTab('ats');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70 transition-colors cursor-pointer shrink-0"
              title="Click to view ATS Diagnostics"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono">{currentDoc.atsAnalysis.overallScore}%</span>
              <span className="font-normal text-emerald-700 text-[11px]">Match</span>
            </button>
          )}

          {/* Export Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="btn-primary text-xs py-1.5 px-3 shrink-0"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Export</span>
              <ChevronDown className="w-3 h-3 ml-0.5 shrink-0 opacity-70" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200/80 py-1.5 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    handlePrintPDF();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-700" />
                  <div>
                    <div className="font-semibold text-slate-900">Download PDF</div>
                    <div className="text-[10.5px] text-slate-500">Print-ready, selectable vector text</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExportDocx}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 cursor-pointer border-t border-slate-100 transition-colors"
                >
                  <FileDown className="w-4 h-4 text-slate-700" />
                  <div>
                    <div className="font-semibold text-slate-900">Download Word (.DOCX)</div>
                    <div className="text-[10.5px] text-slate-500">Fully editable Word document</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExportDoc}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 cursor-pointer border-t border-slate-100 transition-colors"
                >
                  <FileDown className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Download Legacy (.DOC)</div>
                    <div className="text-[10.5px] text-slate-500">Standard Word-compatible format</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Settings Modal Toggle */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer shrink-0 transition-colors"
            title="AI Model Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile / Tablet View Switcher (< lg) */}
      <div className="no-print lg:hidden bg-white border-b border-slate-200/80 px-2 sm:px-4 py-1.5 flex items-center justify-around gap-1 shrink-0 z-20">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold flex-1 transition-all cursor-pointer ${
            mobileTab === 'editor'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 shrink-0" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold flex-1 transition-all cursor-pointer ${
            mobileTab === 'preview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>Preview</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('ats')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold flex-1 transition-all cursor-pointer ${
            mobileTab === 'ats'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Target className="w-3.5 h-3.5 shrink-0" />
          <span>Job & ATS</span>
          {currentDoc.atsAnalysis?.overallScore ? (
            <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold shrink-0">
              {currentDoc.atsAnalysis.overallScore}%
            </span>
          ) : null}
        </button>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Section Editing */}
        <aside
          className={`no-print bg-[#f8fafc] border-r border-slate-200/80 flex flex-col shrink-0 overflow-hidden ${
            mobileTab === 'editor' ? 'w-full flex-1' : 'hidden lg:flex lg:w-80 xl:w-96'
          }`}
        >
          {/* Section Navigation Segmented Bar */}
          <div className="p-2 border-b border-slate-200/80 bg-white flex gap-1 overflow-x-auto scrollbar-none text-xs">
            {[
              { id: 'summary', label: 'Summary' },
              { id: 'experience', label: 'Experience' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'education', label: 'Education' },
              { id: 'contact', label: 'Contact' },
              { id: 'certifications', label: 'Other' },
              { id: 'sections', label: 'Order' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveLeftTab(tab.id as any)}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  activeLeftTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeLeftTab === 'contact' && (
              <ContactEditor
                contact={currentDoc.profile.contact}
                onChange={(contact) => updateProfile({ ...currentDoc.profile, contact })}
              />
            )}

            {activeLeftTab === 'summary' && (
              <SummaryEditor
                summary={currentDoc.profile.professionalSummary}
                isLocked={currentDoc.sectionSettings.lockedSections?.summary || false}
                onToggleLock={() => toggleSectionLock('summary')}
                onChange={(professionalSummary) => updateProfile({ ...currentDoc.profile, professionalSummary })}
                onOpenAIRewrite={openAIRewrite}
              />
            )}

            {activeLeftTab === 'experience' && (
              <ExperienceEditor
                experiences={currentDoc.profile.experiences}
                isLocked={currentDoc.sectionSettings.lockedSections?.experience || false}
                onToggleLock={() => toggleSectionLock('experience')}
                onChange={(experiences) => updateProfile({ ...currentDoc.profile, experiences })}
                onOpenAIRewrite={openAIRewrite}
              />
            )}

            {activeLeftTab === 'skills' && (
              <SkillsEditor
                categories={currentDoc.profile.skillCategories}
                isLocked={currentDoc.sectionSettings.lockedSections?.skills || false}
                onToggleLock={() => toggleSectionLock('skills')}
                onChange={(skillCategories) => updateProfile({ ...currentDoc.profile, skillCategories })}
              />
            )}

            {activeLeftTab === 'projects' && (
              <ProjectsEditor
                projects={currentDoc.profile.projects}
                onChange={(projects) => updateProfile({ ...currentDoc.profile, projects })}
              />
            )}

            {activeLeftTab === 'education' && (
              <EducationEditor
                education={currentDoc.profile.education}
                onChange={(education) => updateProfile({ ...currentDoc.profile, education })}
              />
            )}

            {activeLeftTab === 'certifications' && (
              <CertificationsAwardsEditor
                certifications={currentDoc.profile.certifications}
                awards={currentDoc.profile.awards}
                languages={currentDoc.profile.languages}
                onCertificationsChange={(certifications) => updateProfile({ ...currentDoc.profile, certifications })}
                onAwardsChange={(awards) => updateProfile({ ...currentDoc.profile, awards })}
                onLanguagesChange={(languages) => updateProfile({ ...currentDoc.profile, languages })}
              />
            )}

            {activeLeftTab === 'sections' && (
              <SectionOrderManager
                settings={currentDoc.sectionSettings}
                onChange={updateSettings}
              />
            )}
          </div>
        </aside>

        {/* Middle: Live Interactive CV Document Preview */}
        <main
          className={`bg-[#eef2f6] overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center items-start ${
            mobileTab === 'preview' ? 'w-full flex-1' : 'hidden lg:flex lg:flex-1'
          }`}
        >
          <div className="w-full max-w-[850px] flex justify-center items-start">
            <CVDocumentRenderer
              profile={currentDoc.profile}
              settings={currentDoc.sectionSettings}
              templateId={currentDoc.templateId}
              zoom={zoom}
            />
          </div>
        </main>

        {/* Right Sidebar: Target Job Description & ATS Analysis */}
        {isRightSidebarOpen && (
          <aside
            className={`no-print bg-[#f8fafc] border-l border-slate-200/80 flex flex-col shrink-0 overflow-hidden ${
              mobileTab === 'ats' ? 'w-full flex-1' : 'hidden lg:flex lg:w-80 xl:w-96'
            }`}
          >
            <div className="p-2 border-b border-slate-200/80 bg-white flex justify-between items-center text-xs">
              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setActiveRightTab('job')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11.5px] font-medium cursor-pointer transition-all ${
                    activeRightTab === 'job'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Job Analysis</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRightTab('ats')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11.5px] font-medium cursor-pointer transition-all ${
                    activeRightTab === 'ats'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ATS Match</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsRightSidebarOpen(false)}
                className="hidden lg:block p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                title="Collapse panel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeRightTab === 'job' && (
                <TargetJobPanel
                  job={currentDoc.targetJob}
                  onUpdateJob={(targetJob) => commitDocChange({ ...currentDoc, targetJob })}
                  onTailorCV={handleTailorCV}
                  isTailoring={isTailoring}
                  lockedSectionsCount={lockedSectionsCount}
                />
              )}

              {activeRightTab === 'ats' && (
                <ATSAnalysisPanel
                  atsAnalysis={currentDoc.atsAnalysis}
                  onRefreshScore={handleRecalculateATS}
                  isRecalculating={isRecalculatingATS}
                />
              )}
            </div>
          </aside>
        )}

        {!isRightSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsRightSidebarOpen(true)}
            className="no-print hidden lg:flex items-center gap-1 absolute right-0 top-16 bg-white border-l border-y border-slate-300 px-2 py-1.5 rounded-l-lg shadow-sm hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer z-20"
            title="Open Target Job & ATS Diagnostics"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Job & ATS</span>
          </button>
        )}
      </div>

      {/* AI Rewrite Assistant Modal */}
      <AIRewriteModal
        isOpen={isAIRewriteOpen}
        onClose={() => setIsAIRewriteOpen(false)}
        originalText={rewriteContext.text}
        context={rewriteContext.label}
        onApply={rewriteContext.onApply}
        targetRole={currentDoc.targetJob.jobTitle}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={userSettings}
        onSave={onUpdateUserSettings}
      />
    </div>
  );
};

