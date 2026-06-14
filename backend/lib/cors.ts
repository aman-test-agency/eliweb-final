import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const allowedOrigins = [
  "http://localhost:3000",
  "https://eliweb-final.vercel.app",
  "https://www.eliweb.in",
    "https://eliweb.in", 
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

function resolveOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    return origin;
  }
  return allowedOrigins[0] ?? null;
}

export function withCors(
  response: NextResponse,
  request?: NextRequest,
): NextResponse {
  const origin = request ? resolveOrigin(request) : allowedOrigins[0];
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  return response;
}

export function corsPreflight(request?: NextRequest): NextResponse {
  return withCors(new NextResponse(null, { status: 204 }), request);
}
