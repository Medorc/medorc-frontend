import { useState, useRef, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { RASA_URL } from "../config/api";

const OrbyChat = ({ userName, onBack, shcCode, qrCode }) => {
    const [messages, setMessages] = useState([
        {
            role: "bot",
            content: `Hi ${userName}! I'm Orby, your medical records assistant. Ask me anything about your health records, medications, or appointments.`,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage = { role: "user", content: trimmedInput };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post(`${RASA_URL}/webhooks/rest/webhook`, {
                sender: shcCode || "default_user",
                message: trimmedInput,
                metadata: {
                    shc_code: shcCode,
                    qr_code: qrCode
                }
            });

            console.log("Rasa response:", response.data);

            const botResponses = response.data;
            let hasText = false;
            if (Array.isArray(botResponses) && botResponses.length > 0) {
                botResponses.forEach((res) => {
                    if (res.text) {
                        hasText = true;
                        setMessages((prev) => [...prev, { role: "bot", content: res.text }]);
                    }
                });
            }

            if (!hasText) {
                let fallbackMsg = "I can assist you with your health records, emergency contacts, diagnoses, and medical profile. What would you like to know?";
                const lowerMsg = trimmedInput.toLowerCase();
                if (lowerMsg.includes("emergency") || lowerMsg.includes("contact")) {
                    fallbackMsg = "Your registered emergency contacts can be viewed and updated in your Personal Profile Settings under Emergency Contacts.";
                } else if (lowerMsg.includes("record") || lowerMsg.includes("history") || lowerMsg.includes("diagnosis")) {
                    fallbackMsg = "You can view your full medical history, diagnoses, and prescriptions in the Medical Records section.";
                } else if (lowerMsg.includes("tip") || lowerMsg.includes("health")) {
                    fallbackMsg = "💡 Health Tip: Stay hydrated with 2.5–3L of water daily and take regular breaks during work!";
                }

                setMessages((prev) => [...prev, {
                    role: "bot",
                    content: fallbackMsg
                }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            let errorContent = "Sorry, I encountered an error. Please try again later.";

            if (error.code === "ERR_NETWORK" || error.code === "ERR_CONNECTION_REFUSED") {
                errorContent = "I'm currently offline. The chat service is not available at the moment.";
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-teal-50">
            {/* Top Navigation Bar */}
            <div className="bg-gradient-to-r from-[#0a5078] to-[#0d6e9e] shadow-lg">
                <div className="max-w-full mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 border-3 border-white/30 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                                {userName?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Medical Records</h1>
                            <p className="text-teal-200 text-sm">{userName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border border-white/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to home
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="max-w-full mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Orby Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Orby</h2>
                                <p className="text-sm text-gray-500">Your AI Health Assistant</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="h-[28rem] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "bot" && (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                        </svg>
                                    </div>
                                )}
                                <div
                                    className={`max-w-xs sm:max-w-md lg:max-w-lg px-5 py-3.5 ${msg.role === "user"
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-blue-500/20"
                                            : "bg-white text-gray-700 rounded-2xl rounded-bl-md shadow-md border border-gray-100"
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content) }} >
                                    {/*<p className="text-sm leading-relaxed">{msg.content}</p>*/}
                                </div>
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center ml-3 flex-shrink-0 shadow-sm">
                                        <span className="text-white text-xs font-bold">
                                            {userName?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                                <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-md shadow-md border border-gray-100">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                    placeholder="Ask about your medications, appointments, records..."
                                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:shadow-none"
                            >
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center">
                            Try: "What are my allergies?" • "Show my last hospital visit" • "List my medications"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrbyChat;
