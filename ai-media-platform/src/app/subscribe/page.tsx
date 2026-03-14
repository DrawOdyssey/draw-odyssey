"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { SUBSCRIPTION_PLANS, CREDIT_PACKS } from "@/lib/stripe";
import { CreditCard, Star, Check, Loader2, Coins, Zap, ShoppingCart } from "lucide-react";

type Tab = "subscriptions" | "credits";

export default function SubscribePage() {
  const [tab, setTab] = useState<Tab>("subscriptions");
  const [billing, setBilling] = useState<"month" | "year">("month");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(planId: string) {
    setLoading(planId);
    try {
      const res = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: planId, userId: "demo-user", type: "subscription" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { console.error(err); }
    finally { setLoading(null); }
  }

  async function handleBuyCredits(packId: string) {
    setLoading(packId);
    try {
      const res = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: packId, userId: "demo-user", type: "credits" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { console.error(err); }
    finally { setLoading(null); }
  }

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p className="text-surface-400 max-w-xl mx-auto">
            Access all AI models, tools, and features. Start free, upgrade anytime. Cancel anytime.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setTab("subscriptions")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "subscriptions" ? "bg-brand-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" /> Subscriptions
          </button>
          <button
            onClick={() => setTab("credits")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "credits" ? "bg-brand-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            <Coins className="w-4 h-4 inline mr-2" /> Credit Packs
          </button>
        </div>

        {tab === "subscriptions" && (
          <>
            {/* Billing toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-surface-800 rounded-lg p-1 flex gap-1">
                <button onClick={() => setBilling("month")} className={`px-4 py-2 rounded-md text-sm transition-all ${billing === "month" ? "bg-surface-700 text-white" : "text-surface-400"}`}>
                  Monthly
                </button>
                <button onClick={() => setBilling("year")} className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-1.5 ${billing === "year" ? "bg-surface-700 text-white" : "text-surface-400"}`}>
                  Annual <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">Save 20%</span>
                </button>
              </div>
            </div>

            {/* Plans */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const displayPrice = plan.price === 0 ? "Free" : billing === "year"
                  ? `$${((plan.price * 12 * 0.8) / 100 / 12).toFixed(0)}`
                  : plan.priceDisplay;

                return (
                  <div key={plan.id} className={`card relative flex flex-col ${plan.popular ? "border-brand-500 shadow-lg shadow-brand-500/10" : ""}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 bg-brand-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
                          <Star className="w-3 h-3" /> Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-white">{displayPrice}</span>
                        {plan.price > 0 && <span className="text-sm text-surface-400">/mo</span>}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Coins className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-sm text-surface-400">
                          {plan.credits} credits{plan.price > 0 ? "/month" : ""}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading !== null}
                      className={`w-full ${plan.popular ? "btn-primary" : plan.id === "pro" ? "btn-accent" : "btn-secondary"} text-sm`}
                    >
                      {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "credits" && (
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-surface-400 text-sm mb-6">
              Need more credits? Buy a one-time credit pack. No subscription required.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {CREDIT_PACKS.map((pack) => (
                <div key={pack.id} className="card flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="text-lg font-semibold text-white">{pack.name}</span>
                    </div>
                    <span className="text-sm text-surface-400">{pack.priceDisplay} &middot; one-time</span>
                  </div>
                  <button onClick={() => handleBuyCredits(pack.id)} disabled={loading !== null} className="btn-primary text-sm">
                    {loading === pack.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingCart className="w-4 h-4" /> Buy</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-surface-500 mt-8">
          All plans include commercial usage rights &middot; Credits roll over for up to 3 months &middot; Cancel anytime
        </p>
      </div>
    </AppShell>
  );
}
