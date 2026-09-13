"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "booked";
  price: number;
}

interface SeatMapProps {
  showId: string;
  basePrice?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cineai-backend-1zxp.onrender.com";

export default function SeatMap({ showId, basePrice = 250 }: SeatMapProps) {
  const router = useRouter();

  const [seats, setSeats] = useState<Seat[]>([
    { id: "A1", row: "A", number: 1, status: "available", price: basePrice },
    { id: "A2", row: "A", number: 2, status: "available", price: basePrice },
    { id: "A3", row: "A", number: 3, status: "available", price: basePrice },
    { id: "A4", row: "A", number: 4, status: "available", price: basePrice },
    { id: "A5", row: "A", number: 5, status: "available", price: basePrice },
    { id: "B1", row: "B", number: 1, status: "available", price: basePrice },
    { id: "B2", row: "B", number: 2, status: "available", price: basePrice },
    { id: "B3", row: "B", number: 3, status: "available", price: basePrice },
    { id: "B4", row: "B", number: 4, status: "available", price: basePrice },
    { id: "B5", row: "B", number: 5, status: "available", price: basePrice },
    { id: "C1", row: "C", number: 1, status: "available", price: basePrice + 100 },
    { id: "C2", row: "C", number: 2, status: "available", price: basePrice + 100 },
    { id: "C3", row: "C", number: 3, status: "available", price: basePrice + 100 },
    { id: "C4", row: "C", number: 4, status: "available", price: basePrice + 100 },
    { id: "C5", row: "C", number: 5, status: "available", price: basePrice + 100 },
  ]);

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  // Fetch live booked seats from the backend for this specific movie/show ID
  useEffect(() => {
    async function fetchBookedSeats() {
      if (!showId) return;
      try {
        const response = await fetch(`${API_URL}/api/seats/${showId}`);
        const data = await response.json();
        if (data.booked_seats) {
          setSeats((prevSeats) =>
            prevSeats.map((seat) => ({
              ...seat,
              status: data.booked_seats.includes(seat.id) ? "booked" : "available",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch booked seats:", error);
      }
    }
    fetchBookedSeats();
  }, [showId]);

  const toggleSeatSelection = (seat: Seat) => {
    if (seat.status === "booked") return;
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  const calculateTotal = () => {
    return selectedSeatIds.reduce((total, id) => {
      const seat = seats.find((s) => s.id === id);
      return total + (seat ? seat.price : 0);
    }, 0);
  };

  const handleProceedToPayment = () => {
    const total = calculateTotal();
    const seatsQuery = selectedSeatIds.join(",");
    router.push(`/checkout?showId=${showId}&seats=${seatsQuery}&total=${total}`);
  };

  const rows = Array.from(new Set(seats.map((s) => s.row)));

  return (
    <div className="flex flex-col items-center space-y-8 max-w-2xl mx-auto">
      <div className="w-full text-center space-y-2">
        <div className="w-3/4 h-2 bg-purple-500 rounded-full mx-auto shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
        <p className="text-xs uppercase tracking-widest text-zinc-500">Screen</p>
      </div>

      <div className="space-y-4 py-4">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-3 justify-center">
            <span className="w-4 text-xs font-bold text-zinc-500">{row}</span>
            <div className="flex gap-2">
              {seats
                .filter((s) => s.row === row)
                .map((seat) => {
                  const isSelected = selectedSeatIds.includes(seat.id);
                  const isBooked = seat.status === "booked";

                  let buttonStyles = "bg-emerald-600 hover:bg-emerald-500 text-white";
                  if (isBooked) buttonStyles = "bg-rose-900/50 text-rose-500 cursor-not-allowed border border-rose-800/50";
                  if (isSelected) buttonStyles = "bg-purple-600 text-white shadow-lg shadow-purple-600/40 ring-2 ring-purple-400";

                  return (
                    <button
                      key={seat.id}
                      disabled={isBooked}
                      onClick={() => toggleSeatSelection(seat)}
                      className={`w-10 h-10 rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${buttonStyles}`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800 px-6 py-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-600 rounded" />
          <span>Available (₹{basePrice})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-rose-900/50 border border-rose-800/50 rounded" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded" />
          <span>Selected</span>
        </div>
      </div>

      <div className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-400">Total Price ({selectedSeatIds.length} seats)</p>
          <p className="text-2xl font-bold text-purple-400">₹{calculateTotal()}</p>
        </div>
        <button
          disabled={selectedSeatIds.length === 0}
          onClick={handleProceedToPayment}
          className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold rounded-xl transition-all cursor-pointer"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}