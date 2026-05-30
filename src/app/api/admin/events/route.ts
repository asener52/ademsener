import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await request.json();
  await query(
    `INSERT INTO events (title, description, location, event_date, end_date, type, status, max_participants, is_online, registration_url, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [b.title, b.description || null, b.location || null, b.event_date || null, b.end_date || null,
     b.type || "event", b.status || "upcoming", b.max_participants || null,
     b.is_online ? 1 : 0, b.registration_url || null, JSON.stringify(b.tags || [])]
  );
  return NextResponse.json({ ok: true }, { status: 201 });
}
