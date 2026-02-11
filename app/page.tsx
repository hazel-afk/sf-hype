"use client";

import { useState } from "react";

// --- Official Seal Component ---

function OfficialSeal({ classLevel, size = "md" }: { classLevel: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: { outer: "w-11 h-11", inner: "w-7 h-7", roman: "text-xs" },
    md: { outer: "w-14 h-14", inner: "w-9 h-9", roman: "text-sm" },
    lg: { outer: "w-20 h-20", inner: "w-13 h-13", roman: "text-xl" },
    xl: { outer: "w-32 h-32", inner: "w-20 h-20", roman: "text-3xl" },
  };
  const s = sizes[size];

  return (
    <div className={`${s.outer} rounded-full border-[3px] border-[#1a472a] flex items-center justify-center bg-white shadow-lg`}>
      <div className={`${s.inner} rounded-full bg-[#1a472a] flex items-center justify-center`}>
        <span className={`font-serif font-bold text-white ${s.roman}`}>{classLevel}</span>
      </div>
    </div>
  );
}

// --- Category Card ---

function CategoryCard({
  icon,
  title,
  status,
  description,
  stats
}: {
  icon: React.ReactNode;
  title: string;
  status: "live" | "coming" | "future";
  description: string;
  stats?: string;
}) {
  const statusStyles = {
    live: { bg: "bg-[#1a472a]", text: "text-white", label: "Live" },
    coming: { bg: "bg-amber-500", text: "text-white", label: "2026" },
    future: { bg: "bg-neutral-300", text: "text-neutral-600", label: "2027" },
  };
  const s = statusStyles[status];

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:border-neutral-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-[#1a472a]/10 flex items-center justify-center text-[#1a472a]">
          {icon}
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}>
          {s.label}
        </span>
      </div>
      <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 mb-3">{description}</p>
      {stats && <p className="text-xs text-[#1a472a] font-medium">{stats}</p>}
    </div>
  );
}

// --- Main Page ---

export default function Home() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
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
                <div className="text-[11px] text-neutral-500">The Standard for Earned Reputation</div>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-5 text-sm text-neutral-600">
              <a href="#categories" className="hover:text-neutral-900">Categories</a>
              <a href="/build.html" className="hover:text-neutral-900">The Movement</a>
              <a href="/deck.html" className="hover:text-neutral-900">For Investors</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1a472a]/20 bg-[#1a472a]/5 text-[#1a472a] text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-[#1a472a] rounded-full animate-pulse"></span>
                The Great Reallocation
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight mb-6 leading-[1.1]">
                The metric that makes advertising obsolete
              </h1>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-lg">
                $650 billion is spent yearly on advertising. OPC gives consumers a way to find
                what's genuinely good—redirecting capital from promotion to product.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/deck.html" className="px-5 py-2.5 bg-[#1a472a] text-white text-sm font-medium rounded-lg hover:bg-[#1a472a]/90 transition-colors">
                  Read the Vision
                </a>
                <a href="/build.html" className="px-5 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors">
                  See the Roadmap
                </a>
              </div>
            </div>

            {/* Visual */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-[4px] border-[#1a472a] flex items-center justify-center bg-white shadow-xl">
                  <div className="w-32 h-32 rounded-full bg-[#1a472a] flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-white border border-neutral-200 rounded-full shadow-sm">
                  <span className="text-xs font-semibold text-[#1a472a]">Class I</span>
                </div>
                <div className="absolute -bottom-2 -left-2 px-3 py-1 bg-white border border-neutral-200 rounded-full shadow-sm">
                  <span className="text-xs font-medium text-neutral-600">Verified Organic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">The problem with everything you buy</h2>
              <p className="text-neutral-400 leading-relaxed">
                Every recommendation platform—Yelp, Google, Amazon—makes money selling ads to the
                businesses they rank. Consumers can no longer tell what's genuinely popular from
                what's heavily promoted.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#4ade80]">$650B</div>
                <div className="text-sm text-neutral-400 mt-1">Spent on ads yearly</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#4ade80]">82%</div>
                <div className="text-sm text-neutral-400 mt-1">Don't trust reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#fafaf8] border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">How OPC Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We analyze publicly observable signals to measure the ratio of organic to paid visibility.
              High organic score = earned reputation.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { class: "I", range: "90-100%", desc: "Exceptional organic reputation. Minimal advertising footprint." },
              { class: "II", range: "75-89%", desc: "Strong organic presence. Limited promotional spend." },
              { class: "III", range: "60-74%", desc: "Verified organic presence. Balanced visibility." },
            ].map((c) => (
              <div key={c.class} className="bg-white border border-neutral-200 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <OfficialSeal classLevel={c.class} size="lg" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg mb-1">Class {c.class}</h3>
                <div className="text-sm text-[#1a472a] font-semibold mb-2">{c.range}</div>
                <p className="text-sm text-neutral-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">Everything You Buy</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              OPC certification is expanding across every consumer category. Know what's real before you spend.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CategoryCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-4.5l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 12m18-4.5l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 7.5" />
                </svg>
              }
              title="Restaurants"
              status="live"
              description="Bay Area restaurants rated by organic buzz vs paid promotion."
              stats="25 certified"
            />
            <CategoryCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              }
              title="Consumer Goods"
              status="coming"
              description="Skincare, supplements, home goods. The P&G test."
              stats="Taking on $80B CPG"
            />
            <CategoryCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              }
              title="Software & Apps"
              status="coming"
              description="SaaS, mobile apps, digital tools. Real user satisfaction."
              stats="Browser extension"
            />
            <CategoryCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              }
              title="Services"
              status="future"
              description="Healthcare, finance, home services. Trust where it matters."
              stats="$200B market"
            />
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="bg-[#1a472a] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">The Great Reallocation</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              When consumers can identify organic popularity at scale, advertising becomes optional.
              Companies redirect billions from promotion to product, wages, and R&D.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-lg p-5">
                <div className="text-2xl font-bold text-[#4ade80]">$650B</div>
                <div className="text-sm text-white/60 mt-1">Current ad spend</div>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="bg-white/10 rounded-lg p-5">
                <div className="text-2xl font-bold text-[#4ade80]">Better products</div>
                <div className="text-sm text-white/60 mt-1">Higher wages, more R&D</div>
              </div>
            </div>
            <a href="/deck.html" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a472a] font-semibold rounded-lg hover:bg-white/90 transition-colors">
              See How We Get There
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Apple Example */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-medium text-[#1a472a] mb-2">The proof it works</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
                Apple spends 0.7% on advertising.<br />
                Samsung spends 7.4%.
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                Apple proves you don't need massive ad budgets when you build products people
                genuinely want. OPC makes this path visible and viable for every company.
              </p>
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-[#1a472a]/5 rounded-lg border border-[#1a472a]/10">
                  <div className="text-2xl font-bold text-[#1a472a]">0.7%</div>
                  <div className="text-sm text-neutral-600">Apple ad spend</div>
                </div>
                <div className="flex-1 p-4 bg-neutral-100 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-400">7.4%</div>
                  <div className="text-sm text-neutral-500">Samsung ad spend</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-40 bg-gradient-to-br from-[#1a472a] to-[#2d5a3d] rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white/90 font-medium text-lg">Earns Attention</span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-64 h-40 bg-neutral-200 rounded-2xl flex items-center justify-center -z-10">
                  <span className="text-neutral-400 font-medium text-lg">Buys Attention</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">Join the movement</h2>
            <p className="text-neutral-600 mb-8">
              Be the first to know when OPC expands to new categories.
              Help us redirect capital from advertising to product.
            </p>
            <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20 focus:border-[#1a472a]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1a472a] text-white text-sm font-medium rounded-lg hover:bg-[#1a472a]/90 transition-colors"
              >
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-neutral-600 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-neutral-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <span className="font-semibold">Organic Popularity Certification</span>
              </div>
              <p className="text-sm text-neutral-400 max-w-sm">
                The standard for earned reputation. Like USDA Organic, but for trust.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm">Learn More</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="/deck.html" className="hover:text-white">Investor Deck</a></li>
                <li><a href="/build.html" className="hover:text-white">The Movement</a></li>
                <li><a href="/whitepaper.html" className="hover:text-white">Methodology</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="mailto:jetct.theo@gmail.com" className="hover:text-white">jetct.theo@gmail.com</a></li>
                <li><span className="text-neutral-500">San Francisco, CA</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              © 2026 Organic Popularity Certification. All rights reserved.
            </p>
            <p className="text-xs text-neutral-600">
              OPC ratings are assessments based on publicly observable data. Certification cannot be purchased.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
