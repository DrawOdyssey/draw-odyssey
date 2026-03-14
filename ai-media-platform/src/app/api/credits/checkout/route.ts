import { stripe, CREDIT_PACKS, SUBSCRIPTION_PLANS } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { packageId, userId, type } = await request.json();

    // Check credit packs first, then subscription plans
    const creditPack = CREDIT_PACKS.find((p) => p.id === packageId);
    const subPlan = SUBSCRIPTION_PLANS.find((p) => p.id === packageId);

    const pkg = creditPack || subPlan;
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pkg.name}${creditPack ? ` - ${creditPack.credits} Credits` : ""}`,
              description: creditPack
                ? `${creditPack.credits} credits for Draw Odyssey`
                : `${subPlan?.name} subscription`,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?purchase=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?purchase=cancelled`,
      metadata: {
        userId,
        packageId: pkg.id,
        credits: String(creditPack?.credits || subPlan?.credits || 0),
        type: type || "credits",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
