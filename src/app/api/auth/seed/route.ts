import { NextResponse } from "next/server";
import { seedAdmin } from "@/lib/auth";

// Bu route sadece ilk kurulumda çağrılır, sonra silinebilir
export async function GET() {
  const email = process.env.ADMIN_EMAIL || "adem@ademsener.org";
  const password = process.env.ADMIN_PASSWORD || "changeme";
  await seedAdmin(email, password);
  return NextResponse.json({ ok: true, message: `Admin oluşturuldu: ${email}` });
}
