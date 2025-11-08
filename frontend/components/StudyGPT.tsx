"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const StudyGPT = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/studygpt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Gemini API failed." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-9 right-0 w-full max-w-2xl mx-auto h-[600px] bg-slate-900 rounded-lg border border-purple-500/20 overflow-hidden">
      <div className="bg-purple-600 p-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <h2 className="text-white font-semibold">StudyGPT</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(600px-140px)]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-12 h-12 text-purple-400 mb-3" />
            <h3 className="text-white text-lg font-semibold mb-2">Ask me anything</h3>
            <p className="text-gray-400 text-sm">I can help with your studies</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg text-sm prose prose-sm prose-invert ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-white border border-white/20"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 text-white border border-white/20 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-black/20 border-t border-white/10">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask anything..."
            className="flex-1 px-3 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-2 rounded-lg disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyGPT;
