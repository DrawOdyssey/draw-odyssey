import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://drawodyssey.com";

  const staticPages = [
    "", "/auth/login", "/auth/signup", "/subscribe", "/gallery", "/news",
    "/seo/ai-image-generator", "/seo/ai-video-generator",
    "/seo/ai-upscaler", "/seo/lora-training",
  ];

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/seo") ? 0.9 : 0.7,
  }));
}
