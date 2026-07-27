import type { JobMatchResult, SavedSearch, JobApplication, InterviewScheduleEntry, Resume, ApplicationStatus } from "types";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { Skeleton } from "~/components/Skeleton";
import { Button, Card, ScoreBadge } from "~/components/ui";

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
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function TrendIndicator({ value, label }: { value: number; label: string }) {
  if (value === 0) return <span className="text-xs text-gray-400">{label}</span>;
  const isPositive = value > 0;
  return (
    <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}>
      {isPositive ? "+" : ""}{value} {label}
    </span>
  );
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
  const draftCount = allApps.filter((a: JobApplication) => a.status === "draft").length;

  const now = new Date();
  const upcoming = upcomingInterviews
    .filter((i: InterviewScheduleEntry) => new Date(i.scheduledAt) > now)
    .slice(0, 3);

  // AI suggestion: find best match to highlight
  const topMatch = jobMatches.length > 0
    ? jobMatches.reduce((best, m) => (m.score ?? m.matchScore ?? 0) > (best.score ?? best.matchScore ?? 0) ? m : best, jobMatches[0])
    : null;

  if (loading) {
    return (
      <div className="p-8 max-w-[1200px] mx-auto">
        <div className="space-y-6">
          <div className="h-12 w-64 bg-gray-100 rounded-lg animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 rounded-xl lg:col-span-2" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {upcoming.length > 0
              ? `You have ${upcoming.length} interview${upcoming.length > 1 ? "s" : ""} this week`
              : "Here's your job search overview"
            }
          </p>
        </div>
        <Link to="/resumes">
          <Button>Upload Resume</Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Applications</p>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <svg className="size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalApps}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Applied</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="size-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-500">{appliedCount}</p>
          <TrendIndicator value={appliedCount - draftCount} label="vs draft" />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Interviewing</p>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <svg className="size-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-500">{interviewingCount}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Offers</p>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="size-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.665 6.023 6.023 0 01-2.77-.665" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-500">{offerCount}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — pipeline + matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline mini-view */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">Application Pipeline</h2>
              <Link to="/applications">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {STATUS_ORDER.map((status) => {
                const cfg = STATUS_CONFIG[status];
                const apps = allApps.filter((a: JobApplication) => a.status === status);
                return (
                  <div key={status} className="bg-gray-50 rounded-xl p-3 min-h-[200px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-medium text-gray-600 truncate">{cfg.label}</h3>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bgColor} ${cfg.color}`}>
                        {apps.length}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {apps.slice(0, 4).map((app: JobApplication) => (
                        <div
                          key={app.id}
                          className="bg-white p-2.5 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer text-xs"
                          onClick={() => navigate(`/applications/${app.id}`)}
                        >
                          <p className="font-medium text-gray-900 truncate">{app.companyName}</p>
                          <p className="text-gray-500 truncate mt-0.5">{app.roleTitle}</p>
                        </div>
                      ))}
                      {apps.length > 4 && (
                        <p className="text-[10px] text-gray-400 text-center">+{apps.length - 4} more</p>
                      )}
                      {apps.length === 0 && (
                        <p className="text-[10px] text-gray-400 text-center py-2">Empty</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* AI suggestion — integrated */}
          {topMatch && (topMatch.score ?? topMatch.matchScore ?? 0) >= 80 && (
            <Card className="p-5 bg-primary-50 border-primary-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <svg className="size-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">AI Recommendation</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{topMatch.title}</span> at{" "}
                    <span className="font-medium">{topMatch.company}</span> —{" "}
                    <ScoreBadge score={topMatch.score ?? topMatch.matchScore ?? 0} size="sm" /> match.
                    {" "}
                    <Link to={`/jobs/${topMatch.jobId}`} className="text-primary-600 font-medium hover:underline">
                      View & apply →
                    </Link>
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Top matches */}
          {jobMatches.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Top Job Matches</h2>
                <Link to="/jobs">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-2">
                {jobMatches.slice(0, 4).map((match: JobMatchResult) => (
                  <Link
                    key={match.jobId}
                    to={`/jobs/${match.jobId}`}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ScoreBadge score={match.score ?? match.matchScore} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{match.title}</p>
                      <p className="text-xs text-gray-500 truncate">{match.company}</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right column — interviews, actions, searches */}
        <div className="space-y-6">
          {/* Upcoming interviews */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Upcoming Interviews</h2>
              <Link to="/interview-schedule">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="size-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No upcoming interviews</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcoming.map((interview: InterviewScheduleEntry) => (
                  <div key={interview.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{interview.company}</p>
                        <p className="text-xs text-gray-500 truncate">{interview.role}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs font-medium text-gray-900">
                          {new Date(interview.scheduledAt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(interview.scheduledAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick actions */}
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { to: "/jobs", label: "Search Jobs", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
                { to: "/resumes", label: "My Resumes", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
                { to: "/interview-prep", label: "Interview Prep", icon: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" },
                { to: "/offers", label: "Track Offers", icon: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.665 6.023 6.023 0 01-2.77-.665" },
              ].map((action) => (
                <Link key={action.to} to={action.to}>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <svg className="size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                    </svg>
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>

          {/* Saved searches */}
          {savedSearches.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Saved Searches</h2>
                <Link to="/saved-searches">
                  <Button variant="ghost" size="sm">Manage</Button>
                </Link>
              </div>
              <div className="space-y-2">
                {savedSearches.slice(0, 3).map((search: SavedSearch) => (
                  <Link key={search.id} to="/saved-searches" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="text-sm font-medium text-gray-900 truncate">{search.name}</p>
                    <p className="text-xs text-gray-500">{search.keywords} · {search.frequency}</p>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Resumes */}
          {resumes.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Your Resumes</h2>
                <Link to="/resumes">
                  <Button variant="ghost" size="sm">Manage</Button>
                </Link>
              </div>
              <div className="space-y-2">
                {resumes.slice(0, 3).map((resume: Resume) => (
                  <Link key={resume.id} to={`/resumes/${resume.id}`} className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="text-sm font-medium text-gray-900 truncate">{resume.jobTitle}</p>
                    <p className="text-xs text-gray-500">{resume.companyName || "General"} · Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
