"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const events = [
    {
      id: 1,
      title: "Arijit Singh Live",
      image: "/events/event1.jpg",
      date: "Oct 15, 2026",
      location: "Hyderabad",
      venue: "Gachibowli Stadium",
      category: "Concert",
      price: "₹1,499",
      rating: "4.9",
    },
    {
      id: 2,
      title: "Stand-up Night",
      image: "/events/event2.jpg",
      date: "Nov 02, 2026",
      location: "Hyderabad",
      venue: "Heart Cup Cafe",
      category: "Concert",
      price: "₹799",
      rating: "4.7",
    },
    {
      id: 3,
      title: "Sunburn EDM Festival",
      image: "/events/event3.jpg",
      date: "Dec 20, 2026",
      venue: "Hitex Exhibition Center",
      location: "Hyderabad",
      category: "Concert",
      price: "₹1,999",
      rating: "4.8",
    },
    {
      id: 4,
      title: "IPL Fan Park Live Screen",
      image: "/events/event1.jpg",
      date: "Apr 10, 2026",
      location: "Hyderabad",
      venue: "LB Stadium",
      category: "Concert",
      price: "₹499",
      rating: "4.6",
    },
    {
      id: 5,
      title: "The Great Indian Theatre Play",
      image: "/events/event2.jpg",
      date: "May 18, 2026",
      location: "Hyderabad",
      venue: "Ravindra Bharathi",
      category: "Concert",
      price: "₹350",
      rating: "4.5",
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <Link href="/" className="text-sm text-purple-400 hover:underline">
            ← Back to Home
          </Link>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl">
          <input
            type="text"
            placeholder="🔍 Search concerts, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-zinc-400 font-medium">Filters:</span>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="concert">Concerts</option>
          </select>

          <select className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
            <option value="">City</option>
            <option value="hyderabad">Hyderabad</option>
          </select>

          <select className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
            <option value="">Rating</option>
            <option value="4.5+">⭐ 4.5 & above</option>
          </select>
        </div>

        {/* Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredEvents.map((event) => (
              <Link
                href={`/event/${event.id}`}
                key={event.id}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 block"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-800">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Top left category badge fixed to Concert */}
                  <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 bg-purple-950/90 text-purple-300 border border-purple-700/50 rounded-md backdrop-blur-md">
                    Concert
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-lg text-zinc-100 group-hover:text-purple-400 transition-colors line-clamp-1">
                      {event.title}
                    </h2>
                    <span className="text-amber-400 text-sm font-bold flex items-center gap-1 shrink-0">
                      ⭐ {event.rating}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-400 space-y-1">
                    <p>📍 {event.venue}, {event.location}</p>
                    <p>📅 {event.date}</p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Starting from</span>
                    <span className="text-sm font-bold text-purple-400">{event.price} onwards</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500">
            No events found matching your criteria.
          </div>
        )}

      </div>
    </main>
  );
}