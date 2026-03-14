import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

// ── Subscription Plans (like PixelDojo) ──
export const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceDisplay: "Free",
    interval: null,
    credits: 50,
    features: [
      "50 credits to try all tools",
      "Access to standard models",
      "720p image generation",
      "Community gallery access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: 800, // cents
    priceDisplay: "$8",
    interval: "month" as const,
    credits: 300,
    features: [
      "300 credits per month",
      "All image models",
      "Standard video models",
      "HD image generation",
      "Image upscaling tools",
      "Background remover",
      "Credits roll over (3 months)",
      "Commercial usage rights",
    ],
    cta: "Subscribe",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 2000,
    priceDisplay: "$20",
    interval: "month" as const,
    credits: 900,
    features: [
      "900 credits per month",
      "All image + video models",
      "Premium video models (Kling, Minimax)",
      "4MP image generation",
      "Creative upscaler (16x)",
      "Face swap tool",
      "API access",
      "Priority generation queue",
      "Credits roll over (3 months)",
      "Commercial usage rights",
    ],
    cta: "Subscribe",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 2500,
    priceDisplay: "$25",
    interval: "month" as const,
    credits: 1500,
    features: [
      "1,500 credits per month",
      "All models including latest releases",
      "LoRA model training",
      "Full API access",
      "Prompt enhancer tool",
      "Creator Studio access",
      "4K video upscaling",
      "Dedicated support",
      "Credits roll over (3 months)",
      "Full commercial rights",
    ],
    cta: "Go Pro",
    popular: false,
  },
] as const;

// ── Credit Packs (one-time purchases) ──
export const CREDIT_PACKS = [
  { id: "pack-100", name: "100 Credits", credits: 100, price: 500, priceDisplay: "$5.00" },
  { id: "pack-300", name: "300 Credits", credits: 300, price: 1200, priceDisplay: "$12.00" },
  { id: "pack-700", name: "700 Credits", credits: 700, price: 2500, priceDisplay: "$25.00" },
  { id: "pack-1500", name: "1,500 Credits", credits: 1500, price: 4500, priceDisplay: "$45.00" },
] as const;

// ── Credit Costs ──
export const CREDIT_COSTS = {
  // Images
  image_standard: 1,
  image_pro: 2,
  // Videos
  video_standard: 8,
  video_premium: 12,
  video_pro: 15,
  // Tools
  upscale_standard: 1,
  upscale_creative: 2,
  background_remove: 1,
  face_swap: 2,
  // Editor
  export_video: 5,
} as const;
