"use client";
import { useState, KeyboardEvent } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage(): Promise<void> {
    if (!input.trim()) return;

    const newMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, userId: 1 }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data: { answer?: string; error?: string } = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer ?? "Sorry, something went wrong." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Failed to fetch response. Please try again." },
      ]);
    } finally {
      setInput("");
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Ecommerce Chatbot</h1>
      <div className="border rounded p-2 h-96 overflow-y-auto bg-white">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-1 ${m.role === "user" ? "text-right" : "text-left"}`}
          >
            <p
              className={`inline-block px-3 py-2 rounded-lg shadow-sm ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
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
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
