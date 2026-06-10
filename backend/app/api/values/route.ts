import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  try {
    const values = await prisma.value.findMany({ orderBy: { order: "asc" } });
    return json(values);
  } catch {
    return json({ error: "Failed to fetch values" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const value = await prisma.value.create({ data: body });
    return json(value, { status: 201 });
  } catch {
    return json({ error: "Failed to create value" }, { status: 500 });
  }
}
