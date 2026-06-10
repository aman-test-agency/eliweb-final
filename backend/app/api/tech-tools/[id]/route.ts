import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: { id: string } };

export function OPTIONS() {
  return corsPreflight();
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const tool = await prisma.techTool.update({
      where: { id: params.id },
      data: body,
    });
    return json(tool);
  } catch {
    return json({ error: "Tech tool not found" }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await prisma.techTool.delete({ where: { id: params.id } });
    return json({ success: true });
  } catch {
    return json({ error: "Tech tool not found" }, { status: 404 });
  }
}
