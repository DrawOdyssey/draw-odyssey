import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const origin = new URL(request.url).origin;

  if (code) {
    const supabase = createServerClient();
    // Exchange the code — in a real implementation you'd use the auth-helpers
    // For now, redirect to dashboard
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
