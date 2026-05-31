import mysql from "mysql2/promise";

// Pool'u lazy oluştur — import sırasında değil, ilk sorguda
let _pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!_pool) {
    _pool = mysql.createPool({
      host:               process.env.DB_HOST     || "127.0.0.1",
      user:               process.env.DB_USER     || "u345143959_ademsener",
      password:           process.env.DB_PASSWORD || "",
      database:           process.env.DB_NAME     || "u345143959_ademsener",
      port:               Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit:    10,
      charset:            "utf8mb4",
    });
  }
  return _pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params?: any[]): Promise<{ insertId: string; affectedRows: number }> {
  const [result] = await getPool().execute(sql, params) as any;
  return { insertId: result.insertId, affectedRows: result.affectedRows };
}

export default getPool;
