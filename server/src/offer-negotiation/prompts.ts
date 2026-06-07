export const NEGOTIATION_COACH_SYSTEM = `You are an expert salary negotiation coach and career strategist. You provide data-driven, actionable advice for negotiating job offers. Always be specific with numbers, percentages, and scripts. Return valid JSON only.`;

const NegotiationCoachResponseFormat = `
{
  "marketData": {
    "percentiles": { "p10": number, "p25": number, "p50": number, "p75": number, "p90": number },
    "currency": "USD",
    "period": "yearly",
    "summary": "string"
  },
  "strategy": {
    "overallApproach": "string",
    "anchorPoint": number,
    "targetPoint": number,
    "walkAwayPoint": number,
    "keyLeveragePoints": ["string"],
    "timingAdvice": "string",
    "riskAssessment": "string",
    "stepByStep": [
      { "step": number, "action": "string", "script": "string", "tip": "string" }
    ]
  },
  "emailTemplates": [
    {
      "type": "initial_counter" | "follow_up" | "final_acceptance",
      "subject": "string",
      "body": "string"
    }
  ],
  "scripts": [
    {
      "scenario": "string",
      "opening": "string",
      "keyPoints": ["string"],
      "closing": "string",
      "handlingObjections": ["string"]
    }
  ]
}`;

export const buildNegotiationCoachPrompt = ({
  roleTitle,
  companyName,
  jobDescription,
  resumeText,
  offerDetails,
}: {
  roleTitle: string;
  companyName: string;
  jobDescription?: string;
  resumeText?: string;
  offerDetails: {
    baseSalary: number;
    equity?: number;
    equityType?: string;
    bonus?: number;
    signOn?: number;
    benefits?: string[];
  };
}) => `You are a senior salary negotiation coach. Analyze this offer and create a comprehensive negotiation strategy.

Role: ${roleTitle}
Company: ${companyName}
${jobDescription ? `Job Description:\n${jobDescription}` : ''}
${resumeText ? `Candidate Background:\n${resumeText}` : ''}

Current Offer:
- Base Salary: $${offerDetails.baseSalary.toLocaleString()}
${offerDetails.equity ? `- Equity: $${offerDetails.equity.toLocaleString()}/year (${offerDetails.equityType || 'RSUs'})` : ''}
${offerDetails.bonus ? `- Bonus: $${offerDetails.bonus.toLocaleString()}` : ''}
${offerDetails.signOn ? `- Sign-on Bonus: $${offerDetails.signOn.toLocaleString()}` : ''}
${offerDetails.benefits?.length ? `- Benefits: ${offerDetails.benefits.join(', ')}` : ''}

Your task:
1. Estimate market salary data for this role/location at different percentiles.
2. Create a negotiation strategy with an anchor, target, and walk-away point.
3. Write 3 email templates: initial counter, follow-up, and final acceptance.
4. Write talking-point scripts for phone/video negotiation conversations.
5. Include objection handling for common pushback.

Return the analysis as a JSON object matching this format: ${NegotiationCoachResponseFormat}
Do not include any text or comments outside the JSON output.`;

const EquityCalculationFormat = `
{
  "summary": "string",
  "scenarios": [
    {
      "name": "string",
      "description": "string",
      "exitValuation": number,
      "totalValue": number,
      "annualValue": number,
      "monthlyValue": number,
      "afterTaxEstimate": number,
      "netAnnual": number
    }
  ],
  "vestingSchedule": [
    { "year": number, "vestedShares": number, "cumulativeValue": number, "taxOwed": number }
  ],
  "taxBreakdown": {
    "ordinaryIncomeRate": number,
    "longTermCapitalGainsRate": number,
    "estimatedTax": number,
    "afterTaxTotal": number
  },
  "recommendations": ["string"]
}`;

export const buildEquityCalculatorPrompt = ({
  roleTitle,
  equityDetails,
}: {
  roleTitle: string;
  equityDetails: {
    totalShares: number;
    sharePrice: number;
    vestingSchedule: string;
    vestingCliff?: number;
    equityType: string;
    strikePrice?: number;
    refreshGrant?: number;
    currentSalary: number;
  };
}) => `You are an equity compensation expert. Calculate the full value of this equity package under multiple scenarios.

Role: ${roleTitle}
Equity Package:
- Type: ${equityDetails.equityType}
- Total Shares/Units: ${equityDetails.totalShares}
- Current Share Price: $${equityDetails.sharePrice}
- Vesting Schedule: ${equityDetails.vestingSchedule}
- Cliff: ${equityDetails.vestingCliff || 12} months
${equityDetails.strikePrice ? `- Strike Price: $${equityDetails.strikePrice}` : ''}
${equityDetails.refreshGrant ? `- Annual Refresh Grant: ${equityDetails.refreshGrant} shares` : ''}
- Current Base Salary: $${equityDetails.currentSalary.toLocaleString()}

Your task:
1. Model scenarios: company fails (0x), modest exit (2-5x), good exit (5-10x), great exit (10-20x), unicorn (20x+).
2. Create a year-by-year vesting schedule with cumulative value.
3. Estimate tax implications (ISO vs NSO vs RSU treatment).
4. Calculate total compensation including equity at each scenario.
5. Provide actionable recommendations.

Return as JSON matching: ${EquityCalculationFormat}
Do not include any text or comments outside the JSON output.`;

const BenefitsAnalysisFormat = `
{
  "overallScore": number,
  "summary": "string",
  "categories": [
    {
      "name": "string",
      "score": number,
      "items": [
        {
          "name": "string",
          "value": "string",
          "marketBenchmark": "string",
          "rating": "excellent" | "good" | "average" | "below_average" | "poor",
          "notes": "string"
        }
      ]
    }
  ],
  "comparison": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "missingComparedToMarket": ["string"]
  },
  "totalCompensationValue": number,
  "recommendations": ["string"]
}`;

export const buildBenefitsAnalyzerPrompt = ({
  roleTitle,
  companyName,
  benefits,
  salary,
}: {
  roleTitle: string;
  companyName: string;
  benefits: string[];
  salary: number;
}) => `You are a benefits and total compensation analyst. Evaluate this benefits package against market standards.

Role: ${roleTitle}
Company: ${companyName}
Base Salary: $${salary.toLocaleString()}/year
Benefits:
${benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Your task:
1. Score each benefit category (health insurance, retirement, PTO, wellness, equity, perks) on a scale.
2. Compare each benefit to market benchmarks for this role level and industry.
3. Calculate the approximate monetary value of the benefits package.
4. Identify strengths, weaknesses, and missing benefits compared to market.
5. Provide recommendations for negotiation or gaps to address.

Return as JSON matching: ${BenefitsAnalysisFormat}
Do not include any text or comments outside the JSON output.`;

const DecisionFrameworkFormat = `
{
  "summary": "string",
  "winner": "string",
  "winnerReason": "string",
  "offerScores": [
    {
      "offerName": "string",
      "totalScore": number,
      "criterionScores": [
        { "criterionId": "string", "criterionName": "string", "score": number, "maxScore": number, "notes": "string" }
      ]
    }
  ],
  "sensitivityAnalysis": [
    { "scenario": "string", "winner": "string", "reasoning": "string" }
  ],
  "recommendations": ["string"]
}`;

export const buildDecisionFrameworkPrompt = ({
  criteria,
  offers,
}: {
  criteria: { id: string; name: string; weight: number }[];
  offers: {
    name: string;
    baseSalary: number;
    equity?: number;
    bonus?: number;
    location: string;
    remotePolicy: string;
    benefits: string[];
    growthOpportunities?: string;
    companyCulture?: string;
  }[];
}) => `You are a career decision strategist. Help evaluate multiple job offers using a weighted decision matrix.

Criteria (weighted):
${criteria.map(c => `- ${c.name} (weight: ${c.weight}%`).join('\n')}

Offers to Compare:
${offers.map((o, i) => `
Offer ${i + 1}: ${o.name}
- Base: $${o.baseSalary.toLocaleString()}
${o.equity ? `- Equity: $${o.equity.toLocaleString()}/yr` : ''}
${o.bonus ? `- Bonus: $${o.bonus.toLocaleString()}` : ''}
- Location: ${o.location}
- Remote: ${o.remotePolicy}
- Benefits: ${o.benefits.join(', ')}
${o.growthOpportunities ? `- Growth: ${o.growthOpportunities}` : ''}
${o.companyCulture ? `- Culture: ${o.companyCulture}` : ''}
`).join('')}

Your task:
1. Score each offer (0-10) on each criterion with specific notes.
2. Calculate weighted total scores.
3. Perform sensitivity analysis (what if location weight doubles? what if culture matters most?).
4. Declare a winner with clear reasoning.
5. Provide actionable recommendations.

Return as JSON matching: ${DecisionFrameworkFormat}
Do not include any text or comments outside the JSON output.`;

const ResignationLetterFormat = `
{
  "letter": "string",
  "transitionPlan": "string",
  "tips": ["string"],
  "dosAndDonts": {
    "dos": ["string"],
    "donts": ["string"]
  }
}`;

export const buildResignationLetterPrompt = ({
  companyName,
  roleTitle,
  managerName,
  lastDay,
  reason,
  tone,
  yearsAtCompany,
  keyAchievements,
  handoverNotes,
}: {
  companyName: string;
  roleTitle: string;
  managerName?: string;
  lastDay?: string;
  reason?: string;
  tone?: string;
  yearsAtCompany?: number;
  keyAchievements?: string[];
  handoverNotes?: string;
}) => `You are an expert career transition advisor. Write a professional resignation letter.

Details:
- Company: ${companyName}
- Role: ${roleTitle}
- Manager: ${managerName || 'Hiring Manager'}
- Last Working Day: ${lastDay || 'Two weeks from today'}
- Reason: ${reason || 'new_opportunity'}
- Tone: ${tone || 'professional'}
${yearsAtCompany ? `- Years at Company: ${yearsAtCompany}` : ''}
${keyAchievements?.length ? `- Key Achievements: ${keyAchievements.join('; ')}` : ''}
${handoverNotes ? `- Handover Notes: ${handoverNotes}` : ''}

Your task:
1. Write a professional resignation letter (300-500 words).
2. Create a detailed transition plan with handover timeline.
3. Provide tips for the resignation conversation.
4. Include dos and don'ts for maintaining professional relationships.

Return as JSON matching: ${ResignationLetterFormat}
Do not include any text or comments outside the JSON output.`;
