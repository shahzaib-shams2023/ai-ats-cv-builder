import React from 'react';
import { CVProfile, SectionSettings } from '@/types/cv';

interface TemplateProps {
  profile: CVProfile;
  settings: SectionSettings;
  onEditSection?: (sectionId: string) => void;
}

export const TemplateAtsClassic: React.FC<TemplateProps> = ({ profile, settings }) => {
  const { contact, professionalSummary, experiences, education, skillCategories, projects, certifications, awards, languages } = profile;
  const headings = settings.renamedHeadings || {};

  return (
    <div className="cv-document-page bg-white text-black font-serif text-[10.5pt] leading-normal p-8 w-[800px] min-h-[1050px] shadow-sm print:shadow-none print:p-0 print:w-full break-words">
      {/* Header */}
      <header className="text-center border-b border-black pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight uppercase mb-1 font-serif break-words">
          {contact.fullName || 'YOUR NAME'}
        </h1>
        {contact.professionalTitle && (
          <p className="text-[11pt] font-semibold tracking-wide uppercase text-neutral-800 mb-1 break-words">
            {contact.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[9pt] font-sans text-neutral-800">
          {contact.email && <span className="break-all">{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.location && <span>• {contact.location}</span>}
          {contact.linkedinUrl && (
            <span>• <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="underline break-all">{contact.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}</a></span>
          )}
          {contact.githubUrl && (
            <span>• <a href={contact.githubUrl} target="_blank" rel="noreferrer" className="underline break-all">{contact.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}</a></span>
          )}
          {contact.portfolioUrl && (
            <span>• <a href={contact.portfolioUrl} target="_blank" rel="noreferrer" className="underline break-all">{contact.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}</a></span>
          )}
        </div>
      </header>

      {/* Render sections in order */}
      {settings.sectionOrder.map((sectionKey) => {
        if (settings.visibleSections[sectionKey] === false) return null;

        if (sectionKey === 'summary' && professionalSummary) {
          return (
            <section key="summary" className="mb-4">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-serif">
                {headings.summary || 'PROFESSIONAL SUMMARY'}
              </h2>
              <p className="text-[10pt] leading-relaxed text-justify break-words">
                {professionalSummary}
              </p>
            </section>
          );
        }

        if (sectionKey === 'experience' && experiences.length > 0) {
          return (
            <section key="experience" className="mb-4">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-serif">
                {headings.experience || 'WORK EXPERIENCE'}
              </h2>
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-bold text-[10pt] gap-2">
                      <span className="break-words">{exp.jobTitle} - <span className="font-semibold">{exp.company}</span></span>
                      <span className="text-[9pt] font-normal font-sans shrink-0">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="text-[8.5pt] italic text-neutral-700 mb-1">
                        {exp.location}
                      </div>
                    )}
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[9.5pt]">
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
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-serif">
                {headings.skills || 'TECHNICAL SKILLS'}
              </h2>
              <div className="space-y-1 text-[9.5pt]">
                {skillCategories.map((cat) => (
                  <div key={cat.id} className="break-words">
                    <strong className="font-semibold">{cat.name}:</strong>{' '}
                    <span>{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-4">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-serif">
                {headings.projects || 'PROJECTS'}
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline font-bold text-[10pt] gap-2">
                      <span className="break-words">
                        {proj.name}
                        {proj.tools.length > 0 && (
                          <span className="font-normal text-[9pt] italic ml-1">
                            ({proj.tools.join(', ')})
                          </span>
                        )}
                      </span>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" className="text-[8.5pt] underline font-sans shrink-0 break-all">
                          Link
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-[9.5pt] mt-0.5 break-words">{proj.description}</p>
                    )}
                    {proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-[9.5pt]">
                        {proj.highlights.map((h, i) => (
                          <li key={i} className="break-words">{h}</li>
                        ))}
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
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-serif">
                {headings.education || 'EDUCATION'}
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline font-bold text-[10pt] gap-2">
                      <span className="break-words">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</span>
                      <span className="text-[9pt] font-normal font-sans shrink-0">
                        {edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}
                      </span>
                    </div>
                    <div className="text-[9.5pt] flex justify-between gap-2">
                      <span className="break-words">{edu.institution}</span>
                      {edu.location && <span className="text-[8.5pt] italic shrink-0">{edu.location}</span>}
                    </div>
                    {edu.gpa && <div className="text-[8.5pt] mt-0.5">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certifications' && certifications.length > 0) {
          return (
            <section key="certifications" className="mb-4">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-serif">
                {headings.certifications || 'CERTIFICATIONS'}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9.5pt]">
                {certifications.map((cert) => (
                  <li key={cert.id} className="break-words">
                    <strong>{cert.name}</strong> - {cert.issuer} {cert.date ? `(${cert.date})` : ''}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'awards' && awards.length > 0) {
          return (
            <section key="awards" className="mb-4">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-serif">
                {headings.awards || 'HONORS & AWARDS'}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9.5pt]">
                {awards.map((a) => (
                  <li key={a.id} className="break-words">
                    <strong>{a.title}</strong> {a.issuer ? `- ${a.issuer}` : ''} {a.date ? `(${a.date})` : ''}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'languages' && languages.length > 0) {
          return (
            <section key="languages" className="mb-4">
              <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-serif">
                {headings.languages || 'LANGUAGES'}
              </h2>
              <p className="text-[9.5pt] break-words">
                {languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}
              </p>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};
