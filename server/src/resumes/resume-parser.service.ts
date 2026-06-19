import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as JSZip from 'jszip';

export type ResumeFormat = 'pdf' | 'docx' | 'txt' | 'html' | 'linkedin';

export interface ResumeParseResult {
  text: string;
  format: ResumeFormat;
  preview: string;
}

@Injectable()
export class ResumeParserService {
  private readonly MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  private readonly allowedMimeTypes: Record<ResumeFormat, string[]> = {
    pdf: ['application/pdf'],
    docx: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    txt: ['text/plain'],
    html: ['text/html'],
    linkedin: ['application/zip', 'application/x-zip-compressed'],
  };

  validateFile(buffer: Buffer, mimetype: string): ResumeFormat {
    for (const [format, mimes] of Object.entries(this.allowedMimeTypes)) {
      if (mimes.includes(mimetype)) return format as ResumeFormat;
    }
    throw new Error(
      `Unsupported file type: ${mimetype}. Accepted: PDF, DOCX, TXT, HTML, LinkedIn export (ZIP)`,
    );
  }

  async parse(buffer: Buffer, format: ResumeFormat): Promise<ResumeParseResult> {
    switch (format) {
      case 'pdf':
        return this.parsePdf(buffer);
      case 'docx':
        return this.parseDocx(buffer);
      case 'txt':
        return this.parseTxt(buffer);
      case 'html':
        return this.parseHtml(buffer);
      case 'linkedin':
        return this.parseLinkedIn(buffer);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async parsePdf(buffer: Buffer): Promise<ResumeParseResult> {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(buffer);
    const doc = await pdfjsLib.getDocument({ data }).promise;

    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => item.str)
        .join(' ');
      pages.push(text);
    }

    const fullText = pages.join('\n\n');
    return {
      text: fullText,
      format: 'pdf',
      preview: fullText.substring(0, 500),
    };
  }

  private async parseDocx(buffer: Buffer): Promise<ResumeParseResult> {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;
    return {
      text,
      format: 'docx',
      preview: text.substring(0, 500),
    };
  }

  private async parseTxt(buffer: Buffer): Promise<ResumeParseResult> {
    const text = buffer.toString('utf-8');
    return {
      text,
      format: 'txt',
      preview: text.substring(0, 500),
    };
  }

  private async parseHtml(buffer: Buffer): Promise<ResumeParseResult> {
    const html = buffer.toString('utf-8');
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM(html);
    const text = dom.window.document.body?.textContent || '';
    return {
      text: text.trim(),
      format: 'html',
      preview: text.trim().substring(0, 500),
    };
  }

  private async parseLinkedIn(buffer: Buffer): Promise<ResumeParseResult> {
    const zip = await JSZip.loadAsync(buffer);
    const profileFile = zip.file(/profile\.html/i)[0];
    if (!profileFile) {
      throw new Error('No profile.html found in LinkedIn export ZIP');
    }

    const html = await profileFile.async('string');
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM(html);
    const text = dom.window.document.body?.textContent || '';

    return {
      text: text.trim(),
      format: 'linkedin',
      preview: text.trim().substring(0, 500),
    };
  }
}