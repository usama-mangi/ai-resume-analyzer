import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AIResponse, Feedback } from "types";

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();

export const cn = (...input: ClassValue[]) => twMerge(clsx(input));

/**
 * Normalizes a raw feedback object from the API/database to guarantee
 * all required sub-objects exist with the correct shape.
 * This prevents crashes when older resume data is missing sections
 * that the AI failed to return.
 */
export function normalizeFeedback(raw: unknown): Feedback {
  const defaultTip = (extra: string) => [
    { type: 'improve' as const, tip: `No feedback available for ${extra}` },
  ];
  const defaultFullTip = (extra: string) => [
    { type: 'improve' as const, tip: `No feedback available for ${extra}`, explanation: 'The AI did not return feedback for this section. Please re-analyze the resume.' },
  ];
  const emptyCategory = (extra: string) => ({
    score: 0,
    tips: defaultFullTip(extra),
  });

  if (!raw || typeof raw !== 'object') {
    return {
      overallScore: 0,
      ATS: { score: 0, tips: defaultTip('ATS') },
      toneAndStyle: emptyCategory('toneAndStyle'),
      content: emptyCategory('content'),
      structure: emptyCategory('structure'),
      skills: emptyCategory('skills'),
    };
  }

  const r = raw as Record<string, unknown>;

  const getScore = (key: string): number => {
    const val = r[key];
    if (typeof val === 'number') return val;
    if (val && typeof val === 'object' && 'score' in val) {
      const scoreVal = (val as Record<string, unknown>).score;
      return typeof scoreVal === 'number' ? scoreVal : 0;
    }
    return 0;
  };

  const getTips = (key: string, isATS = false): Feedback['ATS']['tips'] | Feedback['toneAndStyle']['tips'] => {
    const val = r[key];
    if (val && typeof val === 'object' && 'tips' in val) {
      const tipsVal = (val as Record<string, unknown>).tips;
      if (Array.isArray(tipsVal)) {
        return tipsVal as Feedback['ATS']['tips'];
      }
    }
    return isATS ? defaultTip(key) : defaultFullTip(key);
  };

  return {
    overallScore: getScore('overallScore'),
    keywordMatchScore: typeof r.keywordMatchScore === 'number' ? r.keywordMatchScore : undefined,
    formatScore: typeof r.formatScore === 'number' ? r.formatScore : undefined,
    ATS: {
      score: getScore('ATS'),
      tips: getTips('ATS', true) as Feedback['ATS']['tips'],
    },
    toneAndStyle: {
      score: getScore('toneAndStyle'),
      tips: getTips('toneAndStyle') as Feedback['toneAndStyle']['tips'],
    },
    content: {
      score: getScore('content'),
      tips: getTips('content') as Feedback['content']['tips'],
    },
    structure: {
      score: getScore('structure'),
      tips: getTips('structure') as Feedback['structure']['tips'],
    },
    skills: {
      score: getScore('skills'),
      tips: getTips('skills') as Feedback['skills']['tips'],
    },
  };
}

/**
 * Extracts the text content from an AIResponse, handling both string and array formats.
 */
export function getResponseText(response: AIResponse): string {
  if (response.data && typeof response.data === 'string') return response.data;
  if (typeof response.message === 'string') return response.message;
  return "";
}

/**
 * Parses an AI response string into JSON.
 * Handles pure JSON, JSON wrapped in ```json ... ``` blocks,
 * and JSON wrapped in ``` ... ``` blocks.
 * Throws a descriptive error if parsing fails.
 */
export function parseAIResponse<T = unknown>(text: string): T {
  const trimmed = text.trim();

  // Try pure JSON first
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Not pure JSON — try markdown code block extraction
  }

  // Try ```json ... ``` block
  const jsonBlockMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim()) as T;
    } catch {
      throw new Error(
        "AI returned a JSON code block with invalid JSON content.",
      );
    }
  }

  // Try ``` ... ``` block (language-agnostic)
  const codeBlockMatch = trimmed.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {
      throw new Error(
        "AI returned a code block with invalid JSON content.",
      );
    }
  }

  // Not JSON at all — show the raw response in the error
  const preview = trimmed.length > 200 ? trimmed.slice(0, 200) + "..." : trimmed;
  throw new Error(
    `AI response was not valid JSON. Raw response:\n\n${preview}`,
  );
}
