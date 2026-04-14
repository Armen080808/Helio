import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use next-auth v5's own auth helper — reads the correct "authjs.session-token"
// cookie instead of the v4 "next-auth.session-token" that getToken() looked for.
// The authorized() callback in auth.config.ts handles redirects to /login.
export const { auth: proxy } = NextAuth(authConfig);

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
