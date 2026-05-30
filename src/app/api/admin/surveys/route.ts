import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await request.json();
  await query(
    "INSERT INTO surveys (title, description, questions, is_active, ends_at) VALUES (?, ?, ?, ?, ?)",
    [b.title, b.description || null, JSON.stringify(b.questions || []), b.is_active ? 1 : 0, b.ends_at || null]
  );
  return NextResponse.json({ ok: true }, { status: 201 });
}
