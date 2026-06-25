import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { Navbar } from "./Navbar";
import { ToastProvider } from "./Toast";

export default function Layout() {
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!isAuthenticated) {
      setChecking(false);
      return;
    }

    // Skip onboarding check for /onboarding route
    if (location.pathname === "/onboarding") {
      setChecking(false);
      return;
    }

    // Check onboarding status
    api.profile.get()
      .then((data) => {
        if (data?.user && !data.user.onboardingCompleted) {
          navigate("/onboarding", { replace: true });
        }
        setChecking(false);
      })
      .catch(() => {
        // If profile fetch fails, let the page handle auth
        setChecking(false);
      });
  }, [isPending, isAuthenticated, location.pathname, navigate]);

  if (isPending || checking) {
    return (
      <ToastProvider>
        <div className="page-shell">
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </main>
        </div>
      </ToastProvider>
    );
  }

  // If not authenticated, redirect to login (but don't render navbar)
  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <div className="page-shell">
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">
            <Outlet />
          </main>
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="page-shell">
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}