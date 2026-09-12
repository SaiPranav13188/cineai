"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const showId = searchParams.get("showId") || "5001";
  const seats = searchParams.get("seats") || "A1";
  const total = searchParams.get("total") || "250";

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold">Checkout & Payment</h1>
        <Link href="/movies" className="text-sm text-purple-400 hover:underline">
          Cancel
        </Link>
      </div>

      {paymentSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center font-medium">
          🎉 Payment Successful! Redirecting to your Dashboard...
        </div>
      )}

      {/* Booking Summary Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold border-b border-zinc-800 pb-2">Order Summary</h2>
        
        <div className="flex justify-between text-sm text-zinc-400">
          <span>Show ID</span>
          <span className="text-zinc-200 font-mono">{showId}</span>
        </div>

        <div className="flex justify-between text-sm text-zinc-400">
          <span>Selected Seats</span>
          <span className="text-purple-400 font-bold">{seats}</span>
        </div>

        <div className="flex justify-between text-base font-bold text-zinc-100 border-t border-zinc-800 pt-3">
          <span>Total Amount</span>
          <span className="text-purple-400">₹{total}</span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Select Payment Method</h2>
        
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 bg-zinc-950 border border-purple-500/50 rounded-xl cursor-pointer">
            <input type="radio" name="payment" defaultChecked className="accent-purple-600" />
            <span className="text-sm font-medium">UPI / GPay / PhonePe</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl cursor-pointer">
            <input type="radio" name="payment" className="accent-purple-600" />
            <span className="text-sm font-medium">Credit / Debit Card</span>
          </label>
        </div>

        <button
          onClick={handlePay}
          disabled={isProcessing || paymentSuccess}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-600/25"
        >
          {isProcessing ? "Processing Payment..." : paymentSuccess ? "Paid!" : `Pay ₹${total}`}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">
      <Suspense fallback={<div className="text-center py-12 text-zinc-400">Loading Checkout...</div>}>
        <CheckoutForm />
      </Suspense>
    </main>
  );
}