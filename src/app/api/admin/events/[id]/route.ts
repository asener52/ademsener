import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await request.json();
  await query(
    `UPDATE events SET title=?, description=?, location=?, event_date=?, end_date=?, type=?, status=?,
     max_participants=?, is_online=?, registration_url=?, tags=? WHERE id=?`,
    [b.title, b.description || null, b.location || null, b.event_date || null, b.end_date || null,
     b.type, b.status, b.max_participants || null, b.is_online ? 1 : 0,
     b.registration_url || null, JSON.stringify(b.tags || []), id]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await query("DELETE FROM events WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
