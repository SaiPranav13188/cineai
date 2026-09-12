
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const movies = [
    {
      id: 1,
      title: "Spider-Man",
      image: "/movies/movie1.jpg",
      rating: "4.8",
      genre: "Action / Sci-Fi",
      language: "English",
      format: "IMAX 3D",
      price: "₹250",
    },
    {
      id: 2,
      title: "Jaws",
      image: "/movies/movie2.jpg",
      rating: "4.5",
      genre: "Thriller / Adventure",
      language: "English",
      format: "2D",
      price: "₹180",
    },
    {
      id: 3,
      title: "The Avengers",
      image: "/movies/movie3.jpg",
      rating: "4.7",
      genre: "Action / Sci-Fi",
      language: "English",
      format: "3D",
      price: "₹300",
    },
    {
      id: 4,
      title: "Spider-Man: Into the Spider-Verse",
      image: "/movies/movie1.jpg",
      rating: "4.9",
      genre: "Animation / Action",
      language: "English",
      format: "IMAX 3D",
      price: "₹280",
    },
    {
      id: 5,
      title: "Jaws 2",
      image: "/movies/movie2.jpg",
      rating: "4.2",
      genre: "Thriller / Adventure",
      language: "English",
      format: "2D",
      price: "₹160",
    },
  ];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === "" || movie.language.toLowerCase() === selectedLanguage.toLowerCase();
    const matchesGenre = selectedGenre === "" || movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesLanguage && matchesGenre;
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Navigation */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
          <Link href="/" className="text-sm text-purple-400 hover:underline">
            ← Back to Home
          </Link>
        </div>

        {/* Interactive Search Bar */}
        <div className="max-w-xl">
          <input
            type="text"
            placeholder="🔍 Search movies by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-zinc-400 font-medium">Filters:</span>
          
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-xs"
          >
            <option value="">All Languages</option>
            <option value="english">English</option>
          </select>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-xs"
          >
            <option value="">All Genres</option>
            <option value="action">Action</option>
            <option value="animation">Animation</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="thriller">Thriller</option>
          </select>

          <select className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-xs">
            <option value="">Rating</option>
            <option value="4+">⭐ 4.0 & above</option>
          </select>
        </div>

        {/* Movies Grid with Decreased Image Size */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 pt-2">
            {filteredMovies.map((movie) => (
              <Link
                href={`/movie/${movie.id}`}
                key={movie.id}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Fixed compact image height container (h-36) */}
                <div className="relative w-full h-36 bg-zinc-800 overflow-hidden">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 bg-zinc-950/80 text-zinc-200 border border-zinc-700 rounded backdrop-blur-md">
                    {movie.format}
                  </span>
                </div>

                {/* Compact Details Section */}
                <div className="p-3 space-y-1.5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h2 className="font-semibold text-xs text-zinc-100 group-hover:text-purple-400 transition-colors truncate" title={movie.title}>
                        {movie.title}
                      </h2>
                      <span className="text-amber-400 text-[11px] font-bold shrink-0">
                        ⭐ {movie.rating}
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {movie.genre} • {movie.language}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">From</span>
                    <span className="font-bold text-purple-400">{movie.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No movies found matching your filters.
          </div>
        )}

      </div>
    </main>
  );
}