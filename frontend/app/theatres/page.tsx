"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";

interface TheatreDetail {
  name: string;
  location: string;
  screens: number;
  movies: {
    id: string;
    title: string;
    poster: string;
    price: number;
    showtimes: string[];
  }[];
}

const THEATRES_CATALOG: Record<string, TheatreDetail> = {
  "1": {
    name: "Cinepolis IMAX",
    location: "Downtown Mall",
    screens: 2,
    movies: [
      {
        id: "1",
        title: "Spider-Man: Across the Spider-Verse",
        poster: "/movies/movie1.jpg",
        price: 250,
        showtimes: ["10:30 AM", "02:15 PM", "06:00 PM", "09:30 PM"],
      },
      {
        id: "2",
        title: "Jaws",
        poster: "/movies/movie2.jpg",
        price: 180,
        showtimes: ["11:00 AM", "04:30 PM", "08:15 PM"],
      },
    ],
  },
  "2": {
    name: "PVR Superplex",
    location: "City Center",
    screens: 2,
    movies: [
      {
        id: "3",
        title: "The Avengers",
        poster: "/movies/movie3.jpg",
        price: 300,
        showtimes: ["10:15 AM", "03:00 PM", "07:30 PM"],
      },
      {
        id: "1",
        title: "Spider-Man: Across the Spider-Verse",
        poster: "/movies/movie1.jpg",
        price: 250,
        showtimes: ["01:00 PM", "05:00 PM", "09:00 PM"],
      },
    ],
  },
  "3": {
    name: "INAX Cinema",
    location: "Westside Hub",
    screens: 1,
    movies: [
      {
        id: "2",
        title: "Jaws",
        poster: "/movies/movie2.jpg",
        price: 180,
        showtimes: ["12:00 PM", "03:30 PM", "07:00 PM"],
      },
    ],
  },
};

export default function TheatreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const theatreId = resolvedParams.id;
  const theatre = THEATRES_CATALOG[theatreId];

  if (!theatre) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold">Theatre Not Found</h1>
        <p className="text-zinc-400 mt-2">The requested theatre does not exist.</p>
        <Link href="/theatres" className="mt-6 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold">
          Back to Theatres
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <Link href="/theatres" className="text-sm text-purple-400 hover:underline">
            ← Back to Partner Theatres
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">{theatre.name}</h1>
          <p className="text-sm text-zinc-400 mt-1">📍 {theatre.location} • 🎬 {theatre.screens} Screens</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Now Showing</h2>

          {theatre.movies.map((movie) => (
            <div key={movie.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-28 h-40 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
              </div>

              <div className="flex-1 space-y-3 text-center md:text-left">
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <p className="text-xs text-zinc-400">Tickets starting at ₹{movie.price}</p>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                  {movie.showtimes.map((time) => (
                    <Link
                      key={time}
                      href={`/movie/${movie.id}`}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-950 border border-zinc-800 text-purple-400 hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all"
                    >
                      {time}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}