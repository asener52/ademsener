import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await request.json();
  await query(
    `UPDATE posts SET title=?, slug=?, excerpt=?, content=?, cover_image=?, type=?, tags=?, published=?, featured=?,
     published_at=COALESCE(published_at, IF(?, NOW(), NULL)) WHERE id=?`,
    [b.title, b.slug, b.excerpt || null, b.content || null, b.cover_image || null,
     b.type, JSON.stringify(b.tags || []), b.published ? 1 : 0, b.featured ? 1 : 0,
     b.published ? 1 : 0, id]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await query("DELETE FROM posts WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { published } = await request.json();
  await query("UPDATE posts SET published=?, published_at=IF(?,NOW(),published_at) WHERE id=?",
    [published ? 1 : 0, published ? 1 : 0, id]);
  return NextResponse.json({ ok: true });
}
