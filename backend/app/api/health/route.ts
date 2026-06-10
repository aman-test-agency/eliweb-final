import { json } from "@/lib/api-helpers";
import { corsPreflight } from "@/lib/cors";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  return json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
