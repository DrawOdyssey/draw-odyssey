import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || "0");

    if (userId && credits > 0) {
      const supabase = createServerClient();

      // Add credits to user balance
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits_balance")
        .eq("id", userId)
        .single();

      const currentBalance = profile?.credits_balance ?? 0;

      await supabase
        .from("profiles")
        .update({ credits_balance: currentBalance + credits })
        .eq("id", userId);

      // Log the transaction
      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: credits,
        type: "purchase",
        description: `Purchased ${credits} credits`,
        stripe_session_id: session.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
