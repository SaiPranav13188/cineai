"use client";

import Image from "next/image";
import Link from "next/link";

export interface Movie {
  id: string;
  title: string;
  rating: string;
  genre: string;
  poster: string;
  price?: number;
}

interface MovieCardProps {
  movie: Movie;
  variant?: "compact" | "full";
}

export default function MovieCard({ movie, variant = "compact" }: MovieCardProps) {
  if (variant === "compact") {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex gap-3 items-center w-full">
        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm truncate">{movie.title}</h4>
          <p className="text-xs text-amber-400 font-semibold mt-0.5">
            ⭐ {movie.rating}
          </p>
          <p className="text-[10px] text-zinc-500 truncate">{movie.genre}</p>
        </div>
        <Link
          href={`/movie/${movie.id}`}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition-all"
        >
          Book
        </Link>
      </div>
    );
  }

  // Full Grid Variant (For Home / Catalog Pages)
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all flex flex-col group">
      <div className="relative w-full h-64 bg-zinc-800 overflow-hidden">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-base truncate">{movie.title}</h3>
            <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
              ⭐ {movie.rating}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{movie.genre}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
          {movie.price && (
            <span className="text-sm font-semibold text-zinc-200">
              ₹{movie.price}
            </span>
          )}
          <Link
            href={`/movie/${movie.id}`}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}