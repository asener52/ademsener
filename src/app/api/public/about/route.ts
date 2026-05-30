import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_info").select("*").limit(1).single();
  return NextResponse.json({ about: data || null });
}
