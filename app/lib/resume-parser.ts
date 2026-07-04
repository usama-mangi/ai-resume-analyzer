import mammoth from "mammoth";
import JSZip from "jszip";

// Type definitions for pdfjs-dist (lazy-loaded)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PDFJSStatic = any;

export type ResumeFormat = "pdf" | "docx" | "txt" | "html" | "linkedin";

// Lazy-load pdfjs-dist for PDF text extraction
let pdfjsLib: PDFJSStatic | null = null;
let pdfjsLoading = false;
let pdfjsLoadPromise: Promise<PDFJSStatic> | null = null;

async function loadPdfJs(): Promise<PDFJSStatic> {
  if (pdfjsLib) return pdfjsLib;
  if (pdfjsLoadPromise) return pdfjsLoadPromise;

  pdfjsLoading = true;
  pdfjsLoadPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsLib = lib;
    pdfjsLoading = false;
    return lib;
  });

  return pdfjsLoadPromise;
}

export interface ResumeParseResult {
  text: string;
  html?: string;
  preview: string;
}

const FORMAT_LABELS: Record<ResumeFormat, string> = {
  pdf: "PDF",
  docx: "DOCX",
  txt: "TXT",
  html: "HTML",
  linkedin: "LinkedIn",
};

export function getFormatLabel(format: ResumeFormat): string {
  return FORMAT_LABELS[format];
}

export function detectFormat(file: File): ResumeFormat | null {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".txt")) return "txt";
  if (name.endsWith(".html") || name.endsWith(".htm")) return "html";
  if (name.endsWith(".zip")) return "linkedin";

  return null;
}

const ACCEPTED_MIME_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
  "text/html": [".html", ".htm"],
  "application/zip": [".zip"],
};

export function getAcceptTypes(): Record<string, string[]> {
  return ACCEPTED_MIME_TYPES;
}

export function getMaxFileSize(): number {
  return 20 * 1024 * 1024; // 20 MB
}

function extractTextFromHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  // Remove script and style elements
  const scripts = doc.querySelectorAll("script, style, nav, header, footer");
  scripts.forEach((el) => el.remove());

  const body = doc.body || doc.documentElement;
  return body.textContent?.replace(/\s+/g, " ").trim() || "";
}

async function parseDocx(file: File): Promise<ResumeParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;
  const text = extractTextFromHtml(html);
  const preview = text.slice(0, 500);

  return { text, html, preview };
}

async function parseTxt(file: File): Promise<ResumeParseResult> {
  const text = await file.text();
  const preview = text.slice(0, 500);

  return { text, preview };
}

async function parseHtml(file: File): Promise<ResumeParseResult> {
  const html = await file.text();
  const text = extractTextFromHtml(html);
  const preview = text.slice(0, 500);

  return { text, html, preview };
}

async function parsePdf(file: File): Promise<ResumeParseResult> {
  const lib = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: { str: string }) => item.str).join(" ");
    pages.push(text);
  }

  const text = pages.join("\n\n").replace(/\s+/g, " ").trim();
  const preview = text.slice(0, 500);

  return { text, preview };
}

async function parseLinkedInZip(file: File): Promise<ResumeParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // LinkedIn exports contain various HTML files. Try to find the profile HTML.
  // Common patterns: "Profile.html", "profile.html", or any HTML file in the root
  const htmlFiles = Object.keys(zip.files).filter(
    (name) =>
      name.endsWith(".html") &&
      !name.startsWith("__") &&
      !name.includes("/") &&
      (name.toLowerCase().includes("profile") || true),
  );

  // Sort by name so "Profile.html" is preferred
  htmlFiles.sort();

  if (htmlFiles.length === 0) {
    throw new Error(
      "No HTML files found in LinkedIn export. Expected a profile HTML file.",
    );
  }

  const htmlContent = await zip.files[htmlFiles[0]].async("string");
  const text = extractTextFromHtml(htmlContent);
  const preview = text.slice(0, 500);

  return { text, html: htmlContent, preview };
}

export async function parseResume(file: File): Promise<{
  format: ResumeFormat;
  result: ResumeParseResult;
}> {
  const format = detectFormat(file);
  if (!format) throw new Error(`Unsupported file format: ${file.name}`);

  switch (format) {
    case "pdf":
      return { format, result: await parsePdf(file) };
    case "docx":
      return { format, result: await parseDocx(file) };
    case "txt":
      return { format, result: await parseTxt(file) };
    case "html":
      return { format, result: await parseHtml(file) };
    case "linkedin":
      return { format, result: await parseLinkedInZip(file) };
  }
}
