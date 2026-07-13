import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { PageShell, PageHeader, Button, Card } from "~/components/ui";
import { Skeleton } from "~/components/Skeleton";

export const meta = () => [
  { title: "Resumind | Offers" },
  { name: "description", content: "Manage and compare job offers" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-yellow-600", bg: "bg-yellow-50" },
  negotiating: { label: "Negotiating", color: "text-blue-600", bg: "bg-blue-50" },
  accepted: { label: "Accepted", color: "text-green-600", bg: "bg-green-50" },
  declined: { label: "Declined", color: "text-gray-600", bg: "bg-gray-100" },
  expired: { label: "Expired", color: "text-red-600", bg: "bg-red-50" },
};

function formatCurrency(val: number | undefined, currency = "USD", compact = false) {
  if (!val) return "—";
  if (compact) {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val.toLocaleString()}`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || { label: status, color: "text-gray-600", bg: "bg-gray-100" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function Offers() {
  const [offers, setOffers] = useState<any[]>([]);
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
        const data = await api.offerNegotiation.listComparisons();
        setOffers(data || []);
      } catch (err) {
        console.error("Failed to load offers:", err);
      }
      setLoading(false);
    }
    load();
  }, [isAuthenticated]);

  const activeOffers = offers.filter((o) => o.status === "pending" || o.status === "negotiating");
  const pastOffers = offers.filter((o) => o.status === "accepted" || o.status === "declined" || o.status === "expired");

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Offers" subtitle="Loading..." />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="2xl">
      <PageHeader
        title="Job Offers"
        subtitle="Track, compare, and negotiate your offers"
        action={<Link to="/offers/compare"><Button>Compare Offers</Button></Link>}
      />

      {/* Active Offers */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Offers</h2>
        {activeOffers.length === 0 ? (
          <Card className="text-center py-12">
            <svg className="size-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active offers</h3>
            <p className="text-gray-500 mb-6">When you receive an offer, add it here to track and compare.</p>
            <Button onClick={() => navigate("/offers/compare")}>Add First Offer</Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeOffers.map((offer) => (
              <Card key={offer.id} className="p-4 flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{offer.companyName}</h3>
                    <p className="text-sm text-gray-500">{offer.roleTitle}</p>
                  </div>
                  <StatusBadge status={offer.status} />
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Base Salary</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(offer.baseSalary)}</span>
                  </div>
                  {offer.equityValue && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Equity Value</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(offer.equityValue)}</span>
                    </div>
                  )}
                  {offer.signingBonus && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Signing Bonus</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(offer.signingBonus)}</span>
                    </div>
                  )}
                  {offer.annualBonus && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Annual Bonus</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(offer.annualBonus)}</span>
                    </div>
                  )}
                  {offer.totalCompensation && (
                    <div className="flex items-center justify-between border-t pt-2">
                      <span className="text-sm font-medium text-gray-700">Total Comp</span>
                      <span className="font-bold text-primary-500 text-lg">{formatCurrency(offer.totalCompensation)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Link to={`/offers/compare?offers=${offer.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Compare</Button>
                  </Link>
                  <Link to={`/offers/negotiate?offer=${offer.id}`} className="flex-1">
                    <Button size="sm" className="w-full">Negotiate</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Offers */}
      {pastOffers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Offers</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastOffers.map((offer) => (
              <Card key={offer.id} className="p-4 opacity-70">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{offer.companyName}</h3>
                    <p className="text-sm text-gray-500">{offer.roleTitle}</p>
                  </div>
                  <StatusBadge status={offer.status} />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-500">Total Comp: <span className="font-medium text-gray-900">{formatCurrency(offer.totalCompensation)}</span></p>
                  <p className="text-gray-500">Status: <span className="font-medium">{offer.status}</span></p>
                  {offer.respondedAt && (
                    <p className="text-gray-500">Responded: <span className="font-medium">{new Date(offer.respondedAt).toLocaleDateString()}</span></p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}