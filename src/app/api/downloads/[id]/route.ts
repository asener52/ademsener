import { NextResponse } from "next/server";
import { queryOne, query } from "@/lib/db";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dl = await queryOne<any>("SELECT * FROM downloads WHERE id = ?", [id]);
  if (!dl) return new NextResponse("Bulunamadı", { status: 404 });

  const filePath = path.join(process.cwd(), "downloads", dl.filename);
  let buffer: Buffer;
  try {
    buffer = await readFile(filePath);
  } catch {
    return new NextResponse("Dosya bulunamadı", { status: 404 });
  }

  await query("UPDATE downloads SET download_count = download_count + 1 WHERE id = ?", [id]);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": dl.file_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(dl.original_name)}"`,
      "Content-Length": String(buffer.length),
    },
  });
}
