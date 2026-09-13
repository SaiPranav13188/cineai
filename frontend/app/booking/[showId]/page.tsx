"use client";
import { useState, useEffect } from "react";

interface SeatMapProps {
  showId: string;
  basePrice: number;
}

export default function SeatMap({ showId, basePrice }: SeatMapProps) {
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const allSeats = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];

  // Replace with your live Render backend URL when deploying to production
  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    if (!showId) return;

    fetch(`${API_URL}/api/seats/${showId}`)
      .then((res) => res.json())
      .then((data) => setBookedSeats(data.booked_seats || []))
      .catch((err) => console.error("Failed to fetch seat status:", err));
  }, [showId]);

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) return;

    try {
      const res = await fetch(`${API_URL}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_id: showId, seats: selectedSeats }),
      });

      if (res.ok) {
        alert("Booking confirmed and QR code generated!");
        setBookedSeats((prev) => [...prev, ...selectedSeats]);
        setSelectedSeats([]);
      } else {
        const errorData = await res.json();
        alert("Booking failed: " + errorData.detail);
      }
    } catch (err) {
      console.error("Network error during booking:", err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="grid grid-cols-3 gap-3 max-w-xs w-full">
        {allSeats.map((seat) => {
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);
          return (
            <button
              key={seat}
              disabled={isBooked}
              onClick={() => toggleSeat(seat)}
              className={`p-4 rounded-lg font-semibold transition-all ${
                isBooked
                  ? "bg-zinc-900 text-zinc-600 opacity-40 cursor-not-allowed border border-zinc-800"
                  : isSelected
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
              }`}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <div className="text-sm text-zinc-400">
        Total Price: <span className="text-white font-bold">₹{selectedSeats.length * basePrice}</span>
      </div>

      <button
        onClick={handleConfirmBooking}
        disabled={selectedSeats.length === 0}
        className={`px-6 py-3 rounded-xl font-medium transition-colors ${
          selectedSeats.length === 0
            ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        Confirm Booking ({selectedSeats.length} Selected)
      </button>
    </div>
  );
}