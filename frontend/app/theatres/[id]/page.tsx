import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Show {
  showId: string;
  movieTitle: string;
  poster: string;
  times: string[];
  price: number;
}

interface TheatreData {
  name: string;
  location: string;
  screens: number;
  shows: Show[];
}

const theatreDatabase: Record<string, TheatreData> = {
  "1": {
    name: "Cinepolis IMAX",
    location: "Downtown Mall",
    screens: 2,
    shows: [
      {
        showId: "5001",
        movieTitle: "Spider-Man",
        poster: "/movies/movie1.jpg",
        times: ["10:30 AM", "02:15 PM", "06:00 PM", "09:30 PM"],
        price: 250,
      },
      {
        showId: "5002",
        movieTitle: "Jaws",
        poster: "/movies/movie2.jpg",
        times: ["11:00 AM", "04:30 PM", "08:15 PM"],
        price: 180,
      },
    ],
  },
  "2": {
    name: "PVR Superplex",
    location: "City Center",
    screens: 2,
    shows: [
      {
        showId: "5003",
        movieTitle: "The Avengers",
        poster: "/movies/movie3.jpg",
        times: ["01:00 PM", "05:00 PM", "09:00 PM"],
        price: 300,
      },
      {
        showId: "5004",
        movieTitle: "Spider-Man",
        poster: "/movies/movie1.jpg",
        times: ["11:30 AM", "03:45 PM", "07:15 PM"],
        price: 280,
      },
    ],
  },
  "3": {
    name: "INAX Cinema",
    location: "Westside Hub",
    screens: 1,
    shows: [
      {
        showId: "5005",
        movieTitle: "Jaws",
        poster: "/movies/movie2.jpg",
        times: ["12:00 PM", "03:30 PM", "07:00 PM"],
        price: 180,
      },
    ],
  },
};

export default async function TheatreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theatre = theatreDatabase[id];

  if (!theatre) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div>
            <Link href="/theatres" className="text-xs text-purple-400 hover:underline">
              ← Back to Partner Theatres
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight mt-2">{theatre.name}</h1>
            <p className="text-sm text-zinc-400 mt-1">
              📍 {theatre.location} • 🎬 {theatre.screens} Screens
            </p>
          </div>
        </div>

        {/* Available Shows Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-wide">Now Showing</h2>

          <div className="space-y-4">
            {theatre.shows.map((show) => (
              <div
                key={show.showId}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-28 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800 flex-shrink-0">
                    <Image
                      src={show.poster}
                      alt={show.movieTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{show.movieTitle}</h3>
                    <p className="text-xs text-zinc-400">Tickets starting at ₹{show.price}</p>
                  </div>
                </div>

                {/* Showtimes */}
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  {show.times.map((time, idx) => (
                    <Link
                      key={idx}
                      href={`/booking/${show.showId}?price=${show.price}`}
                      className="px-4 py-2 bg-zinc-950 border border-zinc-800 hover:border-purple-500 hover:bg-purple-600/10 text-purple-400 text-sm font-semibold rounded-xl transition-all"
                    >
                      {time}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}