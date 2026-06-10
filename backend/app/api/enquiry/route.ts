import type { NextRequest } from "next/server";
import { z } from "zod";

import { json } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { sendEnquiryEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const enquirySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional(),
  message: z.string().min(1).max(1000),
});

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    await prisma.enquirySubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        message: data.message,
      },
    });

    try {
      await sendEnquiryEmail(data);
    } catch (emailError) {
      console.error("Enquiry email failed:", emailError);
      return json({ error: "Failed to send email" }, { status: 500 });
    }

    return json({ success: true });
  } catch {
    return json({ error: "Failed to process enquiry submission" }, { status: 500 });
  }
}
