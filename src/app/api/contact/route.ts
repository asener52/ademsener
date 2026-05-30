import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, body: messageBody } = body;

    if (!name || !email || !subject || !messageBody) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("messages").insert({
      name,
      email,
      subject,
      body: messageBody,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
  }
}
