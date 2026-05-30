import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";

export async function POST(request: Request) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await request.json();
  const existing = await queryOne("SELECT id FROM about_info LIMIT 1");
  if (existing) {
    await query(
      "UPDATE about_info SET full_name=?, title=?, organization=?, bio=?, skills=?, social_links=?, profile_image=? WHERE id=?",
      [b.full_name, b.title, b.organization, b.bio || null,
       JSON.stringify(b.skills || []), JSON.stringify(b.social_links || {}),
       b.profile_image || null, existing.id]
    );
  } else {
    await query(
      "INSERT INTO about_info (full_name, title, organization, bio, skills, social_links, profile_image) VALUES (?,?,?,?,?,?,?)",
      [b.full_name, b.title, b.organization, b.bio || null,
       JSON.stringify(b.skills || []), JSON.stringify(b.social_links || {}),
       b.profile_image || null]
    );
  }
  return NextResponse.json({ ok: true });
}
