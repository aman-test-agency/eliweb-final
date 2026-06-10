import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  try {
    const tools = await prisma.techTool.findMany({ orderBy: { order: "asc" } });
    return json(tools);
  } catch {
    return json({ error: "Failed to fetch tech tools" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const tool = await prisma.techTool.create({ data: body });
    return json(tool, { status: 201 });
  } catch {
    return json({ error: "Failed to create tech tool" }, { status: 500 });
  }
}
