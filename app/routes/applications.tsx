import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { useToastHelpers } from "~/components/ui";
import { Skeleton } from "~/components/Skeleton";
import { PageShell, PageHeader, Button, Input, Textarea, Select, Card, Modal, ModalFooter } from "~/components/ui";
import type { JobApplication, ApplicationStatus } from "types";

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-gray-600", bgColor: "bg-gray-100" },
  applied: { label: "Applied", color: "text-primary-500", bgColor: "bg-primary-50" },
  phone_screen: { label: "Phone Screen", color: "text-purple-600", bgColor: "bg-purple-50" },
  interviewing: { label: "Interviewing", color: "text-warning", bgColor: "bg-warning-light" },
  offer: { label: "Offer", color: "text-success", bgColor: "bg-success-light" },
  rejected: { label: "Rejected", color: "text-danger", bgColor: "bg-danger-light" },
  accepted: { label: "Accepted", color: "text-success", bgColor: "bg-success-light" },
  withdrawn: { label: "Withdrawn", color: "text-gray-400", bgColor: "bg-gray-100" },
};

const PIPELINE_STATUSES = ["draft", "applied", "phone_screen", "interviewing", "offer", "rejected", "accepted", "withdrawn"];

export default function Applications() {
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToastHelpers();
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;

  const [pipeline, setPipeline] = useState<Array<{ id: string; companyName: string; roleTitle: string; status: string; appliedAt?: string; nextActionAt?: string; company?: { name: string } }>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({ companyName: "", roleTitle: "", notes: "" });

  useEffect(() => {
    if (!isPending && !isAuthenticated) { navigate("/login"); return; }
    if (isAuthenticated) loadPipeline();
  }, [isAuthenticated, isPending, navigate]);

  async function loadPipeline() {
    try {
      setLoading(true);
      const data = await api.applications.pipeline();
      setPipeline(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  async function handleCreate() {
    if (!formData.companyName.trim() || !formData.roleTitle.trim()) return;
    try {
      await api.applications.create({
        companyName: formData.companyName.trim(),
        roleTitle: formData.roleTitle.trim(),
        notes: formData.notes.trim() || undefined,
      });
      setFormData({ companyName: "", roleTitle: "", notes: "" });
      setShowForm(false);
      toastSuccess("Application created");
      loadPipeline();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
      setTimeout(() => setError(""), 3000);
    }
  };

  async function handleStatusChange(appId: string, newStatus: string) {
      try { await api.applications.updateStatus(appId, { status: newStatus as ApplicationStatus }); loadPipeline(); }
      catch (err) { setError(err instanceof Error ? err.message : "Failed to update"); setTimeout(() => setError(""), 3000); }
    }

  function getNextStatuses(current: string): string[] {
    const t: Record<string, string[]> = {
      draft: ["applied", "withdrawn"], applied: ["phone_screen", "rejected", "withdrawn"],
      phone_screen: ["interviewing", "rejected", "withdrawn"], interviewing: ["offer", "rejected", "withdrawn"],
      offer: ["accepted", "rejected", "withdrawn"], rejected: [], accepted: [], withdrawn: [],
    };
    return t[current] || [];
  }

  const allApps = pipeline;
  const filteredApps = allApps.filter((app) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!app.companyName.toLowerCase().includes(q) && !app.roleTitle.toLowerCase().includes(q)) return false;
    }
    if (filterStatus && app.status !== filterStatus) return false;
    return true;
  });

  function formatDate(d: string | null | undefined) {
      if (!d) return "—";
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Application Tracker" subtitle="Loading your applications..." />
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 w-72 rounded-xl shrink-0" />)}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Application Tracker"
        subtitle={`${allApps.length} application${allApps.length !== 1 ? "s" : ""} total`}
        action={
          <Button onClick={() => setShowForm(true)}>+ Add Application</Button>
        }
      />

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <Button variant={view === "kanban" ? "primary" : "ghost"} size="sm" onClick={() => setView("kanban")}>Board</Button>
          <Button variant={view === "list" ? "primary" : "ghost"} size="sm" onClick={() => setView("list")}>List</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Search company or role..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} options={[
            { value: "", label: "All Statuses" },
            ...PIPELINE_STATUSES.map((s) => ({ value: s, label: STATUS_CONFIG[s].label })),
          ]} className="w-48" />
        </div>
      </div>

      {/* Kanban or List */}
      {view === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {PIPELINE_STATUSES.map((status) => {
            const apps = filteredApps.filter((app) => app.status === status);
            const cfg = STATUS_CONFIG[status];
            return (
              <div key={status} className="flex-shrink-0 w-64">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg ${cfg.bgColor}`}>
                  <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                  <span className={`text-[10px] font-medium ${cfg.color}`}>{apps.length}</span>
                </div>
                <div className="bg-gray-100 rounded-b-lg p-1.5 min-h-[160px] space-y-1.5">
                  {apps.map((app) => (
                    <Link key={app.id} to={`/applications/${app.id}`} className="block bg-white rounded-lg p-2.5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <p className="text-sm font-medium text-gray-900 truncate">{app.companyName}</p>
                      <p className="text-xs text-gray-500 truncate">{app.roleTitle}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-gray-400">{formatDate(app.appliedAt || app.appliedAt)}</span>
                        {getNextStatuses(app.status).length > 0 && (
                          <select onClick={(e) => e.stopPropagation()} onChange={(e) => { e.preventDefault(); handleStatusChange(app.id, e.target.value); }} className="text-[10px] border border-gray-200 rounded px-1 py-0.5 text-gray-500 bg-gray-50" value="">
                            <option value="" disabled>Move</option>
                            {getNextStatuses(app.status).map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                          </select>
                        )}
                      </div>
                    </Link>
                  ))}
                  {apps.length === 0 && <p className="text-center text-[10px] text-gray-400 py-6">Empty</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Company</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Applied</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Next</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.map((app) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft;
                return (
                  <tr key={app.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/applications/${app.id}`)}>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{app.companyName}</td>
                    <td className="px-4 py-2.5 text-gray-600">{app.roleTitle}</td>
                    <td className="px-4 py-2.5"><span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span></td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{formatDate(app.appliedAt)}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{formatDate(app.nextActionAt ?? null)}</td>
                  </tr>
                );
              })}
              {filteredApps.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-gray-400">No applications found</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setFormData({ companyName: "", roleTitle: "", notes: "" }); setError(""); }}
        title="New Application"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Company Name"
            placeholder="e.g. Google"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
          <Input
            label="Role Title"
            placeholder="e.g. Senior Software Engineer"
            value={formData.roleTitle}
            onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
            required
          />
          <Textarea
            label="Notes"
            placeholder="Optional notes..."
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
          <ModalFooter
            actions={[
              { label: "Cancel", variant: "secondary", onClick: () => { setShowForm(false); setFormData({ companyName: "", roleTitle: "", notes: "" }); } },
              { label: "Create", variant: "primary", onClick: handleCreate },
            ]}
          />
        </form>
      </Modal>
    </PageShell>
  );
}
