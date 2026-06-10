import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET ?? "eliweb-super-secret-jwt-key-2024",
  );
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(
  token: string,
): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getTokenFromCookies(request: NextRequest): string | null {
  return request.cookies.get("admin-token")?.value ?? null;
}
