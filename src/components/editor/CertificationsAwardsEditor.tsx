import React from 'react';
import { Certification, Award, Language } from '@/types/cv';
import { Award as AwardIcon, CheckCircle, Globe, Plus, Trash2 } from 'lucide-react';

interface CertificationsAwardsEditorProps {
  certifications: Certification[];
  awards: Award[];
  languages: Language[];
  onCertificationsChange: (updated: Certification[]) => void;
  onAwardsChange: (updated: Award[]) => void;
  onLanguagesChange: (updated: Language[]) => void;
}

export const CertificationsAwardsEditor: React.FC<CertificationsAwardsEditorProps> = ({
  certifications,
  awards,
  languages,
  onCertificationsChange,
  onAwardsChange,
  onLanguagesChange
}) => {
  const addCert = () => {
    onCertificationsChange([
      ...certifications,
      { id: `cert-${Date.now()}`, name: 'New Certification', issuer: 'Certifying Authority', date: '2023' }
    ]);
  };

  const addAward = () => {
    onAwardsChange([
      ...awards,
      { id: `award-${Date.now()}`, title: 'Award / Honor Title', issuer: 'Recognizing Body', date: '2023' }
    ]);
  };

  const addLanguage = () => {
    onLanguagesChange([
      ...languages,
      { id: `lang-${Date.now()}`, language: 'Language', proficiency: 'Fluent' }
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Certifications */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <span>Verified Certifications ({certifications.length})</span>
          </div>
          <button
            type="button"
            onClick={addCert}
            className="btn-secondary flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium cursor-pointer"
          >
            <Plus className="w-3 h-3 text-slate-600" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {certifications.map((c, i) => (
            <div key={c.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200">
              <input
                type="text"
                value={c.name}
                onChange={e => {
                  const updated = [...certifications];
                  updated[i] = { ...c, name: e.target.value };
                  onCertificationsChange(updated);
                }}
                placeholder="Certification Name (e.g. AWS Solutions Architect)"
                className="flex-1 min-w-0 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 focus:border-slate-800 outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={c.issuer}
                  onChange={e => {
                    const updated = [...certifications];
                    updated[i] = { ...c, issuer: e.target.value };
                    onCertificationsChange(updated);
                  }}
                  placeholder="Issuer (e.g. Amazon Web Services)"
                  className="flex-1 sm:w-36 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 focus:border-slate-800 outline-none"
                />
                <input
                  type="text"
                  value={c.date || ''}
                  onChange={e => {
                    const updated = [...certifications];
                    updated[i] = { ...c, date: e.target.value };
                    onCertificationsChange(updated);
                  }}
                  placeholder="Year"
                  className="w-16 text-xs px-2 py-1.5 bg-white border border-slate-200 rounded text-slate-900 focus:border-slate-800 outline-none text-center font-mono"
                />
                <button
                  type="button"
                  onClick={() => onCertificationsChange(certifications.filter(x => x.id !== c.id))}
                  className="text-slate-400 hover:text-rose-600 p-1 shrink-0 transition-colors cursor-pointer"
                  title="Remove certification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {certifications.length === 0 && (
            <p className="text-[11px] text-slate-400 italic">No certifications added</p>
          )}
        </div>
      </div>

      {/* Awards */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <AwardIcon className="w-3.5 h-3.5" />
            </div>
            <span>Honors & Professional Recognition ({awards.length})</span>
          </div>
          <button
            type="button"
            onClick={addAward}
            className="btn-secondary flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium cursor-pointer"
          >
            <Plus className="w-3 h-3 text-slate-600" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {awards.map((a, i) => (
            <div key={a.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200">
              <input
                type="text"
                value={a.title}
                onChange={e => {
                  const updated = [...awards];
                  updated[i] = { ...a, title: e.target.value };
                  onAwardsChange(updated);
                }}
                placeholder="Award Title (e.g. Innovator of the Year)"
                className="flex-1 min-w-0 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 focus:border-slate-800 outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={a.issuer || ''}
                  onChange={e => {
                    const updated = [...awards];
                    updated[i] = { ...a, issuer: e.target.value };
                    onAwardsChange(updated);
                  }}
                  placeholder="Organization"
                  className="flex-1 sm:w-36 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 focus:border-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => onAwardsChange(awards.filter(x => x.id !== a.id))}
                  className="text-slate-400 hover:text-rose-600 p-1 shrink-0 transition-colors cursor-pointer"
                  title="Remove award"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {awards.length === 0 && (
            <p className="text-[11px] text-slate-400 italic">No awards listed</p>
          )}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <span>Language Proficiencies ({languages.length})</span>
          </div>
          <button
            type="button"
            onClick={addLanguage}
            className="btn-secondary flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium cursor-pointer"
          >
            <Plus className="w-3 h-3 text-slate-600" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {languages.map((l, i) => (
            <div key={l.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200">
              <input
                type="text"
                value={l.language}
                onChange={e => {
                  const updated = [...languages];
                  updated[i] = { ...l, language: e.target.value };
                  onLanguagesChange(updated);
                }}
                placeholder="Language (e.g. English, Mandarin)"
                className="flex-1 min-w-0 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 focus:border-slate-800 outline-none"
              />
              <div className="flex items-center gap-2">
                <select
                  value={l.proficiency}
                  onChange={e => {
                    const updated = [...languages];
                    updated[i] = { ...l, proficiency: e.target.value as any };
                    onLanguagesChange(updated);
                  }}
                  className="flex-1 sm:w-36 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 focus:border-slate-800 outline-none cursor-pointer"
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional">Professional</option>
                  <option value="Working">Working</option>
                  <option value="Basic">Basic</option>
                </select>
                <button
                  type="button"
                  onClick={() => onLanguagesChange(languages.filter(x => x.id !== l.id))}
                  className="text-slate-400 hover:text-rose-600 p-1 shrink-0 transition-colors cursor-pointer"
                  title="Remove language"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {languages.length === 0 && (
            <p className="text-[11px] text-slate-400 italic">No languages specified</p>
          )}
        </div>
      </div>
    </div>
  );
};
