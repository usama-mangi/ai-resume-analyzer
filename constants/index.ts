import type { Resume } from "../types";

export const resumes: Resume[] = [
  {
    id: "1",
    userId: "test-user",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    format: "pdf",
    imagePath: "/images/resume-1.png",
    filePath: "/resumes/resume-1.pdf",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    userId: "test-user",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    format: "pdf",
    imagePath: "/images/resume-2.png",
    filePath: "/resumes/resume-2.pdf",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "3",
    userId: "test-user",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    format: "pdf",
    imagePath: "/images/resume-3.png",
    filePath: "/resumes/resume-3.pdf",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
];

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
  }
}`;

export const ANALYSIS_SYSTEM_MESSAGE = `You are an expert ATS and resume analysis system. You MUST return valid JSON and nothing else — no markdown fences, no commentary, no preamble. Your JSON response must contain ALL of the following top-level keys: overallScore, ATS, toneAndStyle, content, structure, skills. Omitting any key is a critical failure. Every tip object must have both a "tip" and an "explanation" field (except ATS tips which only need "tip"). Scores must be numbers 0-100. Tips arrays must contain 3-4 items each.`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `You are an expert in Applicant Tracking Systems (ATS) and resume analysis. Your task is to critically analyze and rate a provided resume, ensuring alignment with the job description if one is given, or general best practices if no job description is provided. Be highly critical, thorough, and detailed, identifying all mistakes, weaknesses, and areas for improvement, including ATS compatibility issues (e.g., formatting, keyword usage, scannability). Do not hesitate to assign a low score if the resume is poorly constructed or misaligned with the job requirements. Provide specific, actionable suggestions that pinpoint exact sections, bullet points, or content (e.g., specific skills, experiences, or keywords) in the resume that need improvement, clearly explaining what is wrong and how to fix it with precise, tailored solutions. If a job description is provided, use it to assess the resume's alignment with the job's requirements, including skills, qualifications, and keywords, and highlight any missing or irrelevant content. Ensure all feedback is objective, evidence-based, and avoids vague or generic statements.

    CRITICAL: Your response MUST be a single valid JSON object with ALL SIX top-level keys: "overallScore", "ATS", "toneAndStyle", "content", "structure", "skills". Do NOT omit any key. Do NOT wrap the JSON in markdown code fences. Do NOT include any text before or after the JSON.

    The job title is: ${jobTitle}
    The job description is: ${jobDescription}

    Return the analysis as a JSON object matching this exact structure: ${AIResponseFormat}

    REQUIRED fields per section:
    - overallScore: number (0-100)
    - ATS: { score: number, tips: Array<{ type: "good"|"improve", tip: string }> } — exactly 3-4 tips, each with "type" and "tip"
    - toneAndStyle: { score: number, tips: Array<{ type: "good"|"improve", tip: string, explanation: string }> } — exactly 3-4 tips, each with "type", "tip", and "explanation"
    - content: { score: number, tips: Array<{ type: "good"|"improve", tip: string, explanation: string }> } — exactly 3-4 tips, each with "type", "tip", and "explanation"
    - structure: { score: number, tips: Array<{ type: "good"|"improve", tip: string, explanation: string }> } — exactly 3-4 tips, each with "type", "tip", and "explanation"
    - skills: { score: number, tips: Array<{ type: "good"|"improve", tip: string, explanation: string }> } — exactly 3-4 tips, each with "type", "tip", and "explanation"

    For each section (ATS, toneAndStyle, content, structure, skills):
    - Assign a score (0-100) reflecting the quality and job alignment, with lower scores for significant flaws.
    - Provide 3-4 tips, each referencing specific resume sections, bullet points, or content (e.g., "Education section", "Work Experience bullet point 2").
    - For 'ATS.tips', include concise tips with 'type' ("good" or "improve") and 'tip' describing the issue or strength and a solution (if applicable).
    - For 'toneAndStyle', 'content', 'structure', and 'skills', include tips with 'type' ("good" or "improve"), a concise 'tip' as a title, and a detailed 'explanation' identifying the specific issue or strength and providing a precise solution (if applicable).

    If no job description is provided, evaluate based on general resume best practices and ATS standards. Ensure all tips and explanations are tied to specific resume content, avoid generic advice, and prioritize fixes that enhance ATS compatibility and job alignment. Do not include any text or comments outside the JSON output.`;

export const prepareResumeInstructions = ({
  jobTitle,
  jobDescription,
  feedback,
}: {
  jobTitle: string;
  jobDescription: string;
  feedback: string;
}) => `You are an expert in Applicant Tracking Systems (ATS) and resume creation. Your task is to generate a new LaTeX resume for a user based on their provided resume and the feedback stored in the variable 'feedback', which follows the structure: ${AIResponseFormat}

    Analyze the user's resume and the 'feedback' to create an improved LaTeX resume that addresses all "improve" tips and retains "good" aspects, referencing specific sections, bullet points, or content as indicated in the feedback. Ensure the resume:
    - Incorporates all suggestions from 'feedback', particularly from 'ATS.tips', 'toneAndStyle.tips', 'content.tips', 'structure.tips', and 'skills.tips', applying precise fixes (e.g., adding missing keywords, reformatting sections, adjusting tone).
    - Is ATS-compatible (e.g., uses standard fonts like Times New Roman or Arial, avoids complex tables, headers, or footers, includes machine-readable text).
    - Aligns with the job description (if provided) by including relevant skills, qualifications, and keywords, tailored to the job's industry and role.
    - Uses a clean, professional structure with clear sections (e.g., Contact Information, Summary, Work Experience, Education, Skills) suitable for diverse job roles worldwide.
    - Follows LaTeX guidelines: uses PDFLaTeX, includes only packages from texlive-full and texlive-fonts-extra, ensures all environments are properly closed, avoids external images, and uses reliable fonts (e.g., Times New Roman for Latin text, or appropriate Noto Serif fonts for non-Latin languages based on user context).
    - Supports diverse user backgrounds by avoiding assumptions about specific industries or roles, ensuring flexibility for global users.

    The job title is: ${jobTitle}
    The job description is: ${jobDescription}
    The feedback is: ${feedback}

    Generate a complete LaTeX document that compiles without errors using latexmk. Include a comprehensive preamble with compatible packages (e.g., geometry, enumitem, hyperref) and configure fonts last to avoid conflicts. If no job description is provided, optimize the resume based on general resume best practices and ATS standards, incorporating feedback suggestions. Ensure content is specific, professional, and tailored to the feedback, addressing the job's requirements or general standards. Return the LaTeX code wrapped in a JSON object with a single key 'latexCode' containing the full LaTeX document as a string. Do not include any text or comments outside the JSON output.`;

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

const TemplateSuggestionsResponseFormat = `
  interface ResumeTemplateSuggestionsResult {
    currentTemplateScore: number; // 0-100: how ATS-friendly and effective the current template is
    currentTemplateAnalysis: string; // 2-3 sentence analysis of the current template's strengths and weaknesses
    suggestions: {
      name: string; // template name e.g. "Hybrid", "Functional", "Reverse-Chronological"
      description: string; // brief description of the template style
      bestFor: string[]; // what career situations this template suits (e.g. "Career changers", "Tech roles", "Executive positions")
      keyFeatures: string[]; // distinctive layout/organization features of the template
      sectionOrder: string[]; // recommended section ordering for this template
      designTips: string[]; // 2-3 specific design/layout recommendations for this template
      atsScore: number; // 0-100: how well this template performs with ATS parsing
    }[];
    customizationTips: string[]; // 3-4 general tips for tailoring resume templates
    summary: string; // 2-3 sentence overall recommendation
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
    5. Score each recommended template for ATS compatibility (considering formatting complexity, section headers, keyword placement).
    6. Provide 3-4 general customization tips applicable to any template the candidate chooses.
    7. Consider the candidate's industry norms, years of experience, and any specific feedback from the ATS analysis.

    Important:
    - Be realistic — if the candidate has 15+ years in one field, don't recommend a functional template that hides career progression.
    - For tech roles, prioritize clean, ATS-optimized templates over visually complex ones.
    - Consider the job description's industry and company culture when recommending creative vs. conservative templates.
    - Template names should be descriptive and recognizable.

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
    9. Return ONLY a JSON object with a single key "coverLetter" containing the full cover letter text as a string.
    10. Do not include any text or comments outside the JSON output.`;
