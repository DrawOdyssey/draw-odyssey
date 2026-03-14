import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET - Fetch public gallery items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "trending";
    const type = searchParams.get("type"); // "image" | "video" | null
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const supabase = createServerClient();

    let query = supabase
      .from("media_items")
      .select(`*, profiles(email)`, { count: "exact" })
      .not("prompt", "is", null)
      .range((page - 1) * limit, page * limit - 1);

    if (type) query = query.eq("type", type);
    if (search) query = query.ilike("prompt", `%${search}%`);

    // Sort
    if (sort === "latest") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false }); // Replace with likes/views in production
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      items: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// POST - Share an item to gallery (make it public)
export async function POST(request: Request) {
  try {
    const { mediaItemId, userId } = await request.json();

    const supabase = createServerClient();

    // Add a "shared" flag or insert into a gallery table
    // For MVP, we just verify ownership
    const { data, error } = await supabase
      .from("media_items")
      .update({ metadata: { shared: true } })
      .eq("id", mediaItemId)
      .eq("user_id", userId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to share" }, { status: 500 });
  }
}
