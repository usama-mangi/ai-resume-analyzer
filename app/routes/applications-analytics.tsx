import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { cn } from "~/lib/utils";
import { PageShell, PageHeader, useToastHelpers, Card } from "~/components/ui";
import type { ApplicationsAnalytics } from "types";

export const meta = () => [
  { title: "Resumind | Applications Analytics" },
  { name: "description", content: "Conversion funnel: Applications → Screens → Interviews → Offers → Acceptance rate" },
];

export default function ApplicationsAnalytics() {
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToastHelpers();

  const [analytics, setAnalytics] = useState<ApplicationsAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!isPending && !isAuthenticated) navigate("/login");
  }, [isAuthenticated, isPending, navigate]);

  useEffect(() => {
    if (isAuthenticated) loadAnalytics();
  }, [isAuthenticated, startDate, endDate, navigate]);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const data = await api.applications.analytics({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setAnalytics(data as unknown as ApplicationsAnalytics);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  // Compute top strengths and weaknesses
  const topStrengths = analytics?.strengthFrequency
    ? Object.entries(analytics.strengthFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5)
    : [];
  const topWeaknesses = analytics?.weaknessFrequency
    ? Object.entries(analytics.weaknessFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5)
    : [];

  function getRatingColor(rating: number) {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3) return "bg-blue-500";
    if (rating >= 2) return "bg-yellow-500";
    return "bg-red-500";
  }

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Application Analytics" subtitle="Loading..." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
        <div className="mt-8">
          <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </PageShell>
    );
  }

  if (!analytics) {
    return (
      <PageShell>
        <PageHeader title="Application Analytics" subtitle="No data available" />
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Not enough application data to generate analytics.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="2xl">
      <PageHeader
        title="Application Analytics"
        subtitle="Conversion funnel: Applications → Screens → Interviews → Offers → Acceptance rate"
      />

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm" role="alert">{error}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalApplications}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Applied &rarr; Offer</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{analytics.conversionRate}%</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Overall Success</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{analytics.conversionRate}%</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Avg Days to Offer</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.averageTimeToOffer ?? "—"}</p>
        </Card>
      </div>

      {/* Funnel */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="flex items-end gap-1.5 h-16">
          {[
            { label: "Applications", value: analytics.totalApplications, color: "bg-gray-500" },
            { label: "Screens", value: analytics.applicationsByStatus?.phone_screen || 0, color: "bg-blue-500" },
            { label: "Interviews", value: analytics.applicationsByStatus?.interviewing || 0, color: "bg-purple-500" },
            { label: "Offers", value: analytics.applicationsByStatus?.offer || 0, color: "bg-green-500" },
          ].map((step, i) => {
            const maxVal = Math.max(
              analytics.totalApplications,
              analytics.applicationsByStatus?.phone_screen || 0,
              analytics.applicationsByStatus?.interviewing || 0,
              analytics.applicationsByStatus?.offer || 0,
              1
            );
            return (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(step.value / maxVal) * 100}%`, backgroundColor: step.color }} />
                </div>
                <span className="text-xs font-medium text-gray-900">{step.value}</span>
                <span className="text-xs text-gray-500">{step.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* By Interview Type */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">By Interview Type</h3>
          <div className="space-y-3">
            {Object.entries(analytics.byType || {}).map(([type, data]: [string, { count: number; avgRating: number }]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700 text-sm capitalize">{type.replace("_", " ")}</span>
                  <span className="text-xs text-gray-400">{data.count} interview{data.count !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", data.avgRating >= 4 ? "bg-green-500" : data.avgRating >= 3 ? "bg-blue-500" : "bg-yellow-500")} style={{ width: `${(data.avgRating / 5) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-8 text-right">{data.avgRating}</span>
                </div>
              </div>
            ))}
            {Object.keys(analytics.byType || {}).length === 0 && <p className="text-sm text-gray-400">No data yet</p>}
          </div>
        </Card>

        {/* By Company */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">By Company</h3>
          <div className="space-y-3">
            {Object.entries(analytics.byCompany || {}).map(([company, data]: [string, { count: number; avgRating: number }]) => (
              <div key={company} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700 text-sm">{company}</span>
                  <span className="text-xs text-gray-400">{data.count} interview{data.count !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", data.avgRating >= 4 ? "bg-green-500" : data.avgRating >= 3 ? "bg-blue-500" : "bg-yellow-500")} style={{ width: `${(data.avgRating / 5) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-8 text-right">{data.avgRating}</span>
                </div>
              </div>
            ))}
            {Object.keys(analytics.byCompany || {}).length === 0 && <p className="text-sm text-gray-400 text-center py-6">No data yet</p>}
          </div>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Strengths</h3>
          {topStrengths.length > 0 ? (
            <div className="space-y-2">
              {topStrengths.map(([strength, count]: [string, number]) => (
                <div key={strength} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{strength}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-lg">{count}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No strengths recorded yet</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
          {topWeaknesses.length > 0 ? (
            <div className="space-y-2">
              {topWeaknesses.map(([weakness, count]: [string, number]) => (
                <div key={weakness} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{weakness}</span>
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">{count}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No weaknesses recorded yet</p>
          )}
        </Card>
      </div>

      {/* Feedback Summary */}
      {analytics.feedbackSummary && (
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interviewer Feedback Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Feedbacks</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.feedbackSummary.totalFeedbacks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Feedback Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-indigo-600">{analytics.feedbackSummary.averageRating}</p>
                <span className="text-sm text-gray-400">/5</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Recommendations</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(analytics.feedbackSummary.recommendationCounts).map(([rec, count]: [string, number]) => (
                  <span key={rec} className={cn("text-xs font-medium px-2 py-1 rounded-full",
                    rec === "strong_hire" || rec === "hire" ? "bg-green-100 text-green-700" :
                    rec === "neutral" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {rec.replace("_", " ")}: {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
