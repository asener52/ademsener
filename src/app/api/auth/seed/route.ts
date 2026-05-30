import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

// Bu route sadece ilk kurulumda çağrılır, sonra silinebilir
export async function GET() {
  try {
    const email    = process.env.ADMIN_EMAIL    || "adem@ademsener.org";
    const password = process.env.ADMIN_PASSWORD || "changeme";

    // DB bağlantısını test et
    await query("SELECT 1");

    // Tabloyu oluştur (yoksa)
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id            CHAR(36)     NOT NULL DEFAULT (UUID()),
        email         VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Şifreyi hash'le ve kaydet
    const hash = await bcrypt.hash(password, 12);
    await query(
      `INSERT INTO admin_users (email, password_hash) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [email, hash]
    );

    return NextResponse.json({
      ok: true,
      message: `Admin oluşturuldu: ${email}`,
      note: "Bu sayfayı güvenlik için daha sonra kaldırabilirsiniz.",
    });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({
      ok: false,
      error: err?.message || String(err),
      code:  err?.code,
    }, { status: 500 });
  }
}
