import { useMemo, useState } from 'react';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

export type AiChatSettings = {
  endpoint: string;
  model: string;
  apiKey: string;
  systemPrompt: string;
};

type UseAiChatOptions = {
  initialAssistantMessage: string;
};

type OpenAiResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const SETTINGS_STORAGE_KEY = 'tools.ai.chat.settings.v1';

const createId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createFallbackReply = (input: string): string => {
  const normalized = input.toLowerCase();
  if (normalized.includes('react') || normalized.includes('tsx')) {
    return 'For React tasks, split logic into hooks and keep components focused on rendering.';
  }
  if (normalized.includes('css') || normalized.includes('scss') || normalized.includes('style')) {
    return 'Try defining shared tokens first, then build component styles from those tokens for consistency.';
  }
  if (normalized.includes('build') || normalized.includes('vite')) {
    return 'Run a full build after each feature change to detect type and bundling regressions early.';
  }
  return 'AI endpoint is not configured yet. Set endpoint and API key to enable real model responses.';
};

const parseContent = (data: unknown): string => {
  const typed = data as OpenAiResponse;
  const first = typed.choices?.[0]?.message?.content;
  if (typeof first === 'string' && first.trim()) {
    return first.trim();
  }
  return '';
};

const readInitialSettings = (): AiChatSettings => {
  const endpointFromEnv = (import.meta.env.VITE_AI_CHAT_ENDPOINT as string | undefined) ?? '';
  const modelFromEnv = (import.meta.env.VITE_AI_CHAT_MODEL as string | undefined) ?? 'gpt-4o-mini';

  if (typeof window === 'undefined') {
    return {
      endpoint: endpointFromEnv,
      model: modelFromEnv,
      apiKey: '',
      systemPrompt: 'You are a pragmatic frontend engineering assistant.'
    };
  }

  const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!raw) {
    return {
      endpoint: endpointFromEnv,
      model: modelFromEnv,
      apiKey: '',
      systemPrompt: 'You are a pragmatic frontend engineering assistant.'
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AiChatSettings>;
    return {
      endpoint: parsed.endpoint ?? endpointFromEnv,
      model: parsed.model ?? modelFromEnv,
      apiKey: parsed.apiKey ?? '',
      systemPrompt: parsed.systemPrompt ?? 'You are a pragmatic frontend engineering assistant.'
    };
  } catch {
    return {
      endpoint: endpointFromEnv,
      model: modelFromEnv,
      apiKey: '',
      systemPrompt: 'You are a pragmatic frontend engineering assistant.'
    };
  }
};

export const useAiChat = ({ initialAssistantMessage }: UseAiChatOptions) => {
  const [settings, setSettings] = useState<AiChatSettings>(() => readInitialSettings());
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createId(),
      role: 'assistant',
      content: initialAssistantMessage,
      createdAt: Date.now()
    }
  ]);
  const [isSending, setIsSending] = useState(false);

  const canUseRemote = useMemo(() => {
    return Boolean(settings.endpoint.trim() && settings.apiKey.trim());
  }, [settings.endpoint, settings.apiKey]);

  const persistSettings = (next: AiChatSettings) => {
    setSettings(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const updateSettings = (patch: Partial<AiChatSettings>) => {
    const next = {
      ...settings,
      ...patch
    };
    persistSettings(next);
  };

  const clearMessages = (resetAssistantMessage: string) => {
    setMessages([
      {
        id: createId(),
        role: 'assistant',
        content: resetAssistantMessage,
        createdAt: Date.now()
      }
    ]);
  };

  const sendMessage = async (input: string): Promise<void> => {
    const normalized = input.trim();
    if (!normalized || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: normalized,
      createdAt: Date.now()
    };

    const history = [...messages, userMessage];
    setMessages(history);
    setIsSending(true);

    try {
      if (!canUseRemote) {
        const fallback = createFallbackReply(normalized);
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: 'assistant',
            content: fallback,
            createdAt: Date.now()
          }
        ]);
        return;
      }

      const response = await fetch(settings.endpoint.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey.trim()}`
        },
        body: JSON.stringify({
          model: settings.model.trim() || 'gpt-4o-mini',
          messages: [
            ...(settings.systemPrompt.trim()
              ? [
                  {
                    role: 'system',
                    content: settings.systemPrompt.trim()
                  }
                ]
              : []),
            ...history.map((message) => ({
              role: message.role,
              content: message.content
            }))
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as unknown;
      const assistantReply = parseContent(data);
      if (!assistantReply) {
        throw new Error('Empty model response');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content: assistantReply,
          createdAt: Date.now()
        }
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content: `Request error: ${message}`,
          createdAt: Date.now()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return {
    settings,
    messages,
    isSending,
    canUseRemote,
    updateSettings,
    clearMessages,
    sendMessage
  };
};
