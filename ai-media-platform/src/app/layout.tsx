import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/AuthProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Draw Odyssey | AI Image & Video Generation Platform",
    template: "%s | Draw Odyssey",
  },
  description:
    "Access 30+ cutting-edge AI models to generate images, create videos, upscale to 4K, train custom LoRA models, and edit everything in one platform. FLUX, Stable Diffusion, Kling, Wan & more.",
  keywords: [
    "AI image generator", "AI video generator", "text to image", "text to video",
    "image to video", "AI upscaler", "LoRA training", "FLUX", "Stable Diffusion",
    "AI art", "video editor", "background remover", "face swap", "style transfer",
  ],
  openGraph: {
    title: "Draw Odyssey — Every AI Creative Tool in One Place",
    description: "Generate images, create videos, train custom models, and edit everything with 30+ AI models.",
    type: "website",
    siteName: "Draw Odyssey",
  },
  twitter: {
    card: "summary_large_image",
    title: "Draw Odyssey — AI Image & Video Generation",
    description: "30+ AI models. One platform. Create stunning images and videos with AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
