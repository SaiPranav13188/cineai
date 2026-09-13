"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface MovieDetail {
  title: string;
  rating: string;
  genre: string;
  poster: string;
  price: number;
  synopsis: string;
  duration: string;
  showtimes: string[];
}

const MOVIES_CATALOG: Record<string, MovieDetail> = {
  "1": {
    title: "Spider-Man: Across the Spider-Verse",
    rating: "4.8",
    genre: "Action / Sci-Fi",
    poster: "/movies/movie1.jpg",
    price: 250,
    synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    duration: "2h 20m",
    showtimes: ["11:30 AM", "02:45 PM", "06:15 PM", "09:30 PM"],
  },
  "2": {
    title: "Jaws",
    rating: "4.5",
    genre: "Thriller / Survival",
    poster: "/movies/movie2.jpg",
    price: 180,
    synopsis: "When a killer shark unleashes chaos on a beach community off Long Island, it's up to a local sheriff, a marine biologist, and an old seafarer to hunt the beast down.",
    duration: "2h 04m",
    showtimes: ["01:00 PM", "04:30 PM", "08:00 PM"],
  },
  "3": {
    title: "The Avengers",
    rating: "4.7",
    genre: "Action / Sci-Fi",
    poster: "/movies/movie3.jpg",
    price: 300,
    synopsis: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    duration: "2h 23m",
    showtimes: ["10:15 AM", "03:00 PM", "07:30 PM", "10:45 PM"],
  },
};

const SEAT_ROWS = ["A", "B", "C", "D", "E"];
const SEATS_PER_ROW = 6;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cineai-backend-1zxp.onrender.com";

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;
  const movie = MOVIES_CATALOG[movieId];

  const [selectedShowtime, setSelectedShowtime] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [step, setStep] = useState<"details" | "seats" | "payment" | "ticket">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketId, setTicketId] = useState("");

  // Fetch live occupied seats filtered by both movie ID and showtime
  useEffect(() => {
    async function fetchBookedSeats() {
      if (!movieId || !selectedShowtime) return;
      try {
        const encodedShowtime = encodeURIComponent(selectedShowtime);
        const response = await fetch(`${API_URL}/api/seats/${movieId}?showtime=${encodedShowtime}`);
        const data = await response.json();
        if (data.booked_seats) {
          setOccupiedSeats(data.booked_seats);
        }
      } catch (error) {
        console.error("Failed to fetch booked seats from backend:", error);
      }
    }
    if (step === "seats") {
      fetchBookedSeats();
    }
  }, [movieId, selectedShowtime, step]);

  if (!movie) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold">Movie Not Found</h1>
        <p className="text-zinc-400 mt-2">The movie ID #{movieId} does not exist in our catalog.</p>
        <Link href="/" className="mt-6 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold">
          Return Home
        </Link>
      </main>
    );
  }

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const handlePayment = async () => {
    if (selectedSeats.length === 0) return;
    setIsProcessing(true);

    try {
      const response = await fetch(`${API_URL}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: movieId,
          showtime: selectedShowtime,
          seats: selectedSeats,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTicketId(`CINE-${Math.floor(100000 + Math.random() * 900000)}`);
        setStep("ticket");
      } else {
        alert(data.detail || "Booking failed on server. Some seats might already be taken.");
        if (data.booked_seats) {
          setOccupiedSeats(data.booked_seats);
        }
        setStep("seats");
      }
    } catch (error) {
      console.error("Network error during checkout:", error);
      alert("Could not connect to backend server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = selectedSeats.length * movie.price;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="text-sm text-zinc-400 hover:text-white flex items-center gap-2">
          ← Back to Catalog
        </Link>

        {/* STEP 1: Details & Showtime */}
        {step === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-800">
              <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
            </div>

            <div className="md:col-span-2 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 px-2.5 py-1 rounded-full">
                    ⭐ {movie.rating}
                  </span>
                  <span className="text-xs text-zinc-400">{movie.duration}</span>
                  <span className="text-xs text-purple-400 font-mono">{movie.genre}</span>
                </div>
                <h1 className="text-3xl font-extrabold mt-3">{movie.title}</h1>
                <p className="text-zinc-300 text-sm leading-relaxed mt-4">{movie.synopsis}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-200">Select Show Time</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.showtimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedShowtime(time)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        selectedShowtime === time
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!selectedShowtime}
                onClick={() => {
                  setSelectedSeats([]);
                  setStep("seats");
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                {selectedShowtime ? "Select Seats →" : "Select a Showtime"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Seat Selection */}
        {step === "seats" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-bold">{movie.title}</h2>
                <p className="text-xs text-purple-400">Showtime: {selectedShowtime}</p>
              </div>
              <button onClick={() => setStep("details")} className="text-xs text-zinc-400 hover:text-white">
                Change Showtime
              </button>
            </div>

            {/* Screen Banner */}
            <div className="w-full bg-zinc-800 text-center py-1.5 rounded-lg text-xs font-mono text-zinc-400 tracking-widest uppercase">
              Screen This Way
            </div>

            {/* Seat Grid */}
            <div className="flex flex-col items-center gap-3 py-6">
              {SEAT_ROWS.map((row) => (
                <div key={row} className="flex gap-3 items-center">
                  <span className="w-4 text-xs font-mono text-zinc-500">{row}</span>
                  {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <button
                        key={seatId}
                        disabled={isOccupied}
                        onClick={() => toggleSeat(seatId)}
                        className={`w-9 h-9 text-xs font-bold rounded-lg border transition-all ${
                          isOccupied
                            ? "bg-zinc-800 border-zinc-700 text-zinc-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/50"
                            : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-purple-500/50"
                        }`}
                      >
                        {seatId}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Seat Legend */}
            <div className="flex justify-center gap-6 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-zinc-950 border border-zinc-800" /> Available
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-purple-600" /> Selected
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-zinc-800 border border-zinc-700" /> Occupied
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <div>
                <p className="text-xs text-zinc-400">Selected Seats: {selectedSeats.join(", ") || "None"}</p>
                <p className="text-xl font-bold text-white">₹{totalPrice}</p>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={() => setStep("payment")}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Gateway */}
        {step === "payment" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold">Payment Summary</h2>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Movie</span>
                <span className="text-white font-semibold">{movie.title}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Time</span>
                <span className="text-white font-semibold">{selectedShowtime}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Seats</span>
                <span className="text-purple-400 font-semibold">{selectedSeats.join(", ")}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2 text-base font-bold text-white">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white font-semibold rounded-xl transition-all cursor-pointer flex justify-center items-center"
            >
              {isProcessing ? "Saving Booking..." : `Pay ₹${totalPrice}`}
            </button>
          </div>
        )}

        {/* STEP 4: Digital Ticket & QR Code */}
        {step === "ticket" && (
          <div className="bg-zinc-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 text-center space-y-6 max-w-md mx-auto shadow-2xl shadow-purple-950">
            <div className="inline-block bg-purple-600/20 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-mono text-purple-400">
              Booking Confirmed ✅
            </div>

            <h2 className="text-2xl font-bold">{movie.title}</h2>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
              <QRCodeSVG
                value={JSON.stringify({
                  ticketId,
                  movie: movie.title,
                  showtime: selectedShowtime,
                  seats: selectedSeats,
                  price: totalPrice,
                })}
                size={160}
              />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs space-y-2 text-zinc-400 text-left">
              <div className="flex justify-between">
                <span>Ticket ID:</span>
                <span className="font-mono text-white">{ticketId}</span>
              </div>
              <div className="flex justify-between">
                <span>Showtime:</span>
                <span className="text-white">{selectedShowtime}</span>
              </div>
              <div className="flex justify-between">
                <span>Seats:</span>
                <span className="text-purple-400 font-bold">{selectedSeats.join(", ")}</span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-block w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}