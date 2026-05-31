import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  webp: "image/webp", gif: "image/gif", svg: "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Güvenlik: path traversal engelle
  const safe = path.basename(filename);
  if (safe !== filename || filename.includes("..")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const ext = safe.split(".").pop()?.toLowerCase() || "";
  const contentType = MIME[ext] || "application/octet-stream";

  // Önce cwd/uploads, sonra cwd/public/uploads dene
  const candidates = [
    path.join(process.cwd(), "uploads", safe),
    path.join(process.cwd(), "public", "uploads", safe),
  ];

  for (const filePath of candidates) {
    try {
      const buffer = await readFile(filePath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Sonraki path'i dene
    }
  }

  return new NextResponse("Not Found", { status: 404 });
}
