import type { NextRequest } from "next/server";
import { z } from "zod";

import { json } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { sendContactEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(1).max(50),
  service: z.string().min(1).max(100),
  message: z.string().min(1).max(1000),
});

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    await prisma.contactSubmission.create({ data });

    try {
      await sendContactEmail(data);
    } catch (emailError) {
      console.error("Contact email failed:", emailError);
      return json({ error: "Failed to send email" }, { status: 500 });
    }

    return json({ success: true });
  } catch {
    return json({ error: "Failed to process contact submission" }, { status: 500 });
  }
}
