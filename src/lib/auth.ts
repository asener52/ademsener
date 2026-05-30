import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { query } from "./db";
import bcrypt from "bcryptjs";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ademsener-super-secret-jwt-key-change-in-prod"
);
const COOKIE = "admin_session";

export async function signIn(email: string, password: string): Promise<boolean> {
  const rows = await query<{ id: string; email: string; password_hash: string }>(
    "SELECT id, email, password_hash FROM admin_users WHERE email = ? LIMIT 1",
    [email]
  );
  const user = rows[0];
  if (!user) return false;
  return bcrypt.compare(password, user.password_hash);
}

export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}

export async function getSession(): Promise<{ email: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

// Admin şifresini hash'le ve veritabanına kaydet
export async function seedAdmin(email: string, password: string) {
  const hash = await bcrypt.hash(password, 12);
  await query(
    `INSERT INTO admin_users (email, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [email, hash]
  );
}
