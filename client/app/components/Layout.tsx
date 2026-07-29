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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  if (isPending || checking) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#FFFBF5]">
          <div className="fixed inset-0 z-50 flex items-center justify-center" role="status" aria-live="polite" aria-label="Loading Career Autopilot">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </ToastProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#FFFBF5]">
          <Outlet />
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#FFFBF5]">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary-500 text-white rounded-lg">
          Skip to main content
        </a>
        <Sidebar
          collapsed={sidebarCollapsed}
          open={sidebarOpen}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onClose={() => setSidebarOpen(false)}
        />
        {window.innerWidth < 768 && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <main id="main-content" className="min-h-screen lg:ml-[260px] lg:transition-all lg:duration-200">
          {/* Mobile hamburger button */}
          <button
            className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-lg bg-white border border-[#E8DDD1] shadow-sm flex items-center justify-center"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}
