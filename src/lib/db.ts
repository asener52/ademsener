import mysql from "mysql2/promise";

let _pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!_pool) {
    // Hostinger'da MySQL socket path'ini dene, yoksa TCP ile bağlan
    const socketPath = process.env.DB_SOCKET; // örn: /var/run/mysqld/mysqld.sock

    const config: mysql.PoolOptions = {
      user:               process.env.DB_USER     || "u345143959_ademsener",
      password:           process.env.DB_PASSWORD || "",
      database:           process.env.DB_NAME     || "u345143959_ademsener",
      waitForConnections: true,
      connectionLimit:    10,
      charset:            "utf8mb4",
    };

    if (socketPath) {
      // Unix socket bağlantısı (host gerekmez)
      config.socketPath = socketPath;
    } else {
      config.host = process.env.DB_HOST || "localhost";
      config.port = Number(process.env.DB_PORT) || 3306;
    }

    _pool = mysql.createPool(config);
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
