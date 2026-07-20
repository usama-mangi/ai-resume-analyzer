import type { GeneratedResume, ResumeVersionContent, ResumeBasics, ResumeExperience, ResumeEducation, ResumeSkill, ResumeProject, ResumeCertification, ResumeLanguage, ResumeAward, ResumePublication, ResumeVolunteer, ResumeReference, CustomSection, UserProfile } from "types";
import { cn } from "~/lib/utils";

interface ResumePreviewProps {
  content: GeneratedResume | ResumeVersionContent;
  profile?: UserProfile | null;
  resumeTitle: string;
  companyName?: string;
  className?: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatDateRange(startDate?: string, endDate?: string, current?: boolean): string {
  const start = formatDate(startDate || "");
  const end = current ? "Present" : formatDate(endDate || "");
  return `${start} – ${end}`;
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-[13px] font-bold text-black uppercase tracking-wide border-b border-black pb-1 mb-3 mt-5 first:mt-0">
      {title}
    </h2>
  );
}

export function ResumePreview({ content, profile, resumeTitle, companyName, className }: ResumePreviewProps) {
  const basics = content.basics || {};
  const name = basics.name || (content as any).name || profile?.name || "";
  const headline = basics.headline || (content as any).headline || profile?.headline || resumeTitle;
  const email = basics.email || (content as any).email || profile?.email || "";
  const phone = basics.phone || (content as any).phone || profile?.phone || "";
  const location = basics.location || (content as any).location || profile?.location || "";
  const linkedin = basics.linkedin || (content as any).linkedin || profile?.linkedinUrl || "";
  const github = basics.github || (content as any).github || profile?.githubUrl || "";
  const website = basics.website || (content as any).website || profile?.websiteUrl || "";
  // Summary: check basics first, then top-level (AI generates at top-level)
  const summary = basics.summary || (content as any).summary || "";

  const hasExperience = content.experience && content.experience.length > 0;
  const hasEducation = content.education && content.education.length > 0;
  const hasSkills = content.skills && content.skills.length > 0;
  const hasProjects = content.projects && content.projects.length > 0;
  const hasCertifications = content.certifications && content.certifications.length > 0;
  const hasLanguages = content.languages && content.languages.length > 0;
  const hasAwards = content.awards && content.awards.length > 0;
  const hasPublications = content.publications && content.publications.length > 0;
  const hasVolunteer = content.volunteer && content.volunteer.length > 0;
  const hasReferences = content.references && content.references.length > 0;
  const hasCustomSections = content.customSections && content.customSections.length > 0;

  interface ContactItem { label: string; href?: string; }
  const contactItems: ContactItem[] = [];
  if (location) contactItems.push({ label: location });
  if (phone) contactItems.push({ label: phone, href: `tel:${phone}` });
  if (email) contactItems.push({ label: email, href: `mailto:${email}` });
  if (linkedin) contactItems.push({ label: linkedin.replace(/^https?:\/\//, ""), href: linkedin.startsWith("http") ? linkedin : `https://${linkedin}` });
  if (github) contactItems.push({ label: github.replace(/^https?:\/\//, ""), href: github.startsWith("http") ? github : `https://${github}` });
  if (website) contactItems.push({ label: website.replace(/^https?:\/\//, ""), href: website.startsWith("http") ? website : `https://${website}` });

  return (
    <div className={cn("bg-white text-black font-[Georgia,Times,serif]", className)}>
      {/* Name */}
      <header className="text-center mb-4">
        {name && <h1 className="text-[22px] font-bold tracking-wide uppercase">{name}</h1>}
        {headline && <p className="text-[11px] text-gray-700 mt-0.5">{headline}</p>}
      </header>

      {/* Contact line */}
      {contactItems.length > 0 && (
        <div className="text-center text-[10px] text-gray-600 mb-4 leading-relaxed">
          {contactItems.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-1.5">|</span>}
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline text-black">{item.label}</a>
              ) : (
                <span>{item.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <SectionHeading title="Professional Summary" />
          <p className="text-[11px] leading-[1.6] text-gray-800">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {hasExperience && (
        <section className="mb-4">
          <SectionHeading title="Professional Experience" />
          <div className="space-y-3">
            {content.experience!.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[12px] font-bold text-black">{exp.title}</span>
                    {exp.company && <span className="text-[12px] text-gray-700">, {exp.company}</span>}
                    {exp.location && <span className="text-[12px] text-gray-500"> — {exp.location}</span>}
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 ml-3">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>

                {exp.description && (
                  <p className="text-[11px] leading-[1.6] text-gray-800 mt-1">{exp.description}</p>
                )}

                {(() => {
                  const bullets = exp.bullets || exp.highlights;
                  if (!bullets || bullets.length === 0) return null;
                  return (
                    <ul className="mt-1 space-y-0.5">
                      {bullets.filter(Boolean).map((h: string, hi: number) => (
                        <li key={hi} className="text-[11px] leading-[1.6] text-gray-800 flex">
                          <span className="shrink-0 w-3 text-center">&bull;</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  );
                })()}

                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="text-[10px] text-gray-500 mt-1">
                    <span className="font-semibold">Technologies:</span> {exp.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {hasEducation && (
        <section className="mb-4">
          <SectionHeading title="Education" />
          <div className="space-y-2">
            {content.education!.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[12px] font-bold text-black">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </span>
                    {edu.school && <span className="text-[12px] text-gray-700">, {edu.school}</span>}
                    {edu.location && <span className="text-[12px] text-gray-500"> — {edu.location}</span>}
                  </div>
                  {edu.startDate || edu.endDate ? (
                    <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 ml-3">
                      {formatDateRange(edu.startDate || "", edu.endDate || "")}
                    </span>
                  ) : null}
                </div>
                {edu.gpa && <p className="text-[11px] text-gray-600 mt-0.5">GPA: {edu.gpa}</p>}
                {edu.honors && edu.honors.length > 0 && (
                  <p className="text-[11px] text-gray-600 mt-0.5">Honors: {edu.honors.join(", ")}</p>
                )}
                {edu.coursework && edu.coursework.length > 0 && (
                  <p className="text-[11px] text-gray-600 mt-0.5">Relevant Coursework: {edu.coursework.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section className="mb-4">
          <SectionHeading title="Skills" />
          <div className="space-y-1.5">
            {(() => {
              // Handle both string[] and ResumeSkill[]
                const skills = content.skills!;

                if (skills.length > 0 && typeof skills[0] === 'string') {
                  return (
                    <p className="text-[11px] leading-[1.6] text-gray-800">
                      {skills.join(", ")}
                    </p>
                  );
                }

                const skillArray = skills as ResumeSkill[];
                const categorized = skillArray.reduce((acc, skill) => {
                  const cat = skill.category || "Technical Skills";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(skill);
                  return acc;
                }, {} as Record<string, ResumeSkill[]>);

              return Object.entries(categorized).map(([category, skills]) => {
                const names = skills.map((s) => s.name).filter(Boolean);
                if (names.length === 0) return null;
                return (
                  <p key={category} className="text-[11px] leading-[1.6] text-gray-800">
                    <span className="font-bold">{category}:</span> {names.join(", ")}
                  </p>
                );
              });
            })()}
          </div>
        </section>
      )}

      {/* Projects */}
      {hasProjects && (
        <section className="mb-4">
          <SectionHeading title="Projects" />
          <div className="space-y-3">
            {content.projects!.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[12px] font-bold text-black">{proj.name}</span>
                    {proj.url && (
                      <span className="text-[10px] text-gray-500 ml-2">({proj.url.replace(/^https?:\/\//, "")})</span>
                    )}
                  </div>
                  {proj.startDate || proj.endDate ? (
                    <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 ml-3">
                      {formatDateRange(proj.startDate || "", proj.endDate || "")}
                    </span>
                  ) : null}
                </div>
                {proj.description && (
                  <p className="text-[11px] leading-[1.6] text-gray-800 mt-0.5">{proj.description}</p>
                )}
                {(() => {
                  const bullets = proj.bullets || proj.highlights;
                  if (!bullets || bullets.length === 0) return null;
                  return (
                    <ul className="mt-1 space-y-0.5">
                      {bullets.filter(Boolean).map((h: string, hi: number) => (
                        <li key={hi} className="text-[11px] leading-[1.6] text-gray-800 flex">
                          <span className="shrink-0 w-3 text-center">&bull;</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[10px] text-gray-500 mt-1">
                    <span className="font-semibold">Technologies:</span> {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {hasCertifications && (
        <section className="mb-4">
          <SectionHeading title="Certifications" />
          <div className="space-y-1">
            {content.certifications!.map((cert, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="text-[11px] font-bold text-black">{cert.name}</span>
                  <span className="text-[11px] text-gray-600"> — {cert.issuer}</span>
                </div>
                <span className="text-[10px] text-gray-500 shrink-0 ml-3">{formatDate(cert.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {hasLanguages && (
        <section className="mb-4">
          <SectionHeading title="Languages" />
          <p className="text-[11px] text-gray-800">
            {content.languages!.map((l) => `${l.name || l.language || "Unknown"} (${l.proficiency || ""})`).join(", ")}
          </p>
        </section>
      )}

      {/* Awards */}
      {hasAwards && (
        <section className="mb-4">
          <SectionHeading title="Awards & Honors" />
          <div className="space-y-1">
            {content.awards!.map((award, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="text-[11px] font-bold text-black">{award.title}</span>
                  {award.issuer && <span className="text-[11px] text-gray-600"> — {award.issuer}</span>}
                </div>
                <span className="text-[10px] text-gray-500 shrink-0 ml-3">{formatDate(award.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {hasPublications && (
        <section className="mb-4">
          <SectionHeading title="Publications" />
          <div className="space-y-1">
            {content.publications!.map((pub, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="text-[11px] text-gray-800 italic">&ldquo;{pub.title}&rdquo;</span>
                  {pub.publisher && <span className="text-[11px] text-gray-600"> — {pub.publisher}</span>}
                </div>
                <span className="text-[10px] text-gray-500 shrink-0 ml-3">{formatDate(pub.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer */}
      {hasVolunteer && (
        <section className="mb-4">
          <SectionHeading title="Volunteer Experience" />
          <div className="space-y-3">
            {content.volunteer!.map((vol, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[12px] font-bold text-black">{vol.role}</span>
                    <span className="text-[12px] text-gray-700">, {vol.organization}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 ml-3">
                    {formatDateRange(vol.startDate, vol.endDate)}
                  </span>
                </div>
                {vol.description && <p className="text-[11px] leading-[1.6] text-gray-800 mt-0.5">{vol.description}</p>}
                {vol.highlights && vol.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {vol.highlights.map((h, hi) => (
                      <li key={hi} className="text-[11px] leading-[1.6] text-gray-800 flex">
                        <span className="shrink-0 w-3 text-center">&bull;</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {hasReferences && (
        <section className="mb-4">
          <SectionHeading title="References" />
          <div className="space-y-1">
            {content.references!.map((ref, i) => (
              <p key={i} className="text-[11px] text-gray-800">
                {ref.name}, {ref.title}, {ref.company}
                {ref.email && <span className="text-gray-500"> — {ref.email}</span>}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {hasCustomSections && content.customSections!.map((section, i) => (
        <section key={i} className="mb-4">
          <SectionHeading title={section.title || section.name || "Section"} />
          <div className="text-[11px] leading-[1.6] text-gray-800">
            {(section.content || "").split("\n").filter(Boolean).map((para: string, pi: number) => (
              <p key={pi} className="mb-1">{para}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default ResumePreview;
