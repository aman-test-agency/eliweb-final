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
    let type = request.nextUrl.searchParams.get("type");

    if (!type) {
      const body = (await request.json().catch(() => ({}))) as {
        type?: string;
      };
      type = body.type ?? null;
    }

    if (type === "contact") {
      const submission = await prisma.contactSubmission.update({
        where: { id: params.id },
        data: { read: true },
      });
      return json({ ...submission, type: "contact" });
    }

    if (type === "enquiry") {
      const submission = await prisma.enquirySubmission.update({
        where: { id: params.id },
        data: { read: true },
      });
      return json({ ...submission, type: "enquiry" });
    }

    return json(
      { error: "type query parameter must be contact or enquiry" },
      { status: 400 },
    );
  } catch {
    return json({ error: "Submission not found" }, { status: 404 });
  }
}
