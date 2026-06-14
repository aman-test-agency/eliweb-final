import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getTokenFromRequest, verifyToken } from "@/lib/auth";
// import { withCors } from "@/lib/cors";

export function json(
  data: unknown,
  init?: ResponseInit,
  request?: NextRequest,
): NextResponse {
  return NextResponse.json(data, init);
  // return withCors(NextResponse.json(data, init), request);
}

export function apiError(
  error: unknown,
  fallback: string,
  status = 500,
  request?: NextRequest,
): NextResponse {
  console.error(error);
  const message = error instanceof Error ? error.message : fallback;
  return json({ error: message }, { status }, request);
}

export async function requireAuth(
  request: NextRequest,
): Promise<NextResponse | null> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return json({ error: "Unauthorized" }, { status: 401 }, request);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return json({ error: "Unauthorized" }, { status: 401 }, request);
  }

  return null;
}
