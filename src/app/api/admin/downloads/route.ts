import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query, execute } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const downloads = await query("SELECT * FROM downloads ORDER BY created_at DESC");
  return NextResponse.json({ downloads });
}

export async function POST(request: Request) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string || null;

  if (!file) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  if (!title?.trim()) return NextResponse.json({ error: "Başlık zorunludur" }, { status: 400 });

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "Dosya boyutu 50MB'dan büyük olamaz" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "downloads");
  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  await execute(
    "INSERT INTO downloads (title, description, filename, original_name, file_size, file_type) VALUES (?, ?, ?, ?, ?, ?)",
    [title.trim(), description, filename, file.name, file.size, file.type || ext]
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
