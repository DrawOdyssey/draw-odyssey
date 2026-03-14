import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createServerClient();

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        credits_balance: profile?.credits_balance ?? 0,
        plan: subscription?.plan ?? "free",
        created_at: user.created_at,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
