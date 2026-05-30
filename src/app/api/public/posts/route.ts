import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, type, excerpt, tags, published_at, view_count")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(50);
  return NextResponse.json({ posts: data || [] });
}
