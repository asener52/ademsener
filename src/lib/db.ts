import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || "localhost",
  user:            process.env.DB_USER     || "u345143959_ademsener",
  password:        process.env.DB_PASSWORD || "",
  database:        process.env.DB_NAME     || "u345143959_ademsener",
  port:            Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit:    10,
  charset:            "utf8mb4",
});

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params?: any[]): Promise<{ insertId: string; affectedRows: number }> {
  const [result] = await pool.execute(sql, params) as any;
  return { insertId: result.insertId, affectedRows: result.affectedRows };
}

export default pool;
