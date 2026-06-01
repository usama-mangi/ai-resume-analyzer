const CompanyBriefingResponseFormat = `
  interface CompanyBriefing {
    companyName: string;
    mission: string;
    products: { name: string; description: string; marketPosition: string }[];
    competitors: { name: string; differentiator: string }[];
    recentNews: { title: string; date: string; summary: string; sentiment: "positive" | "neutral" | "negative" }[];
    financialHealth: { summary: string; keyMetrics: string[] };
    culture: { values: string[]; workEnvironment: string; notablePerks: string[] };
    interviewerProfiles: { name: string; role: string; background: string; tips: string[] }[];
    keyTalkingPoints: string[];
    redFlags: string[];
    questionsToAsk: string[];
    summary: string;
  }`;

export const prepareCompanyBriefingInstructions = ({
  companyName,
  jobTitle,
  jobDescription,
  resumeText,
  companyContext,
}: {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  companyContext?: string;
}) => `You are an expert career coach and company research analyst. Generate a comprehensive interview preparation briefing for a candidate interviewing at ${companyName}.

Context:
- Company: ${companyName}
- Role: ${jobTitle}
- Job Description: ${jobDescription || "Not provided — focus on the company and general role expectations."}
- Candidate Resume: ${resumeText}
- Additional Company Context: ${companyContext || "None provided — use your general knowledge about the company."}

Your task:
1. Research and compile a comprehensive briefing covering:
   - Company mission, vision, and core values
   - Key products/services and their market position
   - Main competitors and differentiators
   - Recent notable news (positive and negative)
   - Financial health and key metrics
   - Company culture and work environment
   - Potential interviewer backgrounds (generic profiles based on role level)
2. Identify key talking points the candidate should emphasize based on their resume alignment with the role
3. Flag potential red flags or areas of concern the candidate should be aware of
4. Suggest thoughtful questions the candidate can ask the interviewers
5. Provide a concise summary of the most important things to know

Return a JSON object adhering to the format: ${CompanyBriefingResponseFormat}

Be specific and actionable. Use your knowledge of the company up to 2025. Do not include any text or comments outside the JSON output.`;

const TechnicalAssessmentResponseFormat = `
  interface TechnicalAssessment {
    roleTitle: string;
    difficulty: "junior" | "mid" | "senior" | "staff";
    codingChallenges: {
      title: string;
      description: string;
      difficulty: "easy" | "medium" | "hard";
      topics: string[];
      timeEstimate: string;
      hints: string[];
      solutionApproach: string;
      keyConcepts: string[];
    }[];
    systemDesignPrompts: {
      title: string;
      description: string;
      scope: string;
      keyConsiderations: string[];
      evaluationCriteria: string[];
      timeEstimate: string;
    }[];
    takeHomeProjects: {
      title: string;
      description: string;
      requirements: string[];
      evaluationCriteria: string[];
      timeEstimate: string;
      tips: string[];
    }[];
    studyPlan: { topic: string; resources: string[]; priority: "high" | "medium" | "low" }[];
    summary: string;
  }`;

export const prepareTechnicalAssessmentInstructions = ({
  jobTitle,
  jobDescription,
  resumeText,
  targetDifficulty,
  focusAreas,
}: {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  targetDifficulty?: string;
  focusAreas?: string;
}) => `You are an expert technical interviewer and assessment designer. Create a comprehensive technical assessment practice package for a candidate preparing for a ${jobTitle} interview.

Context:
- Role: ${jobTitle}
- Job Description: ${jobDescription || "Not provided — design assessments based on the role title and industry standards."}
- Resume Text: ${resumeText}
- Target Difficulty: ${targetDifficulty || "Infer from resume experience level"}
- Focus Areas: ${focusAreas || "None specified — cover all relevant areas for the role."}

Your task:
1. Determine the appropriate difficulty level (junior, mid, senior, staff) based on the role and resume
2. Create 3-4 coding challenges that are relevant to the role:
   - Each with a clear description, difficulty rating, relevant topics, time estimate
   - Include 2-3 hints of increasing specificity
   - Describe the solution approach and key concepts tested
3. Create 1-2 system design prompts (for mid-level and above):
   - Clear scope and constraints
   - Key considerations and trade-offs
   - Evaluation criteria
   - Time estimate
4. Create 1 take-home project suggestion:
   - Realistic scope and requirements
   - Clear evaluation criteria
   - Practical tips for completion
5. Develop a study plan prioritized by importance:
   - Key topics to review
   - Specific resources (docs, courses, practice sites)
   - Priority level based on the role requirements

Return a JSON object adhering to the format: ${TechnicalAssessmentResponseFormat}

Make challenges realistic and relevant to actual interview scenarios. Do not include any text or comments outside the JSON output.`;

const BehavioralBankResponseFormat = `
  interface BehavioralQuestionBank {
    competencies: string[];
    questions: {
      question: string;
      competency: string;
      difficulty: "easy" | "medium" | "hard";
      starTemplate: {
        situation: string;
        task: string;
        action: string;
        result: string;
      };
      sampleAnswer: string;
      tips: string[];
      whatInterviewerLooksFor: string;
    }[];
    preparationTips: string[];
    summary: string;
  }`;

export const prepareBehavioralBankInstructions = ({
  jobTitle,
  jobDescription,
  resumeText,
  competencies,
  questionCount,
}: {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  competencies?: string;
  questionCount?: number;
}) => `You are an expert behavioral interview coach. Create a comprehensive STAR-based behavioral question bank for a candidate preparing for a ${jobTitle} interview.

Context:
- Role: ${jobTitle}
- Job Description: ${jobDescription || "Not provided — focus on general competencies for the role."}
- Resume Text: ${resumeText}
- Target Competencies: ${competencies || "Determine the most relevant competencies based on the role."}
- Number of Questions: ${questionCount || 12}

Your task:
1. Identify 6-8 key competencies most relevant to the role (e.g., leadership, teamwork, problem-solving, conflict resolution, adaptability, communication, initiative, time management)
2. For each competency, generate 1-2 behavioral interview questions (total ~${questionCount || 12} questions)
3. For each question, provide:
   - A STAR framework template with situation, task, action, and result prompts tailored to the candidate's resume
   - A sample answer demonstrating how to use the STAR method effectively
   - 2-3 tips for answering this specific question well
   - What the interviewer is looking for in the answer
   - Difficulty rating based on the complexity of the competency
4. Provide 3-4 general behavioral interview preparation tips
5. Provide a concise summary of the behavioral prep strategy

Return a JSON object adhering to the format: ${BehavioralBankResponseFormat}

Make questions realistic and grounded in actual interview scenarios. The STAR templates should guide the candidate to draw from their own experience. Do not include any text or comments outside the JSON output.`;

const CheatSheetResponseFormat = `
  interface InterviewCheatSheet {
    companyName: string;
    roleTitle: string;
    keyTalkingPoints: { topic: string; points: string[] }[];
    questionsToAsk: { question: string; why: string }[];
    salaryRange?: { min: number; max: number; median: number; currency: string };
    redFlags: string[];
    companyQuickFacts: { label: string; value: string }[];
    interviewTips: string[];
    followUpPlan: string[];
    summary: string;
  }`;

export const prepareCheatSheetInstructions = ({
  companyName,
  jobTitle,
  jobDescription,
  resumeText,
  companyContext,
  salaryContext,
}: {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  companyContext?: string;
  salaryContext?: string;
}) => `You are an expert career coach. Create a concise one-page interview cheat sheet for a candidate interviewing at ${companyName} for the ${jobTitle} role.

Context:
- Company: ${companyName}
- Role: ${jobTitle}
- Job Description: ${jobDescription || "Not provided — focus on general prep for the role."}
- Candidate Resume: ${resumeText}
- Company Context: ${companyContext || "Use your general knowledge about the company."}
- Salary Context: ${salaryContext || "Estimate based on role, company, and market data."}

Your task:
1. Create key talking points organized by topic (your strengths, why this company, why this role, technical expertise, leadership examples)
2. Suggest 6-8 thoughtful questions to ask the interviewer, each with a brief explanation of why it's a good question
3. Provide a realistic salary range estimate for the role at this company
4. List potential red flags or challenging questions the candidate should prepare for
5. Include 5-7 quick company facts the candidate should know
6. Provide 4-5 interview day tips
7. Outline a follow-up plan (thank-you notes, timing, what to include)
8. Create a concise summary

Return a JSON object adhering to the format: ${CheatSheetResponseFormat}

Keep it concise and actionable — this should fit on one page when printed. Do not include any text or comments outside the JSON output.`;

export const prepareMockInterviewerInstructions = ({
  roleTitle,
  company,
  resumeText,
  jobDescription,
  conversationHistory,
  questionNumber,
}: {
  roleTitle: string;
  company?: string;
  resumeText: string;
  jobDescription: string;
  conversationHistory: string;
  questionNumber: number;
}) => `You are an expert technical interviewer conducting a mock interview for a ${roleTitle} position${company ? ` at ${company}` : ''}.

Context:
- Role: ${roleTitle}
${company ? `- Company: ${company}` : ''}
- Job Description: ${jobDescription || "Not provided — focus on the role and general expectations."}
- Candidate Resume: ${resumeText}
- Question Number: ${questionNumber}

Conversation so far:
${conversationHistory || "This is the beginning of the interview."}

Your task:
1. Based on the conversation history, ask the NEXT interview question. Vary the type:
   - Technical questions about specific skills, tools, and technologies
   - Behavioral questions about past experiences and soft skills
   - Role-specific questions about how the candidate would handle job responsibilities
   - Situational/hypothetical scenarios
2. Adapt your questioning based on the candidate's previous answers — follow up on interesting points or probe areas that need more depth
3. Keep the tone professional but encouraging — like a real interviewer
4. For the first question, start with an introduction and a warm-up question
5. For subsequent questions, increase difficulty and specificity

Return a JSON object with this structure:
{
  "message": "Your interview question or comment as the interviewer",
  "isComplete": false,
  "suggestedTopics": ["topic1", "topic2"],
  "difficulty": "easy" | "medium" | "hard",
  "category": "technical" | "behavioral" | "role-specific" | "situational"
}

Set isComplete to true only when you've asked enough questions (8-12) and want to conclude the interview with final thoughts.

Do not include any text or comments outside the JSON output.`;

export const prepareMockInterviewFeedback = ({
  roleTitle,
  company,
  messages,
}: {
  roleTitle: string;
  company?: string;
  messages: string;
}) => `You are an expert interview coach providing feedback on a mock interview for a ${roleTitle} position${company ? ` at ${company}` : ''}.

Interview transcript:
${messages}

Your task:
1. Evaluate the candidate's overall performance (0-100 score)
2. Rate communication skills (0-100): clarity, structure, conciseness
3. Rate technical knowledge (0-100): depth, accuracy, problem-solving approach
4. Rate behavioral responses (0-100): STAR method usage, self-awareness, examples
5. Identify 3-5 specific strengths demonstrated during the interview
6. Identify 3-5 specific areas for improvement with actionable advice
7. Provide a concise summary of the overall performance

Return a JSON object with this structure:
{
  "score": number,
  "communicationScore": number,
  "technicalScore": number,
  "behavioralScore": number,
  "strengths": string[],
  "areasForImprovement": string[],
  "summary": string
}

Be constructive but honest. Score accurately — don't inflate. Do not include any text or comments outside the JSON output.`;
