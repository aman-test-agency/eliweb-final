import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const type = request.nextUrl.searchParams.get("type");
    const submissions: Array<Record<string, unknown>> = [];

    if (!type || type === "contact") {
      const contacts = await prisma.contactSubmission.findMany();
      submissions.push(
        ...contacts.map((item) => ({ ...item, type: "contact" as const })),
      );
    }

    if (!type || type === "enquiry") {
      const enquiries = await prisma.enquirySubmission.findMany();
      submissions.push(
        ...enquiries.map((item) => ({ ...item, type: "enquiry" as const })),
      );
    }

    submissions.sort((a, b) => {
      const aDate = new Date(a.createdAt as string).getTime();
      const bDate = new Date(b.createdAt as string).getTime();
      return bDate - aDate;
    });

    return json(submissions);
  } catch {
    return json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}
