import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, BorderStyle } from 'docx';
import { CVProfile, SectionSettings, TemplateId } from '@/types/cv';

export async function generateDocxBuffer(
  profile: CVProfile,
  settings: SectionSettings,
  templateId: TemplateId = 'ats-classic'
): Promise<Buffer> {
  const { contact, professionalSummary, experiences, education, skillCategories, projects, certifications, awards, languages } = profile;
  const headings = settings.renamedHeadings || {};

  const fontName = templateId === 'ats-classic' || templateId === 'executive' || templateId === 'academic'
    ? 'Times New Roman'
    : 'Calibri';

  const children: Paragraph[] = [];

  // Header - Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: (contact.fullName || 'YOUR NAME').toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: fontName
        })
      ]
    })
  );

  // Professional Title
  if (contact.professionalTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: contact.professionalTitle,
            size: 22, // 11pt
            color: '444444',
            font: fontName
          })
        ]
      })
    );
  }

  // Contact line
  const contactParts: string[] = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedinUrl ? contact.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '') : '',
    contact.githubUrl ? contact.githubUrl.replace(/^https?:\/\/(www\.)?/, '') : '',
    contact.portfolioUrl ? contact.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '') : ''
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        border: {
          bottom: {
            color: '888888',
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6
          }
        },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 18, // 9pt
            color: '555555',
            font: fontName
          })
        ]
      })
    );
  }

  // Helper for section headings
  const createSectionHeading = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      border: {
        bottom: {
          color: '333333',
          space: 2,
          style: BorderStyle.SINGLE,
          size: 4
        }
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          font: fontName,
          color: '111111'
        })
      ]
    });
  };

  // Render sections in order
  for (const sectionKey of settings.sectionOrder) {
    if (settings.visibleSections[sectionKey] === false) continue;

    if (sectionKey === 'summary' && professionalSummary) {
      children.push(createSectionHeading(headings.summary || 'Professional Summary'));
      children.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: professionalSummary,
              size: 20, // 10pt
              font: fontName
            })
          ]
        })
      );
    }

    if (sectionKey === 'experience' && experiences.length > 0) {
      children.push(createSectionHeading(headings.experience || 'Work Experience'));
      for (const exp of experiences) {
        // Job Title & Company
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text: `${exp.jobTitle} - `,
                bold: true,
                size: 21,
                font: fontName
              }),
              new TextRun({
                text: exp.company,
                bold: true,
                color: '333333',
                size: 21,
                font: fontName
              }),
              new TextRun({
                text: `  (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}${exp.location ? `, ${exp.location}` : ''})`,
                size: 18,
                color: '666666',
                font: fontName
              })
            ]
          })
        );

        // Highlights bullets
        for (const bullet of exp.highlights) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: fontName
                })
              ]
            })
          );
        }
      }
    }

    if (sectionKey === 'skills' && skillCategories.length > 0) {
      children.push(createSectionHeading(headings.skills || 'Technical Skills'));
      for (const cat of skillCategories) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${cat.name}: `,
                bold: true,
                size: 20,
                font: fontName
              }),
              new TextRun({
                text: cat.skills.join(', '),
                size: 20,
                font: fontName
              })
            ]
          })
        );
      }
    }

    if (sectionKey === 'projects' && projects.length > 0) {
      children.push(createSectionHeading(headings.projects || 'Projects'));
      for (const proj of projects) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({
                text: proj.name,
                bold: true,
                size: 20,
                font: fontName
              }),
              proj.tools.length > 0
                ? new TextRun({
                    text: `  [${proj.tools.join(', ')}]`,
                    italics: true,
                    size: 18,
                    color: '555555',
                    font: fontName
                  })
                : new TextRun({ text: '' })
            ]
          })
        );

        if (proj.description) {
          children.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: proj.description,
                  size: 19,
                  font: fontName
                })
              ]
            })
          );
        }

        for (const h of proj.highlights) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: [
                new TextRun({
                  text: h,
                  size: 19,
                  font: fontName
                })
              ]
            })
          );
        }
      }
    }

    if (sectionKey === 'education' && education.length > 0) {
      children.push(createSectionHeading(headings.education || 'Education'));
      for (const edu of education) {
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({
                text: `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`,
                bold: true,
                size: 20,
                font: fontName
              }),
              new TextRun({
                text: `  - ${edu.institution}${edu.location ? `, ${edu.location}` : ''}`,
                size: 20,
                font: fontName
              }),
              new TextRun({
                text: `  (${edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate})`,
                size: 18,
                color: '666666',
                font: fontName
              })
            ]
          })
        );
        if (edu.gpa) {
          children.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `GPA: ${edu.gpa}`,
                  italics: true,
                  size: 18,
                  color: '555555',
                  font: fontName
                })
              ]
            })
          );
        }
      }
    }

    if (sectionKey === 'certifications' && certifications.length > 0) {
      children.push(createSectionHeading(headings.certifications || 'Certifications'));
      for (const cert of certifications) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `${cert.name} - `,
                bold: true,
                size: 20,
                font: fontName
              }),
              new TextRun({
                text: `${cert.issuer}${cert.date ? ` (${cert.date})` : ''}`,
                size: 20,
                font: fontName
              })
            ]
          })
        );
      }
    }

    if (sectionKey === 'awards' && awards.length > 0) {
      children.push(createSectionHeading(headings.awards || 'Awards & Honors'));
      for (const award of awards) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `${award.title} - `,
                bold: true,
                size: 20,
                font: fontName
              }),
              new TextRun({
                text: `${award.issuer || ''}${award.date ? ` (${award.date})` : ''}`,
                size: 20,
                font: fontName
              })
            ]
          })
        );
      }
    }

    if (sectionKey === 'languages' && languages.length > 0) {
      children.push(createSectionHeading(headings.languages || 'Languages'));
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: languages.map(l => `${l.language} (${l.proficiency})`).join('  •  '),
              size: 20,
              font: fontName
            })
          ]
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

