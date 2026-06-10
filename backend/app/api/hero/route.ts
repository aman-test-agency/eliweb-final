import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

const EMPTY_HERO = {
  headline: "",
  subtitle: "",
  cta1Label: "",
  cta1Url: "",
  cta2Label: "",
  cta2Url: "",
  trustPills: [] as string[],
  tickerItems: [] as string[],
};

export async function GET() {
  try {
    const hero = await prisma.heroContent.findFirst();
    return json(hero ?? EMPTY_HERO);
  } catch {
    return json({ error: "Failed to fetch hero content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const existing = await prisma.heroContent.findFirst();

    const hero = existing
      ? await prisma.heroContent.update({
          where: { id: existing.id },
          data: body,
        })
      : await prisma.heroContent.create({ data: body });

    return json(hero);
  } catch {
    return json({ error: "Failed to update hero content" }, { status: 500 });
  }
}
