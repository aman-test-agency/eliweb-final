import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";
import { saveFile } from "@/lib/upload";

const MAX_SIZE = 5 * 1024 * 1024;

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return json({ error: "File exceeds 5MB limit" }, { status: 400 });
    }

    const url = await saveFile(file);
    return json({ url });
  } catch {
    return json({ error: "Upload failed" }, { status: 500 });
  }
}
