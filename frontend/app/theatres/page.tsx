import Link from "next/link";

export default function TheatresPage() {
  const theatres = [
    { id: "1", name: "Cinepolis IMAX", location: "Downtown Mall", screens: 2 },
    { id: "2", name: "PVR Superplex", location: "City Center", screens: 2 },
    { id: "3", name: "INAX Cinema", location: "Westside Hub", screens: 1 },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Partner Theatres</h1>
          <Link href="/" className="text-sm text-purple-400 hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {theatres.map((t) => (
            <Link key={t.id} href={`/theatres/${t.id}`}>
              <div className="bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-2xl p-6 space-y-3 transition-all hover:scale-[1.02] cursor-pointer shadow-xl group">
                <h2 className="text-xl font-bold group-hover:text-purple-400 transition-colors">
                  {t.name}
                </h2>
                <p className="text-sm text-zinc-400">📍 {t.location}</p>
                <p className="text-xs font-semibold text-purple-400">
                  {t.screens} Screens Available
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}