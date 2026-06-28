import type { JobMatchResult, SavedSearch, JobApplication, InterviewScheduleEntry, Resume, ApplicationStatus } from "types";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { Skeleton } from "~/components/Skeleton";
import { PageShell, PageHeader, Button, Card, ScoreBadge } from "~/components/ui";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-gray-600", bgColor: "bg-gray-100" },
  applied: { label: "Applied", color: "text-blue-600", bgColor: "bg-blue-50" },
  phone_screen: { label: "Phone Screen", color: "text-purple-600", bgColor: "bg-purple-50" },
  interviewing: { label: "Interviewing", color: "text-orange-600", bgColor: "bg-orange-50" },
  offer: { label: "Offer", color: "text-green-600", bgColor: "bg-green-50" },
  rejected: { label: "Rejected", color: "text-red-600", bgColor: "bg-red-50" },
  accepted: { label: "Accepted", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  withdrawn: { label: "Withdrawn", color: "text-gray-500", bgColor: "bg-gray-100" },
};

const STATUS_ORDER: ApplicationStatus[] = [
  "offer",
  "interviewing",
  "phone_screen",
  "applied",
  "draft",
  "accepted",
  "rejected",
  "withdrawn",
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Dashboard() {
  const [jobMatches, setJobMatches] = useState<JobMatchResult[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [pipeline, setPipeline] = useState<JobApplication[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<InterviewScheduleEntry[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

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
        const [matchesData, searchesData, pipelineData, scheduleData, resumesData] = await Promise.allSettled([
          api.jobs.batchMatch([], "").catch(() => null),
          api.jobs.savedSearches.list(),
          api.applications.list(),
          api.interviewPrep.listSchedule({ status: "upcoming" }),
          api.resumes.list(),
        ]);

        if (matchesData.status === "fulfilled" && matchesData.value) setJobMatches(matchesData.value);
        if (searchesData.status === "fulfilled") setSavedSearches(searchesData.value || []);
        if (pipelineData.status === "fulfilled") setPipeline((pipelineData.value?.applications || pipelineData.value || []) as JobApplication[]);
        if (scheduleData.status === "fulfilled") setUpcomingInterviews(scheduleData.value || []);
        if (resumesData.status === "fulfilled") setResumes(resumesData.value || []);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
      setLoading(false);
    }
    load();
  }, [isAuthenticated]);

  async function handleStatusChange(appId: string, status: ApplicationStatus) {
      try {
        await api.applications.updateStatus(appId, { status });
      setPipeline((prev: JobApplication[]) => prev.map((p) => (p.id === appId ? { ...p, status } : p)));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  const allApps = pipeline || [];
  const totalApps = allApps.length;
  const appliedCount = allApps.filter((a: JobApplication) => a.status === "applied").length;
  const interviewingCount = allApps.filter((a: JobApplication) => a.status === "interviewing" || a.status === "phone_screen").length;
  const offerCount = allApps.filter((a: JobApplication) => a.status === "offer" || a.status === "accepted").length;

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Dashboard" subtitle="Loading..." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </PageShell>
    );
  }

  const now = new Date();
  const upcoming = upcomingInterviews
    .filter((i: InterviewScheduleEntry) => new Date(i.scheduledAt) > now)
    .slice(0, 3);

  return (
    <PageShell maxWidth="2xl" padding="lg">
      <PageHeader title="Dashboard" subtitle="Your job search command center" action={<Link to="/resumes"><Button>Upload Resume</Button></Link>} />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total Applications</p>
          <p className="text-3xl font-bold text-gray-900">{totalApps}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Applied</p>
          <p className="text-3xl font-bold text-blue-500">{appliedCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Interviewing</p>
          <p className="text-3xl font-bold text-orange-500">{interviewingCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Offers</p>
          <p className="text-3xl font-bold text-green-500">{offerCount}</p>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pipeline Kanban */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Application Pipeline</h2>
              <Link to="/applications"><Button variant="ghost" size="sm">View All</Button></Link>
            </div>
            <div className="grid grid-cols-4 gap-4" role="list">
              {STATUS_ORDER.map((status) => {
                const cfg = STATUS_CONFIG[status];
                const apps = allApps.filter((a: JobApplication) => a.status === status);
                return (
                  <div key={status} className="bg-gray-50 rounded-xl p-4 min-h-[300px]" role="listitem">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-700">{cfg.label}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bgColor} ${cfg.color}`}>{apps.length}</span>
                    </div>
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {apps.map((app: JobApplication) => (
                        <div key={app.id} className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/applications/${app.id}`)}>
                          <h4 className="font-medium text-gray-900 truncate">{app.companyName}</h4>
                          <p className="text-sm text-gray-500 truncate">{app.roleTitle}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">{app.appliedAt ? formatDate(app.appliedAt) : "—"}</span>
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                              className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white"
                            >
                              {STATUS_ORDER.map((s) => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                      {apps.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No applications</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Job Matches */}
          {jobMatches.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Top Job Matches</h2>
                <Link to="/jobs"><Button variant="ghost" size="sm">View All</Button></Link>
              </div>
              <div className="space-y-3">
                {jobMatches.slice(0, 5).map((match: JobMatchResult) => (
                  <div key={match.jobId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <ScoreBadge score={match.score ?? match.matchScore} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{match.title}</p>
                      <p className="text-sm text-gray-500 truncate">{match.company}</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Upcoming Interviews */}
          {upcoming.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
                <Link to="/interview-schedule"><Button variant="ghost" size="sm">View All</Button></Link>
              </div>
              <div className="space-y-3">
                {upcoming.map((interview: InterviewScheduleEntry) => (
                  <div key={interview.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{interview.company}</p>
                        <p className="text-sm text-gray-500">{interview.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{new Date(interview.scheduledAt).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{interview.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Resumes */}
          {resumes.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Resumes</h2>
                <Link to="/resumes"><Button variant="ghost" size="sm">Manage</Button></Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {resumes.slice(0, 4).map((resume: Resume) => (
                  <Link key={resume.id} to={`/resume/${resume.id}`} className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium text-gray-900 truncate">{resume.jobTitle}</p>
                    <p className="text-sm text-gray-500">{resume.companyName || "General"} · Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/jobs" className="block"><Button variant="outline" className="w-full justify-start">Search Jobs</Button></Link>
              <Link to="/resumes" className="block"><Button variant="outline" className="w-full justify-start">Upload Resume</Button></Link>
              <Link to="/tailored-resume" className="block"><Button variant="outline" className="w-full justify-start">Tailor Resume</Button></Link>
              <Link to="/cover-letter" className="block"><Button variant="outline" className="w-full justify-start">Write Cover Letter</Button></Link>
              <Link to="/interview-prep" className="block"><Button variant="outline" className="w-full justify-start">Prepare for Interviews</Button></Link>
              <Link to="/offers" className="block"><Button variant="outline" className="w-full justify-start">Track Offers</Button></Link>
            </div>
          </Card>

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Saved Searches</h2>
                <Link to="/saved-searches"><Button variant="ghost" size="sm">Manage</Button></Link>
              </div>
              <div className="space-y-2">
                {savedSearches.slice(0, 3).map((search: SavedSearch) => (
                  <Link key={search.id} to="/saved-searches" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium text-gray-900 truncate">{search.name}</p>
                    <p className="text-sm text-gray-500">{search.keywords} · {search.frequency}</p>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Tips */}
          <Card className="bg-primary-50 border-primary-100">
            <div className="flex items-start gap-3">
              <svg className="size-5 text-primary-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Pro Tip</h3>
                <p className="text-sm text-gray-600">Upload multiple resume versions for different role types to get better job matches and tailored applications.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
