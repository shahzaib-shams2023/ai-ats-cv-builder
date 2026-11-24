import React from 'react';
import { ContactInfo } from '@/types/cv';
import { User, Mail, Phone, MapPin, Globe, Link2 } from 'lucide-react';

interface ContactEditorProps {
  contact: ContactInfo;
  onChange: (updated: ContactInfo) => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({ contact, onChange }) => {
  const updateField = (field: keyof ContactInfo, value: any) => {
    onChange({
      ...contact,
      [field]: value
    });
  };

  return (
    <div className="space-y-4 bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-tight pb-2.5 border-b border-slate-100">
        <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
          <User className="w-3.5 h-3.5" />
        </div>
        <span>Personal & Contact Specification</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11px] font-medium text-slate-700 mb-1">
            Full Legal Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={contact.fullName || ''}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="e.g. Alex Mercer"
            className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700 mb-1">
            Target / Professional Title
          </label>
          <input
            type="text"
            value={contact.professionalTitle || ''}
            onChange={(e) => updateField('professionalTitle', e.target.value)}
            placeholder="e.g. Principal Systems Architect"
            className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>Email Address</span> <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="alex@domain.com"
            className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>Phone Number</span>
          </label>
          <input
            type="tel"
            value={contact.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 019-2834"
            className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>Location / Jurisdiction</span>
          </label>
          <input
            type="text"
            value={contact.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="San Francisco, CA (Open to Remote)"
            className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1.5">
            <Link2 className="w-3 h-3 text-slate-400" />
            <span>LinkedIn Profile</span>
          </label>
          <input
            type="url"
            value={contact.linkedinUrl || ''}
            onChange={(e) => updateField('linkedinUrl', e.target.value)}
            placeholder="linkedin.com/in/alex"
            className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1.5">
            <Link2 className="w-3 h-3 text-slate-400" />
            <span>GitHub / Portfolio Profile</span>
          </label>
          <input
            type="url"
            value={contact.githubUrl || ''}
            onChange={(e) => updateField('githubUrl', e.target.value)}
            placeholder="github.com/alex"
            className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>Personal Website</span>
          </label>
          <input
            type="url"
            value={contact.portfolioUrl || ''}
            onChange={(e) => updateField('portfolioUrl', e.target.value)}
            placeholder="https://alexmercer.dev"
            className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none transition-all font-mono"
          />
        </div>
      </div>
    </div>
  );
};
