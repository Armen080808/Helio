import type { NextAuthConfig } from "next-auth";

// Edge-compatible config — NO database imports here.
// Used by proxy.ts (runs on the edge/CDN).
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/dashboard",
        "/proposals",
        "/contracts",
        "/invoices",
        "/schedule",
        "/clients",
      ];
      const isProtected = protectedPaths.some((p) =>
        nextUrl.pathname.startsWith(p)
      );
      if (isProtected) return isLoggedIn;
      return true;
    },
  },
  session: { strategy: "jwt" },
  providers: [], // providers are added in auth.ts (server-only)
};
