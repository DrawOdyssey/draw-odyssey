import { stripe, CREDIT_PACKAGES } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { packageId, userId } = await request.json();

    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
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
              name: `${pkg.name} - ${pkg.credits} Credits`,
              description: `${pkg.credits} credits for Draw Odyssey`,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?purchase=success&credits=${pkg.credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?purchase=cancelled`,
      metadata: {
        userId,
        packageId: pkg.id,
        credits: pkg.credits.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
