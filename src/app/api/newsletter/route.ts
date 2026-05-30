import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "E-posta zorunludur." }, { status: 400 });
    await query(
      "INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)",
      [email]
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Abone olunamadı." }, { status: 500 });
  }
}
