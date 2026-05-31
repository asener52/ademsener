import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import fs from "fs";

const SOCKET_PATHS = [
  "/var/run/mysqld/mysqld.sock",
  "/tmp/mysql.sock",
  "/var/lib/mysql/mysql.sock",
  "/run/mysqld/mysqld.sock",
];

export async function GET() {
  try {
    // Hangi socket path'lerin var olduğunu kontrol et
    const socketCheck = SOCKET_PATHS.reduce((acc, p) => {
      acc[p] = fs.existsSync(p);
      return acc;
    }, {} as Record<string, boolean>);

    const email    = process.env.ADMIN_EMAIL    || "adem@ademsener.org";
    const password = process.env.ADMIN_PASSWORD || "changeme";

    await query("SELECT 1");

    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id            CHAR(36)     NOT NULL DEFAULT (UUID()),
        email         VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const hash = await bcrypt.hash(password, 12);
    await query(
      `INSERT INTO admin_users (email, password_hash) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [email, hash]
    );

    return NextResponse.json({
      ok: true,
      message: `Admin oluşturuldu: ${email}`,
      socketCheck,
      dbHost: process.env.DB_HOST,
      dbSocket: process.env.DB_SOCKET,
    });
  } catch (err: any) {
    const socketCheck = SOCKET_PATHS.reduce((acc, p) => {
      acc[p] = fs.existsSync(p);
      return acc;
    }, {} as Record<string, boolean>);

    return NextResponse.json({
      ok: false,
      error: err?.message || String(err),
      code:  err?.code,
      socketCheck,
      dbHost: process.env.DB_HOST,
      dbSocket: process.env.DB_SOCKET,
    }, { status: 500 });
  }
}
