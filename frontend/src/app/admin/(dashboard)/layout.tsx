"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { hasAdminToken } from "@/lib/admin-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return null;
  }

  return children;
}
