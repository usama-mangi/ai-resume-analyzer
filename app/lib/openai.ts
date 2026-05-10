const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_BASE_URL = "https://api.openai.com/v1";

interface OpenAIChatResponse {
  index: number;
  message: { role: string; content: string; refusal: string | null; annotations: unknown[] };
  logprobs: unknown;
  finish_reason: string;
  usage: { type: string; model: string; amount: number; cost: number }[];
  via_ai_chat_service: boolean;
}

function getConfig() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error(
      "OpenAI API key is not set. Add VITE_OPENAI_API_KEY to your .env file.",
    );
  }

  const baseURL =
    (import.meta.env.VITE_OPENAI_BASE_URL as string | undefined) ||
    DEFAULT_BASE_URL;

  const model =
    (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ||
    DEFAULT_MODEL;

  return { apiKey, baseURL, model };
}

interface OpenAIChatOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

interface OpenAIChatMessage {
  role: string;
  content: { type: string; text: string }[];
}

interface OpenAIResponseChoice {
  index: number;
  message: {
    role: string;
    content: string | null;
    refusal: string | null;
  };
  finish_reason: string;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIResponseChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function chat(
  prompt: string | { role: string; content: { type: string; text: string }[] }[],
  options?: OpenAIChatOptions,
): Promise<OpenAIChatResponse> {
  const { apiKey, baseURL, model: defaultModel } = getConfig();
  const model = options?.model || defaultModel;

  const messages = normalizePrompt(prompt);

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 8192,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data: OpenAIResponse = await response.json();
  const choice = data.choices?.[0];

  return {
    index: choice?.index ?? 0,
    message: {
      role: choice?.message?.role ?? "assistant",
      content: choice?.message?.content ?? "",
      refusal: choice?.message?.refusal ?? null,
      annotations: [],
    },
    logprobs: null,
    finish_reason: choice?.finish_reason ?? "stop",
    usage: data.usage
      ? [
          {
            type: "completion",
            model: data.model,
            amount: data.usage.total_tokens,
            cost: 0,
          },
        ]
      : [],
    via_ai_chat_service: false,
  } satisfies OpenAIChatResponse;
}

function normalizePrompt(
  prompt: string | { role: string; content: { type: string; text: string }[] }[],
): { role: string; content: string }[] {
  if (typeof prompt === "string") {
    return [{ role: "user", content: prompt }];
  }

  return prompt.map((msg) => ({
    role: msg.role,
    content: msg.content.map((c) => c.text).join("\n\n"),
  }));
}