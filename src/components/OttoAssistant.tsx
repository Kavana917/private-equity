import { useState } from "react";
import { AlertCircle, Bot, FileText, PanelLeftClose, PanelLeftOpen, Send, Trash2 } from "lucide-react";
import { useAssistant } from "../context/AssistantContext";

type OttoAssistantProps = {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

export function OttoAssistant({ isExpanded = false, onToggleExpand }: OttoAssistantProps) {
  const { messages, pushMessage, resetMessages } = useAssistant();
  const [draft, setDraft] = useState("");
  const quickActions = [
    { label: "I detected a data gap. Draft follow-up questions?", icon: FileText },
    { label: "Two risks are high severity. Build mitigation checklist?", icon: AlertCircle },
    { label: "IC memo is stale. Regenerate with latest metrics?", icon: FileText },
  ];

  function handleSend() {
    if (!draft.trim()) return;
    const prompt = draft.trim();
    pushMessage({ role: "user", text: prompt });
    pushMessage({
      role: "otto",
      text: `Understood. I will process this request: ${prompt}`,
      confidence: 0.96,
    });
    setDraft("");
  }

  return (
    <section className="assistant-chat">
      <div className="assistant-chat-header">
        <div className="assistant-header-title">
          <div className="assistant-avatar">
            <Bot size={16} />
          </div>
          <div>
            <h2>Otto AI Assistant</h2>
            <p className="muted">Governance Co-Pilot</p>
          </div>
        </div>
        <div className="assistant-head-actions">
          <button type="button" className="assistant-icon-btn" onClick={resetMessages} title="Clear chat">
            <Trash2 size={15} />
          </button>
          {onToggleExpand && (
            <button type="button" className="assistant-icon-btn" onClick={onToggleExpand} title="Toggle width">
              {isExpanded ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
            </button>
          )}
        </div>
      </div>

      <div className="assistant-quick-strip">
        <p>Quick Actions</p>
        {quickActions.map((action) => (
          <button key={action.label} type="button" className="assistant-quick-btn" onClick={() => setDraft(action.label)}>
            <action.icon size={16} />
            {action.label}
          </button>
        ))}
      </div>

      <div className="assistant-messages">
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "chat-row user" : "chat-row"}>
            {message.role !== "user" && (
              <div className="assistant-avatar bubble-avatar">
                <Bot size={15} />
              </div>
            )}
            <div className={message.role === "user" ? "assistant-bubble user" : "assistant-bubble otto"}>
              <p>{message.text}</p>
              {message.confidence !== undefined && (
                <div className="assistant-confidence">
                  <span>Confidence:</span>
                  <strong>{Math.round(message.confidence * 100)}%</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="assistant-composer">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask Otto anything..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSend();
            }
          }}
        />
        <button type="button" onClick={handleSend} aria-label="Send message">
          <Send size={16} />
        </button>
      </div>
    </section>
  );
}
