import { NextResponse } from "next/server";

import { corsPreflight, withCors } from "@/lib/cors";

export function OPTIONS() {
  return corsPreflight();
}

export async function POST() {
  const response = withCors(NextResponse.json({ success: true }));
  response.cookies.set("admin-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
