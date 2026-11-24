import React, { useState, useRef } from 'react';
import { CVProfile } from '@/types/cv';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

interface UploadCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmProfile: (profile: CVProfile, filename: string) => void;
  onCreateBlank: () => void;
}

export const UploadCVModal: React.FC<UploadCVModalProps> = ({
  isOpen,
  onClose,
  onConfirmProfile,
  onCreateBlank
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    profile: CVProfile;
    filename: string;
    format: string;
    warnings: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to parse CV');
      }

      setExtractedData({
        profile: data.data.profile,
        filename: data.data.filename,
        format: data.data.format,
        warnings: data.data.warnings || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (extractedData) {
      onConfirmProfile(extractedData.profile, extractedData.filename);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200/90 space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/80">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 tracking-tight">
                {extractedData ? 'Review Extracted Dossier' : 'Import Candidate Resume'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {extractedData ? 'Inspect parsed sections before populating editor canvas' : 'Upload PDF, DOCX, DOC, or TXT (Max 10MB)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-0.5">
          {!extractedData ? (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isUploading
                    ? 'bg-slate-50/80 border-slate-400'
                    : 'bg-slate-50/50 border-slate-300 hover:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                />

                {isUploading ? (
                  <div className="flex flex-col items-center justify-center py-4 space-y-2.5">
                    <Loader2 className="w-7 h-7 text-slate-800 animate-spin" />
                    <span className="text-xs font-semibold text-slate-900">
                      Deconstructing document structure...
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Extracting contact specs, roles, skills, and credentials
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-1 border border-slate-200/80">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-900">
                      Click to choose file or drag document here
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      PDF, DOCX, DOC, TXT (up to 10MB)
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <div className="pt-2 text-center">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">or start clean</span>
                <button
                  type="button"
                  onClick={() => {
                    onCreateBlank();
                    onClose();
                  }}
                  className="btn-secondary w-full py-2 px-3 text-xs font-medium cursor-pointer"
                >
                  Create Blank Document from Scratch
                </button>
              </div>
            </div>
          ) : (
            /* Review Step */
            <div className="space-y-3.5">
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Parsed {extractedData.filename}</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-medium px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-200">
                  {extractedData.format}
                </span>
              </div>

              {/* Summary of extracted fields */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">Candidate Identity</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{extractedData.profile.contact.fullName || 'Unspecified'}</div>
                  <div className="text-slate-600 text-xs">{extractedData.profile.contact.professionalTitle || 'Title Not Set'}</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-1">
                    {[extractedData.profile.contact.email, extractedData.profile.contact.phone, extractedData.profile.contact.location].filter(Boolean).join(' • ')}
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-2.5 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Work Positions:</span>{' '}
                    <span className="font-mono font-semibold text-slate-900">{extractedData.profile.experiences.length} records</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Education Entries:</span>{' '}
                    <span className="font-mono font-semibold text-slate-900">{extractedData.profile.education.length} records</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Extracted Skills:</span>{' '}
                    <span className="font-mono font-semibold text-slate-900">
                      {extractedData.profile.skillCategories.flatMap(c => c.skills).length} skills
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Projects:</span>{' '}
                    <span className="font-mono font-semibold text-slate-900">{extractedData.profile.projects.length} records</span>
                  </div>
                </div>
              </div>

              {extractedData.warnings.length > 0 && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] rounded-lg space-y-1">
                  <div className="font-semibold font-mono uppercase text-[10px] tracking-wider text-amber-800">Parser Advisories:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-800/90">
                    {extractedData.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost px-3 py-1.5 text-xs font-medium cursor-pointer text-center"
          >
            Cancel
          </button>

          {extractedData && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setExtractedData(null)}
                className="btn-secondary px-3 py-1.5 text-xs font-medium cursor-pointer text-center"
              >
                Re-upload File
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn-primary px-4 py-1.5 text-xs font-medium cursor-pointer text-center"
              >
                Populate CV Canvas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
