import { NextResponse } from "next/server";

const FRONTEND_ORIGIN =
  process.env.FRONTEND_URL ?? "https://eliweb-frontend.vercel.app";

export function withCors(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export function corsPreflight(): NextResponse {
  return withCors(new NextResponse(null, { status: 204 }));
}
