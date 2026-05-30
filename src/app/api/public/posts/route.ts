import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const posts = await query(
    "SELECT id, title, slug, type, excerpt, tags, published_at, view_count FROM posts WHERE published = 1 ORDER BY published_at DESC LIMIT 50"
  );
  return NextResponse.json({ posts: posts.map(p => ({ ...p, tags: typeof p.tags === "string" ? JSON.parse(p.tags || "[]") : p.tags || [] })) });
}
