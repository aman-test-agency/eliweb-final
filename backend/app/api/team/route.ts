import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
    return json(team);
  } catch {
    return json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const member = await prisma.teamMember.create({ data: body });
    return json(member, { status: 201 });
  } catch {
    return json({ error: "Failed to create team member" }, { status: 500 });
  }
}
