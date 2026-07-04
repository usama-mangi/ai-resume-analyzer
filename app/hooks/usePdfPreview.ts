import type { ResumeExperience, ResumeEducation, ResumeSkill, ResumeProject } from "types";
import type { GeneratedResume } from "types";
import { useCallback, useState } from "react";

export function usePdfPreview() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = useCallback(async (content: GeneratedResume, title: string): Promise<Blob> => {
    setIsGenerating(true);
    try {
      const html = generateResumeHtml(content, title);
      const blob = await htmlToPdf(html);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return blob;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const cleanupPdf = useCallback(() => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [pdfUrl]);

  return {
    pdfUrl,
    isGeneratingPdf: isGenerating,
    generatePdf,
    cleanupPdf,
  };
}

function generateResumeHtml(content: GeneratedResume, title: string): string {
  const basics = content.basics || {};
  const experience = content.experience || [];
  const education = content.education || [];
  const skills = content.skills || [];
  const projects = content.projects || [];

  const escapeHtml = (str: string) => String(str)
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "&#039;");

  const formatDateRange = (start: string, end: string | null | undefined) => {
    const format = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };
    const startF = format(start);
    const endF = end ? format(end) : "Present";
    return `${startF} – ${endF}`;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 0.75in 0.6in; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #1f2937;
      background: white;
      margin: 0;
      padding: 0;
    }
    .container { max-width: 816px; margin: 0 auto; }
    .header {
      border-bottom: 2px solid #1f2937;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .name { font-size: 26pt; font-weight: 700; color: #111827; margin: 0 0 6px; letter-spacing: -0.02em; }
    .headline { font-size: 13pt; color: #4b5563; margin: 0; font-weight: 400; }
    .contact { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 10px; font-size: 10pt; color: #6b7280; }
    .contact a { color: #2563eb; text-decoration: none; }
    .contact a:hover { text-decoration: underline; }
    .contact span { color: #6b7280; }
    .section { margin-bottom: 24px; }
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #111827;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
      margin: 0 0 12px;
    }
    .experience-item { margin-bottom: 18px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; }
    .exp-title { font-weight: 600; font-size: 11.5pt; color: #111827; }
    .exp-company { font-weight: 400; color: #374151; }
    .exp-date { font-size: 9.5pt; color: #9ca3af; white-space: nowrap; }
    .exp-location { font-size: 9.5pt; color: #9ca3af; margin: 2px 0 4px; }
    .exp-description { font-size: 10pt; color: #374151; margin: 4px 0 6px; line-height: 1.6; }
    .exp-highlights { margin: 4px 0 0; padding-left: 18px; }
    .exp-highlights li { font-size: 10pt; color: #374151; margin: 2px 0; line-height: 1.5; }
    .education-item { margin-bottom: 14px; }
    .edu-degree { font-weight: 600; font-size: 11pt; color: #111827; }
    .edu-school { font-weight: 400; color: #4b5563; }
    .edu-meta { font-size: 9.5pt; color: #9ca3af; display: flex; gap: 16px; flex-wrap: wrap; margin-top: 4px; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { background: #f3f4f6; color: #374151; padding: 4px 10px; border-radius: 4px; font-size: 9.5pt; font-weight: 500; }
    .project-item { margin-bottom: 16px; }
    .proj-name { font-weight: 600; font-size: 11pt; color: #111827; }
    .proj-desc { font-size: 10pt; color: #374151; margin: 4px 0 0; line-height: 1.6; }
    .proj-tech { font-size: 9pt; color: #9ca3af; margin-top: 4px; }
    .proj-link { font-size: 9.5pt; color: #2563eb; text-decoration: none; margin-top: 4px; display: inline-block; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="name">${escapeHtml(basics.name || title)}</h1>
      ${basics.headline ? `<p class="headline">${escapeHtml(basics.headline)}</p>` : ""}
      <div class="contact">
        ${basics.email ? `<a href="mailto:${escapeHtml(basics.email)}">${escapeHtml(basics.email)}</a>` : ""}
        ${basics.phone ? `<span>${escapeHtml(basics.phone)}</span>` : ""}
        ${basics.location ? `<span>${escapeHtml(basics.location)}</span>` : ""}
        ${basics.linkedin ? `<a href="${escapeHtml(basics.linkedin)}" target="_blank">LinkedIn</a>` : ""}
        ${basics.github ? `<a href="${escapeHtml(basics.github)}" target="_blank">GitHub</a>` : ""}
        ${basics.website ? `<a href="${escapeHtml(basics.website)}" target="_blank">Website</a>` : ""}
      </div>
    </header>

    ${basics.summary ? `
    <section class="section">
      <h2 class="section-title">Summary</h2>
      <p style="font-size: 10pt; color: #374151; line-height: 1.6;">${escapeHtml(basics.summary)}</p>
    </section>
    ` : ""}

    ${experience.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Experience</h2>
      ${experience.map((exp: ResumeExperience) => `
      <article class="experience-item">
        <div class="exp-header">
          <div>
            <span class="exp-title">${escapeHtml(exp.title)}</span>
            ${exp.company ? `<span class="exp-company"> — ${escapeHtml(exp.company)}</span>` : ""}
          </div>
          <div class="exp-date">${formatDateRange(exp.startDate, exp.endDate)}</div>
        </div>
        ${exp.location ? `<div class="exp-location">${escapeHtml(exp.location)}</div>` : ""}
        ${exp.description ? `<p class="exp-description">${escapeHtml(exp.description)}</p>` : ""}
        ${exp.highlights && exp.highlights.length > 0 ? `
        <ul class="exp-highlights">
          ${exp.highlights.map((h: string) => `<li>${escapeHtml(h)}</li>`).join("")}
        </ul>
        ` : ""}
      </article>
      `).join("")}
    </section>
    ` : ""}

    ${education.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Education</h2>
      ${education.map((edu: ResumeEducation) => `
      <div class="education-item">
        <div class="edu-degree">${escapeHtml([edu.degree, edu.field].filter(Boolean).join(" in "))}</div>
        ${edu.school ? `<div class="edu-school">${escapeHtml(edu.school)}</div>` : ""}
        <div class="edu-meta">
          ${formatDateRange(edu.startDate || "", edu.endDate || "")}
          ${edu.gpa ? `· GPA: ${escapeHtml(edu.gpa)}` : ""}
        </div>
        ${edu.honors && edu.honors.length > 0 ? `<div style="font-size: 9.5pt; color: #6b7280; margin-top: 4px;">Honors: ${escapeHtml(edu.honors.join(", "))}</div>` : ""}
      </div>
      `).join("")}
    </section>
    ` : ""}

    ${skills.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        ${skills.map((skill: ResumeSkill | string) => `<span class="skill-tag">${escapeHtml(typeof skill === "string" ? skill : skill.name)}</span>`).join("")}
      </div>
    </section>
    ` : ""}

    ${projects.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Projects</h2>
      ${projects.map((proj: ResumeProject) => `
      <article class="project-item">
        <div class="proj-name">${escapeHtml(proj.name)}</div>
        ${proj.description ? `<p class="proj-desc">${escapeHtml(proj.description)}</p>` : ""}
        ${proj.technologies && proj.technologies.length > 0 ? `<div class="proj-tech">Tech: ${escapeHtml(proj.technologies.join(", "))}</div>` : ""}
        ${proj.url ? `<a href="${escapeHtml(proj.url)}" class="proj-link" target="_blank">View Project →</a>` : ""}
      </article>
      `).join("")}
    </section>
    ` : ""}
  </div>
</body>
</html>
  `;
}

async function htmlToPdf(html: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position: absolute; left: -9999px; top: -9999px; width: 0; height: 0; border: none;";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      reject(new Error("Could not create iframe document"));
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    const checkLoaded = () => {
      if (doc.readyState === "complete") {
        // Trigger browser print dialog — user can save as PDF
        iframe.contentWindow?.print();
        // Return empty blob since the download happens via print dialog
        const blob = new Blob([], { type: "application/pdf" });
        document.body.removeChild(iframe);
        resolve(blob);
      } else {
        setTimeout(checkLoaded, 50);
      }
    };
    checkLoaded();
  });
}
