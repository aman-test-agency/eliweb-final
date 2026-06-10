import type { NextRequest } from "next/server";

import { apiError, json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    return json(services);
  } catch {
    return json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const service = await prisma.service.create({ data: body });
    return json(service, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create service");
  }
}
