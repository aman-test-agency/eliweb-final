import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyToken } from "@/lib/auth";

export async function requireAdminSession() {
  const token = cookies().get("admin-token")?.value;
  if (!token) {
    redirect("/admin/login");
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect("/admin/login");
  }

  return payload;
}
