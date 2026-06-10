import type { NextRequest } from "next/server";

import { apiError, json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET(request: NextRequest) {
  try {
    const homepage = request.nextUrl.searchParams.get("homepage");
    const projects = await prisma.project.findMany({
      where: homepage === "true" ? { homepageTeaser: true } : undefined,
      orderBy: { order: "asc" },
    });
    return json(projects);
  } catch {
    return json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const project = await prisma.project.create({ data: body });
    return json(project, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create project");
  }
}
