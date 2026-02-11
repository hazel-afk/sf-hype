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

// --- Certification Class ---

function getCertificationClass(score: number): {
  class: string;
  label: string;
  color: string;
  bgColor: string;
} {
  if (score >= 90) return {
    class: "I",
    label: "Class I",
    color: "text-[#1a472a]",
    bgColor: "bg-[#1a472a]"
  };
  if (score >= 75) return {
    class: "II",
    label: "Class II",
    color: "text-[#2d5a3d]",
    bgColor: "bg-[#2d5a3d]"
  };
  if (score >= 60) return {
    class: "III",
    label: "Class III",
    color: "text-[#3d6b4f]",
    bgColor: "bg-[#3d6b4f]"
  };
  return {
    class: "—",
    label: "Not Certified",
    color: "text-neutral-400",
    bgColor: "bg-neutral-300"
  };
}

function getRedditMentions(reasons: string[]): number {
  for (const r of reasons) {
    const match = r.match(/(\d+)\s+(?:recent\s+)?mentions/);
    if (match) return parseInt(match[1]);
  }
  return 0;
}

function generateCertId(name: string): string {
  const hash = name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const num = Math.abs(hash % 90000) + 10000;
  return `OPC-2026-${num}`;
}

// --- Official Seal Component ---

function OfficialSeal({ classLevel, size = "md" }: { classLevel: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { outer: "w-11 h-11", inner: "w-7 h-7", roman: "text-xs" },
    md: { outer: "w-14 h-14", inner: "w-9 h-9", roman: "text-sm" },
    lg: { outer: "w-20 h-20", inner: "w-13 h-13", roman: "text-xl" },
  };
  const s = sizes[size];

  if (classLevel === "—") {
    return (
      <div className={`${s.outer} rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center bg-white`}>
        <span className="text-neutral-400 text-[10px] font-medium">N/C</span>
      </div>
    );
  }

  return (
    <div className={`${s.outer} rounded-full border-[2.5px] border-[#1a472a] flex items-center justify-center bg-white shadow-sm`}>
      <div className={`${s.inner} rounded-full bg-[#1a472a] flex items-center justify-center`}>
        <span className={`font-serif font-bold text-white ${s.roman}`}>{classLevel}</span>
      </div>
    </div>
  );
}

// --- Restaurant Card ---

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const [showPosts, setShowPosts] = useState(false);
  const cert = getCertificationClass(restaurant.hype_score);
  const imageUrl = RESTAURANT_IMAGES[restaurant.name];
  const mentions = getRedditMentions(restaurant.trending_reasons);
  const isCertified = cert.class !== "—";
  const certId = isCertified ? generateCertId(restaurant.name) : null;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-300 hover:shadow-sm transition-all">
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-serif text-neutral-300">{restaurant.name[0]}</span>
          </div>
        )}
        {isCertified && (
          <div className="absolute top-2.5 right-2.5">
            <OfficialSeal classLevel={cert.class} size="sm" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Status line */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            {isCertified ? (
              <>
                <span className={`text-xs font-semibold ${cert.color}`}>{cert.label}</span>
                <span className="text-[10px] text-neutral-400 font-mono">{certId}</span>
              </>
            ) : (
              <span className="text-xs text-neutral-400">Not Certified</span>
            )}
          </div>
          <span className={`text-sm font-bold ${cert.color}`}>{Math.round(restaurant.hype_score)}</span>
        </div>

        <h3 className="font-semibold text-neutral-900 mb-0.5">{restaurant.name}</h3>
        <p className="text-sm text-neutral-500 mb-3">{restaurant.cuisine} · {restaurant.neighborhood}</p>

        {/* Score bar */}
        <div className="h-1 bg-neutral-100 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full ${isCertified ? cert.bgColor : "bg-neutral-300"}`}
            style={{ width: `${restaurant.hype_score}%` }}
          />
        </div>

        {mentions > 0 && (
          <p className="text-xs text-neutral-500 mb-3">{mentions} verified mentions</p>
        )}

        {restaurant.reddit_posts.length > 0 && (
          <div>
            <button
              onClick={() => setShowPosts(!showPosts)}
              className="text-xs font-medium text-[#1a472a] hover:text-[#2d5a3d] flex items-center gap-1"
            >
              Source data ({restaurant.reddit_posts.length})
              <svg className={`w-3 h-3 transition-transform ${showPosts ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showPosts && (
              <div className="mt-2 space-y-1.5">
                {restaurant.reddit_posts.map((post, i) => (
                  <a
                    key={i}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded bg-neutral-50 hover:bg-neutral-100 transition-colors"
                  >
                    <p className="text-sm text-neutral-700 leading-snug">{post.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">
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
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeClass, setActiveClass] = useState<string>("certified");

  const restaurants: Restaurant[] = [...hypeData.restaurants].sort((a, b) => {
    if (b.hype_score !== a.hype_score) return b.hype_score - a.hype_score;
    return b.score_breakdown.reddit_buzz - a.score_breakdown.reddit_buzz;
  });

  const neighborhoods = ["All", ...Array.from(new Set(restaurants.map((r) => r.neighborhood))).sort()];

  const certified = restaurants.filter((r) => r.hype_score >= 60);
  const classI = restaurants.filter((r) => r.hype_score >= 90);
  const classII = restaurants.filter((r) => r.hype_score >= 75 && r.hype_score < 90);
  const classIII = restaurants.filter((r) => r.hype_score >= 60 && r.hype_score < 75);

  const getFilteredList = () => {
    let list = restaurants;
    if (activeClass === "I") list = classI;
    else if (activeClass === "II") list = classII;
    else if (activeClass === "III") list = classIII;
    else if (activeClass === "certified") list = certified;

    if (activeFilter !== "All") {
      list = list.filter((r) => r.neighborhood === activeFilter);
    }
    return list;
  };

  const filtered = getFilteredList();

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-[#1a472a] flex items-center justify-center bg-white">
                <div className="w-6 h-6 rounded-full bg-[#1a472a] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-semibold text-neutral-900 text-sm">Organic Popularity Certification</div>
                <div className="text-[11px] text-neutral-500">Independent Verification Authority</div>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-5 text-sm text-neutral-600">
              <a href="#registry" className="hover:text-neutral-900">Registry</a>
              <a href="/whitepaper.html" className="hover:text-neutral-900">Methodology</a>
              <a href="/deck.html" className="hover:text-neutral-900">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#1a472a]/20 bg-[#1a472a]/5 text-[#1a472a] text-xs font-medium mb-5">
                <span className="w-1.5 h-1.5 bg-[#1a472a] rounded-full"></span>
                Est. 2026 · San Francisco
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-4 leading-tight">
                The Standard for<br />Earned Reputation
              </h1>
              <p className="text-neutral-600 max-w-md mb-6 leading-relaxed">
                OPC verifies businesses that earned their reputation through genuine customer
                satisfaction—not paid advertising. Like USDA Organic, but for trust.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a href="#registry" className="px-4 py-2 bg-[#1a472a] text-white text-sm font-medium rounded hover:bg-[#1a472a]/90 transition-colors">
                  View Registry
                </a>
                <a href="/whitepaper.html" className="px-4 py-2 border border-neutral-300 text-neutral-700 text-sm font-medium rounded hover:bg-neutral-50 transition-colors">
                  Read Methodology
                </a>
              </div>
            </div>

            {/* Seal */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-[3px] border-[#1a472a] flex items-center justify-center bg-white shadow-lg">
                  <div className="w-24 h-24 rounded-full bg-[#1a472a] flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="text-xs font-semibold text-[#1a472a] tracking-wider">OPC CERTIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes */}
      <section className="border-b border-neutral-200 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6 text-center">Classification System</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { class: "I", range: "90-100%", desc: "Exceptional organic reputation" },
              { class: "II", range: "75-89%", desc: "Strong organic presence" },
              { class: "III", range: "60-74%", desc: "Verified organic presence" },
            ].map((c) => (
              <div key={c.class} className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center gap-3">
                <OfficialSeal classLevel={c.class} size="md" />
                <div>
                  <div className="font-semibold text-neutral-900">Class {c.class}</div>
                  <div className="text-xs text-[#1a472a] font-medium">{c.range}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a472a] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{restaurants.length}</div>
              <div className="text-xs text-white/60">Evaluated</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{certified.length}</div>
              <div className="text-xs text-white/60">Certified</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{classI.length}</div>
              <div className="text-xs text-white/60">Class I</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{classII.length + classIII.length}</div>
              <div className="text-xs text-white/60">Class II-III</div>
            </div>
          </div>
        </div>
      </section>

      {/* Registry */}
      <section id="registry">
        <div className="sticky top-0 z-20 bg-white border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-semibold text-neutral-900 text-sm">Certification Registry</h2>
              <div className="flex items-center gap-1.5">
                {[
                  { id: "certified", label: "All Certified" },
                  { id: "I", label: "Class I" },
                  { id: "II", label: "Class II" },
                  { id: "III", label: "Class III" },
                  { id: "all", label: "All" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveClass(tab.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                      activeClass === tab.id
                        ? "bg-[#1a472a] text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#fafaf8] border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {neighborhoods.map((n) => (
                <button
                  key={n}
                  onClick={() => setActiveFilter(n)}
                  className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    activeFilter === n
                      ? "bg-neutral-900 text-white"
                      : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((restaurant) => (
              <RestaurantCard key={restaurant.name} restaurant={restaurant} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-sm">No entries match criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border-2 border-neutral-600 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-neutral-600 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="text-xs">
                <div className="font-medium">Organic Popularity Certification</div>
                <div className="text-neutral-500">Independent Verification Authority</div>
              </div>
            </div>
            <div className="flex items-center gap-5 text-xs text-neutral-500">
              <a href="/whitepaper.html" className="hover:text-white">Methodology</a>
              <a href="/deck.html" className="hover:text-white">About</a>
              <a href="mailto:jetct.theo@gmail.com" className="hover:text-white">Contact</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
            <p className="text-[11px] text-neutral-600">
              OPC ratings are assessments based on publicly observable data. Certification cannot be purchased.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
