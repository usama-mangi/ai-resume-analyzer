import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface OpenAIChatOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
  response_format?: { type: string };
}

interface AIResponse {
  index: number;
  message: {
    role: string;
    content: string | null;
    refusal: string | null;
  };
  finish_reason: string;
  usage: { type: string; model: string; amount: number; cost: number }[];
}

@Injectable()
export class AiService {
  private apiKey: string;
  private baseURL: string;
  private model: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.baseURL =
      this.configService.get<string>('OPENAI_BASE_URL') ||
      'https://api.openai.com/v1';
    this.model =
      this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini';
  }

  async chat(
    prompt: string | { role: string; content: string }[],
    options?: OpenAIChatOptions,
  ): Promise<AIResponse> {
    const model = options?.model || this.model;
    const messages = this.normalizePrompt(prompt);

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.max_tokens ?? 8192,
        ...(options?.response_format ? { response_format: options.response_format } : {}),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
    }

    const data: any = await response.json();
    const choice = data.choices?.[0];

    return {
      index: choice?.index ?? 0,
      message: {
        role: choice?.message?.role ?? 'assistant',
        content: choice?.message?.content ?? '',
        refusal: choice?.message?.refusal ?? null,
      },
      finish_reason: choice?.finish_reason ?? 'stop',
      usage: data.usage
        ? [
            {
              type: 'completion',
              model: data.model,
              amount: data.usage.total_tokens,
              cost: 0,
            },
          ]
        : [],
    };
  }

  private normalizePrompt(
    prompt: string | { role: string; content: string }[],
  ): { role: string; content: string }[] {
    if (typeof prompt === 'string') {
      return [{ role: 'user', content: prompt }];
    }
    return prompt;
  }

  getResponseText(response: AIResponse): string {
    const content = response.message.content;
    if (typeof content === 'string') return content;
    return '';
  }

  parseAIResponse<T>(text: string): T {
    // Strip any leading/trailing text that isn't JSON
    const trimmed = text.trim();

    // Try pure JSON first
    try {
      return JSON.parse(trimmed) as T;
    } catch {}

    // Try ```json ... ``` block
    const jsonMatch = trimmed.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as T;
      } catch {}
    }

    // Try ``` ... ``` block (language-agnostic)
    const codeMatch = trimmed.match(/```\s*([\s\S]*?)```/);
    if (codeMatch) {
      try {
        return JSON.parse(codeMatch[1].trim()) as T;
      } catch {}
    }

    // Try to find the first { ... } block and parse it
    const braceMatch = trimmed.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]) as T;
      } catch {}
    }

    throw new Error(
      `Failed to parse AI response as JSON. Preview: ${text.substring(0, 200)}`,
    );
  }

  async getEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseURL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      throw new Error(`OpenAI embeddings API error (${response.status}): ${errorBody}`);
    }

    const data: any = await response.json();
    return data.data?.[0]?.embedding ?? [];
  }

  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  validateFeedback(raw: any): Record<string, any> {
    const defaultTip = (extra?: string) => [
      { type: 'improve', tip: 'No specific feedback generated' + (extra ? ' — ' + extra : '') },
      { type: 'improve', tip: 'Please re-analyze for detailed suggestions' },
      { type: 'improve', tip: 'Ensure resume content is complete' },
    ];
    const defaultFullTip = (extra?: string) => [
      { type: 'improve', tip: 'No specific feedback generated' + (extra ? ' — ' + extra : ''), explanation: 'The AI response did not include detailed feedback for this section.' },
      { type: 'improve', tip: 'Please re-analyze for detailed suggestions', explanation: 'Try uploading the resume again or re-running the analysis.' },
      { type: 'improve', tip: 'Ensure resume content is complete', explanation: 'Make sure the resume contains sufficient content in this area.' },
    ];
    return {
      overallScore: typeof raw?.overallScore === 'number' ? raw.overallScore : 0,
      ATS: {
        score: typeof raw?.ATS?.score === 'number' ? raw.ATS.score : 0,
        tips: Array.isArray(raw?.ATS?.tips) && raw.ATS.tips.length > 0
          ? raw.ATS.tips
          : defaultTip('ATS'),
      },
      toneAndStyle: {
        score: typeof raw?.toneAndStyle?.score === 'number' ? raw.toneAndStyle.score : 0,
        tips: Array.isArray(raw?.toneAndStyle?.tips) && raw.toneAndStyle.tips.length > 0
          ? raw.toneAndStyle.tips
          : defaultFullTip('toneAndStyle'),
      },
      content: {
        score: typeof raw?.content?.score === 'number' ? raw.content.score : 0,
        tips: Array.isArray(raw?.content?.tips) && raw.content.tips.length > 0
          ? raw.content.tips
          : defaultFullTip('content'),
      },
      structure: {
        score: typeof raw?.structure?.score === 'number' ? raw.structure.score : 0,
        tips: Array.isArray(raw?.structure?.tips) && raw.structure.tips.length > 0
          ? raw.structure.tips
          : defaultFullTip('structure'),
      },
      skills: {
        score: typeof raw?.skills?.score === 'number' ? raw.skills.score : 0,
        tips: Array.isArray(raw?.skills?.tips) && raw.skills.tips.length > 0
          ? raw.skills.tips
          : defaultFullTip('skills'),
      },
    };
  }
}
