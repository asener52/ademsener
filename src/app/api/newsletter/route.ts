import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "E-posta zorunludur." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });

    if (error && error.code === "23505") {
      return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
    }

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Abone olunamadı." }, { status: 500 });
  }
}
