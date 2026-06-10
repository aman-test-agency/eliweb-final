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
    const member = await prisma.teamMember.update({
      where: { id: params.id },
      data: body,
    });
    return json(member);
  } catch {
    return json({ error: "Team member not found" }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await prisma.teamMember.delete({ where: { id: params.id } });
    return json({ success: true });
  } catch {
    return json({ error: "Team member not found" }, { status: 404 });
  }
}
