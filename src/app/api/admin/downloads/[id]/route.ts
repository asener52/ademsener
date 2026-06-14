import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { queryOne, execute, query } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const dl = await queryOne<any>("SELECT filename FROM downloads WHERE id = ?", [id]);
  if (!dl) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  try {
    await unlink(path.join(process.cwd(), "downloads", dl.filename));
  } catch { /* dosya zaten yoksa devam et */ }

  await query("DELETE FROM downloads WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
