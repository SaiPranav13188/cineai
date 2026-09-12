"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    setTimeout(() => {
      // Retrieve locally saved user from signup flow
      const savedUser = localStorage.getItem("user");
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.email === email) {
          setSuccess(true);
          setIsSubmitting(false);
          setTimeout(() => {
            router.push("/movies");
          }, 1200);
          return;
        }
      }

      // Default fallback login for testing even without signing up first
      if (email && password) {
        localStorage.setItem("user", JSON.stringify({ email }));
        setSuccess(true);
        setIsSubmitting(false);
        setTimeout(() => {
          router.push("/movies");
        }, 1200);
      } else {
        setError("Invalid credentials. Please try again.");
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">User Login</h1>
          <p className="text-sm text-zinc-400">Sign in to your CineAI account</p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center font-medium">
            🔓 Logged in successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Email</label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || success}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting || success}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/25 cursor-pointer flex items-center justify-center"
          >
            {isSubmitting ? "Logging in..." : success ? "Logged In!" : "Login"}
          </button>
        </form>

        {/* Navigation to Signup */}
        <div className="text-center pt-2 text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-purple-400 hover:underline font-medium">
            Create Account
          </Link>
        </div>

      </div>
    </main>
  );
}