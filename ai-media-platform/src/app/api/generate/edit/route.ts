import { fal } from "@/lib/fal";
import { createServerClient } from "@/lib/supabase";
import { ALL_MODELS_EXTENDED } from "@/lib/fal";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { modelId, imageUrl, styleImageUrl, targetImageUrl, prompt, userId, params } = await request.json();

    if (!modelId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const model = ALL_MODELS_EXTENDED.find((m) => m.id === modelId);
    const creditCost = model?.creditCost || 2;

    const supabase = createServerClient();

    // Check credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .single();

    if (!profile || profile.credits_balance < creditCost) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Deduct credits
    await supabase
      .from("profiles")
      .update({ credits_balance: profile.credits_balance - creditCost })
      .eq("id", userId);

    // Log credit usage
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -creditCost,
      type: "usage",
      description: `Edit: ${model?.name || modelId}`,
    });

    // Create job
    const { data: job } = await supabase
      .from("generation_jobs")
      .insert({
        user_id: userId,
        type: "image",
        prompt: prompt || "edit",
        model: modelId,
        status: "processing",
        credits_used: creditCost,
      })
      .select()
      .single();

    try {
      // Build input based on model type
      const input: Record<string, unknown> = {};

      if (prompt) input.prompt = prompt;
      if (imageUrl) input.image_url = imageUrl;
      if (styleImageUrl) input.style_image_url = styleImageUrl;
      if (targetImageUrl) input.swap_image = targetImageUrl;
      if (params?.strength) input.strength = params.strength;
      if (params?.controlMode) input.control_type = params.controlMode;

      const result = await fal.subscribe(modelId, { input });

      // Extract result URL (different models return in different formats)
      const data = result.data as any;
      const resultUrl = data?.image?.url || data?.images?.[0]?.url || data?.output?.url || data?.url;

      if (resultUrl) {
        await supabase
          .from("generation_jobs")
          .update({ status: "completed", result_url: resultUrl })
          .eq("id", job!.id);

        await supabase.from("media_items").insert({
          user_id: userId,
          type: "image",
          url: resultUrl,
          thumbnail_url: resultUrl,
          prompt: prompt || "Edited image",
          metadata: { model: modelId, editType: model?.category },
        });

        return NextResponse.json({
          success: true,
          jobId: job!.id,
          imageUrl: resultUrl,
          creditsRemaining: profile.credits_balance - creditCost,
        });
      } else {
        throw new Error("No result returned from model");
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
        amount: creditCost,
        type: "refund",
        description: `Refund: Edit failed (${model?.name || modelId})`,
      });

      console.error("Edit generation error:", genError);
      return NextResponse.json({ error: "Edit failed. Credits refunded." }, { status: 500 });
    }
  } catch (error) {
    console.error("Edit API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
