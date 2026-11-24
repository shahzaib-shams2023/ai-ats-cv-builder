'use client';

import React, { useState, useEffect } from 'react';
import { CVDocument, CVProfile, TemplateId } from '@/types/cv';
import {
  loadAllCVDocuments,
  saveAllCVDocuments,
  getActiveCVID,
  setActiveCVID,
  createDefaultCVDocument,
  loadUserSettings,
  saveUserSettings,
  UserSettings
} from '@/lib/storage/cv-store';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { CVEditorView } from '@/components/editor/CVEditorView';
import { UploadCVModal } from '@/components/modals/UploadCVModal';
import { SettingsModal } from '@/components/modals/SettingsModal';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [documents, setDocuments] = useState<CVDocument[]>([]);
  const [activeDocId, setActiveDocIdState] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({ llmProvider: 'auto' });

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadedDocs = loadAllCVDocuments();
    setDocuments(loadedDocs);

    const savedActiveId = getActiveCVID();
    if (savedActiveId && loadedDocs.some(d => d.id === savedActiveId)) {
      setActiveDocIdState(savedActiveId);
    }

    const settings = loadUserSettings();
    setUserSettings(settings);
  }, []);

  const handleSelectDoc = (id: string | null) => {
    setActiveDocIdState(id);
    if (id) {
      setActiveCVID(id);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_ats_active_cv_id_v1');
    }
  };

  const handleUpdateDocument = (updatedDoc: CVDocument) => {
    const updated = documents.map(d => (d.id === updatedDoc.id ? updatedDoc : d));
    setDocuments(updated);
    saveAllCVDocuments(updated);
  };

  const handleCreateNewDocument = (templateId: TemplateId = 'ats-classic') => {
    const newDoc = createDefaultCVDocument(`Tailored CV #${documents.length + 1}`);
    newDoc.templateId = templateId;
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveAllCVDocuments(updated);
    handleSelectDoc(newDoc.id);
  };

  const handleCreateFromUploadedProfile = (profile: CVProfile, filename: string) => {
    const baseName = filename.replace(/\.[^/.]+$/, '');
    const newDoc = createDefaultCVDocument(`${baseName} - Tailored`);
    newDoc.profile = profile;
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveAllCVDocuments(updated);
    handleSelectDoc(newDoc.id);
  };

  const handleDuplicateDocument = (docId: string) => {
    const original = documents.find(d => d.id === docId);
    if (!original) return;

    const copy: CVDocument = {
      ...JSON.parse(JSON.stringify(original)),
      id: `cv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [copy, ...documents];
    setDocuments(updated);
    saveAllCVDocuments(updated);
  };

  const handleRenameDocument = (docId: string, newName: string) => {
    const updated = documents.map(d => (d.id === docId ? { ...d, name: newName, updatedAt: new Date().toISOString() } : d));
    setDocuments(updated);
    saveAllCVDocuments(updated);
  };

  const handleDeleteDocument = (docId: string) => {
    const updated = documents.filter(d => d.id !== docId);
    setDocuments(updated);
    saveAllCVDocuments(updated);
    if (activeDocId === docId) {
      handleSelectDoc(null);
    }
  };

  const handleSaveUserSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    saveUserSettings(newSettings);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 text-xs font-medium">Loading AutoCV Platform...</div>
      </div>
    );
  }

  const activeDoc = documents.find(d => d.id === activeDocId);

  return (
    <>
      {activeDoc ? (
        <CVEditorView
          document={activeDoc}
          onUpdateDocument={handleUpdateDocument}
          onBackToDashboard={() => handleSelectDoc(null)}
          userSettings={userSettings}
          onUpdateUserSettings={handleSaveUserSettings}
        />
      ) : (
        <DashboardView
          documents={documents}
          onOpenDocument={(id) => handleSelectDoc(id)}
          onCreateNewDocument={handleCreateNewDocument}
          onUploadClick={() => setIsUploadOpen(true)}
          onDuplicateDocument={handleDuplicateDocument}
          onRenameDocument={handleRenameDocument}
          onDeleteDocument={handleDeleteDocument}
          userSettings={userSettings}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Upload CV Modal */}
      <UploadCVModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onConfirmProfile={handleCreateFromUploadedProfile}
        onCreateBlank={() => handleCreateNewDocument()}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={userSettings}
        onSave={handleSaveUserSettings}
      />
    </>
  );
}

