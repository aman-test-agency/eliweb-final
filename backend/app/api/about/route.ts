import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  try {
    const records = await prisma.aboutContent.findMany();
    const content = Object.fromEntries(
      records.map((record) => [record.key, record.value]),
    );
    return json(content);
  } catch {
    return json({ error: "Failed to fetch about content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = (await request.json()) as Record<string, string>;

    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.aboutContent.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        }),
      ),
    );

    const records = await prisma.aboutContent.findMany();
    const content = Object.fromEntries(
      records.map((record) => [record.key, record.value]),
    );
    return json(content);
  } catch {
    return json({ error: "Failed to update about content" }, { status: 500 });
  }
}
