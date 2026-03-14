import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Star } from "lucide-react";

// These would be defined statically or generated from a CMS
const SEO_PAGES: Record<string, {
  title: string;
  h1: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
}> = {
  "ai-image-generator": {
    title: "Free AI Image Generator",
    h1: "Create Stunning AI Images from Text",
    description: "Generate professional-quality images from text prompts using FLUX Pro, Stable Diffusion 3.5, and 10+ cutting-edge AI models. Free credits on signup.",
    features: [
      "11 image generation models including FLUX Pro Ultra and Stable Diffusion 3.5",
      "Multiple aspect ratios: square, landscape, portrait",
      "Batch generation up to 4 images at once",
      "HD and 4MP resolution options",
      "Commercial usage rights on all plans",
      "Download in PNG and JPEG formats",
    ],
    cta: "Start Generating Free",
    ctaLink: "/auth/signup",
  },
  "ai-video-generator": {
    title: "AI Video Generator — Text to Video & Image to Video",
    h1: "Create AI Videos in Seconds",
    description: "Transform text prompts or images into stunning video clips using Kling, Wan 2.1, and 8+ video AI models. No video editing skills needed.",
    features: [
      "8 video models: Kling v2, Wan 2.1, Minimax, CogVideoX, HunyuanVideo",
      "Text-to-Video and Image-to-Video workflows",
      "5-15 second video clips per generation",
      "Smooth motion and temporal consistency",
      "Direct download in MP4 format",
      "Built-in video editor for combining clips",
    ],
    cta: "Create Your First Video",
    ctaLink: "/auth/signup",
  },
  "ai-upscaler": {
    title: "AI Image Upscaler — Enhance Images Up to 8x",
    h1: "Upscale Images with AI",
    description: "Enhance and upscale your images up to 8x resolution with AI-powered upscalers. Perfect for print, social media, and professional use.",
    features: [
      "3 upscaling models: AuraSR 4x, Creative Upscaler, Clarity 8x",
      "Preserve fine details during upscaling",
      "AI-enhanced detail generation",
      "Support for JPG and PNG input",
      "Instant processing, no waiting",
      "Only 1-2 credits per upscale",
    ],
    cta: "Upscale an Image Free",
    ctaLink: "/auth/signup",
  },
  "lora-training": {
    title: "LoRA AI Model Training — Create Custom AI Models",
    h1: "Train Your Own AI Model",
    description: "Upload 5-10 images and train a custom LoRA model in minutes. Create consistent characters, unique styles, or product imagery with AI.",
    features: [
      "Flux LoRA, Fast Flux LoRA, and SDXL training methods",
      "Train in as fast as 2 minutes on H100 GPUs",
      "Upload 3-20 training images",
      "Custom trigger words for your model",
      "Use trained models across all generation tools",
      "Perfect for consistent characters and brand assets",
    ],
    cta: "Train Your First Model",
    ctaLink: "/auth/signup",
  },
};

export function generateStaticParams() {
  return Object.keys(SEO_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = SEO_PAGES[params.slug];
  if (!page) return { title: "Draw Odyssey" };

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.h1,
      description: page.description,
    },
  };
}

export default function SEOPage({ params }: { params: { slug: string } }) {
  const page = SEO_PAGES[params.slug];

  if (!page) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <p className="text-surface-400">Page not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Draw Odyssey</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-surface-300 hover:text-white">Sign In</Link>
            <Link href="/auth/signup" className="btn-primary text-sm !py-2 !px-4">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{page.h1}</h1>
          <p className="text-xl text-surface-400 max-w-2xl mx-auto mb-10">{page.description}</p>
          <Link href={page.ctaLink} className="btn-primary text-base !px-8 !py-3.5 group">
            {page.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">What you get</h2>
          <div className="space-y-4">
            {page.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-surface-900/50 border border-surface-800 rounded-xl">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-surface-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 px-6 bg-surface-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Start creating today</h2>
          <p className="text-surface-400 mb-3">50 free credits on signup. No credit card required.</p>
          <div className="flex items-center justify-center gap-4 text-sm text-surface-500 mb-8">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> 4.8/5 rating</span>
            <span>&#x2022;</span>
            <span>Trusted by 10,000+ creators</span>
            <span>&#x2022;</span>
            <span>Cancel anytime</span>
          </div>
          <Link href={page.ctaLink} className="btn-primary text-base !px-10 !py-3.5">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-surface-500">
          &copy; {new Date().getFullYear()} Draw Odyssey. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
