import { useState, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { signIn, useSession } from "~/lib/auth-store";
import { PageShell, PageHeader, Button, Input, useToastHelpers } from "~/components/ui";

export const meta = () => [
  { title: "Career Autopilot | Login" },
  { name: "description", content: "Log into your account" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const { error: toastError } = useToastHelpers();

  useEffect(() => {
    if (!isPending && session) {
      navigate("/jobs", { replace: true });
    }
  }, [isPending, session, navigate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn.email({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Check your credentials.");
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading" />
        </div>
      </PageShell>
    );
  }

  if (session) return null;

  return (
    <PageShell maxWidth="sm" className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <PageHeader
          title="Welcome Back"
          subtitle="Log in to continue your job search"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={6}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-500 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </PageShell>
  );
}