import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { Sidebar } from "./Sidebar";
import { ToastProvider } from "./Toast";

export default function Layout() {
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!isAuthenticated) {
      setChecking(false);
      return;
    }

    if (location.pathname === "/onboarding") {
      setChecking(false);
      return;
    }

    api.profile.get()
      .then((data) => {
        if (data?.user && !data.user.onboardingCompleted) {
          navigate("/onboarding", { replace: true });
        }
        setChecking(false);
      })
      .catch(() => {
        setChecking(false);
      });
  }, [isPending, isAuthenticated, location.pathname, navigate]);

  if (isPending || checking) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </ToastProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Outlet />
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={`min-h-screen transition-all duration-200 ${sidebarCollapsed ? "ml-[68px]" : "ml-[260px]"}`}>
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}
