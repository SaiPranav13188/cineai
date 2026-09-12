"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface UserProfile {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("Sai");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Read logged-in user profile from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed: UserProfile = JSON.parse(storedUser);
        if (parsed.name) {
          setUserName(parsed.name.split(" ")[0]); // First name
        }
      } catch (err) {
        console.error("Failed to parse user profile", err);
      }
    }
  }, []);

  const upcomingBooking = {
    bookingId: "CINE-892341",
    movie: "Spider-Man",
    theatre: "AMB Cinemas, Screen 3",
    date: "Sep 15, 2026",
    time: "07:30 PM",
    seats: "C2, C3",
    poster: "/movies/movie1.jpg",
  };

  const pastBookings = [
    { id: "1", title: "Jaws", date: "Aug 10, 2026", poster: "/movies/movie2.jpg" },
    { id: "2", title: "The Avengers", date: "Jul 22, 2026", poster: "/movies/movie3.jpg" },
  ];

  const recommendations = [
    { id: "1", title: "Spider-Man", rating: "4.8", poster: "/movies/movie1.jpg" },
    { id: "2", title: "Jaws", rating: "4.5", poster: "/movies/movie2.jpg" },
    { id: "3", title: "The Avengers", rating: "4.7", poster: "/movies/movie3.jpg" },
  ];

  // Stringified payload stored inside the QR code
  const qrPayload = JSON.stringify({
    bookingId: upcomingBooking.bookingId,
    movie: upcomingBooking.movie,
    seats: upcomingBooking.seats,
    showtime: `${upcomingBooking.date} ${upcomingBooking.time}`,
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Greeting */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Hello {userName} 👋</h1>
            <p className="text-sm text-zinc-400 mt-1">Welcome back to your CineAI portal</p>
          </div>
          <Link
            href="/movies"
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm font-medium transition-all"
          >
            Explore Movies
          </Link>
        </div>

        {/* Section 1: Upcoming Bookings */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-wide">Upcoming Bookings</h2>
          
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="relative w-20 h-28 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800 flex-shrink-0">
                <Image
                  src={upcomingBooking.poster}
                  alt={upcomingBooking.movie}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="inline-block px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold rounded-md mb-1">
                  Confirmed
                </div>
                <h3 className="text-xl font-bold">{upcomingBooking.movie}</h3>
                <p className="text-sm text-zinc-400">🏢 {upcomingBooking.theatre}</p>
                <p className="text-sm text-zinc-400">
                  📅 {upcomingBooking.date} • ⏰ {upcomingBooking.time}
                </p>
                <p className="text-sm text-purple-400 font-medium">💺 Seats: {upcomingBooking.seats}</p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer text-center"
            >
              View Ticket
            </button>
          </div>
        </section>

        {/* Section 2: Past Bookings */}
        <section className="space-y-4 border-t border-zinc-800/80 pt-8">
          <h2 className="text-xl font-bold tracking-wide">Past Bookings</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pastBookings.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-800 flex-shrink-0">
                  <Image src={item.poster} alt={item.title} fill className="object-cover grayscale opacity-75" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-200">{item.title}</h4>
                  <p className="text-xs text-zinc-500">Watched on {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Your Recommendations */}
        <section className="space-y-4 border-t border-zinc-800/80 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-wide">Your Recommendations</h2>
            <span className="text-xs text-purple-400 font-mono">✨ Powered by CineAI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendations.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all group">
                  <div className="relative h-48 w-full bg-zinc-800">
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">⭐ {movie.rating}</p>
                    </div>
                    <span className="text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                      Book →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* Ticket Modal with QR Code */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-6 text-center shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold">{upcomingBooking.movie}</h3>
              <p className="text-xs text-zinc-400">{upcomingBooking.theatre}</p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl inline-block border-4 border-purple-600/20 shadow-inner">
              <QRCodeSVG value={qrPayload} size={180} level="H" />
            </div>

            <div className="space-y-2 text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div className="flex justify-between">
                <span className="text-zinc-500">Booking ID</span>
                <span className="font-mono font-bold text-purple-400">{upcomingBooking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Seats</span>
                <span className="font-semibold">{upcomingBooking.seats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Date & Time</span>
                <span>{upcomingBooking.date} • {upcomingBooking.time}</span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500">Scan this QR code at the theater entrance</p>
          </div>
        </div>
      )}
    </main>
  );
}