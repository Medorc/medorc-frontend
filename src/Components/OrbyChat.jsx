import { useState, useRef, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { FiArrowLeft, FiSend, FiRefreshCw, FiMessageCircle, FiUser } from "react-icons/fi";
import { API_BASE_URL } from "../config/api";

const OrbyChat = ({ userName, onBack, shcCode, qrCode }) => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: `Hi ${userName || "User"}! I'm Orby, your medical records assistant. Ask me anything about your health records, medications, or appointments.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const messagesEndRef = useRef(null);

  const checkBackendConnection = async () => {
    setConnectionStatus("connecting");
    try {
      const res = await axios.get(`${API_BASE_URL}/health-tips/random`, { timeout: 5000 });
      if (res.status === 200 || res.data) {
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("error");
      }
    } catch (err) {
      console.warn("Backend connection check error:", err);
      try {
        await axios.post(`${API_BASE_URL}/orby/chat`, { message: "ping" }, { timeout: 4000 });
        setConnectionStatus("connected");
      } catch {
        setConnectionStatus("error");
      }
    }
  };

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatContent = (content) => {
    if (!content) return "";
    const formatted = content.replace(/\n/g, "<br />");
    return DOMPurify.sanitize(formatted);
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || connectionStatus !== "connected") return;

    const userMessage = { role: "user", content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/orby/chat`, {
        sender: shcCode || "default_user",
        message: trimmedInput,
        metadata: {
          shc_code: shcCode,
          qr_code: qrCode,
        },
      });

      console.log("Orby chat response:", response.data);

      const botResponses = response.data?.responses || response.data;
      if (Array.isArray(botResponses) && botResponses.length > 0) {
        botResponses.forEach((res) => {
          if (res.text) {
            setMessages((prev) => [...prev, { role: "bot", content: res.text }]);
          }
        });
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "I received your message but couldn't process a response.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      let errorContent = "Sorry, I encountered an error. Please try again later.";

      if (error.code === "ERR_NETWORK" || error.code === "ERR_CONNECTION_REFUSED") {
        errorContent = "I'm currently offline. The chat service is not available at the moment.";
        setConnectionStatus("error");
      }

      setMessages((prev) => [...prev, { role: "bot", content: errorContent }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const statusMeta = {
    connected: {
      dot: "bg-success",
      text: "Connected",
      cls: "bg-success-soft text-success border border-success/20",
    },
    connecting: {
      dot: "bg-warning animate-pulse",
      text: "Connecting to backend...",
      cls: "bg-warning-soft text-warning border border-warning/20",
    },
    error: {
      dot: "bg-danger",
      text: "Backend offline (click to retry)",
      cls: "bg-danger-soft text-danger border border-danger/20",
    },
  }[connectionStatus];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-primary text-white shadow-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/10">
              <span className="text-lg font-bold">{userName?.charAt(0)?.toUpperCase() || "U"}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Medical Records</h1>
              <p className="text-sm text-white/70">{userName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 font-medium backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <FiArrowLeft size={16} aria-hidden="true" />
            Back
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-pop">
          {/* Orby header */}
          <div className="flex items-center justify-between border-b border-border bg-surface-hover px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-card">
                  <FiMessageCircle size={28} aria-hidden="true" />
                </div>
                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface ${statusMeta.dot}`} />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Orby</h2>
                <p className="text-sm text-muted">Your AI Health Assistant</p>
              </div>
            </div>

            {connectionStatus === "error" ? (
              <button
                type="button"
                onClick={checkBackendConnection}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${statusMeta.cls}`}
              >
                <FiRefreshCw size={12} aria-hidden="true" />
                {statusMeta.text}
              </button>
            ) : (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusMeta.cls}`}>
                <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
                {statusMeta.text}
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="h-[28rem] space-y-4 overflow-y-auto bg-background p-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "bot" && (
                  <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                    <FiMessageCircle size={16} aria-hidden="true" />
                  </div>
                )}
                <div
                  className={`max-w-xs px-5 py-3.5 sm:max-w-md lg:max-w-lg ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-br-md bg-primary text-white shadow-card"
                      : "rounded-2xl rounded-bl-md border border-border bg-surface text-muted shadow-card"
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                />
                {msg.role === "user" && (
                  <div className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success text-white shadow-sm">
                    <FiUser size={16} aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <FiMessageCircle size={16} aria-hidden="true" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-border bg-surface px-5 py-4 shadow-card">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border bg-surface p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || connectionStatus !== "connected"}
                placeholder={
                  connectionStatus === "connected"
                    ? "Ask about your medications, appointments, records..."
                    : connectionStatus === "connecting"
                      ? "Verifying backend connection..."
                      : "Backend offline. Click retry connection to enable chat."
                }
                className="w-full rounded-xl border-2 border-border bg-background px-5 py-3.5 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-hover"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || connectionStatus !== "connected"}
                aria-label="Send message"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-card transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-subtle disabled:shadow-none"
              >
                <FiSend size={18} aria-hidden="true" />
              </button>
            </form>
            <p className="mt-3 text-center text-xs text-subtle">
              Try: "What are my allergies?" • "Show my last hospital visit" • "List my medications"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrbyChat;
