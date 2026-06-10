import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  try {
    const links = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });
    return json(links);
  } catch {
    return json({ error: "Failed to fetch footer links" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const link = await prisma.footerLink.create({ data: body });
    return json(link, { status: 201 });
  } catch {
    return json({ error: "Failed to create footer link" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = (await request.json()) as {
      company?: Array<{ label: string; url: string; order: number }>;
      services?: Array<{ label: string; url: string; order: number }>;
    };

    await prisma.footerLink.deleteMany();

    const links: Array<{
      column: string;
      label: string;
      url: string;
      order: number;
    }> = [];

    (body.company ?? []).forEach((item, index) => {
      links.push({
        column: "company",
        label: item.label,
        url: item.url,
        order: item.order ?? index,
      });
    });

    (body.services ?? []).forEach((item, index) => {
      links.push({
        column: "services",
        label: item.label,
        url: item.url,
        order: item.order ?? index,
      });
    });

    if (links.length > 0) {
      await prisma.footerLink.createMany({ data: links });
    }

    const saved = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });
    return json(saved);
  } catch {
    return json({ error: "Failed to update footer links" }, { status: 500 });
  }
}
