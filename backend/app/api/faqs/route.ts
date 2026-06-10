import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET(request: NextRequest) {
  try {
    const page = request.nextUrl.searchParams.get("page");
    const faqs = await prisma.faq.findMany({
      where: page ? { page } : undefined,
      orderBy: { order: "asc" },
    });
    return json(faqs);
  } catch {
    return json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const faq = await prisma.faq.create({ data: body });
    return json(faq, { status: 201 });
  } catch {
    return json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
