import { CVProfile, SectionSettings, TemplateId } from '@/types/cv';

export async function generateDocBuffer(
  profile: CVProfile,
  settings: SectionSettings,
  templateId: TemplateId = 'ats-classic'
): Promise<Buffer> {
  const { contact, professionalSummary, experiences, education, skillCategories, projects, certifications, awards, languages } = profile;
  const headings = settings.renamedHeadings || {};

  const font = templateId === 'ats-classic' || templateId === 'executive' || templateId === 'academic'
    ? 'Times New Roman, serif'
    : 'Calibri, Arial, sans-serif';

  let sectionsHtml = '';

  for (const sectionKey of settings.sectionOrder) {
    if (settings.visibleSections[sectionKey] === false) continue;

    if (sectionKey === 'summary' && professionalSummary) {
      sectionsHtml += `
        <div style="margin-top: 14pt;">
          <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2pt; margin-bottom: 4pt;">
            ${headings.summary || 'Professional Summary'}
          </h2>
          <p style="font-size: 10pt; line-height: 1.4; margin: 0;">${escapeHtml(professionalSummary)}</p>
        </div>
      `;
    }

    if (sectionKey === 'experience' && experiences.length > 0) {
      let expHtml = '';
      for (const exp of experiences) {
        let bulletsHtml = '';
        for (const b of exp.highlights) {
          bulletsHtml += `<li style="font-size: 9.5pt; margin-bottom: 2pt;">${escapeHtml(b)}</li>`;
        }

        expHtml += `
          <div style="margin-bottom: 8pt;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 10pt;">
              <span>${escapeHtml(exp.jobTitle)} - ${escapeHtml(exp.company)}</span>
              <span style="font-weight: normal; font-size: 9pt;">${escapeHtml(exp.startDate)} - ${exp.current ? 'Present' : escapeHtml(exp.endDate)}</span>
            </div>
            ${exp.location ? `<div style="font-size: 8.5pt; font-style: italic; color: #555;">${escapeHtml(exp.location)}</div>` : ''}
            <ul style="margin-top: 3pt; margin-bottom: 4pt; padding-left: 18pt;">
              ${bulletsHtml}
            </ul>
          </div>
        `;
      }

      sectionsHtml += `
        <div style="margin-top: 14pt;">
          <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2pt; margin-bottom: 6pt;">
            ${headings.experience || 'Work Experience'}
          </h2>
          ${expHtml}
        </div>
      `;
    }

    if (sectionKey === 'skills' && skillCategories.length > 0) {
      let skillsHtml = '';
      for (const cat of skillCategories) {
        skillsHtml += `
          <div style="font-size: 9.5pt; margin-bottom: 3pt;">
            <strong>${escapeHtml(cat.name)}:</strong> ${escapeHtml(cat.skills.join(', '))}
          </div>
        `;
      }
      sectionsHtml += `
        <div style="margin-top: 14pt;">
          <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2pt; margin-bottom: 4pt;">
            ${headings.skills || 'Technical Skills'}
          </h2>
          ${skillsHtml}
        </div>
      `;
    }

    if (sectionKey === 'projects' && projects.length > 0) {
      let projHtml = '';
      for (const proj of projects) {
        let bulletsHtml = '';
        for (const h of proj.highlights) {
          bulletsHtml += `<li style="font-size: 9.5pt; margin-bottom: 2pt;">${escapeHtml(h)}</li>`;
        }
        projHtml += `
          <div style="margin-bottom: 6pt;">
            <div style="font-weight: bold; font-size: 10pt;">
              ${escapeHtml(proj.name)} ${proj.tools.length > 0 ? `<span style="font-weight: normal; font-size: 8.5pt; font-style: italic;">[${escapeHtml(proj.tools.join(', '))}]</span>` : ''}
            </div>
            ${proj.description ? `<p style="font-size: 9pt; margin: 2pt 0;">${escapeHtml(proj.description)}</p>` : ''}
            ${bulletsHtml ? `<ul style="margin-top: 2pt; margin-bottom: 2pt; padding-left: 18pt;">${bulletsHtml}</ul>` : ''}
          </div>
        `;
      }
      sectionsHtml += `
        <div style="margin-top: 14pt;">
          <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2pt; margin-bottom: 4pt;">
            ${headings.projects || 'Projects'}
          </h2>
          ${projHtml}
        </div>
      `;
    }

    if (sectionKey === 'education' && education.length > 0) {
      let eduHtml = '';
      for (const edu of education) {
        eduHtml += `
          <div style="margin-bottom: 6pt;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 10pt;">
              <span>${escapeHtml(edu.degree)}${edu.fieldOfStudy ? ` in ${escapeHtml(edu.fieldOfStudy)}` : ''}</span>
              <span style="font-weight: normal; font-size: 9pt;">${escapeHtml(edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate)}</span>
            </div>
            <div style="font-size: 9pt; color: #444;">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
            ${edu.gpa ? `<div style="font-size: 8.5pt; font-style: italic;">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
          </div>
        `;
      }
      sectionsHtml += `
        <div style="margin-top: 14pt;">
          <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2pt; margin-bottom: 4pt;">
            ${headings.education || 'Education'}
          </h2>
          ${eduHtml}
        </div>
      `;
    }

    if (sectionKey === 'certifications' && certifications.length > 0) {
      let certHtml = '';
      for (const c of certifications) {
        certHtml += `<li style="font-size: 9.5pt; margin-bottom: 2pt;"><strong>${escapeHtml(c.name)}</strong> - ${escapeHtml(c.issuer)} ${c.date ? `(${escapeHtml(c.date)})` : ''}</li>`;
      }
      sectionsHtml += `
        <div style="margin-top: 14pt;">
          <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2pt; margin-bottom: 4pt;">
            ${headings.certifications || 'Certifications'}
          </h2>
          <ul style="margin: 0; padding-left: 18pt;">${certHtml}</ul>
        </div>
      `;
    }

    if (sectionKey === 'languages' && languages.length > 0) {
      sectionsHtml += `
        <div style="margin-top: 14pt;">
          <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2pt; margin-bottom: 4pt;">
            ${headings.languages || 'Languages'}
          </h2>
          <p style="font-size: 9.5pt; margin: 0;">${escapeHtml(languages.map(l => `${l.language} (${l.proficiency})`).join(' • '))}</p>
        </div>
      `;
    }
  }

  const contactLine = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedinUrl ? contact.linkedinUrl.replace(/^https?:\/\//, '') : '',
    contact.githubUrl ? contact.githubUrl.replace(/^https?:\/\//, '') : ''
  ].filter(Boolean).map(escapeHtml).join('  |  ');

  const fullHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(contact.fullName || 'Resume')}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 8.5in 11in;
          margin: 0.5in 0.5in 0.5in 0.5in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
          mso-paper-source: 0;
        }
        body {
          font-family: ${font};
          font-size: 10pt;
          line-height: 1.35;
          color: #111;
        }
      </style>
    </head>
    <body>
      <div style="text-align: center; border-bottom: 1.5px solid #222; padding-bottom: 8pt; margin-bottom: 10pt;">
        <h1 style="font-size: 18pt; font-weight: bold; margin: 0 0 2pt 0; text-transform: uppercase;">
          ${escapeHtml(contact.fullName || 'YOUR NAME')}
        </h1>
        ${contact.professionalTitle ? `<div style="font-size: 11pt; color: #444; font-weight: bold; margin-bottom: 3pt;">${escapeHtml(contact.professionalTitle)}</div>` : ''}
        <div style="font-size: 9pt; color: #555;">${contactLine}</div>
      </div>

      ${sectionsHtml}
    </body>
    </html>
  `.trim();

  return Buffer.from(fullHtml, 'utf-8');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

