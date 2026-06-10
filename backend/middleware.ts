import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    if (request.method === "OPTIONS") {
      return corsPreflight();
    }
    return withCors(NextResponse.next());
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = getTokenFromCookies(request);
    const payload = token ? await verifyToken(token) : null;

    if (!payload) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
