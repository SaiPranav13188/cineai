import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const eventDatabase: Record<string, {
  title: string;
  rating: string;
  category: string;
  date: string;
  venue: string;
  poster: string;
  about: string;
  performers: string[];
}> = {
  "1": {
    title: "Live Music Concert",
    rating: "4.9",
    category: "Music",
    date: "Oct 15, 2026",
    venue: "Grand Arena",
    poster: "/events/event1.jpg",
    about: "Experience an unmissable night of high-energy music featuring top chart-topping artists.",
    performers: ["Band A", "Soloist B"],
  },
  "2": {
    title: "Rock Festival",
    rating: "4.6",
    category: "Festival",
    date: "Nov 02, 2026",
    venue: "Downtown Park",
    poster: "/events/event2.jpg",
    about: "An all-day outdoors rock extravaganza bringing together iconic underground rock bands.",
    performers: ["The Rockers", "Heavy Echoes"],
  },
  "3": {
    title: "EDM Night",
    rating: "4.8",
    category: "Nightlife",
    date: "Dec 20, 2026",
    venue: "Club Velocity",
    poster: "/events/event3.jpg",
    about: "Immerse yourself in neon light shows and electric synth beats spun live by top DJs.",
    performers: ["DJ Pulse", "Electra"],
  },
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = eventDatabase[id];

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 pb-16">
      <div className="relative h-72 md:h-96 w-full overflow-hidden bg-zinc-900">
        <Image
          src={event.poster}
          alt={event.title}
          fill
          className="object-cover opacity-30 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute top-6 left-6 z-10">
          <Link href="/events" className="text-sm text-purple-400 hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-72 h-44 rounded-2xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-2xl flex-shrink-0">
            <Image
              src={event.poster}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 flex-1 pt-4 md:pt-16">
            <h1 className="text-4xl font-extrabold tracking-tight">{event.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span className="text-amber-400 font-bold">⭐ {event.rating}</span>
              <span>•</span>
              <span className="text-purple-400 font-medium">{event.category}</span>
              <span>•</span>
              <span>📅 {event.date}</span>
            </div>

            <p className="text-zinc-400 text-sm">📍 {event.venue}</p>

            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20">
              Book Event Pass
            </button>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 space-y-3">
          <h2 className="text-2xl font-bold">About the Event</h2>
          <p className="text-zinc-400 max-w-3xl leading-relaxed">{event.about}</p>
        </div>

        <div className="border-t border-zinc-800 pt-8 space-y-4">
          <h2 className="text-2xl font-bold">Lineup / Performers</h2>
          <div className="flex flex-wrap gap-3">
            {event.performers.map((artist, idx) => (
              <div key={idx} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300">
                🎤 {artist}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}