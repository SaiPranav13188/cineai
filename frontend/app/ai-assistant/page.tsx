"use client";

import { useState } from "react";
import Link from "next/link";
import MovieCard, { Movie } from "@/components/MovieCard";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  recommendations?: Movie[];
}

export default function AIAssistantPage() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello Sai! 👋 I'm your CineAI assistant. Tell me what kind of movie, genre, or mood you're looking for, and I'll find the best shows near you!",
    },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cineai-backend-1zxp.onrender.com";
      
      const res = await fetch(`${API_URL}/api/v1/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_query: currentInput }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch from backend service");
      }

      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.reply,
        recommendations: data.recommendations,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          text: "Error connecting to the backend server. Please make sure the backend URL is properly configured.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">CineAI Assistant</h1>
              <p className="text-xs text-purple-400 font-mono">LLM + RAG Active</p>
            </div>
          </div>
          <Link href="/" className="text-xs text-zinc-400 hover:text-white">
            ← Home Page
          </Link>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {/* Movie Recommendations via Reusable MovieCard */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {msg.recommendations.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} variant="compact" />
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-950 border border-zinc-800/60 px-4 py-2 rounded-xl w-max">
              <span className="animate-pulse">🤖 CineAI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-zinc-950 border-t border-zinc-800 flex gap-3">
          <input
            type="text"
            placeholder="Ask anything... (e.g. 'I want a thriller tonight')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold rounded-xl transition-all text-sm cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}