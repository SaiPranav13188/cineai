import SeatMap from "@/components/SeatMap";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    showId: string;
  }>;
  searchParams: Promise<{
    price?: string;
  }>;
}

export default async function BookingPage({ params, searchParams }: PageProps) {
  const { showId } = await params;
  const { price } = await searchParams;

  const basePrice = price ? parseInt(price, 10) : 250;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold">Select Seats</h1>
            <p className="text-xs text-zinc-400">Show ID: {showId}</p>
          </div>
          <Link href="/movies" className="text-sm text-purple-400 hover:underline">
            ← Cancel
          </Link>
        </div>

        {/* Dynamic basePrice passed down */}
        <SeatMap showId={showId} basePrice={basePrice} />

      </div>
    </main>
  );
}