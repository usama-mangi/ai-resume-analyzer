import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Skeleton } from "~/components/Skeleton";
import { PageShell, PageHeader, Button, Input, ScoreBadge, Card } from "~/components/ui";
import type { Resume, ApplicationStatus } from "types";

export const meta = () => [
  { title: "Resumind | Resumes" },
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

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setResumes((prev) => prev.map((r) => (r.id === id ? { ...r, applicationStatus: status } : r)));
    try { await api.resumes.updateStatus(id, status as any); } catch {}
  }

  const filtered = resumes
    .filter((r) => activeFilter === "all" || (r.applicationStatus ?? "not_applied") === activeFilter)
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
    (tab) => tab.value === "all" || resumes.some((r) => (r.applicationStatus ?? "not_applied") === tab.value),
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
                : resumes.filter((r) => (r.applicationStatus ?? "not_applied") === tab.value).length;
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
            <Link key={resume.id} to={`/resume/${resume.id}`} className="block">
              <Card hover>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{resume.jobTitle || "Untitled Role"}</h3>
                    <p className="text-sm text-gray-500 truncate">{resume.companyName || "No company"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {resume.feedback?.ATS?.score && (
                    <ScoreBadge score={resume.feedback.ATS.score} size="sm" showLabel={false} />
                  )}
                  <span className="text-xs text-gray-500">{formatDate(resume.createdAt)}</span>
                </div>
              </Card>
            </Link>
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
