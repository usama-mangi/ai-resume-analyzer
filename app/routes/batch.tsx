import type { Batch, BatchItemResponse, BatchResume } from "types";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSession } from "~/lib/auth-store";
import { api, getUploadUrl } from "~/lib/api";

import { PageShell, PageHeader, Button } from "~/components/ui";
import BatchComparison from "~/components/BatchComparison";

export const meta = () => [
  { title: "Career Autopilot | Batch Results" },
  { name: "description", content: "Batch resume comparison results" },
];

export default function BatchResults() {
  const { id } = useParams();
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const navigate = useNavigate();

  const [batch, setBatch] = useState<Batch | null>(null);
  const [resumes, setResumes] = useState<BatchResume[]>([]);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      navigate(`/login`);
    }
  }, [isPending, isAuthenticated]);

  useEffect(() => {
    async function loadBatch() {
      if (!id) return;

      try {
        const data = await api.batches.get(id);
        const batchData = data as BatchItemResponse;
        setBatch({
          id: batchData.id,
          jobTitle: batchData.jobTitle,
          jobDescription: batchData.jobDescription,
          createdAt: batchData.createdAt,
        } as any);

        const batchResumes = batchData.resumes || [];
        const validResumes = batchResumes.filter(
          (r) =>
            r.feedback &&
            r.feedback.overallScore !== undefined,
        );
        setResumes(validResumes);

        const urls: Record<string, string> = {};
        for (const resume of validResumes) {
          if (resume.format === "pdf" && resume.imagePath) {
            urls[resume.id] = getUploadUrl(`resumes/${resume.imagePath}`);
          } else {
            urls[resume.id] = resume.textPreview || "";
          }
        }
        setPreviewUrls(urls);
      } catch (err) {
        console.error("Failed to load batch:", err);
      }
      setLoading(false);
    }

    loadBatch();
  }, [id]);

  return (
    <PageShell maxWidth="2xl">
      <PageHeader
        title="Batch Comparison"
              subtitle={
                batch
                  ? `Comparing ${resumes.length} resume${resumes.length !== 1 ? "s" : ""} for ${batch.jobTitle}`
                  : undefined
              }
      />

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading" />
        </div>
      )}

      {!loading && !batch && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <p className="text-lg text-gray-500">Batch not found.</p>
          <Link to="/batch-upload"><Button>Start a New Batch Analysis</Button></Link>
        </div>
      )}

      {!loading && batch && resumes.length === 0 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <p className="text-lg text-gray-500">No resumes found in this batch. Some files may have failed to process.</p>
          <Link to="/batch-upload"><Button>Try Again</Button></Link>
        </div>
      )}

      {!loading && batch && resumes.length > 0 && (
        <div className="animate-in fade-in duration-1000">
          <BatchComparison
            resumes={resumes as any}
            previewUrls={previewUrls}
            jobTitle={batch.jobTitle || ""}
            jobDescription={batch.jobDescription || ""}
          />
        </div>
      )}
    </PageShell>
  );
}
