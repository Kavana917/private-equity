import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AlertCircle, Bot, FileText, PanelLeftClose, PanelLeftOpen, Send, Trash2 } from "lucide-react";
import { useAssistant } from "../context/AssistantContext";
export function OttoAssistant({ isExpanded = false, onToggleExpand }) {
    const { messages, pushMessage, resetMessages } = useAssistant();
    const [draft, setDraft] = useState("");
    const quickActions = [
        { label: "I detected a data gap. Draft follow-up questions?", icon: FileText },
        { label: "Two risks are high severity. Build mitigation checklist?", icon: AlertCircle },
        { label: "IC memo is stale. Regenerate with latest metrics?", icon: FileText },
    ];
    function handleSend() {
        if (!draft.trim())
            return;
        const prompt = draft.trim();
        pushMessage({ role: "user", text: prompt });
        pushMessage({
            role: "otto",
            text: `Understood. I will process this request: ${prompt}`,
            confidence: 0.96,
        });
        setDraft("");
    }
    return (_jsxs("section", { className: "assistant-chat", children: [_jsxs("div", { className: "assistant-chat-header", children: [_jsxs("div", { className: "assistant-header-title", children: [_jsx("div", { className: "assistant-avatar", children: _jsx(Bot, { size: 16 }) }), _jsxs("div", { children: [_jsx("h2", { children: "Otto AI Assistant" }), _jsx("p", { className: "muted", children: "Governance Co-Pilot" })] })] }), _jsxs("div", { className: "assistant-head-actions", children: [_jsx("button", { type: "button", className: "assistant-icon-btn", onClick: resetMessages, title: "Clear chat", children: _jsx(Trash2, { size: 15 }) }), onToggleExpand && (_jsx("button", { type: "button", className: "assistant-icon-btn", onClick: onToggleExpand, title: "Toggle width", children: isExpanded ? _jsx(PanelLeftClose, { size: 15 }) : _jsx(PanelLeftOpen, { size: 15 }) }))] })] }), _jsxs("div", { className: "assistant-quick-strip", children: [_jsx("p", { children: "Quick Actions" }), quickActions.map((action) => (_jsxs("button", { type: "button", className: "assistant-quick-btn", onClick: () => setDraft(action.label), children: [_jsx(action.icon, { size: 16 }), action.label] }, action.label)))] }), _jsx("div", { className: "assistant-messages", children: messages.map((message) => (_jsxs("div", { className: message.role === "user" ? "chat-row user" : "chat-row", children: [message.role !== "user" && (_jsx("div", { className: "assistant-avatar bubble-avatar", children: _jsx(Bot, { size: 15 }) })), _jsxs("div", { className: message.role === "user" ? "assistant-bubble user" : "assistant-bubble otto", children: [_jsx("p", { children: message.text }), message.confidence !== undefined && (_jsxs("div", { className: "assistant-confidence", children: [_jsx("span", { children: "Confidence:" }), _jsxs("strong", { children: [Math.round(message.confidence * 100), "%"] })] }))] })] }, message.id))) }), _jsxs("div", { className: "assistant-composer", children: [_jsx("input", { value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "Ask Otto anything...", onKeyDown: (event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                handleSend();
                            }
                        } }), _jsx("button", { type: "button", onClick: handleSend, "aria-label": "Send message", children: _jsx(Send, { size: 16 }) })] })] }));
}
