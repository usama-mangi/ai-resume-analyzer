export const POST_ONBOARDING_SYSTEM = `You are an expert career onboarding advisor specializing in helping new employees successfully transition into their roles. You provide practical, actionable advice for the first 90 days and beyond. Return valid JSON only.`;

export function buildOnboardingPlanPrompt(data: {
  roleTitle: string;
  companyName: string;
  jobDescription?: string;
  resumeText?: string;
  startDate?: string;
  planType?: string;
}) {
  return `Create a comprehensive ${data.planType || '30-60-90'} day onboarding plan for a ${data.roleTitle} at ${data.companyName}.

${data.jobDescription ? `Job Description:\n${data.jobDescription}\n` : ''}
${data.resumeText ? `Candidate Background:\n${data.resumeText}\n` : ''}
${data.startDate ? `Start Date: ${data.startDate}\n` : ''}

Provide a JSON response with:
{
  "milestones": [
    {
      "phase": "30" | "60" | "90",
      "title": "string",
      "description": "string",
      "tasks": ["string"],
      "successCriteria": ["string"]
    }
  ],
  "learningGoals": [
    {
      "topic": "string",
      "priority": "high" | "medium" | "low",
      "resources": ["string"],
      "estimatedHours": number
    }
  ],
  "stakeholders": [
    {
      "name": "string",
      "role": "string",
      "relationship": "string",
      "meetingFrequency": "string",
      "talkingPoints": ["string"]
    }
  ],
  "summary": "string"
}`;
}

export function buildOnboardingChecklistPrompt(data: {
  roleTitle: string;
  companyName: string;
  startDate?: string;
}) {
  return `Create a comprehensive onboarding checklist for a ${data.roleTitle} at ${data.companyName}.
${data.startDate ? `Start Date: ${data.startDate}\n` : ''}

Provide a JSON response with:
{
  "categories": [
    {
      "name": "string",
      "items": [
        {
          "task": "string",
          "description": "string",
          "dueDate": "string" | null,
          "priority": "high" | "medium" | "low",
          "completed": false
        }
      ]
    }
  ],
  "totalCount": number
}

Include categories like:
- Pre-start Paperwork
- Equipment & Setup
- Accounts & Access
- Introductions & Meetings
- First Week Schedule
- Learning & Training
- Team Integration`;
}

export function buildManagerAlignmentPrompt(data: {
  roleTitle: string;
  companyName: string;
  managerName?: string;
  jobDescription?: string;
}) {
  return `Create a manager alignment document for a new ${data.roleTitle} at ${data.companyName}.
${data.managerName ? `Manager: ${data.managerName}\n` : ''}
${data.jobDescription ? `Job Description:\n${data.jobDescription}\n` : ''}

Provide a JSON response with:
{
  "successMetrics": [
    {
      "metric": "string",
      "description": "string",
      "timeframe": "30 days" | "60 days" | "90 days",
      "measurementMethod": "string"
    }
  ],
  "communicationStyle": {
    "preferredChannels": ["string"],
    "meetingFrequency": "string",
    "feedbackStyle": "string",
    "responseTimeExpectations": "string"
  },
  "meetingCadence": [
    {
      "type": "string",
      "frequency": "string",
      "duration": "string",
      "purpose": "string"
    }
  ],
  "expectations": "string"
}`;
}

export function buildNetworkMapPrompt(data: {
  roleTitle: string;
  companyName: string;
  jobDescription?: string;
}) {
  return `Create a network mapping plan for a new ${data.roleTitle} at ${data.companyName}.
${data.jobDescription ? `Job Description:\n${data.jobDescription}\n` : ''}

Provide a JSON response with:
{
  "contacts": [
    {
      "name": "string",
      "role": "string",
      "department": "string",
      "relationship": "string",
      "importance": "high" | "medium" | "low",
      "meetingGoal": "string",
      "talkingPoints": ["string"]
    }
  ],
  "coffeeChats": [
    {
      "contactName": "string",
      "suggestedTimeframe": "string",
      "agenda": "string",
      "questions": ["string"]
    }
  ],
  "relationshipMap": {
    "coreTeam": ["string"],
    "crossFunctional": ["string"],
    "leadership": ["string"],
    "externalPartners": ["string"]
  }
}`;
}

export function buildSkillRefreshPrompt(data: {
  roleTitle: string;
  companyName: string;
  techStack: string[];
  jobDescription?: string;
  resumeText?: string;
}) {
  return `Create a skill refresh learning path for a ${data.roleTitle} at ${data.companyName}.
${data.jobDescription ? `Job Description:\n${data.jobDescription}\n` : ''}
${data.resumeText ? `Current Skills:\n${data.resumeText}\n` : ''}
Tech Stack: ${data.techStack.join(', ')}

Provide a JSON response with:
{
  "recommendations": [
    {
      "skill": "string",
      "currentLevel": "beginner" | "intermediate" | "advanced" | "expert",
      "targetLevel": "beginner" | "intermediate" | "advanced" | "expert",
      "priority": "high" | "medium" | "low",
      "resources": [
        {
          "title": "string",
          "type": "course" | "book" | "tutorial" | "documentation" | "practice",
          "url": "string" | null,
          "estimatedHours": number
        }
      ]
    }
  ],
  "learningPath": [
    {
      "week": number,
      "focus": "string",
      "activities": ["string"],
      "deliverable": "string"
    }
  ],
  "estimatedHours": number
}`;
}

export function buildFirst90DaysPrompt(data: {
  roleTitle: string;
  companyName: string;
  jobDescription?: string;
}) {
  return `Create a first 90 days tracker for a new ${data.roleTitle} at ${data.companyName}.
${data.jobDescription ? `Job Description:\n${data.jobDescription}\n` : ''}

Provide a JSON response with:
{
  "milestones": [
    {
      "phase": "learning" | "contributing" | "leading",
      "timeframe": "string",
      "goals": ["string"],
      "deliverables": ["string"],
      "successCriteria": ["string"]
    }
  ],
  "feedbackLoops": [
    {
      "type": "string",
      "frequency": "string",
      "participants": ["string"],
      "purpose": "string"
    }
  ],
  "earlyWins": [
    {
      "opportunity": "string",
      "impact": "high" | "medium" | "low",
      "effort": "high" | "medium" | "low",
      "timeframe": "string",
      "steps": ["string"]
    }
  ]
}`;
}
