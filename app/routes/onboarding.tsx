import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { PageShell, Button, Input, Textarea, Card, useToastHelpers } from "~/components/ui";

export const meta = () => [
  { title: "Resumind | Complete Your Profile" },
];

const STEPS = ["Basic Info", "Education", "Experience", "Skills", "Projects", "Links", "Review"];

const SUGGESTED_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#",
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express", "Django", "FastAPI",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
  "PostgreSQL", "MySQL", "MongoDB", "Redis",
  "Git", "CI/CD", "GraphQL", "REST API",
  "Machine Learning", "TensorFlow", "PyTorch",
  "Communication", "Leadership", "Problem Solving", "Team Management",
];

export default function OnboardingPage() {
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToastHelpers();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Basic info
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  // Education
  const [education, setEducation] = useState<any[]>([{ school: "", degree: "", field: "", startDate: "", endDate: "" }]);

  // Experience
  const [experience, setExperience] = useState<any[]>([{ company: "", title: "", startDate: "", endDate: "", description: "", isCurrent: false }]);

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Projects (optional)
  const [projects, setProjects] = useState<any[]>([]);

  // Links
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  useEffect(() => {
    if (!isPending && !isAuthenticated) navigate("/login");
  }, [isPending, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) loadProfile();
  }, [isAuthenticated]);

  async function loadProfile() {
    try {
      const data = await api.profile.get();
      if (data.user) {
        setHeadline(data.user.headline || "");
        setSummary(data.user.summary || "");
        setLocation(data.user.location || "");
        setPhone(data.user.phone || "");
        setLinkedinUrl(data.user.linkedinUrl || "");
        setGithubUrl(data.user.githubUrl || "");
        setWebsiteUrl(data.user.websiteUrl || "");
      }
      if (data.profile) {
        if (data.profile.education?.length) setEducation(data.profile.education);
        if (data.profile.experience?.length) setExperience(data.profile.experience);
        if (data.profile.projects?.length) setProjects(data.profile.projects);
        if (data.profile.skills?.length) setSkills(data.profile.skills);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
    setFetching(false);
  }

  // Validation per step
  function canProceed(): boolean {
    switch (step) {
      case 0: return !!headline.trim() && !!summary.trim() && !!location.trim();
      case 1: return education.some(e => e.school.trim() && e.degree.trim());
      case 2: return experience.some(e => e.company.trim() && e.title.trim());
      case 3: return skills.length >= 3;
      case 4: return true; // links are optional
      case 5: return true;
      default: return true;
    }
  }

  async function handleFinish() {
    setLoading(true);
    try {
      // Save user fields
      await api.profile.updateUser({ headline, summary, location, phone, linkedinUrl, githubUrl, websiteUrl });
      // Save profile data
      await api.profile.update({ education, experience, projects, skills });
      // Mark onboarding complete
      await api.profile.completeOnboarding();
      toastSuccess("Profile complete", "Welcome to Resumind!");
      navigate("/");
    } catch (err) {
      toastError("Failed to save", err instanceof Error ? err.message : "Unknown error");
    }
    setLoading(false);
  }

  function addEducation() {
    setEducation([...education, { school: "", degree: "", field: "", startDate: "", endDate: "" }]);
  }

  function removeEducation(index: number) {
    setEducation(education.filter((_, i) => i !== index));
  }

  function updateEducation(index: number, field: string, value: string) {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  }

  function addExperience() {
    setExperience([...experience, { company: "", title: "", startDate: "", endDate: "", description: "", isCurrent: false }]);
  }

  function removeExperience(index: number) {
    setExperience(experience.filter((_, i) => i !== index));
  }

  function updateExperience(index: number, field: string, value: any) {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  }

  function addSkill(skill: string) {
    const s = skill.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter(s => s !== skill));
  }

  if (isPending || fetching) {
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto py-12 animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-48 bg-gray-200 rounded mb-8" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Complete Your Profile</h1>
          <p className="text-sm text-gray-500">Tell us about yourself so we can generate a tailored resume for you.</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-[10px] font-medium ${i <= step ? 'text-primary-600' : 'text-gray-400'}`}>{s}</span>
            ))}
          </div>
        </div>

        <Card className="p-6">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <Input label="Professional Headline *" placeholder="e.g. Senior Software Engineer" value={headline} onChange={e => setHeadline(e.target.value)} />
              <Textarea label="Professional Summary *" placeholder="Write a brief summary of your experience and goals..." value={summary} onChange={e => setSummary(e.target.value)} rows={4} />
              <Input label="Location *" placeholder="e.g. San Francisco, CA" value={location} onChange={e => setLocation(e.target.value)} />
              <Input label="Phone" placeholder="e.g. +1 (555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          )}

          {/* Step 1: Education */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                  {education.length > 1 && (
                    <button onClick={() => removeEducation(i)} className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                  <Input label="School *" placeholder="e.g. Stanford University" value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Degree *" placeholder="e.g. B.S." value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} />
                    <Input label="Field of Study" placeholder="e.g. Computer Science" value={edu.field} onChange={e => updateEducation(i, 'field', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Start Date" type="date" value={edu.startDate} onChange={e => updateEducation(i, 'startDate', e.target.value)} />
                    <Input label="End Date" type="date" value={edu.endDate} onChange={e => updateEducation(i, 'endDate', e.target.value)} />
                  </div>
                </div>
              ))}
              <Button variant="secondary" onClick={addEducation}>+ Add Education</Button>
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                  {experience.length > 1 && (
                    <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Company *" placeholder="e.g. Google" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} />
                    <Input label="Title *" placeholder="e.g. Software Engineer" value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Start Date" type="date" value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} />
                    <Input label="End Date" type="date" value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} disabled={exp.isCurrent} />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={exp.isCurrent} onChange={e => updateExperience(i, 'isCurrent', e.target.checked)} className="w-4 h-4 text-primary-500 border-gray-300 rounded" />
                    <span className="text-gray-600">Currently working here</span>
                  </label>
                  <Textarea label="Description" placeholder="What did you do in this role?" value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} rows={3} />
                </div>
              ))}
              <Button variant="secondary" onClick={addExperience}>+ Add Experience</Button>
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
              <p className="text-sm text-gray-500">Add at least 3 skills. These will appear on your generated resume.</p>

              <div className="flex gap-2">
                <Input label="" placeholder="Type a skill and press Enter" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }} />
                <Button variant="secondary" onClick={() => addSkill(skillInput)} className="mt-0.5">Add</Button>
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                      {s}
                      <button onClick={() => removeSkill(s)} className="text-primary-400 hover:text-primary-600 ml-1">×</button>
                    </span>
                  ))}
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggested Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).slice(0, 20).map(s => (
                    <button key={s} onClick={() => addSkill(s)} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Projects (optional) */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              <p className="text-sm text-gray-500">Showcase your best work. This step is optional — you can skip it.</p>
              {projects.map((proj, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                  <button onClick={() => setProjects(projects.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700">Remove</button>
                  <Input label="Project Name" placeholder="e.g. E-commerce Platform" value={proj.name || ''} onChange={e => { const updated = [...projects]; updated[i] = { ...updated[i], name: e.target.value }; setProjects(updated); }} />
                  <Input label="Description" placeholder="What does this project do?" value={proj.description || ''} onChange={e => { const updated = [...projects]; updated[i] = { ...updated[i], description: e.target.value }; setProjects(updated); }} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Project URL" placeholder="https://..." value={proj.url || ''} onChange={e => { const updated = [...projects]; updated[i] = { ...updated[i], url: e.target.value }; setProjects(updated); }} />
                    <Input label="GitHub URL" placeholder="https://github.com/..." value={proj.githubUrl || ''} onChange={e => { const updated = [...projects]; updated[i] = { ...updated[i], githubUrl: e.target.value }; setProjects(updated); }} />
                  </div>
                  <Input label="Technologies" placeholder="React, Node.js, PostgreSQL (comma-separated)" value={(proj.technologies || []).join(', ')} onChange={e => { const updated = [...projects]; updated[i] = { ...updated[i], technologies: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }; setProjects(updated); }} />
                </div>
              ))}
              <Button variant="secondary" onClick={() => setProjects([...projects, { name: '', description: '', url: '', githubUrl: '', technologies: [] }])}>+ Add Project</Button>
            </div>
          )}

          {/* Step 5: Links */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Online Presence</h2>
              <p className="text-sm text-gray-500">Add links to your professional profiles. This step is optional.</p>
              <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/yourname" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} />
              <Input label="GitHub URL" placeholder="https://github.com/yourname" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
              <Input label="Website / Portfolio URL" placeholder="https://yourname.com" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} />
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Review Your Profile</h2>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Headline</p>
                  <p className="text-sm font-medium text-gray-900">{headline}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Summary</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{summary}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Location</p>
                  <p className="text-sm font-medium text-gray-900">{location}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Education ({education.length})</p>
                  {education.map((e, i) => <p key={i} className="text-sm text-gray-700">{e.degree} in {e.field || 'N/A'} — {e.school}</p>)}
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Experience ({experience.length})</p>
                  {experience.map((e, i) => <p key={i} className="text-sm text-gray-700">{e.title} at {e.company}</p>)}
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Skills ({skills.length})</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skills.map(s => <span key={s} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs">{s}</span>)}
                  </div>
                </div>
                {projects.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Projects ({projects.length})</p>
                    {projects.map((p, i) => (
                      <div key={i} className="text-sm mb-1">
                        <span className="font-medium text-gray-900">{p.name}</span>
                        {p.technologies?.length > 0 && (
                          <span className="text-gray-400 ml-1">— {p.technologies.join(', ')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {(linkedinUrl || githubUrl || websiteUrl) && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Links</p>
                    <div className="space-y-2 text-sm">
                      {linkedinUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400 w-20">LinkedIn</span>
                          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline truncate">{linkedinUrl}</a>
                        </div>
                      )}
                      {githubUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400 w-20">GitHub</span>
                          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline truncate">{githubUrl}</a>
                        </div>
                      )}
                      {websiteUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400 w-20">Website</span>
                          <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline truncate">{websiteUrl}</a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>Next</Button>
          ) : (
            <Button onClick={handleFinish} disabled={loading}>
              {loading ? "Saving..." : "Finish & Start"}
            </Button>
          )}
        </div>
      </div>
    </PageShell>
  );
}
