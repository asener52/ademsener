import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await request.json();
  await query(
    "UPDATE surveys SET title=?, description=?, questions=?, is_active=?, ends_at=? WHERE id=?",
    [b.title, b.description || null, JSON.stringify(b.questions || []), b.is_active ? 1 : 0, b.ends_at || null, id]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await query("DELETE FROM survey_responses WHERE survey_id = ?", [id]);
  await query("DELETE FROM surveys WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
