import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useSession } from "~/lib/auth-store";
import { PageShell } from "~/components/ui";

export const meta = () => [
  { title: "Career Autopilot | Auth" },
  { name: "description", content: "Log into your account" },
];

export default function Auth() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/";

  useEffect(() => {
    if (!isPending && session) {
      navigate(next);
    } else if (!isPending && !session) {
      navigate("/login");
    }
  }, [isPending, session, next, navigate]);

  return (
    <PageShell className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="text-white text-base font-bold">CA</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Career Autopilot</span>
        </Link>
        <img src="/images/resume-scan-2.gif" className="w-[240px]" alt="Loading" />
      </div>
    </PageShell>
  );
}