import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { getUploadUrl } from "~/lib/api";
import { getFormatLabel } from "~/lib/resume-parser";
import { ScoreCircle, Card, Button } from "~/components/ui";
import type { ResumeFormat } from "types";

type ApplicationStatus =
  | "not_applied"
  | "applied"
  | "phone_screen"
  | "interviewing"
  | "offer"
  | "rejected"
  | "accepted"
  | "withdrawn";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string }
> = {
  not_applied: { label: "Not Applied", color: "text-gray-600", bgColor: "bg-gray-100" },
  applied: { label: "Applied", color: "text-primary-600", bgColor: "bg-primary-50" },
  phone_screen: { label: "Phone Screen", color: "text-purple-600", bgColor: "bg-purple-50" },
  interviewing: { label: "Interviewing", color: "text-warning", bgColor: "bg-warning-light" },
  offer: { label: "Offer", color: "text-success", bgColor: "bg-success-light" },
  rejected: { label: "Rejected", color: "text-danger", bgColor: "bg-danger-light" },
  accepted: { label: "Accepted", color: "text-success", bgColor: "bg-success-light" },
  withdrawn: { label: "Withdrawn", color: "text-gray-400", bgColor: "bg-gray-100" },
};

function StatusBadge({
  status,
  id,
  onStatusChange,
}: {
  status: string;
  id: string;
  onStatusChange?: (id: string, status: ApplicationStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = STATUS_CONFIG[(status as ApplicationStatus) ?? "not_applied"] ?? STATUS_CONFIG.not_applied;

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen((o) => !o);
  }

  function handleSelect(e: React.MouseEvent, value: ApplicationStatus) {
    e.preventDefault();
    e.stopPropagation();
    onStatusChange?.(id, value);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={`text-xs font-semibold rounded-full ${current.color}`}
      >
        {current.label}
      </Button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-30 min-w-[160px] py-1 animate-in fade-in duration-150">
          {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, { label: string; color: string; bgColor: string }][]).map(
            ([value, { label, bgColor }]) => (
              <button
                key={value}
                onClick={(e) => handleSelect(e, value)}
                className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
              >
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bgColor} ${STATUS_CONFIG[value].color}`}>
                  {label}
                </span>
                {value === status && <span className="ml-auto text-gray-400 text-xs">✓</span>}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

const FORMAT_BADGE_COLORS: Record<string, string> = {
  pdf: "bg-badge-green text-badge-green-text",
  docx: "bg-badge-blue text-badge-blue-text",
  txt: "bg-badge-yellow text-badge-yellow-text",
  html: "bg-badge-purple text-badge-purple-text",
  linkedin: "bg-badge-blue text-badge-blue-text",
};

interface ResumeCardProps {
  resume: {
    id: string;
    feedback?: { overallScore?: number; ATS?: { score?: number } };
    imagePath?: string;
    companyName?: string;
    jobTitle?: string;
    format?: ResumeFormat;
    textPreview?: string;
    applicationStatus?: string;
  };
  onStatusChange?: (id: string, status: ApplicationStatus) => void;
}

export default function ResumeCard({ resume, onStatusChange }: ResumeCardProps) {
  const { id, feedback, imagePath, companyName, jobTitle, format, textPreview, applicationStatus } = resume;
  const badgeColor = FORMAT_BADGE_COLORS[format || ""] || "bg-gray-100 text-gray-700";
  const resumeURL = imagePath ? getUploadUrl(`resumes/${imagePath}`) : "";
  const textContent = textPreview || null;
  const score = feedback?.ATS?.score ?? feedback?.overallScore ?? 0;

  return (
    <Link to={`/resume/${id}`} className="block">
      <Card hover className="flex flex-col h-full animate-in fade-in duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {companyName && (
                <h3 className="text-base font-bold text-gray-900 truncate">{companyName}</h3>
              )}
              {!companyName && !jobTitle && <h3 className="text-base font-bold text-gray-900">Resume</h3>}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
                {getFormatLabel(format || "pdf")}
              </span>
            </div>
            {jobTitle && <p className="text-sm text-gray-500 truncate">{jobTitle}</p>}
          </div>
          <div className="shrink-0">
            <ScoreCircle score={score} size="md" showLabel={false} />
          </div>
        </div>

        {format === "pdf" && resumeURL && (
          <div className="rounded-lg overflow-hidden border border-gray-100 mb-3">
            <img src={resumeURL} alt="resume" className="w-full h-[200px] object-cover object-top" />
          </div>
        )}
        {format !== "pdf" && textContent && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 mb-3">
            <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Preview</p>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap line-clamp-[8] font-sans">
              {textContent}
            </pre>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100"
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <span className="text-xs text-gray-400 font-medium">Status</span>
          <StatusBadge
            status={applicationStatus ?? "not_applied"}
            id={id}
            onStatusChange={onStatusChange}
          />
        </div>
      </Card>
    </Link>
  );
}
