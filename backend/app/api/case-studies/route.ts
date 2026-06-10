import type { NextRequest } from "next/server";

import { apiError, json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  try {
    const caseStudies = await prisma.caseStudy.findMany();
    return json(caseStudies);
  } catch {
    return json({ error: "Failed to fetch case studies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const caseStudy = await prisma.caseStudy.create({ data: body });
    return json(caseStudy, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create case study");
  }
}
