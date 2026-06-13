interface UserProfileData {
  headline?: string | null;
  summary?: string | null;
  location?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
}

interface ProfileData {
  education?: any[] | null;
  experience?: any[] | null;
  projects?: any[] | null;
  skills?: string[];
  certifications?: any[] | null;
  languages?: string[];
}

interface SectionResult {
  name: string;
  complete: boolean;
  percentage: number;
  missingFields: string[];
}

export interface CompletionResult {
  percentage: number;
  sections: SectionResult[];
  onboardingComplete: boolean;
}

export function calculateProfileCompletion(
  user: UserProfileData,
  profile: ProfileData | null,
): CompletionResult {
  const sections: SectionResult[] = [];

  // Section 1: Basic Info (25%)
  const basicMissing: string[] = [];
  if (!user.headline) basicMissing.push('headline');
  if (!user.summary) basicMissing.push('summary');
  if (!user.location) basicMissing.push('location');
  const basicFields = 3;
  const basicFilled = basicFields - basicMissing.length;
  sections.push({
    name: 'Basic Info',
    complete: basicMissing.length === 0,
    percentage: Math.round((basicFilled / basicFields) * 100),
    missingFields: basicMissing,
  });

  // Section 2: Education (25%)
  const eduEntries = profile?.education;
  const hasEdu = Array.isArray(eduEntries) && eduEntries.length > 0;
  const eduComplete = hasEdu && eduEntries.some((e: any) => e.school && e.degree);
  sections.push({
    name: 'Education',
    complete: eduComplete,
    percentage: eduComplete ? 100 : hasEdu ? 50 : 0,
    missingFields: eduComplete ? [] : ['at least 1 education entry with school and degree'],
  });

  // Section 3: Experience (25%)
  const expEntries = profile?.experience;
  const hasExp = Array.isArray(expEntries) && expEntries.length > 0;
  const expComplete = hasExp && expEntries.some((e: any) => e.company && e.title);
  sections.push({
    name: 'Experience',
    complete: expComplete,
    percentage: expComplete ? 100 : hasExp ? 50 : 0,
    missingFields: expComplete ? [] : ['at least 1 experience entry with company and title'],
  });

  // Section 4: Skills (15%)
  const skills = profile?.skills || [];
  const skillsComplete = skills.length >= 3;
  const skillsPartial = skills.length > 0 ? Math.min(100, Math.round((skills.length / 3) * 100)) : 0;
  sections.push({
    name: 'Skills',
    complete: skillsComplete,
    percentage: skillsComplete ? 100 : skillsPartial,
    missingFields: skillsComplete ? [] : [`at least 3 skills (have ${skills.length})`],
  });

  // Section 5: Links (10%)
  const linksMissing: string[] = [];
  if (!user.linkedinUrl) linksMissing.push('linkedin');
  if (!user.githubUrl) linksMissing.push('github');
  if (!user.websiteUrl) linksMissing.push('website');
  const hasAtLeastOneLink = !!(user.linkedinUrl || user.githubUrl || user.websiteUrl);
  sections.push({
    name: 'Links',
    complete: hasAtLeastOneLink,
    percentage: hasAtLeastOneLink ? 100 : 0,
    missingFields: hasAtLeastOneLink ? [] : ['at least 1 social link'],
  });

  // Section 6: Projects (optional, 10%)
  const projectEntries = profile?.projects;
  const hasProjects = Array.isArray(projectEntries) && projectEntries.length > 0;
  sections.push({
    name: 'Projects',
    complete: hasProjects,
    percentage: hasProjects ? 100 : 0,
    missingFields: [], // optional — no required fields
  });

  // Weighted total
  const weights = [25, 20, 20, 15, 10, 10];
  let total = 0;
  for (let i = 0; i < sections.length; i++) {
    total += (sections[i].percentage / 100) * weights[i];
  }
  const percentage = Math.round(total);

  // Onboarding requires: headline + summary + location + 1 edu + 1 exp + 3 skills
  const onboardingComplete = !!(
    user.headline && user.summary && user.location &&
    eduComplete && expComplete && skillsComplete
  );

  return { percentage, sections, onboardingComplete };
}
