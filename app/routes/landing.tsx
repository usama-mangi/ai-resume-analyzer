import { Link } from "react-router";
import { PageShell, Button } from "~/components/ui";

export const meta = () => [
  { title: "Resumind | Your Career Command Center" },
  { name: "description", content: "Find jobs, tailor resumes, track applications, prep for interviews, and negotiate offers — all in one AI-powered platform." },
];

export default function Landing() {
  return (
    <PageShell className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Your Career{" "}
              <span className="text-gradient">Command Center</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              From job search to offer negotiation — one AI-powered platform that handles
              every step of your career journey. Find roles, tailor resumes, track
              applications, prep for interviews, and close offers with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/login?redirect=/jobs">
                <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                  Start Job Search Free
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                  Create Free Account
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 font-medium">
            <span>Trusted by job seekers at</span>
            <span className="font-bold text-gray-600">Google</span>
            <span className="font-bold text-gray-600">Microsoft</span>
            <span className="font-bold text-gray-600">Amazon</span>
            <span className="font-bold text-gray-600">Meta</span>
            <span className="font-bold text-gray-600">Netflix</span>
            <span className="font-bold text-gray-600">Stripe</span>
            <span className="font-bold text-gray-600">and 10,000+ more</span>
          </div>
        </div>
      </section>

      {/* Feature Pipeline - The Job Search Lifecycle */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The Complete Job Search Lifecycle
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every tool you need, connected by AI. No more context switching between
              job boards, resume builders, spreadsheets, and interview prep tools.
            </p>
          </div>

          {/* Pipeline Visualization */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-10 left-10 right-10 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-0 relative z-10">
              {[
                {
                  icon: (
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: "Discover Jobs",
                  desc: "Search across LinkedIn, Indeed, Glassdoor & company sites. AI matches you to roles.",
                  color: "bg-blue-500",
                  bg: "bg-blue-50",
                  border: "border-blue-200",
                },
                {
                  icon: (
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  title: "Tailor Resumes",
                  desc: "AI injects keywords, reorders sections, and optimizes for ATS per job description.",
                  color: "bg-purple-500",
                  bg: "bg-purple-50",
                  border: "border-purple-200",
                },
                {
                  icon: (
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  ),
                  title: "Apply & Track",
                  desc: "One-click apply, auto-fill forms, kanban pipeline, deadlines, reminders, analytics.",
                  color: "bg-green-500",
                  bg: "bg-green-50",
                  border: "border-green-200",
                },
                {
                  icon: (
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                  title: "Prep & Interview",
                  desc: "Company briefings, mock interviews, STAR stories, cheat sheets, scheduling.",
                  color: "bg-orange-500",
                  bg: "bg-orange-50",
                  border: "border-orange-200",
                },
                {
                  icon: (
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Negotiate & Decide",
                  desc: "Offer comparison, equity calculator, negotiation scripts, decision matrix, resignation letters.",
                  color: "bg-emerald-500",
                  bg: "bg-emerald-50",
                  border: "border-emerald-200",
                },
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center px-4">
                  {/* Step number / connector */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center text-white {step.color} shadow-lg border-4 border-white z-20">
                    <span className="text-2xl font-bold">{i + 1}</span>
                  </div>
                  <div className={`mt-24 p-6 rounded-2xl border {step.bg} {step.border} h-full flex flex-col`}>
                    <div className={`p-3 rounded-xl {step.bg} {step.color} inline-flex mb-4`}>
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 flex-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Tools for Every Stage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built features that work together — not a collection of disjointed tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Multi-Source Job Search",
                desc: "Aggregate listings from LinkedIn, Indeed, Glassdoor, JSearch, and company career pages. Save searches, get alerts.",
                icon: (
                  <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                title: "AI Job Matching",
                desc: "Batch score your resume against 50+ jobs. See match % for skills, experience, keywords. Prioritize applications.",
                icon: (
                  <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                title: "ATS Resume Optimizer",
                desc: "Upload resume + job description → get ATS score, missing keywords, section-by-section feedback, rewrite suggestions.",
                icon: (
                  <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                title: "Interview Simulator",
                desc: "AI voice/text mock interviews with real-time feedback. STAR framework coaching. Technical & behavioral modes.",
                icon: (
                  <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
              },
              {
                title: "Offer Comparison Matrix",
                desc: "Side-by-side: base, equity, bonus, benefits, PTO, remote policy, growth path. Weighted decision framework.",
                icon: (
                  <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                title: "Application Autofill Extension",
                desc: "Browser extension that fills Greenhouse, Lever, Workday, SuccessFactors forms from your profile in one click.",
                icon: (
                  <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <Link key={i} to="/login?redirect=/jobs" className="block">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200 h-full">
                  <div className="p-3 bg-primary-50 rounded-xl w-fit text-primary-500 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Job Search?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've landed roles at top companies using Resumind.
            Start free — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg bg-primary-500 hover:bg-primary-600">
                Start Free Job Search
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg text-white border-gray-700 hover:bg-gray-800">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/jobs" className="hover:text-primary-500">Job Search</Link></li>
                <li><Link to="/resumes" className="hover:text-primary-500">Resume Builder</Link></li>
                <li><Link to="/applications" className="hover:text-primary-500">Application Tracker</Link></li>
                <li><Link to="/interview-prep" className="hover:text-primary-500">Interview Prep</Link></li>
                <li><Link to="/offer-comparison" className="hover:text-primary-500">Offer Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/blog" className="hover:text-primary-500">Blog</Link></li>
                <li><Link to="/guides" className="hover:text-primary-500">Guides</Link></li>
                <li><Link to="/templates" className="hover:text-primary-500">Templates</Link></li>
                <li><Link to="/salary-data" className="hover:text-primary-500">Salary Data</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/about" className="hover:text-primary-500">About</Link></li>
                <li><Link to="/careers" className="hover:text-primary-500">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-primary-500">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/privacy" className="hover:text-primary-500">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-primary-500">Terms</Link></li>
                <li><Link to="/security" className="hover:text-primary-500">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 Resumind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PageShell>
  );
}