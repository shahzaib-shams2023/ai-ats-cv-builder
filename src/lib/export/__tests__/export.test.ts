import { describe, it, expect } from 'vitest';
import { generateDocxBuffer } from '../export-docx';
import { generateDocBuffer } from '../export-doc';
import { SAMPLE_PROFILE, DEFAULT_SECTION_SETTINGS } from '@/lib/storage/cv-store';

describe('Document Export System', () => {
  it('generates a valid binary DOCX buffer with paragraphs and headings', async () => {
    const buffer = await generateDocxBuffer(SAMPLE_PROFILE, DEFAULT_SECTION_SETTINGS, 'ats-classic');
    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(1000);
    // DOCX file header starts with PK (ZIP signature 0x50, 0x4B)
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4B);
  });

  it('generates a valid Word-compatible DOC buffer containing profile content', async () => {
    const buffer = await generateDocBuffer(SAMPLE_PROFILE, DEFAULT_SECTION_SETTINGS, 'ats-classic');
    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(500);
    const content = buffer.toString('utf-8');
    expect(content).toContain('Alex Mercer');
    expect(content).toContain('Acme Cloud Systems');
  });
});

