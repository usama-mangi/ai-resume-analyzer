import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { cn } from "~/lib/utils";
import type { GeneratedResume } from "types";
import { PageShell, PageHeader, Button, Input, Textarea, Card, useToastHelpers } from "~/components/ui";

export const meta = () => [
  { title: "Resumind | Edit Resume" },
];

interface BulletEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

function BulletEditor({ bullets, onChange }: BulletEditorProps) {
  return (
    <div className="space-y-2">
      {bullets.map((bullet, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={bullet}
            onChange={(e) => {
              const next = [...bullets];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder="Achievement or responsibility..."
          />
          <button
            type="button"
            onClick={() => onChange(bullets.filter((_, j) => j !== i))}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...bullets, ""])}
        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        + Add bullet
      </button>
    </div>
  );
}

interface SkillsEditorProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const skill = input.trim();
    if (skill && !skills.includes(skill)) {
      onChange([...skills, skill]);
      setInput("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          placeholder="Type a skill and press Enter..."
        />
        <Button variant="secondary" size="sm" onClick={addSkill}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 border border-primary-200 text-primary-700 rounded-lg text-sm"
          >
            {skill}
            <button
              type="button"
              onClick={() => onChange(skills.filter((s) => s !== skill))}
              className="ml-1 hover:text-primary-900"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ResumeEditPage() {
  const { id } = useParams();
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToastHelpers();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState<any>(null);

  // Contact info (user-level fields)
  const [contact, setContact] = useState({
    name: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",
  });

  // Structured resume content
  const [content, setContent] = useState<any>({
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  const [activeSection, setActiveSection] = useState<string>("summary");

  useEffect(() => {
    if (!isPending && !isAuthenticated) navigate("/login");
  }, [isPending, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && id) loadData();
  }, [isAuthenticated, id]);

  async function loadData() {
    try {
      const [resumeData, profileData] = await Promise.all([
        api.resumes.get(id!),
        api.profile.get(),
      ]);
      setResume(resumeData);

      // Populate contact info from profile
      if (profileData.user) {
        setContact({
          name: profileData.user.name || "",
          headline: profileData.user.headline || "",
          email: profileData.user.email || "",
          phone: profileData.user.phone || "",
          location: profileData.user.location || "",
          linkedinUrl: profileData.user.linkedinUrl || "",
          githubUrl: profileData.user.githubUrl || "",
          websiteUrl: profileData.user.websiteUrl || "",
        });
      }

      // Populate content from generatedContent or fallback
      if (resumeData.generatedContent) {
        setContent(resumeData.generatedContent);
      } else if (resumeData.textContent) {
        // Parse text content as fallback
        setContent(parseTextToContent(resumeData.textContent));
      }
    } catch (err) {
      console.error("Failed to load resume:", err);
    }
    setLoading(false);
  }

  function parseTextToContent(text: string): any {
    const result: any = {
      summary: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
    };

    const lines = text.split("\n");
    let currentSection = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed === "PROFESSIONAL SUMMARY") { currentSection = "summary"; continue; }
      if (trimmed === "EXPERIENCE") { currentSection = "experience"; continue; }
      if (trimmed === "EDUCATION") { currentSection = "education"; continue; }
      if (trimmed === "SKILLS") { currentSection = "skills"; continue; }
      if (trimmed === "PROJECTS") { currentSection = "projects"; continue; }

      // Skip header lines (name, headline, contact info, LinkedIn, GitHub, Website)
      if (!currentSection) continue;

      if (currentSection === "summary") {
        result.summary = result.summary ? result.summary + " " + trimmed : trimmed;
      } else if (currentSection === "skills") {
        result.skills = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
        currentSection = "";
      }
    }

    return result;
  }

  const handleSave = useCallback(async () => {
    if (!id) return;
    setSaving(true);
    try {
      await api.resumes.updateContent(id, {
        generatedContent: content,
        contactInfo: contact,
      } as any);
      toastSuccess("Resume updated", "Your changes have been saved");
      navigate(`/resume/${id}`);
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : "Unknown error");
    }
    setSaving(false);
  }, [id, content, contact]);

  // Experience helpers
  const addExperience = () => {
    setContent((prev: any) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", startDate: "", endDate: "", bullets: [""] },
      ],
    }));
    setActiveSection("experience");
  };

  const updateExperience = (index: number, update: any) => {
    setContent((prev: any) => ({
      ...prev,
      experience: prev.experience.map((exp: any, i: number) => (i === index ? { ...exp, ...update } : exp)),
    }));
  };

  const removeExperience = (index: number) => {
    setContent((prev: any) => ({
      ...prev,
      experience: prev.experience.filter((_: any, i: number) => i !== index),
    }));
  };

  // Education helpers
  const addEducation = () => {
    setContent((prev: any) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", field: "", school: "", startDate: "", endDate: "" },
      ],
    }));
    setActiveSection("education");
  };

  const updateEducation = (index: number, update: any) => {
    setContent((prev: any) => ({
      ...prev,
      education: prev.education.map((edu: any, i: number) => (i === index ? { ...edu, ...update } : edu)),
    }));
  };

  const removeEducation = (index: number) => {
    setContent((prev: any) => ({
      ...prev,
      education: prev.education.filter((_: any, i: number) => i !== index),
    }));
  };

  // Project helpers
  const addProject = () => {
    setContent((prev: any) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", description: "", technologies: [] },
      ],
    }));
    setActiveSection("projects");
  };

  const updateProject = (index: number, update: any) => {
    setContent((prev: any) => ({
      ...prev,
      projects: prev.projects.map((p: any, i: number) => (i === index ? { ...p, ...update } : p)),
    }));
  };

  const removeProject = (index: number) => {
    setContent((prev: any) => ({
      ...prev,
      projects: prev.projects.filter((_: any, i: number) => i !== index),
    }));
  };

  if (isPending || loading) {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto py-12 animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </PageShell>
    );
  }

  if (!isAuthenticated || !resume) {
    navigate("/login");
    return null;
  }

  const sections = [
    { id: "contact", label: "Contact Info" },
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <PageShell maxWidth="2xl">
      <PageHeader
        title="Edit Resume"
        subtitle="Modify your resume content section by section"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar navigation */}
        <div className="lg:w-48 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors text-left whitespace-nowrap",
                  activeSection === section.id
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Link
              to={`/resume/${id}`}
              className="text-center text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Editor panel */}
        <div className="flex-1 min-w-0">
          <Card className="p-6">
            {/* Contact Info Section */}
            {activeSection === "contact" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                <p className="text-sm text-gray-500">These fields are from your profile and appear on the resume header.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={contact.name} onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))} />
                  <Input label="Headline" value={contact.headline} onChange={(e) => setContact((p) => ({ ...p, headline: e.target.value }))} placeholder="e.g. Senior Software Engineer" />
                  <Input label="Email" value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} />
                  <Input label="Phone" value={contact.phone} onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} />
                  <Input label="Location" value={contact.location} onChange={(e) => setContact((p) => ({ ...p, location: e.target.value }))} />
                  <Input label="LinkedIn URL" value={contact.linkedinUrl} onChange={(e) => setContact((p) => ({ ...p, linkedinUrl: e.target.value }))} />
                  <Input label="GitHub URL" value={contact.githubUrl} onChange={(e) => setContact((p) => ({ ...p, githubUrl: e.target.value }))} />
                  <Input label="Website URL" value={contact.websiteUrl} onChange={(e) => setContact((p) => ({ ...p, websiteUrl: e.target.value }))} />
                </div>
              </div>
            )}

            {/* Summary Section */}
            {activeSection === "summary" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
                <p className="text-sm text-gray-500">A 2-3 sentence summary of your professional background and goals.</p>
                <Textarea
                  value={(content as any).summary}
                  onChange={(e: any) => setContent((p: any) => ({ ...p, summary: e.target.value }))}
                  rows={4}
                  placeholder="Experienced software engineer with expertise in..."
                />
              </div>
            )}

            {/* Experience Section */}
            {activeSection === "experience" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                  <Button variant="secondary" size="sm" onClick={addExperience}>+ Add</Button>
                </div>
                {content.experience.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No experience entries yet. Click "+ Add" to add one.</p>
                )}
                {content.experience.map((exp: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-gray-400">Experience {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeExperience(i)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input label="Job Title" value={exp.title} onChange={(e) => updateExperience(i, { title: e.target.value })} placeholder="e.g. Software Engineer" />
                      <Input label="Company" value={exp.company} onChange={(e) => updateExperience(i, { company: e.target.value })} placeholder="e.g. Google" />
                      <Input label="Start Date" value={exp.startDate} onChange={(e) => updateExperience(i, { startDate: e.target.value })} placeholder="e.g. Jan 2022" />
                      <Input label="End Date" value={exp.endDate} onChange={(e) => updateExperience(i, { endDate: e.target.value })} placeholder="e.g. Present" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bullet Points</label>
                      <BulletEditor
                        bullets={(exp.bullets || []) as string[]}
                        onChange={(bullets) => updateExperience(i, { bullets })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education Section */}
            {activeSection === "education" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                  <Button variant="secondary" size="sm" onClick={addEducation}>+ Add</Button>
                </div>
                {content.education.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No education entries yet.</p>
                )}
                {content.education.map((edu: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-gray-400">Education {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(i)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input label="Degree" value={edu.degree} onChange={(e) => updateEducation(i, { degree: e.target.value })} placeholder="e.g. B.S." />
                      <Input label="Field" value={edu.field} onChange={(e) => updateEducation(i, { field: e.target.value })} placeholder="e.g. Computer Science" />
                      <Input label="School" value={edu.school} onChange={(e) => updateEducation(i, { school: e.target.value })} placeholder="e.g. MIT" />
                      <Input label="Start Date" value={edu.startDate} onChange={(e) => updateEducation(i, { startDate: e.target.value })} placeholder="e.g. Sep 2018" />
                      <Input label="End Date" value={edu.endDate} onChange={(e) => updateEducation(i, { endDate: e.target.value })} placeholder="e.g. Jun 2022" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Section */}
            {activeSection === "skills" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                <p className="text-sm text-gray-500">Add skills relevant to your target role. Ordered by relevance.</p>
                <SkillsEditor
                  skills={(content.skills || []).map((s: any) => typeof s === "string" ? s : s.name || "")}
                  onChange={(skills: string[]) => setContent((p: any) => ({ ...p, skills }))}
                />
              </div>
            )}

            {/* Projects Section */}
            {activeSection === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                  <Button variant="secondary" size="sm" onClick={addProject}>+ Add</Button>
                </div>
                {content.projects.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No projects yet.</p>
                )}
                {content.projects.map((proj: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-gray-400">Project {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeProject(i)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <Input label="Project Name" value={proj.name} onChange={(e) => updateProject(i, { name: e.target.value })} placeholder="e.g. AI Resume Analyzer" />
                    <Textarea label="Description" value={proj.description} onChange={(e) => updateProject(i, { description: e.target.value })} rows={2} placeholder="What does this project do?" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                      <SkillsEditor
                        skills={(proj.technologies || []) as string[]}
                        onChange={(technologies) => updateProject(i, { technologies })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
