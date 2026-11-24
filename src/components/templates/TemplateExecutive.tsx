import React from 'react';
import { CVProfile, SectionSettings } from '@/types/cv';

interface TemplateProps {
  profile: CVProfile;
  settings: SectionSettings;
}

export const TemplateExecutive: React.FC<TemplateProps> = ({ profile, settings }) => {
  const { contact, professionalSummary, experiences, education, skillCategories, projects, certifications, awards, languages } = profile;
  const headings = settings.renamedHeadings || {};

  return (
    <div className="cv-document-page bg-white text-zinc-900 font-serif text-[10pt] leading-normal p-8 w-[800px] min-h-[1050px] mx-auto shadow-sm print:shadow-none print:p-0 print:w-full break-words">
      {/* Header */}
      <header className="text-center pb-4 mb-4 border-b-2 border-zinc-800">
        <h1 className="text-2xl font-bold tracking-widest uppercase mb-1 break-words">
          {contact.fullName || 'YOUR NAME'}
        </h1>
        {contact.professionalTitle && (
          <p className="text-[11pt] italic text-zinc-700 tracking-wider mb-2 font-serif break-words">
            {contact.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[8.5pt] font-sans text-zinc-600 tracking-tight">
          {contact.email && <span className="break-all">{contact.email}</span>}
          {contact.phone && <span>| {contact.phone}</span>}
          {contact.location && <span>| {contact.location}</span>}
          {contact.linkedinUrl && (
            <span>| <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="underline break-all">LinkedIn</a></span>
          )}
          {contact.portfolioUrl && (
            <span>| <a href={contact.portfolioUrl} target="_blank" rel="noreferrer" className="underline break-all">Portfolio</a></span>
          )}
        </div>
      </header>

      {/* Sections */}
      {settings.sectionOrder.map((sectionKey) => {
        if (settings.visibleSections[sectionKey] === false) return null;

        if (sectionKey === 'summary' && professionalSummary) {
          return (
            <section key="summary" className="mb-4">
              <h2 className="text-[10.5pt] font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-0.5 mb-1.5">
                {headings.summary || 'Executive Profile'}
              </h2>
              <div className="bg-zinc-50 border-l-2 border-zinc-800 p-2 text-[9.5pt] italic text-zinc-800 leading-relaxed">
                {professionalSummary}
              </div>
            </section>
          );
        }

        if (sectionKey === 'experience' && experiences.length > 0) {
          return (
            <section key="experience" className="mb-4">
              <h2 className="text-[10.5pt] font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-0.5 mb-2">
                {headings.experience || 'Leadership & Professional Experience'}
              </h2>
              <div className="space-y-3.5">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-bold text-[10pt] gap-2">
                      <span className="break-words">{exp.jobTitle} <span className="font-normal italic">at</span> {exp.company}</span>
                      <span className="shrink-0 text-[8.5pt] font-normal font-sans text-zinc-600">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.location && <div className="text-[8.5pt] text-zinc-500 italic">{exp.location}</div>}
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[9pt] text-zinc-800">
                      {exp.highlights.map((bullet, idx) => (
                        <li key={idx} className="leading-snug break-words">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'skills' && skillCategories.length > 0) {
          return (
            <section key="skills" className="mb-4">
              <h2 className="text-[10.5pt] font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-0.5 mb-1.5">
                {headings.skills || 'Core Expertise & Competencies'}
              </h2>
              <div className="space-y-1 text-[9pt]">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <span className="font-bold">{cat.name}:</span>{' '}
                    <span className="font-sans text-[8.5pt] text-zinc-700">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-4">
              <h2 className="text-[10.5pt] font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-0.5 mb-2">
                {headings.projects || 'Key Initiatives & Projects'}
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between font-bold text-[9.5pt] gap-2">
                      <span className="break-words">{proj.name}</span>
                      {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="shrink-0 text-[8pt] underline font-sans break-all">Details</a>}
                    </div>
                    {proj.description && <p className="text-[9pt] text-zinc-700 break-words">{proj.description}</p>}
                    {proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-0.5 text-[9pt] text-zinc-800">
                        {proj.highlights.map((h, i) => <li key={i} className="break-words">{h}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-4">
              <h2 className="text-[10.5pt] font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-0.5 mb-2">
                {headings.education || 'Education'}
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between font-bold text-[9.5pt] gap-2">
                      <span className="break-words">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</span>
                      <span className="shrink-0 font-normal font-sans text-[8.5pt] text-zinc-600">{edu.startDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate}</span>
                    </div>
                    <div className="text-[9pt] text-zinc-700 break-words">{edu.institution} {edu.location && `• ${edu.location}`}</div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certifications' && certifications.length > 0) {
          return (
            <section key="certifications" className="mb-4">
              <h2 className="text-[10.5pt] font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-0.5 mb-1.5">
                {headings.certifications || 'Credentials & Certifications'}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-zinc-800">
                {certifications.map((c) => (
                  <li key={c.id}><strong>{c.name}</strong> — {c.issuer} {c.date && `(${c.date})`}</li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'awards' && awards.length > 0) {
          return (
            <section key="awards" className="mb-4">
              <h2 className="text-[10.5pt] font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-0.5 mb-1.5">
                {headings.awards || 'Honors'}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-zinc-800">
                {awards.map((a) => (
                  <li key={a.id}><strong>{a.title}</strong> {a.issuer && `— ${a.issuer}`} {a.date && `(${a.date})`}</li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'languages' && languages.length > 0) {
          return (
            <section key="languages" className="mb-4">
              <h2 className="text-[10.5pt] font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 pb-0.5 mb-1.5">
                {headings.languages || 'Languages'}
              </h2>
              <p className="text-[9pt] text-zinc-800">{languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}</p>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};

