import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Skeleton } from "~/components/Skeleton";
import { PageShell, PageHeader, Button, Input, Card } from "~/components/ui";
import ResumeCard from "~/components/ResumeCard";
import type { Resume, ApplicationStatus } from "types";

type ResumeApplicationStatus = ApplicationStatus | "not_applied";

export const meta = () => [
  { title: "Career Autopilot | Resumes" },
  { name: "description", content: "Your resume library" },
];

const FILTER_TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "phone_screen", label: "Phone Screen" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "accepted", label: "Accepted" },
];

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !isAuthenticated) navigate("/login");
  }, [isPending, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function load() {
      try {
        const data = await api.resumes.list();
        setResumes(data || []);
      } catch (err) {
        console.error("Failed to load resumes:", err);
      }
      setLoading(false);
    }
    load();
  }, [isAuthenticated]);

  async function handleStatusChange(id: string, status: ResumeApplicationStatus) {
    setResumes((prev) => prev.map((r) => (r.id === id ? { ...r, applicationStatus: status } : r)));
    try { await api.resumes.updateStatus(id, status as any); } catch {}
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    try {
      await api.resumes.delete(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete resume:", err);
    }
  }

  const filtered = resumes
    .filter((r) => activeFilter === "all" || (r.applicationStatus ?? "draft") === activeFilter)
    .filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (r.companyName || "").toLowerCase().includes(q) ||
        (r.jobTitle || "").toLowerCase().includes(q) ||
        (r.fileName || "").toLowerCase().includes(q)
      );
    });

  const visibleTabs = FILTER_TABS.filter(
    (tab) => tab.value === "all" || resumes.some((r) => (r.applicationStatus ?? "draft") === tab.value),
  );

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Your Resumes" subtitle="Loading your library..." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      </PageShell>
    );
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <PageShell>
      <PageHeader
        title="Your Resumes"
        subtitle={`${resumes.length} resume${resumes.length !== 1 ? "s" : ""} in your library`}
        action={<Link to="/upload"><Button>+ Upload Resume</Button></Link>}
      />

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <Input
          placeholder="Search by company, title, or filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {visibleTabs.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTabs.map((tab) => {
              const count = tab.value === "all"
                ? resumes.length
                : resumes.filter((r) => (r.applicationStatus ?? "draft") === tab.value).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activeFilter === tab.value
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label} <span className="opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Resume grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={{
                id: resume.id,
                feedback: resume.feedback as any,
                imagePath: resume.imagePath,
                companyName: resume.companyName,
                jobTitle: resume.jobTitle,
                format: resume.format as any,
                textPreview: resume.textPreview,
                applicationStatus: resume.applicationStatus,
                generatedContent: resume.generatedContent,
              }}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-sm text-gray-500 mb-4">
            {search || activeFilter !== "all" ? "No resumes match your filters." : "No resumes yet."}
          </p>
          {!search && activeFilter === "all" && (
            <Link to="/upload"><Button>Upload Resume</Button></Link>
          )}
        </Card>
      )}
    </PageShell>
  );
}
