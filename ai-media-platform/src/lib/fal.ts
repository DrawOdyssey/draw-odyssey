import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY! });
export { fal };

export interface AIModel {
  id: string;
  name: string;
  description: string;
  creditCost: number;
  type: "image" | "video" | "upscale" | "edit";
  category: string;
  badge?: "new" | "popular" | "fast" | "hd";
  inputType: "text" | "image" | "text+image";
}

export const IMAGE_MODELS: AIModel[] = [
  { id: "fal-ai/flux-pro/v1.1-ultra", name: "FLUX Pro Ultra", description: "Highest quality FLUX, 4MP resolution", creditCost: 2, type: "image", category: "Flux", badge: "hd", inputType: "text" },
  { id: "fal-ai/flux-pro/v1.1", name: "FLUX Pro 1.1", description: "Professional quality, excellent prompt adherence", creditCost: 2, type: "image", category: "Flux", badge: "popular", inputType: "text" },
  { id: "fal-ai/flux/dev", name: "FLUX Dev", description: "High-quality general purpose generation", creditCost: 1, type: "image", category: "Flux", inputType: "text" },
  { id: "fal-ai/flux/schnell", name: "FLUX Schnell", description: "Ultra-fast, great for iteration", creditCost: 1, type: "image", category: "Flux", badge: "fast", inputType: "text" },
  { id: "fal-ai/flux-realism", name: "FLUX Realism", description: "Photorealistic images with FLUX backbone", creditCost: 1, type: "image", category: "Flux", inputType: "text" },
  { id: "fal-ai/stable-diffusion-v35-large", name: "Stable Diffusion 3.5", description: "Latest SD with excellent detail", creditCost: 1, type: "image", category: "Stable Diffusion", badge: "new", inputType: "text" },
  { id: "fal-ai/stable-diffusion-v35-medium", name: "SD 3.5 Medium", description: "Balanced quality and speed", creditCost: 1, type: "image", category: "Stable Diffusion", inputType: "text" },
  { id: "fal-ai/recraft-v3", name: "Recraft V3", description: "Design-focused, brand-safe outputs", creditCost: 1, type: "image", category: "Other", inputType: "text" },
  { id: "fal-ai/ideogram/v2/turbo", name: "Ideogram 2 Turbo", description: "Excellent text rendering in images", creditCost: 1, type: "image", category: "Other", badge: "fast", inputType: "text" },
  { id: "fal-ai/aura-flow", name: "AuraFlow", description: "Artistic and creative generation", creditCost: 1, type: "image", category: "Other", inputType: "text" },
  { id: "fal-ai/kolors", name: "Kolors", description: "Vibrant color-focused generation", creditCost: 1, type: "image", category: "Other", inputType: "text" },
];

export const VIDEO_MODELS: AIModel[] = [
  { id: "fal-ai/wan/v2.1/1.3b/text-to-video", name: "Wan 2.1", description: "Open-source text-to-video, fast and versatile", creditCost: 10, type: "video", category: "Text to Video", badge: "popular", inputType: "text" },
  { id: "fal-ai/ltx-video/v0.9.1", name: "LTX Video", description: "Fast video at 30fps", creditCost: 8, type: "video", category: "Text to Video", badge: "fast", inputType: "text" },
  { id: "fal-ai/cogvideox-5b", name: "CogVideoX 5B", description: "High-fidelity 6-second clips", creditCost: 10, type: "video", category: "Text to Video", inputType: "text" },
  { id: "fal-ai/hunyuan-video", name: "HunyuanVideo", description: "Cinematic motion and coherence", creditCost: 12, type: "video", category: "Text to Video", inputType: "text" },
  { id: "fal-ai/kling-video/v2/master/image-to-video", name: "Kling v2 Master", description: "Premium image-to-video, smooth motion", creditCost: 15, type: "video", category: "Image to Video", badge: "popular", inputType: "image" },
  { id: "fal-ai/minimax-video/image-to-video", name: "Minimax I2V", description: "High quality video from image", creditCost: 12, type: "video", category: "Image to Video", inputType: "image" },
  { id: "fal-ai/wan/v2.1/1.3b/image-to-video", name: "Wan 2.1 I2V", description: "Animate any image into video", creditCost: 10, type: "video", category: "Image to Video", inputType: "image" },
  { id: "fal-ai/stable-video", name: "Stable Video Diffusion", description: "Stability AI image-to-video", creditCost: 10, type: "video", category: "Image to Video", inputType: "image" },
];

export const UPSCALE_MODELS: AIModel[] = [
  { id: "fal-ai/aura-sr", name: "AuraSR 4x", description: "4x upscale, excellent detail preservation", creditCost: 1, type: "upscale", category: "Upscale", badge: "popular", inputType: "image" },
  { id: "fal-ai/creative-upscaler", name: "Creative Upscaler", description: "AI-enhanced upscale that adds realistic detail", creditCost: 2, type: "upscale", category: "Upscale", badge: "hd", inputType: "image" },
  { id: "fal-ai/clarity-upscaler", name: "Clarity Upscaler", description: "High-clarity upscale up to 8x", creditCost: 2, type: "upscale", category: "Upscale", inputType: "image" },
];

export const EDIT_MODELS: AIModel[] = [
  { id: "fal-ai/birefnet", name: "Background Remover", description: "Precision edge detection background removal", creditCost: 1, type: "edit", category: "Background", badge: "popular", inputType: "image" },
  { id: "fal-ai/imageutils/depth", name: "Depth Map", description: "Generate depth maps from images", creditCost: 1, type: "edit", category: "Utility", inputType: "image" },
];

export const ALL_MODELS = [...IMAGE_MODELS, ...VIDEO_MODELS, ...UPSCALE_MODELS, ...EDIT_MODELS];
export function getCategories(models: AIModel[]): string[] {
return Array.from(new Set(models.map((m) => m.category)));
}

// ── STYLE TRANSFER / IMG2IMG MODELS ──
export const IMG2IMG_MODELS: AIModel[] = [
  { id: "fal-ai/flux/dev/image-to-image", name: "FLUX Image-to-Image", description: "Transform images while preserving structure", creditCost: 1, type: "edit", category: "Image to Image", badge: "popular", inputType: "image" },
  { id: "fal-ai/stable-diffusion-v35-large/image-to-image", name: "SD 3.5 Image-to-Image", description: "Restyle images with Stable Diffusion", creditCost: 1, type: "edit", category: "Image to Image", inputType: "image" },
  { id: "fal-ai/ip-adapter-face-id", name: "IP-Adapter FaceID", description: "Generate consistent faces across images", creditCost: 2, type: "edit", category: "Consistent Character", badge: "popular", inputType: "image" },
  { id: "fal-ai/pulid", name: "PuLID Identity", description: "Preserve identity with high fidelity", creditCost: 2, type: "edit", category: "Consistent Character", inputType: "image" },
];

// ── CONTROLNET / POSE MODELS ──
export const CONTROL_MODELS: AIModel[] = [
  { id: "fal-ai/flux-general/image-to-image/controlnet", name: "FLUX ControlNet", description: "Guide generation with depth, edge, or pose maps", creditCost: 2, type: "edit", category: "ControlNet", badge: "popular", inputType: "image" },
  { id: "fal-ai/stable-diffusion-v35-large/controlnet", name: "SD 3.5 ControlNet", description: "Structural control with Stable Diffusion", creditCost: 1, type: "edit", category: "ControlNet", inputType: "image" },
  { id: "fal-ai/imageutils/depth", name: "Depth Estimator", description: "Extract depth map from any image", creditCost: 1, type: "edit", category: "Utility", inputType: "image" },
  { id: "fal-ai/dwpose", name: "Pose Detector", description: "Extract body/hand/face pose from images", creditCost: 1, type: "edit", category: "Utility", badge: "new", inputType: "image" },
];

// ── VIDEO TRANSFORM MODELS ──
export const VIDEO_TRANSFORM_MODELS: AIModel[] = [
  { id: "fal-ai/wan/v2.1/1.3b/image-to-video", name: "Wan 2.1 Transform", description: "Re-style video using a reference image", creditCost: 12, type: "video", category: "Video Transform", badge: "popular", inputType: "text+image" },
  { id: "fal-ai/stable-video/image-to-video", name: "SVD Transform", description: "Stability AI video style transfer", creditCost: 10, type: "video", category: "Video Transform", inputType: "text+image" },
];

export const ALL_MODELS_EXTENDED = [
  ...ALL_MODELS, ...IMG2IMG_MODELS, ...CONTROL_MODELS, ...VIDEO_TRANSFORM_MODELS,
];
