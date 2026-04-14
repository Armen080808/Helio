import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED = [
  "/dashboard",
  "/proposals",
  "/contracts",
  "/invoices",
  "/schedule",
  "/clients",
];

// next-auth v5 uses "authjs.session-token" (dev) or "__Secure-authjs.session-token" (prod)
// instead of the v4 default "next-auth.session-token".
const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName: COOKIE_NAME,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/proposals/:path*",
    "/contracts/:path*",
    "/invoices/:path*",
    "/schedule/:path*",
    "/clients/:path*",
  ],
};
