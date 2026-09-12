"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/components/MovieCard";

// Catalog dataset matching your backend local structure
const NOW_SHOWING_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Spider-Man: Across the Spider-Verse",
    rating: "4.8",
    genre: "Action / Sci-Fi",
    poster: "/movies/movie1.jpg",
  },
  {
    id: "2",
    title: "Jaws",
    rating: "4.5",
    genre: "Thriller / Survival",
    poster: "/movies/movie2.jpg",
  },
  {
    id: "3",
    title: "The Avengers",
    rating: "4.7",
    genre: "Action / Sci-Fi",
    poster: "/movies/movie3.jpg",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter movies based on title or genre matching search input
  const filteredMovies = NOW_SHOWING_MOVIES.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 font-sans pb-16">
      {/* Navigation Header */}
      <nav className="flex items-center justify-between p-6 border-b border-zinc-800 max-w-7xl mx-auto gap-4">
        <div className="flex items-center gap-6 flex-1 max-w-xl">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image 
              src="/icons/icon1.svg" 
              alt="CineAI Logo" 
              width={36} 
              height={36} 
              className="invert"
            />
            <span className="text-2xl font-bold tracking-tight">CineAI</span>
          </Link>

          {/* Functional Search Bar */}
          <div className="relative w-full max-w-xs">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search movies, events..." 
              className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Nav Links */}
        <div className="flex items-center gap-8 font-medium text-zinc-300 text-sm">
          <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link href="/events" className="hover:text-white transition-colors">Events</Link>
          <Link href="/theatres" className="hover:text-white transition-colors">Theatres</Link>
          <Link href="/ai-assistant" className="hover:text-white transition-colors text-purple-400 font-semibold">AI Assistant</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 font-semibold hover:bg-zinc-200 transition-colors">Login</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 space-y-12 mt-8">
        {/* Hero Section */}
        <section className="text-center py-10 space-y-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Stop Scrolling. Start Watching.
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm">
            Discover movies, live events, and personalized AI suggestions tailored to your taste.
          </p>
        </section>

        {/* Now Showing Section - Dynamic Search Results */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Now Showing"}
            </h2>
            <Link href="/movies" className="text-sm text-purple-400 hover:underline">View All →</Link>
          </div>
          
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {filteredMovies.map((movie) => (
                <div key={movie.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full cursor-default">
                  {/* Movie Poster */}
                  <div className="relative w-full h-48 bg-zinc-800">
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 flex flex-col justify-between flex-1 gap-1">
                    <h3 className="font-bold text-xs truncate text-zinc-100">{movie.title}</h3>
                    <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-1">
                      <span className="truncate">{movie.genre}</span>
                      <span className="text-amber-400 font-semibold flex-shrink-0">⭐ {movie.rating}</span>
                    </div>
                  </div>
                </div>
              ))}

              {!searchQuery && (
                <div className="border border-zinc-800/80 rounded-xl bg-zinc-900/30 flex flex-col items-center justify-center p-4 text-center text-zinc-500 text-xs h-full min-h-[220px]">
                  <span className="text-xl mb-1">🎬</span>
                  <p className="font-semibold text-zinc-400 text-[11px]">+ More Movies</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 border border-zinc-800/80 rounded-2xl bg-zinc-900/30">
              <p className="text-zinc-400 text-sm">No movies found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs text-purple-400 hover:underline font-semibold"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>

        {/* CineAI Prompt Box */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-800/50 text-center space-y-4">
          <h2 className="text-2xl font-bold">🤖 Not sure what to watch?</h2>
          <p className="text-zinc-300 max-w-lg mx-auto text-sm">
            Let CineAI recommend personalized options based on your mood, favorite genres, or schedule.
          </p>
          <Link 
            href="/ai-assistant" 
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-950"
          >
            Ask CineAI
          </Link>
        </section>
      </div>
    </main>
  );
}