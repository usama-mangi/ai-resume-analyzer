export const ANALYSIS_SYSTEM_MESSAGE = `You are an expert ATS and resume analysis system. You MUST respond with a single valid JSON object and nothing else.

The JSON MUST have EXACTLY these 8 top-level keys:
- "overallScore" (number 0-100)
- "ATS" (object with "score" number 0-100 and "tips" array of 3-4 objects each with "type" and "tip")
- "toneAndStyle" (object with "score" number 0-100 and "tips" array of 3-4 objects each with "type", "tip", and "explanation")
- "content" (object with "score" number 0-100 and "tips" array of 3-4 objects each with "type", "tip", and "explanation")
- "structure" (object with "score" number 0-100 and "tips" array of 3-4 objects each with "type", "tip", and "explanation")
- "skills" (object with "score" number 0-100 and "tips" array of 3-4 objects each with "type", "tip", and "explanation")
- "keywordMatchScore" (number 0-100 — how well resume keywords match the job description)
- "formatScore" (number 0-100 — formatting, layout, and ATS parsability)

Each "type" must be either "good" or "improve".

CRITICAL: Before outputting, verify your response has all 8 top-level keys. If ANY key is missing, your response is invalid. NEVER return partial JSON. If analysis cannot be completed, return the full structure with score 0 and a tip explaining the issue.`;

const AIResponseFormat = `{
  "overallScore": 75,
  "ATS": {
    "score": 60,
    "tips": [
      { "type": "improve", "tip": "Add missing keywords from the job description" },
      { "type": "good", "tip": "Clean formatting is ATS-compatible" },
      { "type": "improve", "tip": "Use standard section headings" },
      { "type": "good", "tip": "Consistent date formatting throughout" }
    ]
  },
  "toneAndStyle": {
    "score": 70,
    "tips": [
      { "type": "improve", "tip": "Use more action verbs", "explanation": "Replace passive phrases like 'was responsible for' with strong action verbs like 'spearheaded' or 'optimized'." },
      { "type": "good", "tip": "Professional tone maintained", "explanation": "The overall tone is professional and appropriate for the target role." },
      { "type": "improve", "tip": "Quantify achievements", "explanation": "Add metrics and numbers to demonstrate impact, e.g. 'increased revenue by 20%'." },
      { "type": "good", "tip": "Consistent voice throughout", "explanation": "The resume maintains first-person implied voice consistently." }
    ]
  },
  "content": {
    "score": 65,
    "tips": [
      { "type": "improve", "tip": "Strengthen work experience bullets", "explanation": "Current bullets describe duties rather than achievements. Rewrite each bullet to show impact with specific results." },
      { "type": "good", "tip": "Relevant education section", "explanation": "Education details are complete and relevant to the target role." },
      { "type": "improve", "tip": "Add missing technical skills", "explanation": "The job description requires Docker and Kubernetes experience, which are not mentioned in the skills section." },
      { "type": "good", "tip": "Clear project descriptions", "explanation": "Project descriptions provide good context about the technologies used." }
    ]
  },
  "structure": {
    "score": 72,
    "tips": [
      { "type": "improve", "tip": "Add a professional summary", "explanation": "Include a 2-3 sentence professional summary at the top to immediately highlight your value proposition." },
      { "type": "good", "tip": "Logical section ordering", "explanation": "Sections flow logically from contact info through experience to education." },
      { "type": "improve", "tip": "Improve section headers", "explanation": "Use standard ATS-friendly headers like 'Work Experience' instead of creative alternatives." },
      { "type": "good", "tip": "Adequate white space", "explanation": "The layout has good spacing making it easy to scan." }
    ]
  },
  "skills": {
    "score": 55,
    "tips": [
      { "type": "improve", "tip": "Add more relevant keywords", "explanation": "Include specific tools and technologies mentioned in the job description such as AWS, CI/CD pipelines, and agile methodologies." },
      { "type": "good", "tip": "Core programming skills listed", "explanation": "Primary programming languages are clearly listed and relevant." },
      { "type": "improve", "tip": "Categorize skills", "explanation": "Group skills into categories (Languages, Frameworks, Tools, Cloud) for better readability and ATS parsing." },
      { "type": "improve", "tip": "Remove outdated technologies", "explanation": "Remove or de-emphasize older technologies that are less relevant to modern roles." }
    ]
  },
  "keywordMatchScore": 65,
  "formatScore": 80
}`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `Analyze this resume for ATS compatibility and overall quality.

Job Title: ${jobTitle}
Job Description: ${jobDescription || "Not provided — evaluate against general best practices."}

Be critical and thorough. Identify specific weaknesses, missing keywords, and formatting issues. Provide actionable suggestions tied to specific resume sections.

You MUST return a JSON object with ALL SIX of these keys — missing ANY key is a failure:

{
  "overallScore": <number 0-100>,
  "ATS": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good"|"improve", "tip": "<specific tip>" },
      ...
    ]
  },
  "toneAndStyle": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good"|"improve", "tip": "<specific tip>", "explanation": "<detailed explanation>" },
      ...
    ]
  },
  "content": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good"|"improve", "tip": "<specific tip>", "explanation": "<detailed explanation>" },
      ...
    ]
  },
  "structure": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good"|"improve", "tip": "<specific tip>", "explanation": "<detailed explanation>" },
      ...
    ]
  },
  "skills": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good"|"improve", "tip": "<specific tip>", "explanation": "<detailed explanation>" },
      ...
    ]
  }
}

Rules:
- Each section MUST have a score (0-100) and a tips array with 3-4 tips.
- "type" must be "good" or "improve".
- ATS tips only need "type" and "tip". All other sections need "type", "tip", and "explanation".
- Tips must reference specific resume sections or content (e.g., "Work Experience bullet 2", "Skills section").
- Lower scores for significant flaws. Be objective and evidence-based.
- Return ONLY the JSON object. No markdown fences, no commentary, no preamble.`;

const SkillGapResponseFormat = `
  interface SkillGapResult {
    totalScore: number; // 0-100: how well the resume covers the required skills
    presentSkills: string[]; // skills from the job description that are present in the resume
    missingSkills: {
      skill: string; // the skill name
      importance: "critical" | "important" | "nice-to-have"; // how important for the role
      recommendations: {
        title: string; // specific resource/course name
        type: "course" | "article" | "project" | "certification" | "documentation";
        description: string; // what this resource teaches and why it's relevant
        duration?: string; // estimated time commitment e.g. "4 weeks", "2 hours"
        difficulty: "beginner" | "intermediate" | "advanced";
      }[]; // 2-3 actionable recommendations per missing skill
    }[];
    summary: string; // 2-3 sentence overview of the skill gap analysis
  }`;

export const prepareSkillGapInstructions = ({
  jobTitle,
  jobDescription,
  resumeText,
  feedback,
}: {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  feedback: string;
}) => `You are an expert career coach and skills analyst. Your task is to analyze a candidate's resume against a job description and identify skill gaps with actionable learning recommendations.

    Context:
    - Job Title: ${jobTitle}
    - Job Description: ${jobDescription || "Not provided — use general best practices for the role."}
    - Resume Text: ${resumeText}
    - ATS Feedback Analysis: ${feedback}

    Your task:
    1. Extract all skills, technologies, and qualifications mentioned in the job description.
    2. Compare them against the candidate's resume to identify which skills are present and which are missing.
    3. Categorize each missing skill by importance: "critical" (required for the role), "important" (strongly preferred), or "nice-to-have" (bonus/optional).
    4. For each missing skill, provide 2-3 specific, actionable learning recommendations (real courses, platforms, certifications, documentation, or projects).
    5. Calculate a totalScore (0-100) representing what percentage of the required skills are covered by the resume.
    6. Only include skills that are genuinely relevant to the job — do not pad the list.
    7. Be specific with recommendations: include actual platform names (Coursera, Udemy, freeCodeCamp, MDN, AWS documentation, etc.), course titles, and estimated duration where possible.

    Return the analysis as a JSON object adhering to the format: ${SkillGapResponseFormat}

    If no job description is provided, evaluate the resume against industry-standard skills for the given job title. Do not include any text or comments outside the JSON output.`;

const InterviewQuestionsResponseFormat = `
  interface InterviewQuestionsResult {
    questions: {
      question: string; // the interview question
      category: "behavioral" | "technical" | "role-specific" | "situational";
      talkingPoints: string[]; // 2-3 specific points from the resume/JD to mention in the answer
      whatInterviewerLooksFor: string; // what the interviewer is trying to assess
      difficulty: "easy" | "medium" | "hard";
    }[];
    preparationTips: string[]; // 3-4 general tips for the interview
    keyTopicsToReview: string[]; // 3-5 topics/skills to brush up on before the interview
    confidence: number; // 0-100: how well prepared the candidate appears based on their resume
  }`;

export const prepareInterviewQuestionsInstructions = ({
  jobTitle,
  jobDescription,
  resumeText,
  feedback,
  questionCount,
  focusAreas,
}: {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  feedback: string;
  questionCount: number;
  focusAreas?: string;
}) => `You are an expert interview coach and hiring manager. Your task is to generate realistic interview questions tailored to a candidate's resume and a specific job description.

    Context:
    - Job Title: ${jobTitle}
    - Job Description: ${jobDescription || "Not provided — generate questions based on the candidate's resume and general best practices for the role."}
    - Resume Text: ${resumeText}
    - ATS Feedback Analysis: ${feedback}
    - Focus Areas (optional): ${focusAreas || "None specified — cover all relevant areas."}

    Your task:
    1. Generate ${questionCount} interview questions across these categories:
       - Behavioral: Questions about past experiences and soft skills (e.g., teamwork, conflict resolution, leadership).
       - Technical: Questions about specific hard skills, tools, and technologies mentioned in the resume or JD.
       - Role-specific: Questions directly tied to the job description's responsibilities and requirements.
       - Situational: Hypothetical scenarios the candidate might face in the role.
    2. Distribute the questions across categories based on what's most relevant — the mix should reflect the role's demands.
    3. For each question, provide 2-3 specific talking points from the candidate's resume or the job description that would make for a strong answer.
    4. Include what the interviewer is looking for in each question — this helps the candidate understand the intent behind the question.
    5. Rate each question's difficulty based on the complexity of the topic and the seniority level of the role.
    6. Provide 3-4 general preparation tips for the interview.
    7. List 3-5 key topics/skills the candidate should review before the interview.
    8. Calculate a confidence score (0-100) indicating how well-prepared the candidate appears based on their resume alignment with the job.

    Return the analysis as a JSON object adhering to the format: ${InterviewQuestionsResponseFormat}

    If no job description is provided, generate questions based on the candidate's resume and industry-standard expectations for the given job title. Be specific and realistic — avoid generic questions that could apply to any role. Do not include any text or comments outside the JSON output.`;

const SalaryRangeResponseFormat = `
  interface SalaryRangeResult {
    estimatedRange: {
      p10: number; // 10th percentile (low-end)
      p25: number; // 25th percentile
      p50: number; // median (50th percentile)
      p75: number; // 75th percentile
      p90: number; // 90th percentile (high-end)
    };
    currency: string; // e.g. "USD", "EUR", "GBP"
    currencySymbol: string; // e.g. "$", "€", "£"
    period: "yearly" | "monthly" | "hourly";
    marketLevel: "below-market" | "market" | "above-market"; // how the candidate's profile compares
    confidence: "low" | "medium" | "high"; // confidence in the estimate
    factors: string[]; // key factors influencing the estimate (location, experience, skills, industry, etc.)
    locationAdjustments?: {
      location: string; // e.g. "San Francisco", "Remote - US"
      adjustment: string; // e.g. "+25% vs national average"
      range: { p10: number; p25: number; p50: number; p75: number; p90: number };
    }[];
    summary: string; // 2-3 sentence overview
  }`;

export const prepareSalaryEstimationInstructions = ({
  jobTitle,
  jobDescription,
  resumeText,
  feedback,
  targetLocation,
  yearsOfExperience,
  targetIndustry,
}: {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  feedback: string;
  targetLocation?: string;
  yearsOfExperience?: string;
  targetIndustry?: string;
}) => `You are an expert compensation analyst and market researcher. Your task is to estimate a realistic salary range for a candidate based on their resume, job description, and market data.

    Context:
    - Job Title: ${jobTitle}
    - Job Description: ${jobDescription || "Not provided — estimate based on the candidate's resume and industry standards."}
    - Resume Text: ${resumeText}
    - ATS Feedback Analysis: ${feedback}
    - Target Location: ${targetLocation || "Not specified — use national/major-market averages."}
    - Years of Experience: ${yearsOfExperience || "Infer from resume content"}
    - Target Industry: ${targetIndustry || "Infer from job title and resume content"}

    Your task:
    1. Analyze the candidate's experience level, skills, education, and overall profile from the resume.
    2. Consider the job description's seniority level, required skills, and responsibilities.
    3. Use your knowledge of current market salary data (as of 2025-2026) for similar roles.
    4. Provide a percentile-based salary range (p10 through p90) in the most appropriate currency.
    5. Rate whether the candidate's profile commands below-market, market, or above-market compensation.
    6. List key factors that influence the estimate (location, industry, experience, skills shortage, company size, etc.).
    7. If targetLocation is provided, also provide location-specific adjustments with adjusted ranges for common markets.
    8. Rate your confidence based on how much information is available — "high" if both JD and resume are detailed, "medium" if one is sparse, "low" if very little info.
    9. Choose the appropriate period (yearly for salaried roles, monthly in some markets, hourly for contract/part-time).

    Important guidelines:
    - Be realistic and data-driven — do not inflate or deflate numbers.
    - Consider the full compensation picture but report base salary range.
    - For tech roles in USD, use the US market as the baseline and adjust for other locations.
    - If no location is specified, default to US national averages.
    - Distinguish between early-career, mid-career, senior, and executive levels.
    - Factor in industry-specific variations (e.g., finance pays more than non-profits for the same title).

    Return the analysis as a JSON object adhering to the format: ${SalaryRangeResponseFormat}

    Do not include any text or comments outside the JSON output.`;

export const prepareMultiJdInstructions = ({
  baseJobTitle,
  resumeText,
  feedback,
  jobEntries,
}: {
  baseJobTitle: string;
  resumeText: string;
  feedback: string;
  jobEntries: { title: string; description: string }[];
}) => `You are an expert career coach and ATS analyst. Your task is to evaluate a single resume against multiple job descriptions and rank which role is the best fit.

Context:
- Resume's original job title: ${baseJobTitle}
- Resume Text: ${resumeText}
- ATS Feedback Analysis: ${feedback}

Job Descriptions to compare:
${jobEntries.map((j, i) => `JD ${i + 1}:
  Title: ${j.title}
  Description: ${j.description || "Not provided"}`).join('\n\n')}

Your task:
1. For each job description, evaluate the resume against the specific requirements, skills, and qualifications of that role.
2. Assign an overallScore (0-100) for how well the resume matches each role.
3. Provide a full ATS-style breakdown for each JD including scores and tips for:
   - ATS compatibility (keyword matching, formatting for ATS)
   - Tone & style (professional tone alignment with the role)
   - Content (experience relevance, achievements)
   - Structure (organization, section completeness)
   - Skills (technical and soft skill alignment)
4. Identify which JD is the best match and explain why.
5. Provide an overarching recommendation for how the candidate could tailor their resume.

Return a JSON object with this exact structure:
{
  comparisons: {
    jobTitle: string;
    overallScore: number;
    ATS: { score: number; tips: { type: "good" | "improve"; tip: string }[] };
    toneAndStyle: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string }[] };
    content: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string }[] };
    structure: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string }[] };
    skills: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string }[] };
    summary: string; // 1-2 sentence summary of this match
  }[];
  bestMatch: string; // title of the best-matching JD
  recommendation: string; // 2-3 sentence recommendation
}

Be thorough and objective. Do not pad scores — be critical where the resume falls short. Do not include any text outside the JSON output.`;

const TemplateSuggestionsResponseFormat = `
  interface ResumeTemplateSuggestionsResult {
    currentTemplateScore: number;
    currentTemplateAnalysis: string;
    suggestions: {
      name: string;
      description: string;
      bestFor: string[];
      keyFeatures: string[];
      sectionOrder: string[];
      designTips: string[];
      atsScore: number;
    }[];
    customizationTips: string[];
    summary: string;
  }`;

export const prepareTemplateSuggestionsInstructions = ({
  jobTitle,
  jobDescription,
  resumeText,
  feedback,
}: {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  feedback: string;
}) => `You are an expert resume design consultant and ATS specialist. Your task is to analyze a candidate's resume and recommend the most effective resume templates/styles based on their industry, experience level, career goals, and the job description.

    Context:
    - Job Title: ${jobTitle}
    - Job Description: ${jobDescription || "Not provided — use general best practices for the role."}
    - Resume Text: ${resumeText}
    - ATS Feedback Analysis: ${feedback}

    Your task:
    1. Analyze the candidate's current resume template/layout based on the resume text and feedback.
    2. Score how ATS-friendly and effective the current template is (0-100).
    3. Recommend 3-4 resume templates/styles that would work best for this candidate, including:
       - Reverse-Chronological: Best for candidates with consistent career progression in the same field.
       - Hybrid/Combination: Best for showcasing both skills and career progression.
       - Functional: Best for career changers or those with employment gaps.
       - Creative: Best for design/creative roles where visual layout matters.
       - Targeted: Highly customized for a specific role or company.
       - Executive: Best for senior leadership roles emphasizing accomplishments.
    4. For each template, explain why it suits the candidate and provide specific design tips.
    5. Score each recommended template for ATS compatibility.
    6. Provide 3-4 general customization tips applicable to any template the candidate chooses.
    7. Consider the candidate's industry norms, years of experience, and any specific feedback from the ATS analysis.

    Return the analysis as a JSON object adhering to the format: ${TemplateSuggestionsResponseFormat}

    Do not include any text or comments outside the JSON output.`;

export const prepareCoverLetterInstructions = ({
  jobTitle,
  jobDescription,
  companyName,
  resumeText,
  feedback,
  hiringManager,
  additionalContext,
}: {
  jobTitle: string;
  jobDescription: string;
  companyName: string;
  resumeText: string;
  feedback: string;
  hiringManager?: string;
  additionalContext?: string;
}) => `You are an expert cover letter writer and career coach. Your task is to write a professional, tailored cover letter for a job applicant based on their resume, the job description, and the detailed ATS feedback analysis.

    Context:
    - Job Title: ${jobTitle}
    - Company Name: ${companyName}
    - Job Description: ${jobDescription || "Not provided — focus on the candidate's strengths and general best practices."}
    - Hiring Manager: ${hiringManager || "Hiring Manager"}
    - Additional Context from Applicant: ${additionalContext || "None provided"}
    - Resume Text: ${resumeText}
    - ATS Feedback Analysis: ${feedback}

    Requirements:
    1. Write a compelling, professional cover letter that highlights the candidate's relevant skills and experiences.
    2. Address the cover letter to the hiring manager (if provided, use the name; otherwise use "Hiring Manager").
    3. Reference specific skills, achievements, or qualifications from the resume that align with the job description.
    4. Address any weaknesses identified in the ATS feedback analysis by framing them as areas of growth or learning.
    5. Keep the tone confident, professional, and enthusiastic — not arrogant or desperate.
    6. Structure the letter with:
       - Opening paragraph: Introduction and expression of interest
       - 2-3 body paragraphs: Highlight relevant experience, skills, and achievements
       - Closing paragraph: Call to action and thank you
    7. The letter should be 3-4 paragraphs, approximately 250-400 words.
    8. Do NOT include placeholders like [Your Name] or [Your Address] — the letter is written from the candidate's perspective.
    9. CRITICAL: Only reference achievements, skills, and experiences that are explicitly stated in the resume. Do NOT invent metrics, accomplishments, or qualifications not present in the original data.
    10. Return ONLY a JSON object with a single key "coverLetter" containing the full cover letter text as a string.
    11. Do not include any text or comments outside the JSON output.`;

const JobMatchResponseFormat = `
  interface JobMatchResult {
    overallMatch: number; // 0-100
    skillMatch: {
      matched: string[]; // skills from JD found in resume
      missing: {
        skill: string;
        importance: "critical" | "important" | "nice-to-have";
      }[]; // important skills from JD missing in resume
      score: number; // 0-100
    };
    experienceMatch: {
      yearsRequired: string;
      yearsCandidate: string;
      levelMatch: "exceeds" | "meets" | "below";
      score: number; // 0-100
    };
    keywordMatch: {
      keywordsFound: string[];
      keywordsMissing: string[];
      score: number; // 0-100
    };
    cultureFit: {
      score: number; // 0-100
      indicators: string[];
    };
    recommendations: {
      priority: "high" | "medium" | "low";
      action: string;
      reason: string;
    }[];
    summary: string; // 2-3 sentence overview
  }`;

export const prepareJobMatchInstructions = ({
  jobTitle,
  jobDescription,
  resumeText,
  feedback,
  userSkills,
}: {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  feedback: string;
  userSkills?: string[];
}) => `You are an AI career coach and job matching expert. Analyze how well a candidate's resume matches a specific job posting.

    Context:
    - Job Title: ${jobTitle}
    - Job Description: ${jobDescription}
    - Resume Text: ${resumeText}
    - ATS Feedback Analysis: ${feedback}
    - User's Known Skills: ${userSkills?.join(", ") || "Not provided"}

    Your task:
    1. Analyze the skill match between the resume and job description
    2. Evaluate experience level match (years, seniority)
    3. Check keyword overlap (technologies, methodologies, certifications)
    4. Assess culture fit indicators (values, work style, company size/type)
    5. Provide an overall match score (0-100)
    6. Give 3-5 specific, actionable recommendations prioritized by impact

    Return a JSON object with this exact structure: ${JobMatchResponseFormat}

    Rules:
    - Be objective and evidence-based
    - Score accurately: 80+ = strong match, 60-79 = good match, 40-59 = partial match, <40 = weak match
    - Identify specific missing skills with importance levels
    - Provide concrete actions the candidate can take (e.g., "Add Kubernetes to skills section", "Highlight project management experience in summary")
    - Return ONLY the JSON object. No markdown, no commentary, no extra text.`;

const BatchJobMatchResponseFormat = `
  interface BatchJobMatchResult {
    jobId: string;
    overallMatch: number; // 0-100
    skillMatch: {
      matched: string[];
      missing: { skill: string; importance: "critical" | "important" | "nice-to-have" }[];
      score: number;
    };
    experienceMatch: { score: number; levelMatch: "exceeds" | "meets" | "below" };
    keywordMatch: { keywordsFound: string[]; score: number };
    cultureFit: { score: number; indicators: string[] };
    topRecommendation: string;
  }`;

export const prepareBatchJobMatchInstructions = ({
  resumeText,
  feedback,
  userSkills,
  jobs,
}: {
  resumeText: string;
  feedback: string;
  userSkills?: string[];
  jobs: { id: string; title: string; company: string; description: string; requirements?: string }[];
}) => `You are an AI career coach. Analyze how well a candidate's resume matches MULTIPLE job postings.

    Candidate Profile:
    - Resume: ${resumeText}
    - ATS Feedback: ${feedback}
    - Known Skills: ${userSkills?.join(", ") || "Not provided"}

    Jobs to evaluate (${jobs.length}):
${jobs.map((j, i) => `${i + 1}. [${j.id}] ${j.title} at ${j.company}
   Description: ${j.description}
   Requirements: ${j.requirements || "Not provided"}`).join("\n\n")}

    For EACH job, provide a match analysis. Return a JSON array with this exact structure:
${BatchJobMatchResponseFormat}

    Rules:
    - Be objective and evidence-based
    - Score accurately: 80+ = strong, 60-79 = good, 40-59 = partial, <40 = weak
    - Identify specific missing skills with importance levels
    - Provide ONE top actionable recommendation per job
    - Return ONLY the JSON array. No markdown, no commentary, no extra text.`;

const TailoredResumeResponseFormat = `
  interface TailoredResumeResult {
    tailoredResume: {
      summary: string;
      skills: string[];
      experience: Array<{
        title: string;
        company: string;
        location?: string;
        startDate: string;
        endDate: string;
        bullets: string[];
      }>;
      education: Array<{
        degree: string;
        school: string;
        location?: string;
        graduationDate: string;
        details?: string[];
      }>;
      projects: Array<{
        name: string;
        description: string;
        bullets: string[];
        technologies: string[];
        link?: string;
      }>;
      certifications: string[];
      customSections?: Record<string, string[]>;
    };
    changes: {
      keywordsAdded: string[];
      keywordsRemoved: string[];
      sectionsReordered: string[];
      emphasisChanges: string[];
      summaryChanges: string;
    };
    matchScore: number;
    missingKeywords: string[];
    recommendations: string[];
  }`;

export const prepareTailoredResumeInstructions = ({
  baseResumeText,
  jobTitle,
  companyName,
  jobDescription,
  atsFeedback,
}: {
  baseResumeText: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  atsFeedback: string;
}) => `You are an expert resume writer and ATS optimization specialist. Create a tailored version of a resume for a specific job posting.

## CRITICAL TRUTHFULNESS RULES — VIOLATION IS UNACCEPTABLE

1. **NEVER add metrics, numbers, percentages, or achievements not present in the original resume.** Do not invent "increased revenue by 30%" if the original does not mention it.
2. **NEVER add skills, certifications, or qualifications not in the original resume.**
3. **NEVER fabricate job responsibilities or project details.** Only rephrase what exists.
4. **Every bullet point must be traceable to the original resume text.** If you cannot find it in the input, it does not belong.
5. **You are REORGANIZING and REPHRASING, not writing from scratch.**

## Context:
- Target Job Title: ${jobTitle}
- Target Company: ${companyName}
- Job Description: ${jobDescription}
- Original Resume: ${baseResumeText}
- ATS Analysis Feedback: ${atsFeedback}

## Your Task:
1. Analyze the job description for required skills, keywords, and qualifications
2. Identify which parts of the original resume are most relevant to this role
3. Create a tailored resume that:
   - Reorders sections to prioritize the most relevant experience for this specific role
   - Rephrases existing bullet points to emphasize relevance using the job's terminology
   - Adjusts professional summary to target the specific role using ONLY the user's existing experience
   - Injects job description keywords ONLY where they naturally match existing content
   - NEVER adds new achievements, metrics, responsibilities, or skills
4. For each project, generate 2-3 bullet points describing key features and technologies used. Do NOT fabricate outcomes or metrics.
5. Document what changes were made

## Return Format:
Return a JSON object with this exact structure:
${TailoredResumeResponseFormat}

## Rules:
- Every bullet point MUST be traceable to the original resume — no exceptions
- Use strong action verbs ONLY when rephrasing existing content
- Do NOT add numbers or metrics not in the original
- Do NOT add skills not in the original
- Match the job's terminology where it genuinely overlaps with existing experience
- Keep the same factual content, just optimize presentation and ordering
- Return ONLY the JSON object. No markdown, no commentary, no extra text.`;

const GeneratedResumeResponseFormat = `
  interface GeneratedResume {
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      startDate: string;
      endDate: string;
      bullets: string[];
    }>;
    education: Array<{
      degree: string;
      field: string;
      school: string;
      startDate: string;
      endDate: string;
    }>;
    skills: string[];
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
    }>;
  }`;

export const prepareResumeGenerationInstructions = ({
  summary,
  experience,
  education,
  skills,
  projects,
  jobDescription,
  targetRole,
}: {
  summary?: string;
  experience: any[];
  education: any[];
  skills: string[];
  projects: any[];
  jobDescription?: string;
  targetRole?: string;
}) => `You are an expert resume writer and ATS optimization specialist. Generate a professional, ATS-optimized resume from the provided profile data.

## CRITICAL TRUTHFULNESS RULES — VIOLATION IS UNACCEPTABLE

You MUST follow these rules strictly. Breaking them makes the resume fraudulent:

1. **NEVER add metrics, numbers, percentages, dollar amounts, or team sizes that are NOT explicitly present in the original data.** If the user did not state "increased revenue by 20%", you CANNOT write that. If no numbers exist in the original, do NOT invent them.
2. **NEVER add skills that are not in the provided skills list.** You may reorder existing skills, but you CANNOT add new ones.
3. **NEVER fabricate project details.** Use only the project name, description, and technologies provided. Do not invent features, outcomes, or impact.
4. **NEVER invent job responsibilities or achievements not described in the original experience.** You may rephrase existing descriptions with stronger action verbs, but you CANNOT add new responsibilities or accomplishments.
5. **NEVER add certifications, awards, publications, or other credentials not in the original data.**
6. **Every bullet point in your output must be traceable to specific text in the input data.** If you cannot point to where in the input a bullet came from, it does not belong.

## Context
${targetRole ? `- Target Role: ${targetRole}` : ''}
${jobDescription ? `- Job Description: ${jobDescription}` : ''}

## Profile Data (THIS IS ALL THE DATA YOU HAVE — DO NOT ADD ANYTHING BEYOND THIS)

${summary ? `Professional Summary:\n${summary}` : '(No summary provided)'}

Experience:
${experience.length > 0 ? experience.map((exp) => `- ${exp.title || 'Role'} at ${exp.company || 'Company'} (${exp.startDate || ''} - ${exp.isCurrent ? 'Present' : exp.endDate || ''})\n  ${exp.description || ''}`).join('\n') : '(No experience provided)'}

Education:
${education.length > 0 ? education.map((edu) => `- ${[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Degree'} from ${edu.school || 'Institution'} (${edu.startDate || ''} - ${edu.endDate || ''})`).join('\n') : '(No education provided)'}

Skills:
${skills.length > 0 ? skills.join(', ') : '(No skills provided)'}

Projects:
${projects.length > 0 ? projects.map((p) => `- ${p.name || 'Project'}: ${p.description || ''} | Technologies: ${(p.technologies || []).join(', ')}${p.role ? ` | Role: ${p.role}` : ''}`).join('\n') : '(No projects provided)'}

## Your Task

1. Rewrite the professional summary to be targeted, concise (2-3 sentences), using ONLY information from the provided summary. Do not invent accomplishments.
2. Rewrite experience bullet points using stronger action verbs, BUT only rephrase what is already there. Do not add new achievements, metrics, or responsibilities.
3. Order skills by relevance to the ${targetRole || 'target role'} — use ONLY the skills from the provided list.
4. Select and rewrite project descriptions using ONLY the provided name, description, and technologies. Do not invent outcomes or impact.
5. Keep ALL factual content strictly truthful. You are rephrasing and reorganizing, NOT writing from scratch.
${jobDescription ? `6. Optimize for ATS by naturally incorporating keywords from the job description — but only where they genuinely match the user's existing experience.` : ''}

## Return Format

Return a JSON object with this exact structure:
${GeneratedResumeResponseFormat}

## Rules Summary

- Every bullet MUST be traceable to the original input data — no exceptions
- Use strong action verbs (spearheaded, optimized, architected, implemented, etc.) ONLY when rephrasing existing content
- Do NOT add numbers, percentages, or metrics not present in the original
- Do NOT add skills not in the provided list
- Do NOT fabricate project outcomes or impact
- Each experience entry should have 2-4 bullet points (fewer is fine if the original has less)
- Skills should be ordered most relevant first
- Return ONLY the JSON object. No markdown, no commentary, no extra text.`;
