import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ExtractionResult {
  text: string;
  format: 'pdf' | 'docx' | 'doc' | 'txt' | 'unknown';
  pageCount?: number;
  warnings?: string[];
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  filename: string
): Promise<ExtractionResult> {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const warnings: string[] = [];

  try {
    if (extension === 'pdf') {
      const data = await pdfParse(buffer);
      const text = data.text ? data.text.trim() : '';

      if (text.length < 50) {
        warnings.push('This PDF appears to have very little or scanned text. If it is a scanned image, please ensure text is legible or verify the extracted profile.');
      }

      return {
        text,
        format: 'pdf',
        pageCount: data.numpages,
        warnings
      };
    }

    if (extension === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value ? result.value.trim() : '';
      if (result.messages && result.messages.length > 0) {
        warnings.push(...result.messages.map(m => m.message));
      }
      return {
        text,
        format: 'docx',
        warnings
      };
    }

    if (extension === 'doc') {
      // Legacy Microsoft Word 97-2003 .doc
      try {
        const result = await mammoth.extractRawText({ buffer });
        if (result.value && result.value.trim().length > 50) {
          return {
            text: result.value.trim(),
            format: 'doc',
            warnings
          };
        }
      } catch {
        // Fall back to binary text extraction for OLE binary streams
      }

      const extractedBinaryText = extractPrintableTextFromBinary(buffer);
      if (extractedBinaryText.length > 50) {
        warnings.push('Extracted text from legacy .doc binary format. Some formatting may be simplified.');
        return {
          text: extractedBinaryText,
          format: 'doc',
          warnings
        };
      }

      return {
        text: buffer.toString('utf-8', 0, Math.min(buffer.length, 100000)),
        format: 'doc',
        warnings: ['Legacy .doc format with minimal text. Please consider converting to .docx or .pdf for best results.']
      };
    }

    if (extension === 'txt') {
      const text = buffer.toString('utf-8').trim();
      return {
        text,
        format: 'txt',
        warnings
      };
    }

    // Default fallback
    const text = buffer.toString('utf-8').trim();
    return {
      text,
      format: 'unknown',
      warnings: ['Unrecognized file extension. Processed as raw text.']
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown parsing error';
    throw new Error(`Failed to extract text from ${filename}: ${errorMsg}`);
  }
}

/**
 * Extracts printable text blocks from legacy binary formats (.doc / Word OLE)
 */
function extractPrintableTextFromBinary(buffer: Buffer): string {
  // Extract ASCII chunks
  const asciiChunks: string[] = [];
  let currentChunk = '';

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    // Printable ASCII (32-126) + newline/tab
    if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
      currentChunk += String.fromCharCode(byte);
    } else {
      if (currentChunk.trim().length >= 4) {
        asciiChunks.push(currentChunk.trim());
      }
      currentChunk = '';
    }
  }

  if (currentChunk.trim().length >= 4) {
    asciiChunks.push(currentChunk.trim());
  }

  // Filter out internal metadata/junk strings common in OLE files
  const filtered = asciiChunks.filter(s => {
    if (s.includes('Microsoft') && s.length < 30) return false;
    if (s.includes('Root Entry') || s.includes('WordDocument') || s.includes('CompObj')) return false;
    return true;
  });

  return filtered.join('\n');
}

