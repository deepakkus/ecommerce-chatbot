"use client";
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, userId: 1 }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer || "⚠️ No response received." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error: Could not get response." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // 🔽 Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col items-center h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Chat container */}
      <div className="flex flex-col w-full max-w-2xl h-full border-x bg-white shadow-sm">
        {/* Header */}
        <header className="p-4 bg-blue-600 text-white text-lg font-bold shadow-md rounded-b-lg">
          🛒 Ecommerce Assistant
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => {
            // Split assistant messages into smaller sentence chunks
            const chunks =
              msg.role === "assistant"
                ? msg.text.split(/(?<=[.!?])\s+/)
                : [msg.text];

            return chunks.map((chunk, j) => (
              <motion.div
                key={`${i}-${j}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-gray-100 text-gray-800 self-start"
                }`}
              >
                {chunk}
              </motion.div>
            ));
          })}

          {/* Typing indicator with bouncing dots */}
          {loading && (
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl shadow-sm self-start w-fit flex gap-1">
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-gray-500 rounded-full"
              />
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-gray-500 rounded-full"
              />
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-gray-500 rounded-full"
              />
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={chatEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 bg-white border-t flex gap-2 sticky bottom-0">
          <input
            className="flex-1 border rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-full shadow hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
