"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);

    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input, userId: 1 }),
    });
    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: data.data.answer },
    ]);
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-100 to-white">
      <header className="p-4 bg-blue-600 text-white text-lg font-semibold shadow-md">
        💬 Ecommerce Chatbot
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-xs p-3 rounded-2xl shadow ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <input
          className="flex-1 border rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-xl shadow hover:bg-blue-700"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
