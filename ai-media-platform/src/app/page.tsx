"use client";

import Link from "next/link";
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Layers,
  Zap,
  CreditCard,
  ArrowRight,
  Play,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Draw Odyssey
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-surface-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-surface-400 hover:text-white transition-colors">
              Pricing
            </a>
            <Link href="/auth/login" className="text-sm text-surface-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm !py-2 !px-4">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full mb-8">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-sm text-brand-300 font-medium">
              30+ AI models &middot; New models added weekly
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Create with AI.</span>
            <br />
            <span className="gradient-text">Edit like a pro.</span>
          </h1>

          <p className="text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access FLUX Pro, Stable Diffusion 3.5, Kling, Wan, and 30+ cutting-edge
            AI models. Generate images, create videos, upscale to 4K, and edit
            everything in one platform. Save hundreds vs. separate subscriptions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/signup"
              className="btn-primary text-base !px-8 !py-3.5 group"
            >
              Start Creating Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-secondary text-base !px-8 !py-3.5 group">
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </div>

          {/* Hero visual */}
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-surface-800 bg-surface-900 shadow-2xl shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5" />
              <div className="relative p-1">
                {/* Fake app screenshot */}
                <div className="bg-surface-950 rounded-xl overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-800">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 bg-surface-800 rounded-md text-xs text-surface-400">
                        Draw Odyssey
                      </div>
                    </div>
                  </div>
                  {/* Content area */}
                  <div className="grid grid-cols-4 gap-px bg-surface-800">
                    <div className="col-span-1 bg-surface-950 p-4 min-h-[300px]">
                      <div className="text-xs text-surface-500 mb-3 font-medium uppercase tracking-wider">
                        Media Library
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg bg-gradient-to-br from-surface-800 to-surface-700 animate-pulse"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2 bg-surface-950 p-4 flex items-center justify-center">
                      <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-brand-900/50 to-accent-900/50 border border-surface-700 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 bg-surface-950 p-4">
                      <div className="text-xs text-surface-500 mb-3 font-medium uppercase tracking-wider">
                        Properties
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i}>
                            <div className="h-2 w-16 bg-surface-800 rounded mb-1.5" />
                            <div className="h-8 bg-surface-800 rounded-md" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Timeline */}
                  <div className="bg-surface-900 border-t border-surface-800 p-4">
                    <div className="text-xs text-surface-500 mb-2 font-medium uppercase tracking-wider">
                      Timeline
                    </div>
                    <div className="space-y-2">
                      {["Video", "Audio", "Text"].map((track, i) => (
                        <div key={track} className="flex items-center gap-3">
                          <span className="text-[10px] text-surface-500 w-10">
                            {track}
                          </span>
                          <div className="flex-1 h-8 bg-surface-800 rounded-md relative overflow-hidden">
                            <div
                              className="absolute top-1 bottom-1 rounded bg-brand-600/40 border border-brand-500/30"
                              style={{
                                left: `${i * 10}%`,
                                width: `${40 + i * 5}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to create
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              From AI generation to final export, every tool is built into one
              seamless workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ImageIcon,
                title: "AI Image Generation",
                desc: "Generate stunning images from text prompts using FLUX, Stable Diffusion, and more. Multiple styles and resolutions available.",
                color: "brand",
              },
              {
                icon: Video,
                title: "AI Video Generation",
                desc: "Create short video clips from text or images using Kling, Minimax, and Wan models. 5 to 15 second clips ready for editing.",
                color: "accent",
              },
              {
                icon: Layers,
                title: "Timeline Video Editor",
                desc: "Professional multi-track editor with transitions, text overlays, color grading, and audio mixing. All in your browser.",
                color: "brand",
              },
            ].map((feature) => (
              <div key={feature.title} className="card-hover group">
                <div
                  className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon
                    className={`w-6 h-6 text-${feature.color}-400`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-surface-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-surface-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Describe", desc: "Type a text prompt describing your image or video" },
              { step: "02", title: "Generate", desc: "AI creates your media in seconds using cutting-edge models" },
              { step: "03", title: "Edit", desc: "Drag assets into the timeline editor to arrange your story" },
              { step: "04", title: "Export", desc: "Export your finished video in HD quality" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-surface-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple credit-based pricing
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              Buy credits and use them as you go. No subscriptions required.
              Start with free credits when you sign up.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Starter", credits: 50, price: "$4.99", per: "$0.10", popular: false },
              { name: "Popular", credits: 200, price: "$14.99", per: "$0.075", popular: true },
              { name: "Pro", credits: 500, price: "$29.99", per: "$0.060", popular: false },
              { name: "Studio", credits: 1500, price: "$74.99", per: "$0.050", popular: false },
            ].map((pkg) => (
              <div
                key={pkg.name}
                className={`card relative ${
                  pkg.popular
                    ? "border-brand-500 shadow-lg shadow-brand-500/10"
                    : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-brand-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl font-bold text-white mb-1">
                    {pkg.price}
                  </div>
                  <div className="text-sm text-surface-400 mb-4">
                    {pkg.credits} credits &middot; {pkg.per}/credit
                  </div>
                  <Link
                    href="/auth/signup"
                    className={`w-full ${
                      pkg.popular ? "btn-primary" : "btn-secondary"
                    } text-sm`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-surface-500 text-sm">
              1 credit = 1 standard image &middot; 10 credits = 1 video clip
              &middot; Free credits on signup
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to create something amazing?
          </h2>
          <p className="text-lg text-surface-400 mb-10">
            Sign up today and get free credits to start generating.
          </p>
          <Link
            href="/auth/signup"
            className="btn-primary text-base !px-10 !py-4 group"
          >
            Create Your Free Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-surface-300">
              Draw Odyssey
            </span>
          </div>
          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} Draw Odyssey. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
