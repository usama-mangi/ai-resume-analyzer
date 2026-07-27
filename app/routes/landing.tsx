import { Link } from "react-router";
import { PageShell, Button } from "~/components/ui";

export const meta = () => [
  { title: "Career Autopilot | From Search to Offer" },
  { name: "description", content: "AI-powered career platform that handles every step — job search, resume tailoring, interview prep, and offer negotiation. One system, not five tools." },
];

export default function Landing() {
  return (
    <PageShell className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between py-6 max-w-6xl mx-auto px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">CA</span>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Career Autopilot</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text + CTA */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Job search is broken.
              <br />
              <span className="text-gray-400">We fixed it.</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              One AI-powered platform from first search to signed offer.
              No more juggling five tools, losing context between stages, or starting from scratch every application.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto px-6">
                  Start free
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6">
                  Browse jobs
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400">No credit card required</p>
          </div>

          {/* Right — product mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/5 blur-3xl rounded-full" />

            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-6 space-y-4">
              {/* Top bar */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Career Autopilot</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Applications", value: "24", change: "+6 this week" },
                  { label: "Interviews", value: "7", change: "+2 scheduled" },
                  { label: "Offers", value: "1", change: "Pending review" },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-gray-50">
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{s.change}</p>
                  </div>
                ))}
              </div>

              {/* Job list */}
              <div className="space-y-2">
                {[
                  { role: "Senior Frontend Engineer", company: "Stripe", match: 92, status: "Interview" },
                  { role: "Staff Engineer", company: "Vercel", match: 87, status: "Applied" },
                  { role: "Product Engineer", company: "Linear", match: 78, status: "Matched" },
                ].map((j) => (
                  <div key={j.role} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{j.role}</p>
                      <p className="text-xs text-gray-400">{j.company}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        j.match >= 90 ? "bg-green-50 text-green-700" :
                        j.match >= 80 ? "bg-blue-50 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{j.match}%</span>
                      <span className="text-xs text-gray-400 w-20 text-right">{j.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — clean grid */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-lg mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Everything, connected</h2>
            <p className="text-gray-500">Six stages. One AI thread. No context switching.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Job Search", desc: "Aggregate from LinkedIn, Indeed, Glassdoor. AI matches your profile to roles.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
              { title: "Resume Builder", desc: "AI generates and tailors resumes per job. ATS scoring, keyword injection.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { title: "Application Tracker", desc: "Kanban pipeline, communication log, referral tracking, analytics.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { title: "Interview Prep", desc: "Company briefings, mock interviews, STAR coaching, cheat sheets.", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
              { title: "Offer Negotiation", desc: "Side-by-side comparison, equity calculator, salary coaching, scripts.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" },
              { title: "Onboarding Plans", desc: "30-60-90 day plans, manager alignment, network mapping, skill refresh.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((f) => (
              <Link key={f.title} to="/login" className="block">
                <div className="bg-white p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 h-full">
                  <svg className="w-5 h-5 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to start?</h2>
          <p className="text-gray-500 mb-6">Join professionals who landed roles at top companies.</p>
          <Link to="/register">
            <Button size="lg" className="px-8">Create free account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-400">2025 Career Autopilot</span>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-gray-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </PageShell>
  );
}
