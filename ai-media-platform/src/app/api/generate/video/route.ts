import { fal } from "@/lib/fal";
import { createServerClient } from "@/lib/supabase";
import { VIDEO_MODELS } from "@/lib/fal";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt, modelId, userId, imageUrl } = await request.json();

    if (!prompt || !modelId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const model = VIDEO_MODELS.find((m) => m.id === modelId);
    if (!model) {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Check credit balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .single();

    if (!profile || profile.credits_balance < model.creditCost) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Deduct credits
    await supabase
      .from("profiles")
      .update({ credits_balance: profile.credits_balance - model.creditCost })
      .eq("id", userId);

    // Create job
    const { data: job } = await supabase
      .from("generation_jobs")
      .insert({
        user_id: userId,
        type: "video",
        prompt,
        model: modelId,
        status: "processing",
        credits_used: model.creditCost,
      })
      .select()
      .single();

    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -model.creditCost,
      type: "usage",
      description: `Video generation: ${model.name}`,
    });

    try {
      // Build input based on model type
      const input: Record<string, unknown> = { prompt };
      if (imageUrl && modelId.includes("image-to-video")) {
        input.image_url = imageUrl;
      }

      const result = await fal.subscribe(modelId, { input });

      const videoUrl = (result.data as any)?.video?.url;

      if (videoUrl) {
        await supabase
          .from("generation_jobs")
          .update({ status: "completed", result_url: videoUrl })
          .eq("id", job!.id);

        await supabase.from("media_items").insert({
          user_id: userId,
          type: "video",
          url: videoUrl,
          prompt,
          metadata: { model: modelId },
        });

        return NextResponse.json({
          success: true,
          jobId: job!.id,
          videoUrl,
          creditsRemaining: profile.credits_balance - model.creditCost,
        });
      } else {
        throw new Error("No video returned from model");
      }
    } catch (genError) {
      // Refund on failure
      await supabase
        .from("profiles")
        .update({ credits_balance: profile.credits_balance })
        .eq("id", userId);

      await supabase
        .from("generation_jobs")
        .update({ status: "failed" })
        .eq("id", job!.id);

      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: model.creditCost,
        type: "refund",
        description: `Refund: Video generation failed`,
      });

      console.error("Video generation error:", genError);
      return NextResponse.json({ error: "Generation failed. Credits refunded." }, { status: 500 });
    }
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
