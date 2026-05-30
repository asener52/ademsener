import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

export async function GET() {
  const about = await queryOne("SELECT * FROM about_info LIMIT 1");
  if (about) {
    about.skills = typeof about.skills === "string" ? JSON.parse(about.skills || "[]") : about.skills;
    about.social_links = typeof about.social_links === "string" ? JSON.parse(about.social_links || "{}") : about.social_links;
  }
  return NextResponse.json({ about });
}
