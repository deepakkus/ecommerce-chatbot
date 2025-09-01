"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const newMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input, userId: 1 }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    setInput("");
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Ecommerce Chatbot</h1>
      <div className="border rounded p-2 h-96 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <p
              className={`inline-block p-2 m-1 rounded ${
                m.role === "user" ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
