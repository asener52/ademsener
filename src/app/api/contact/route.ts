import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, body: messageBody } = body;
    if (!name || !email || !messageBody) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }
    await query(
      "INSERT INTO messages (name, email, subject, body) VALUES (?, ?, ?, ?)",
      [name, email, subject || "", messageBody]
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
  }
}
