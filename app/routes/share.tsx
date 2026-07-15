import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { SharedReport } from "types";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { api, getUploadUrl } from "~/lib/api";
import { normalizeFeedback } from "~/lib/utils";
import { PageShell, PageHeader, Button, ScoreBadge } from "~/components/ui";

export const meta = () => [
  { title: "Resumind | Shared Report" },
  { name: "description", content: "Shared resume analysis report" },
];

export default function Share() {
  const { token } = useParams();
  const [report, setReport] = useState<SharedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      if (!token) return;
      try {
        const data = await api.share.getReport(token);
        setReport(data);
      } catch {
        setError("This report is not available or the link has expired.");
      }
      setLoading(false);
    }
    loadReport();
  }, [token]);

  return (
    <PageShell className="min-h-screen" maxWidth="2xl" padding="lg">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <Link to="/" className="font-bold text-xl text-gray-900 tracking-tight">Resumind</Link>
        <span className="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">Shared Report</span>
      </header>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-6 py-24 text-center">
          <p className="text-xl text-gray-500">{error}</p>
          <Link to="/"><Button>Go to Resumind</Button></Link>
        </div>
      )}

      {report && !loading && (
        <div className="w-full flex flex-col gap-8 animate-in fade-in duration-700">
          <PageHeader
            title={report.jobTitle || report.title}
            subtitle={report.companyName ? `${report.companyName} - Analyzed on ${new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` : `Analyzed on ${new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
          />

          {report.imagePath && (
            <div className="gradient-border w-full max-w-sm mx-auto">
              <img src={getUploadUrl(`/uploads/images/${report.imagePath}`)} className="w-full h-auto object-contain rounded-2xl" alt="Resume preview" />
            </div>
          )}

          <Summary feedback={normalizeFeedback(report.feedback)} />
          <ATS
            score={Number(((report.feedback as Record<string, unknown>)?.ATS as Record<string, unknown>)?.score ?? 0)}
            suggestions={(((report.feedback as Record<string, unknown>)?.ATS as Record<string, unknown>)?.tips ?? []) as { type: "good" | "improve"; tip: string }[]}
            tipFeedback={{}}
            onRate={() => {}}
          />
          <Details feedback={normalizeFeedback(report.feedback)} tipFeedback={{}} onRate={() => {}} />

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 text-center flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-gray-900">Want to analyze your own resume?</p>
            <p className="text-sm text-gray-600 max-w-md">
              Get a detailed ATS score, skill gap analysis, cover letter generator, and more — for free.
            </p>
            <Link to="/upload"><Button>Analyze My Resume →</Button></Link>
          </div>
        </div>
      )}
    </PageShell>
  );
}