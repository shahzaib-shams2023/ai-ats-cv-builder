import React from 'react';
import { CVProfile, SectionSettings } from '@/types/cv';

interface TemplateProps {
  profile: CVProfile;
  settings: SectionSettings;
}

export const TemplateAcademic: React.FC<TemplateProps> = ({ profile, settings }) => {
  const { contact, professionalSummary, experiences, education, skillCategories, projects, certifications, awards, languages } = profile;
  const headings = settings.renamedHeadings || {};

  return (
    <div className="cv-document-page bg-white text-black font-serif text-[10.5pt] leading-relaxed p-8 w-[800px] min-h-[1050px] mx-auto shadow-sm print:shadow-none print:p-0 print:w-full break-words">
      {/* Header */}
      <header className="text-center mb-6 pb-2 border-b border-black">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1 font-serif break-words">
          {contact.fullName || 'YOUR NAME'}
        </h1>
        {contact.professionalTitle && (
          <p className="text-[11pt] italic mb-2 break-words">
            {contact.professionalTitle}
          </p>
        )}
        <div className="text-[9pt] font-sans text-neutral-800 space-y-0.5">
          {contact.location && <div>{contact.location}</div>}
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5">
            {contact.email && <span className="break-all">{contact.email}</span>}
            {contact.phone && <span>• {contact.phone}</span>}
            {contact.portfolioUrl && <span>• <a href={contact.portfolioUrl} target="_blank" rel="noreferrer" className="underline break-all">{contact.portfolioUrl}</a></span>}
          </div>
        </div>
      </header>

      {/* Sections - Academic layout gives education prominence */}
      {settings.sectionOrder.map((sectionKey) => {
        if (settings.visibleSections[sectionKey] === false) return null;

        if (sectionKey === 'summary' && professionalSummary) {
          return (
            <section key="summary" className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                {headings.summary || 'Research Interests & Profile'}
              </h2>
              <p className="text-[10pt] leading-relaxed text-justify">
                {professionalSummary}
              </p>
            </section>
          );
        }

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                {headings.education || 'Education'}
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline font-bold text-[10pt] gap-2">
                      <span className="break-words">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</span>
                      <span className="shrink-0 font-normal font-sans text-[9pt]">
                        {edu.startDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate}
                      </span>
                    </div>
                    <div className="text-[9.5pt] italic break-words">
                      {edu.institution} {edu.location && `, ${edu.location}`}
                    </div>
                    {edu.gpa && <div className="text-[9pt]">GPA / Honors: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'experience' && experiences.length > 0) {
          return (
            <section key="experience" className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                {headings.experience || 'Academic & Professional Appointments'}
              </h2>
              <div className="space-y-3.5">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-bold text-[10pt] gap-2">
                      <span className="break-words">{exp.jobTitle}, <span className="font-normal italic">{exp.company}</span></span>
                      <span className="shrink-0 font-normal font-sans text-[9pt]">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <ul className="list-disc list-outside ml-5 mt-1 space-y-0.5 text-[9.5pt]">
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

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                {headings.projects || 'Research Projects & Publications'}
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="font-bold text-[10pt] break-words">
                      {proj.name} {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="font-normal font-sans text-[8.5pt] underline break-all">[URL]</a>}
                    </div>
                    {proj.description && <p className="text-[9.5pt] mt-0.5 break-words">{proj.description}</p>}
                    {proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-5 mt-0.5 text-[9.5pt]">
                        {proj.highlights.map((h, i) => <li key={i} className="break-words">{h}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'awards' && awards.length > 0) {
          return (
            <section key="awards" className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                {headings.awards || 'Grants, Fellowships & Honors'}
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-1 text-[9.5pt]">
                {awards.map((a) => (
                  <li key={a.id}>
                    <strong>{a.title}</strong> {a.issuer && `— ${a.issuer}`} {a.date && `(${a.date})`}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'skills' && skillCategories.length > 0) {
          return (
            <section key="skills" className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                {headings.skills || 'Technical & Methodological Competencies'}
              </h2>
              <div className="space-y-1 text-[9.5pt]">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <strong>{cat.name}:</strong> <span>{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certifications' && certifications.length > 0) {
          return (
            <section key="certifications" className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                {headings.certifications || 'Certifications & Credentials'}
              </h2>
              <ul className="list-disc list-outside ml-5 text-[9.5pt]">
                {certifications.map((c) => (
                  <li key={c.id}><strong>{c.name}</strong> — {c.issuer}</li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'languages' && languages.length > 0) {
          return (
            <section key="languages" className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                {headings.languages || 'Languages'}
              </h2>
              <p className="text-[9.5pt]">{languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}</p>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};

