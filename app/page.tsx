"use client";

import { useState } from "react";
import Image from "next/image";
import hypeData from "../public/hype-data.json";

// --- Types ---

interface ScoreBreakdown {
  reddit_buzz: number;
  engagement: number;
  recency: number;
  paid_penalty: number;
}

interface RedditPost {
  title: string;
  score: number;
  num_comments: number;
  created: string;
  subreddit: string;
  url: string;
}

interface Restaurant {
  name: string;
  cuisine: string;
  neighborhood: string;
  hype_score: number;
  score_breakdown: ScoreBreakdown;
  trending_reasons: string[];
  reddit_posts: RedditPost[];
  is_paid_heavy: boolean;
  updated_at: string;
}

// --- Curated Unsplash photos ---

const RESTAURANT_IMAGES: Record<string, string> = {
  "Tartine Bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
  "Zuni Cafe": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
  "State Bird Provisions": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
  "Lazy Bear": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
  "Nopa": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  "Kokkari Estiatorio": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
  "Delfina": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop",
  "Rich Table": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
  "Foreign Cinema": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
  "Marufuku Ramen": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop",
  "San Tung": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop",
  "Yank Sing": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&h=600&fit=crop",
  "The Progress": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop",
  "Souvla": "https://images.unsplash.com/photo-1529543544282-ea99407407c9?w=800&h=600&fit=crop",
  "La Taqueria": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop",
  "Flour + Water": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop",
  "House of Prime Rib": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop",
  "Liholiho Yacht Club": "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&h=600&fit=crop",
  "Benu": "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=800&h=600&fit=crop",
  "Hog Island Oyster": "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=800&h=600&fit=crop",
  "Che Fico": "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&h=600&fit=crop",
  "Mister Jiu's": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop",
  "Lers Ros": "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&h=600&fit=crop",
  "Burma Superstar": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
  "Swan Oyster Depot": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&h=600&fit=crop",
};

// --- Categories ---

const CATEGORIES = [
  { id: "restaurants", name: "Restaurants", icon: "🍔", active: true },
  { id: "products", name: "Products", icon: "📦", active: false },
  { id: "travel", name: "Travel", icon: "✈️", active: false },
  { id: "services", name: "Services", icon: "🔧", active: false },
  { id: "apps", name: "Apps", icon: "📱", active: false },
  { id: "software", name: "Software", icon: "💻", active: false },
];

// --- Helpers ---

function getTier(score: number): { label: string; color: string; badge: string } {
  if (score >= 95) return { label: "Exceptional", color: "text-gold", badge: "💚 HALL OF FAME" };
  if (score >= 85) return { label: "Outstanding", color: "text-gold", badge: "💚 HALL OF FAME" };
  if (score >= 70) return { label: "Notable", color: "text-secondary", badge: "" };
  if (score >= 50) return { label: "Mixed", color: "text-secondary", badge: "" };
  return { label: "Promoted", color: "text-red-500", badge: "🧾 WALL OF SHAME" };
}

function getRedditMentions(reasons: string[]): number {
  for (const r of reasons) {
    const match = r.match(/(\d+)\s+(?:recent\s+)?mentions/);
    if (match) return parseInt(match[1]);
  }
  return 0;
}

// --- Components ---

function RestaurantCard({
  restaurant,
  rank,
}: {
  restaurant: Restaurant;
  rank: number;
}) {
  const [showPosts, setShowPosts] = useState(false);
  const tier = getTier(restaurant.hype_score);
  const imageUrl = RESTAURANT_IMAGES[restaurant.name];
  const mentions = getRedditMentions(restaurant.trending_reasons);
  const isHallOfFame = restaurant.hype_score >= 85;
  const isWallOfShame = restaurant.is_paid_heavy || restaurant.hype_score < 50;

  return (
    <div className={`rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 border-2 ${
      isHallOfFame ? "border-emerald-200" : isWallOfShame ? "border-red-200" : "border-gray-100"
    }`}>
      {/* Hero Image */}
      <div className="relative aspect-[4/3] overflow-hidden group">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#3A3A3A] flex items-center justify-center">
            <span className="text-5xl font-serif text-white/30">{restaurant.name[0]}</span>
          </div>
        )}
        {/* Rank badge top-left */}
        <div className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
          rank <= 3 ? "bg-gold text-white" : "bg-white/90 backdrop-blur-sm text-foreground"
        }`}>
          {rank}
        </div>
        {/* Score badge top-right */}
        <div className={`absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
          isHallOfFame ? "bg-emerald-500" : isWallOfShame ? "bg-red-500" : "bg-gold"
        }`}>
          {Math.round(restaurant.hype_score)}
        </div>
        {/* Status badge */}
        {tier.badge && (
          <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full backdrop-blur-sm text-white text-xs font-semibold ${
            isHallOfFame ? "bg-emerald-500/90" : "bg-red-500/90"
          }`}>
            {tier.badge}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-xs font-semibold uppercase tracking-wider ${tier.color}`}>
            {tier.label}
          </span>
          <span className="text-xs text-secondary">·</span>
          <span className="text-xs text-secondary">{restaurant.cuisine}</span>
        </div>

        <h3 className="font-serif text-xl font-bold text-foreground leading-tight mb-1">
          {restaurant.name}
        </h3>
        <p className="text-sm text-secondary mb-3">{restaurant.neighborhood}</p>

        {mentions > 0 && (
          <p className="text-xs text-secondary mb-3">
            {mentions} organic Reddit mentions
          </p>
        )}

        {/* Reddit posts toggle */}
        {restaurant.reddit_posts.length > 0 && (
          <div>
            <button
              onClick={() => setShowPosts(!showPosts)}
              className="text-xs font-semibold text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
            >
              Show Receipts ({restaurant.reddit_posts.length})
              <svg
                className={`w-3 h-3 transition-transform ${showPosts ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showPosts && (
              <div className="mt-3 space-y-2">
                {restaurant.reddit_posts.map((post, i) => (
                  <a
                    key={i}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-lg bg-[#FAFAF5] hover:bg-[#F0F0E8] transition-colors"
                  >
                    <p className="text-sm text-foreground leading-snug">{post.title}</p>
                    <p className="text-xs text-secondary mt-1">
                      r/{post.subreddit} · {post.score} pts · {post.num_comments} comments
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Page ---

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("restaurants");
  const [activeTab, setActiveTab] = useState<"all" | "fame" | "shame">("all");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [email, setEmail] = useState("");

  const restaurants: Restaurant[] = [...hypeData.restaurants].sort((a, b) => {
    if (b.hype_score !== a.hype_score) return b.hype_score - a.hype_score;
    return b.score_breakdown.reddit_buzz - a.score_breakdown.reddit_buzz;
  });

  const neighborhoods = [
    "All",
    ...Array.from(new Set(restaurants.map((r) => r.neighborhood))).sort(),
  ];

  const hallOfFame = restaurants.filter((r) => r.hype_score >= 85);
  const wallOfShame = restaurants.filter((r) => r.is_paid_heavy || r.hype_score < 50);

  const getFilteredList = () => {
    let list = restaurants;
    if (activeTab === "fame") list = hallOfFame;
    if (activeTab === "shame") list = wallOfShame;
    if (activeFilter !== "All") {
      list = list.filter((r) => r.neighborhood === activeFilter);
    }
    return list;
  };

  const filtered = getFilteredList();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-gold" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
                <path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xl font-bold tracking-tight">Clarity</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Live · San Francisco
            </div>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 max-w-3xl">
            The trust layer for the internet.
          </h1>
          <p className="text-lg text-white/60 max-w-xl mb-8">
            See who's <span className="text-emerald-400 font-semibold">real</span> and who's <span className="text-red-400 font-semibold">paying for it</span> — across everything you buy.
          </p>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => cat.active && setActiveCategory(cat.id)}
                disabled={!cat.active}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-gold text-white"
                    : cat.active
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {!cat.active && <span className="text-xs opacity-50">Soon</span>}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {[
              { id: "all", label: `🏆 All Rankings (${restaurants.length})` },
              { id: "fame", label: `💚 Hall of Fame (${hallOfFame.length})` },
              { id: "shame", label: `🧾 Wall of Shame (${wallOfShame.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? tab.id === "fame"
                      ? "border-emerald-500 text-emerald-600"
                      : tab.id === "shame"
                      ? "border-red-500 text-red-600"
                      : "border-gold text-gold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Neighborhood Filter */}
      <div className="bg-background border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {neighborhoods.map((n) => (
              <button
                key={n}
                onClick={() => setActiveFilter(n)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === n
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-white text-secondary hover:text-foreground border border-gray-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Membership Banner */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-white font-semibold">Stop getting played.</p>
              <p className="text-white/50 text-sm">$9/mo for all categories, full receipts, and browser extension.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-sm">Coming Q2 2026</span>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.open(`mailto:jetct.theo@gmail.com?subject=Clarity%20Membership%20Waitlist&body=Add%20me:%20${email}`);
                  alert("You're on the list!");
                  setEmail("");
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="px-4 py-2 rounded-lg text-[#1A1A1A] text-sm w-44 focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-white font-semibold text-sm rounded-lg hover:bg-gold/90 transition-colors"
                >
                  Join Waitlist
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Tab description */}
        {activeTab === "fame" && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-emerald-800 text-sm">
              <span className="font-semibold">💚 Hall of Fame:</span> These restaurants earned their reputation through genuine word-of-mouth. High organic buzz, minimal paid promotion.
            </p>
          </div>
        )}
        {activeTab === "shame" && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">
              <span className="font-semibold">🧾 Wall of Shame:</span> Heavy ad spend detected. These places are paying for your attention more than earning it.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filtered.map((restaurant) => {
            const globalRank = restaurants.indexOf(restaurant) + 1;
            return (
              <RestaurantCard
                key={restaurant.name}
                restaurant={restaurant}
                rank={globalRank}
              />
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-secondary text-lg">No restaurants found.</p>
          </div>
        )}
      </main>

      {/* Coming Soon Categories */}
      <section className="bg-[#FAFAF5] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-serif text-2xl font-bold text-center mb-8">Coming Soon: Every Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.filter(c => !c.active).map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl p-4 text-center border border-gray-200">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-foreground">{cat.name}</div>
                <div className="text-xs text-secondary mt-1">Q2-Q3 2026</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-white/40" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
                <path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-semibold text-lg">Clarity</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <a href="/whitepaper.html" className="hover:text-white transition-colors">Methodology</a>
              <a href="/deck.html" className="hover:text-white transition-colors">For Investors</a>
              <a href="mailto:jetct.theo@gmail.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-white/30">
              Scores reflect organic social buzz vs paid promotion. Opinions, not facts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
