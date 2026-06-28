import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSession } from "~/lib/auth-store";

export const meta = () => [
  { title: "Resumind | Auth" },
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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading" />
      </div>
    </main>
  );
}