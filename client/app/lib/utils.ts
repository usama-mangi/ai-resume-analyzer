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

/**
 * Truncates text to a maximum length with optional suffix
 */
export function truncate(text: string, maxLength: number, suffix = '…'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Truncates text from the middle, preserving start and end
 */
export function truncateMiddle(text: string, maxLength: number, separator = '…'): string {
  if (text.length <= maxLength) return text;
  const startLength = Math.floor((maxLength - separator.length) / 2);
  const endLength = maxLength - separator.length - startLength;
  return text.slice(0, startLength) + separator + text.slice(-endLength);
}

/**
 * Clamps a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Safe parseInt with fallback
 */
export function safeParseInt(value: string | number | undefined, fallback = 0): number {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Safe parseFloat with fallback
 */
export function safeParseFloat(value: string | number | undefined, fallback = 0): number {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
