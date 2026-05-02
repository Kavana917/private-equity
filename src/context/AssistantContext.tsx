import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type AssistantMessage = {
  id: string;
  role: "otto" | "system" | "user";
  text: string;
  createdAt: string;
  confidence?: number;
};

type AssistantContextValue = {
  messages: AssistantMessage[];
  pushMessage: (message: Omit<AssistantMessage, "id" | "createdAt">) => void;
  resetMessages: () => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

const initialMessages: AssistantMessage[] = [
  {
    id: "seed-otto-1",
    role: "otto",
    text: "Three deals need attention. Two exceed customer concentration threshold.",
    confidence: 0.96,
    createdAt: new Date().toISOString(),
  }
];

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);

  const pushMessage = useCallback((message: Omit<AssistantMessage, "id" | "createdAt">) => {
    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role: message.role,
        text: message.text,
        confidence: message.confidence,
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);

  const resetMessages = useCallback(() => {
    setMessages(initialMessages);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      pushMessage,
      resetMessages
    }),
    [messages, pushMessage, resetMessages]
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within AssistantProvider.");
  }
  return context;
}
