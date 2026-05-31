import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ademsener-super-secret-jwt-key-change-in-prod"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin rotaları — login hariç oturum kontrolü
  if (pathname.startsWith("/panel") && !pathname.startsWith("/panel/login")) {
    const token = request.cookies.get("admin_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/panel/login", request.url));
    }
    try {
      await jwtVerify(token, SECRET);
    } catch {
      return NextResponse.redirect(new URL("/panel/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"],
};
