"use client";

import { useState } from "react";
import Image from "next/image";
import { PACKAGES, savingsPercent, RobuxPackage } from "@/lib/packages";

function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: RobuxPackage;
  selected: boolean;
  onSelect: () => void;
}) {
  const savings = savingsPercent(pkg);

  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left rounded-2xl border p-5 transition-all duration-200 group focus:outline-none ${
        selected
          ? "border-[#0042B7] bg-[#0042B7]/10 shadow-[0_0_0_1px_#0042B7]"
          : "border-[#1E2330] bg-[#151820] hover:border-[#0042B7]/50 hover:bg-[#151820]"
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0042B7] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
          Most Popular
        </span>
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[#8B8FA8] text-xs font-medium uppercase tracking-widest mb-1">
            {pkg.label}
          </p>
          <p className="text-white text-2xl font-extrabold tracking-tight">
            {pkg.robux.toLocaleString()}
            <span className="text-[#FFC840] text-sm font-bold ml-1.5">R$</span>
          </p>
        </div>
        <span className="bg-emerald-500/15 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
          Save {savings}%
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-white text-xl font-bold">
            ${(pkg.price / 100).toFixed(2)}
          </p>
          <p className="text-[#8B8FA8] text-xs line-through">
            ${(pkg.officialPrice / 100).toFixed(2)} official
          </p>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
            selected
              ? "border-[#0042B7] bg-[#0042B7]"
              : "border-[#1E2330] group-hover:border-[#0042B7]/50"
          }`}
        >
          {selected && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>(
    PACKAGES.find((p) => p.popular)?.id || PACKAGES[2].id
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = PACKAGES.find((p) => p.id === selectedId)!;

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selectedId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0D0F14] text-white">
      {/* Header */}
      <header className="border-b border-[#1E2330] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="ArkSuppliers logo"
                width={36}
                height={36}
                className="object-cover scale-[2.2] translate-x-[4px]"
                priority
              />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">
              Ark<span className="text-[#0042B7]">Suppliers</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Instant Delivery with 0% Fees</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#0042B7]/10 border border-[#0042B7]/20 rounded-full px-4 py-1.5 text-[#4D80D4] text-xs font-semibold uppercase tracking-widest mb-6">
            Trusted Robux Supplier
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-[1.05]">
            Buy Cheap{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0042B7] to-[#4D80D4]">
              Robux With No Roblox Fee.
            </span>
          </h1>
          <p className="text-[#8B8FA8] text-lg max-w-md mx-auto">
            Buy Robux below the official price. 0% Robux tax — get 100% of the Robux you paid for.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Package grid */}
          <div>
            <p className="text-[#8B8FA8] text-xs uppercase tracking-widest font-medium mb-4">
              Select a package
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {PACKAGES.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  selected={selectedId === pkg.id}
                  onSelect={() => setSelectedId(pkg.id)}
                />
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="md:sticky md:top-8">
            <div className="bg-[#151820] border border-[#1E2330] rounded-2xl p-6">
              <p className="text-[#8B8FA8] text-xs uppercase tracking-widest font-medium mb-5">
                Order Summary
              </p>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-[#8B8FA8] text-sm">Package</span>
                  <span className="text-white text-sm font-medium">{selected.label}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B8FA8] text-sm">Robux</span>
                  <span className="text-[#FFC840] font-bold">
                    {selected.robux.toLocaleString()} R$
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B8FA8] text-sm">Official price</span>
                  <span className="text-[#8B8FA8] text-sm line-through">
                    ${(selected.officialPrice / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B8FA8] text-sm">You save</span>
                  <span className="text-emerald-400 text-sm font-semibold">
                    ${((selected.officialPrice - selected.price) / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#1E2330] pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-white text-2xl font-black">
                    ${(selected.price / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#0042B7] hover:bg-[#0038A0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Redirecting...
                  </>
                ) : (
                  <>
                    Buy Now — ${(selected.price / 100).toFixed(2)}
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-4">
                <svg className="w-3.5 h-3.5 text-[#8B8FA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[#8B8FA8] text-xs">Secured by Stripe</span>
              </div>
            </div>

            {/* How it works */}
            <div className="mt-4 bg-[#151820] border border-[#1E2330] rounded-2xl p-5">
              <p className="text-[#8B8FA8] text-xs uppercase tracking-widest font-medium mb-4">
                How it works
              </p>
              <div className="space-y-3">
                {[
                  { n: "1", text: "Pick a package and pay securely via Stripe." },
                  { n: "2", text: "Check your email — we'll send Roblox delivery instructions." },
                  { n: "3", text: "Add us on Roblox. We send your Robux within 24 hours." },
                ].map((s) => (
                  <div key={s.n} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#0042B7]/20 text-[#4D80D4] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {s.n}
                    </span>
                    <p className="text-[#8B8FA8] text-sm leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1E2330] py-6 mt-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[#3a3d4a] text-xs">
            © {new Date().getFullYear()} ArkSuppliers. Not affiliated with Roblox Corporation.
          </p>
        </div>
      </footer>
    </main>
  );
}
