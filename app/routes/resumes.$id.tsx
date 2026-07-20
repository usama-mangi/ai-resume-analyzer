import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSession } from "~/lib/auth-store";
import { api, getUploadUrl } from "~/lib/api";
import { normalizeFeedback } from "~/lib/utils";
import { PageShell, Button, useToastHelpers, CategoryScore, ScoreBadge } from "~/components/ui";
import { ResumePreview } from "~/components/ResumePreview";
import pdfMake from "pdfmake/build/pdfmake";
import pdfMakeVfsFonts from "pdfmake/build/vfs_fonts";
// @ts-ignore
import timesFont from "pdfmake/build/standard-fonts/Times";
import type {
  Resume,
  ResumeVersion,
  Feedback,
  GeneratedResume,
  UserProfile,
  Job,
  TailoredResumeResult,
  ResumeLanguage,
} from "types";

export const meta = () => [
  { title: "Resumind | Resume View" },
  { name: "description", content: "View your resume" },
];

const EDIT_ICON = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export default function Resume() {
  const { id } = useParams();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const [resume, setResume] = useState<Resume | null>(null);
  const [resumeVersion, setResumeVersion] = useState<ResumeVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedResume | null>(null);
  const [textContent, setTextContent] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [sharingLoading, setSharingLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [tipFeedback, setTipFeedback] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();
  const { success: toastSuccess } = useToastHelpers();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadResume = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch resume
        const resumeData: Resume = await api.resumes.get(id);
        setResume(resumeData);

        // Get versions
        try {
          const versions: ResumeVersion[] = await api.resumes.getResumeVersions(id);
          const primaryVersion = versions.find((v) => v.isPrimary) || versions[0] || null;
          if (primaryVersion) {
            setResumeVersion(primaryVersion);
          }
        } catch {}

        // Load profile for contact info
        try {
          const profileData = await api.profile.get();
          setUserProfile({
            id: "", userId: "",
            name: profileData.user?.name,
            headline: profileData.user?.headline,
            email: profileData.user?.email,
            phone: profileData.user?.phone,
            location: profileData.user?.location,
            linkedinUrl: profileData.user?.linkedinUrl,
            githubUrl: profileData.user?.githubUrl,
            websiteUrl: profileData.user?.websiteUrl,
            education: [], experience: [], projects: [], skills: [],
            certifications: [], languages: [], onboardingCompleted: false,
            onboardingStep: 0, completionPercentage: 0, createdAt: "", updatedAt: "",
          } as UserProfile);
        } catch {}

        // Load generated content
        if (resumeData.jobDescription) {
          try {
            const generated: TailoredResumeResult | null = await api.resumes.getTailoredResume(id).catch(() => null);
            if (generated?.tailoredResume) {
              // Normalize tailored resume format to standard resume format
              const tr = generated.tailoredResume;
              const normalized: GeneratedResume = {
                ...tr,
                skills: Array.isArray(tr.skills)
                  ? tr.skills.map((s) => (typeof s === "string" ? { name: s } : s))
                  : tr.skills,
                experience: Array.isArray(tr.experience)
                  ? tr.experience.map((e) => ({ ...e, highlights: e.highlights || e.bullets || [] }))
                  : tr.experience,
                projects: Array.isArray(tr.projects)
                  ? tr.projects.map((p) => ({ ...p, highlights: p.highlights || p.bullets || [] }))
                  : tr.projects,
              };
              setGeneratedContent(normalized);
              setTextContent(generated.textContent || "");
              setIsGenerated(true);
              // Use the jobId stored in the tailored resume result to fetch the correct job title
              const storedJobId = generated.jobId;
              let title = tr.basics?.headline || resumeData.jobTitle || "";
              if (storedJobId) {
                try {
                  const jobData: Job = await api.jobs.get(storedJobId);
                  if (jobData?.title) title = jobData.title;
                } catch {}
              }
              setResumeTitle(title);
            }
          } catch {}
        }

        // Load PDF/image URLs
        if (resumeData.imagePath) {
          try {
            const url = getUploadUrl(resumeData.imagePath);
            setImageUrl(url);
          } catch {}
        }
        if (resumeData.filePath) {
          try {
            const url = getUploadUrl(resumeData.filePath);
            setResumeUrl(url);
          } catch {}
        }

        // Load feedback
        try {
          const fb: any = await api.resumes.analyze(id);
          setFeedback(normalizeFeedback(fb));
        } catch {}

        // Load tip feedback
        try {
          const savedTipFeedback: any = await api.resumes.getTipFeedback(id);
          const feedbackMap: Record<string, boolean> = {};
          if (savedTipFeedback && typeof savedTipFeedback === "object") {
            Object.entries(savedTipFeedback).forEach(([key, value]) => {
              if (typeof value === "boolean") feedbackMap[key] = value;
            });
          }
          setTipFeedback(feedbackMap);
        } catch {}

        // Generate share URL
        try {
          const share: any = await api.resumes.generateShareLink(id);
          if (share.token) {
            setShareUrl(`${window.location.origin}/share/${share.token}`);
          } else if (share.shareUrl) {
            setShareUrl(share.shareUrl);
          }
        } catch {}
      } catch (err) {
        console.error("Failed to load resume:", err);
        setError("Failed to load resume. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, [id]);

  const handleExportPDF = async () => {
    if (!displayContent) return;
    setIsExporting(true);
    try {
      // Register Times serif font with all style variants
      pdfMake.fonts = {
        Times: {
          normal: "Times-Roman",
          bold: "Times-Bold",
          italics: "Times-Italic",
          bolditalics: "Times-BoldItalic",
        },
      };
      const docDefinition = buildPdfDefinition(displayContent, displayTitle || "Resume", userProfile);
      pdfMake.createPdf(docDefinition).download(`${(displayTitle || "resume").replace(/[^a-zA-Z0-9]+/g, "-").replace(/-+$/, "")}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
    setIsExporting(false);
  };

  const handleShare = async () => {
    if (!id) return;
    try {
      setSharingLoading(true);
      const res = await api.resumes.generateShareLink(id);
      setShareUrl(`${window.location.origin}/share/${res.shareToken}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setSharingLoading(false);
    }
  };

  const handleRate = async (tipId: string, helpful: boolean) => {
    if (!id) return;
    try {
      await api.resumes.saveTipFeedback(id, { [tipId]: helpful ? "up" : "down" });
      setTipFeedback((prev) => ({ ...prev, [tipId]: helpful }));
    } catch (err) {
      console.error("Failed to rate tip:", err);
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-500 border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium">{error}</div>
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </PageShell>
    );
  }

  if (!resume) {
    return (
      <PageShell>
        <div className="text-center py-12">
          <div className="text-gray-500">Resume not found</div>
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </PageShell>
    );
  }

  const displayContent = resumeVersion?.content || generatedContent;
  const displayTitle = resumeVersion?.name || resumeTitle || resume.jobTitle;
  const isAiGenerated = !resumeVersion && generatedContent;

  const handleShareClick = async () => {
    if (!id) return;
    try {
      setSharingLoading(true);
      if (!shareUrl) {
        const res = await api.resumes.generateShareLink(id);
        const url = `${window.location.origin}/share/${res.shareToken}`;
        setShareUrl(url);
        await navigator.clipboard.writeText(url);
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      setShareCopied(true);
      toastSuccess("Copied", "Share link copied to clipboard");
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setSharingLoading(false);
    }
  };

  return (
    <PageShell maxWidth="2xl" padding="lg">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{displayTitle}</h1>
          <p className="mt-1 text-sm text-gray-500 flex items-center gap-2 flex-wrap">
            <span className="truncate">{resume.companyName ? `Target: ${resume.companyName}` : "General Resume"}</span>
            {resumeVersion && <span className="shrink-0 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Saved Version</span>}
            {isAiGenerated && <span className="shrink-0 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">AI Generated</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {resumeUrl && (
            <Link
              to={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View Original PDF"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
          )}

          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={isExporting}
            title="Download PDF"
            className="p-2"
          >
            {isExporting ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleShareClick}
            disabled={sharingLoading}
            title="Share"
            className="p-2"
          >
            {shareCopied ? (
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </Button>

          <Link
            to={`/resumes/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            {EDIT_ICON}
            Edit Resume
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Resume Preview */}
        <div className="lg:col-span-9">
          <div id="resume-preview" className="bg-white border border-gray-200 shadow-sm overflow-hidden p-8 md:p-10 lg:p-12">
            {displayContent && (
              <ResumePreview
                content={displayContent}
                profile={userProfile}
                resumeTitle={displayTitle || ""}
                companyName={resume.companyName || undefined}
              />
            )}

            {!displayContent && (
              <div className="py-16 text-center text-gray-500">
                <p className="text-sm">No resume content available</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* ATS Analysis */}
          {feedback && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">ATS Analysis</h3>
              <div className="space-y-4">
                <CategoryScore label="Overall" score={feedback.overallScore} showBar={false} />
                <CategoryScore label="Keywords" score={feedback.keywordMatchScore ?? 0} showBar={false} />
                <CategoryScore label="Format" score={feedback.formatScore ?? 0} showBar={false} />
              </div>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('ats-details')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-4 block text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                View details ↓
              </Link>
            </div>
          )}

          {/* Resume Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Resume Info</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 mb-0.5">Target Role</dt>
                <dd className="font-medium text-gray-900 break-words">{displayTitle}</dd>
              </div>
              {resume.companyName && (
                <div>
                  <dt className="text-gray-500 mb-0.5">Target Company</dt>
                  <dd className="font-medium text-gray-900 break-words">{resume.companyName}</dd>
                </div>
              )}
              {resumeVersion && (
                <div>
                  <dt className="text-gray-500 mb-0.5">Version</dt>
                  <dd className="font-medium text-gray-900">{resumeVersion.name}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500 mb-0.5">Uploaded</dt>
                <dd className="font-medium text-gray-900">{new Date(resume.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          {/* Original File */}
          {resumeUrl && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Original File</h3>
              <Link
                to={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Original {(resume.format || "").toUpperCase()}
              </Link>
            </div>
          )}
        </aside>
      </div>

      {/* Detailed ATS Feedback */}
      {feedback && (feedback.strengths?.length || feedback.weaknesses?.length || feedback.suggestions?.length) ? (
        <div id="ats-details" className="mt-12 animate-in fade-in duration-1000">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">ATS Analysis Details</h2>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <CategoryScore label="Overall Score" score={feedback.overallScore} />
            <CategoryScore label="Keyword Match" score={feedback.keywordMatchScore ?? 0} />
            <CategoryScore label="Format Score" score={feedback.formatScore ?? 0} />
          </div>

          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Strengths</h3>
              <ul className="space-y-2">
                {(feedback.strengths ?? []).map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.weaknesses && feedback.weaknesses.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Areas to Improve</h3>
              <ul className="space-y-2">
                {(feedback.weaknesses ?? []).map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.suggestions && feedback.suggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Suggestions</h3>
              <ul className="space-y-3">
                {(feedback.suggestions ?? []).map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{s}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleRate(`${id}-suggestion-${i}`, true)}
                          className={`text-xs px-2 py-1 rounded ${
                            tipFeedback[`${id}-suggestion-${i}`] === true
                              ? "bg-green-100 text-green-700"
                              : "bg-white text-gray-600 hover:bg-gray-100"
                          }`}
                          disabled={tipFeedback[`${id}-suggestion-${i}`] !== undefined}
                        >
                          👍 Helpful
                        </button>
                        <button
                          onClick={() => handleRate(`${id}-suggestion-${i}`, false)}
                          className={`text-xs px-2 py-1 rounded ${
                            tipFeedback[`${id}-suggestion-${i}`] === false
                              ? "bg-red-100 text-red-700"
                              : "bg-white text-gray-600 hover:bg-gray-100"
                          }`}
                          disabled={tipFeedback[`${id}-suggestion-${i}`] !== undefined}
                        >
                          👎 Not Helpful
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </PageShell>
  );
}

function buildPdfDefinition(content: GeneratedResume, title: string, profile: UserProfile | null): any {
  const name = content.basics?.name || profile?.name || title;
  const headline = content.basics?.headline || profile?.headline || "";
  const email = content.basics?.email || profile?.email || "";
  const phone = content.basics?.phone || profile?.phone || "";
  const location = content.basics?.location || profile?.location || "";
  const linkedin = content.basics?.linkedin || profile?.linkedinUrl || "";
  const github = content.basics?.github || profile?.githubUrl || "";
  const website = content.basics?.website || profile?.websiteUrl || "";
  const summary = content.basics?.summary || "";
  const experience = content.experience || [];
  const education = content.education || [];
  const skills = content.skills || [];
  const projects = content.projects || [];
  const certifications = content.certifications || [];
  const languages = content.languages || [];
  const awards = content.awards || [];
  const publications = content.publications || [];
  const volunteer = content.volunteer || [];
  const references = content.references || [];
  const customSections = content.customSections || [];

  // Matching HTML: font-[Georgia,Times,serif] → Times (serif built-in)
  const F = "Times";
  // HTML CSS px → PDF pt: multiply by 0.75, but pdfmake renders slightly smaller so we nudge up
  const NAME = 17;            // HTML 22px
  const HL = 9;               // HTML 11px
  const CONTACT = 8;          // HTML 10px
  const SECTION = 10;         // HTML 13px
  const BODY = 9;             // HTML 11px
  const ITEM_TITLE = 10;      // HTML 12px
  const DATE = 8;             // HTML 10px
  const SMALL = 8;            // HTML 10px (technologies etc.)

  // Tailwind gray scale colors matching ResumePreview.tsx
  const C800 = "#1f2937";     // text-gray-800
  const C700 = "#374151";     // text-gray-700
  const C600 = "#4b5563";     // text-gray-600
  const C500 = "#6b7280";     // text-gray-500

  const fmtDate = (d: string) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  const formatDate = fmtDate;
  const fmtRange = (s: string, e?: string, cur?: boolean) => {
    const start = fmtDate(s);
    let end = cur ? "Present" : fmtDate(e || "");
    if (start && !end) end = "Present";
    if (!start && !end) return "";
    return `${start} – ${end}`;
  };

  // Section heading matching HTML SectionHeading:
  // text-[13px] font-bold text-black uppercase tracking-wide border-b border-black pb-1 mb-3 mt-5
  const section = (text: string): any => ({
    table: {
      widths: ["*"],
      body: [[{ text: text.toUpperCase(), bold: true, fontSize: SECTION, font: F, color: "#000000" }]],
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0,
      paddingBottom: () => 3,
    },
    margin: [0, 14, 0, 6],
  });

  const body: any[] = [];

  // ── Name ──
  body.push({
    text: name.toUpperCase(),
    fontSize: NAME,
    bold: true,
    font: F,
    characterSpacing: 1,
    alignment: "center",
    margin: [0, 0, 0, 2],
  });

  // ── Headline ──
  if (headline) {
    body.push({
      text: headline,
      fontSize: HL,
      font: F,
      color: C700,
      alignment: "center",
      margin: [0, 0, 0, 4],
    });
  }

  // ── Contact line ──
  const contactItems: Array<{ text: string; link?: string }> = [];
  if (location) contactItems.push({ text: location });
  if (phone) contactItems.push({ text: phone, link: `tel:${phone}` });
  if (email) contactItems.push({ text: email, link: `mailto:${email}` });
  if (linkedin) contactItems.push({ text: linkedin.replace(/^https?:\/\//, ""), link: linkedin.startsWith("http") ? linkedin : `https://${linkedin}` });
  if (github) contactItems.push({ text: github.replace(/^https?:\/\//, ""), link: github.startsWith("http") ? github : `https://${github}` });
  if (website) contactItems.push({ text: website.replace(/^https?:\/\//, ""), link: website.startsWith("http") ? website : `https://${website}` });

  if (contactItems.length) {
    const contactText: any[] = [];
    contactItems.forEach((item, i) => {
      if (i > 0) contactText.push({ text: "  |  ", fontSize: CONTACT, font: F, color: C600 });
      if (item.link) {
        contactText.push({ text: item.text, fontSize: CONTACT, font: F, color: C600, link: item.link });
      } else {
        contactText.push({ text: item.text, fontSize: CONTACT, font: F, color: C600 });
      }
    });
    body.push({ text: contactText, alignment: "center", margin: [0, 0, 0, 10] } as any);
  }

  // ── Summary ──
  if (summary) {
    body.push(section("Professional Summary"));
    body.push({ text: summary, fontSize: BODY, font: F, lineHeight: 1.6, color: C800, margin: [0, 0, 0, 4] });
  }

  // ── Experience ──
  if (experience.length) {
    body.push(section("Professional Experience"));
    for (const exp of experience) {
      const dateRange = fmtRange(exp.startDate, exp.endDate, exp.current);
      const titleParts: any[] = [
        { text: exp.title, fontSize: ITEM_TITLE, bold: true, font: F, color: "#000000" },
      ];
      if (exp.company) titleParts.push({ text: `, ${exp.company}`, fontSize: ITEM_TITLE, font: F, color: C700 });
      if (exp.location) titleParts.push({ text: ` — ${exp.location}`, fontSize: ITEM_TITLE, font: F, color: C500 });

      body.push({
        columns: [
          { text: titleParts, width: "*" },
          ...(dateRange ? [{ text: dateRange, width: "auto", fontSize: DATE, font: F, color: C500, alignment: "right" }] : []),
        ],
        margin: [0, 4, 0, 2],
      } as any);

      if (exp.description) {
        body.push({ text: exp.description, fontSize: BODY, font: F, lineHeight: 1.6, color: C800, margin: [0, 1, 0, 2] });
      }

      const bullets = exp.highlights || exp.bullets || [];
      const validBullets = bullets.filter(Boolean);
      if (validBullets.length) {
        body.push({
          ul: validBullets.map((b: string) => ({ text: b, fontSize: BODY, font: F, lineHeight: 1.6, color: C800 })),
          margin: [8, 1, 0, 4],
          listType: "bullet",
        } as any);
      }

      if (exp.technologies && exp.technologies.length > 0) {
        body.push({
          text: [
            { text: "Technologies: ", fontSize: SMALL, font: F, bold: true, color: C500 },
            { text: exp.technologies.join(", "), fontSize: SMALL, font: F, color: C500 },
          ],
          margin: [0, 1, 0, 4],
        });
      }
    }
  }

  // ── Education ──
  if (education.length) {
    body.push(section("Education"));
    for (const edu of education) {
      const dateRange = fmtRange(edu.startDate || "", edu.endDate || "");
      const titleParts: any[] = [
        { text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, fontSize: ITEM_TITLE, bold: true, font: F, color: "#000000" },
      ];
      if (edu.school) titleParts.push({ text: `, ${edu.school}`, fontSize: ITEM_TITLE, font: F, color: C700 });
      if (edu.location) titleParts.push({ text: ` — ${edu.location}`, fontSize: ITEM_TITLE, font: F, color: C500 });

      body.push({
        columns: [
          { text: titleParts, width: "*" },
          ...(dateRange ? [{ text: dateRange, width: "auto", fontSize: DATE, font: F, color: C500, alignment: "right" }] : []),
        ],
        margin: [0, 4, 0, 2],
      });

      const details: any[] = [];
      if (edu.gpa) details.push({ text: `GPA: ${edu.gpa}`, fontSize: BODY, font: F, color: C600 });
      if (edu.honors?.length) {
        if (details.length) details.push({ text: "  |  ", fontSize: BODY, font: F, color: C600 });
        details.push({ text: `Honors: ${edu.honors.join(", ")}`, fontSize: BODY, font: F, color: C600 });
      }
      if (edu.coursework?.length) {
        if (details.length) details.push({ text: "  |  ", fontSize: BODY, font: F, color: C600 });
        details.push({ text: `Relevant Coursework: ${edu.coursework.join(", ")}`, fontSize: BODY, font: F, color: C600 });
      }
      if (details.length) {
        body.push({ text: details, margin: [8, 0, 0, 2] });
      }
    }
  }

  // ── Skills ──
  if (skills.length) {
    body.push(section("Skills"));
    const categorized: Record<string, string[]> = {};
    for (const s of skills) {
      const n = typeof s === "string" ? s : s.name;
      if (!n) continue;
      const cat = (typeof s === "object" && s.category) || "Technical Skills";
      if (!categorized[cat]) categorized[cat] = [];
      categorized[cat].push(n);
    }
    for (const [cat, names] of Object.entries(categorized)) {
      body.push({
        text: [
          { text: `${cat}: `, bold: true, fontSize: BODY, font: F, color: C800 },
          { text: names.join(", "), fontSize: BODY, font: F, color: C800 },
        ],
        margin: [0, 0, 0, 2],
      });
    }
  }

  // ── Projects ──
  if (projects.length) {
    body.push(section("Projects"));
    for (const proj of projects) {
      const dateRange = fmtRange(proj.startDate || "", proj.endDate || "");
      const titleParts: any[] = [
        { text: proj.name, fontSize: ITEM_TITLE, bold: true, font: F, color: "#000000" },
      ];
      if (proj.url) titleParts.push({ text: ` (${proj.url.replace(/^https?:\/\//, "")})`, fontSize: DATE, font: F, color: C500 });

      body.push({
        columns: [
          { text: titleParts, width: "*" },
          ...(dateRange ? [{ text: dateRange, width: "auto", fontSize: DATE, font: F, color: C500, alignment: "right" }] : []),
        ],
        margin: [0, 4, 0, 2],
      });

      if (proj.description) {
        body.push({ text: proj.description, fontSize: BODY, font: F, lineHeight: 1.6, color: C800, margin: [0, 1, 0, 2] });
      }

      const projBullets = proj.highlights || proj.bullets || [];
      const validBullets = projBullets.filter(Boolean);
      if (validBullets.length) {
        body.push({
          ul: validBullets.map((b: string) => ({ text: b, fontSize: BODY, font: F, lineHeight: 1.6, color: C800 })),
          margin: [8, 1, 0, 2],
          listType: "bullet",
        });
      }

      if (proj.technologies && proj.technologies.length > 0) {
        body.push({
          text: [
            { text: "Technologies: ", fontSize: SMALL, font: F, bold: true, color: C500 },
            { text: proj.technologies.join(", "), fontSize: SMALL, font: F, color: C500 },
          ],
          margin: [0, 1, 0, 4],
        });
      }
    }
  }

  // ── Certifications ──
  if (certifications.length) {
    body.push(section("Certifications"));
    for (const cert of certifications) {
      const titleParts: any[] = [
        { text: cert.name, fontSize: BODY, bold: true, font: F, color: "#000000" },
        { text: ` — ${cert.issuer}`, fontSize: BODY, font: F, color: C600 },
      ];
      body.push({
        columns: [
          { text: titleParts, width: "*" },
          { text: formatDate(cert.date || ""), width: "auto", fontSize: DATE, font: F, color: C500, alignment: "right" },
        ],
        margin: [0, 2, 0, 2],
      });
    }
  }

  // ── Languages ──
  if (languages.length) {
    body.push(section("Languages"));
    body.push({
      text: languages.map((l: ResumeLanguage) => `${l.name} (${l.proficiency})`).join(", "),
      fontSize: BODY,
      font: F,
      color: C800,
      margin: [0, 0, 0, 4],
    });
  }

  // ── Awards ──
  if (awards.length) {
    body.push(section("Awards & Honors"));
    for (const award of awards) {
      const titleParts: any[] = [
        { text: award.title, fontSize: BODY, bold: true, font: F, color: "#000000" },
      ];
      if (award.issuer) titleParts.push({ text: ` — ${award.issuer}`, fontSize: BODY, font: F, color: C600 });
      body.push({
        columns: [
          { text: titleParts, width: "*" },
          { text: formatDate(award.date || ""), width: "auto", fontSize: DATE, font: F, color: C500, alignment: "right" },
        ],
        margin: [0, 2, 0, 2],
      });
    }
  }

  // ── Publications ──
  if (publications.length) {
    body.push(section("Publications"));
    for (const pub of publications) {
      const titleParts: any[] = [
        { text: `“${pub.title}”`, fontSize: BODY, italics: true, font: F, color: C800 },
      ];
      if (pub.publisher) titleParts.push({ text: ` — ${pub.publisher}`, fontSize: BODY, font: F, color: C600 });
      body.push({
        columns: [
          { text: titleParts, width: "*" },
          { text: formatDate(pub.date || ""), width: "auto", fontSize: DATE, font: F, color: C500, alignment: "right" },
        ],
        margin: [0, 2, 0, 2],
      });
    }
  }

  // ── Volunteer ──
  if (volunteer.length) {
    body.push(section("Volunteer Experience"));
    for (const vol of volunteer) {
      const dateRange = fmtRange(vol.startDate || "", vol.endDate || "");
      body.push({
        columns: [
          {
            text: [
              { text: vol.role || "Volunteer", fontSize: ITEM_TITLE, bold: true, font: F, color: "#000000" },
              { text: `, ${vol.organization}`, fontSize: ITEM_TITLE, font: F, color: C700 },
            ],
            width: "*",
          },
          ...(dateRange ? [{ text: dateRange, width: "auto", fontSize: DATE, font: F, color: C500, alignment: "right" }] : []),
        ],
        margin: [0, 4, 0, 2],
      });

      if (vol.description) {
        body.push({ text: vol.description, fontSize: BODY, font: F, lineHeight: 1.6, color: C800, margin: [0, 1, 0, 2] });
      }

      if (vol.highlights && vol.highlights.length) {
        body.push({
          ul: vol.highlights.map((h: string) => ({ text: h, fontSize: BODY, font: F, lineHeight: 1.6, color: C800 })),
          margin: [8, 1, 0, 4],
          listType: "bullet",
        });
      }
    }
  }

  // ── References ──
  if (references.length) {
    body.push(section("References"));
    for (const ref of references) {
      const parts: any[] = [
        { text: `${ref.name}, ${ref.title}, ${ref.company}`, fontSize: BODY, font: F, color: C800 },
      ];
      if (ref.email) parts.push({ text: ` — ${ref.email}`, fontSize: BODY, font: F, color: C500 });
      body.push({ text: parts, margin: [0, 2, 0, 2] });
    }
  }

  // ── Custom Sections ──
  if (customSections.length) {
    for (const cs of customSections) {
      body.push(section(cs.title || "Custom Section"));
      const lines = (cs.content || "").split("\n").filter(Boolean);
      for (const line of lines) {
        body.push({ text: line, fontSize: BODY, font: F, lineHeight: 1.6, color: C800, margin: [0, 0, 0, 2] });
      }
    }
  }

  return {
    content: body,
    defaultStyle: { font: F, fontSize: BODY },
    pageMargins: [36, 36, 36, 36],
  };
}
