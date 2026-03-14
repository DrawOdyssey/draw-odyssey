import { fal } from "@/lib/fal";
import { createServerClient } from "@/lib/supabase";
import { IMAGE_MODELS } from "@/lib/fal";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt, modelId, userId } = await request.json();

    if (!prompt || !modelId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const model = IMAGE_MODELS.find((m) => m.id === modelId);
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

    // Deduct credits FIRST (atomic with job creation)
    await supabase
      .from("profiles")
      .update({ credits_balance: profile.credits_balance - model.creditCost })
      .eq("id", userId);

    // Create the generation job
    const { data: job } = await supabase
      .from("generation_jobs")
      .insert({
        user_id: userId,
        type: "image",
        prompt,
        model: modelId,
        status: "processing",
        credits_used: model.creditCost,
      })
      .select()
      .single();

    // Log credit usage
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -model.creditCost,
      type: "usage",
      description: `Image generation: ${model.name}`,
    });

    try {
      // Call fal.ai to generate the image
      const result = await fal.subscribe(modelId, {
        input: {
          prompt,
          image_size: "landscape_16_9",
          num_images: 1,
        },
      });

      const imageUrl = (result.data as any)?.images?.[0]?.url;

      if (imageUrl) {
        // Update job status
        await supabase
          .from("generation_jobs")
          .update({ status: "completed", result_url: imageUrl })
          .eq("id", job!.id);

        // Add to media library
        await supabase.from("media_items").insert({
          user_id: userId,
          type: "image",
          url: imageUrl,
          thumbnail_url: imageUrl,
          prompt,
          metadata: { model: modelId },
        });

        return NextResponse.json({
          success: true,
          jobId: job!.id,
          imageUrl,
          creditsRemaining: profile.credits_balance - model.creditCost,
        });
      } else {
        throw new Error("No image returned from model");
      }
    } catch (genError) {
      // Refund credits on failure
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
        description: `Refund: Image generation failed`,
      });

      console.error("Generation error:", genError);
      return NextResponse.json({ error: "Generation failed. Credits refunded." }, { status: 500 });
    }
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
