import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await request.json();
  const slug = b.slug || b.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  await query(
    `INSERT INTO posts (title, slug, excerpt, content, cover_image, type, tags, published, featured, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [b.title, slug, b.excerpt || null, b.content || null, b.cover_image || null,
     b.type || "article", JSON.stringify(b.tags || []),
     b.published ? 1 : 0, b.featured ? 1 : 0,
     b.published ? new Date() : null]
  );
  return NextResponse.json({ ok: true }, { status: 201 });
}
