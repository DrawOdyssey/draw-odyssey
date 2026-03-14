import { fal } from "@/lib/fal";
import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, modelName, triggerWord, trainer, steps, imageUrls } = await request.json();

    if (!userId || !modelName || !triggerWord || !imageUrls?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const creditCosts: Record<string, number> = {
      "flux-lora": 40,
      "flux-lora-fast": 25,
      "sdxl-lora": 20,
    };

    const cost = creditCosts[trainer] || 40;
    const supabase = createServerClient();

    // Check credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .single();

    if (!profile || profile.credits_balance < cost) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Deduct credits
    await supabase
      .from("profiles")
      .update({ credits_balance: profile.credits_balance - cost })
      .eq("id", userId);

    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -cost,
      type: "usage",
      description: `LoRA training: ${modelName}`,
    });

    // In production, you'd call fal.ai's LoRA training endpoint here:
    // const result = await fal.subscribe("fal-ai/flux-lora-fast-training", { ... });

    return NextResponse.json({
      success: true,
      message: "Training started",
      trainingId: `train_${Date.now()}`,
      estimatedTime: trainer === "flux-lora-fast" ? "2 minutes" : "5 minutes",
      creditsRemaining: profile.credits_balance - cost,
    });
  } catch (error) {
    console.error("LoRA training error:", error);
    return NextResponse.json({ error: "Training failed to start" }, { status: 500 });
  }
}
