import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { corsPreflight, withCors } from "@/lib/cors";

export function OPTIONS(request: NextRequest) {
  return corsPreflight(request);
}

export async function POST(request: NextRequest) {
  const response = withCors(NextResponse.json({ success: true }), request);
  response.cookies.set("admin-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
