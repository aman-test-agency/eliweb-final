import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  try {
    const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });
    return json(stats);
  } catch {
    return json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const stat = await prisma.stat.create({ data: body });
    return json(stat, { status: 201 });
  } catch {
    return json({ error: "Failed to create stat" }, { status: 500 });
  }
}
