import { NextResponse } from "next/server";
import { signIn, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const ok = await signIn(email, password);
  if (!ok) return NextResponse.json({ error: "Hatalı e-posta veya şifre" }, { status: 401 });
  await createSession(email);
  return NextResponse.json({ ok: true });
}
