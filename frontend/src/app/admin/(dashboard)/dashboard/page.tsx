"use client";

import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminNavSections } from "@/components/admin/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/admin-api";

type RecentItem = {
  id: string;
  name: string;
  email: string;
  read: boolean;
  createdAt: string;
  type: "contact" | "enquiry";
};

type DashboardData = {
  counts: Record<string, number>;
  unreadTotal: number;
  contactUnread: number;
  enquiryUnread: number;
  recent: RecentItem[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<DashboardData>("/api/admin/dashboard")
      .then(setData)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;
  }

  const { counts, unreadTotal, contactUnread, enquiryUnread, recent } = data;
  const contentSections = adminNavSections.filter(
    (s) => s.label && s.label !== "Inbox",
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage everything visitors see on EliWeb.in. Pick a section below to edit content.
        </p>
      </div>

      {unreadTotal > 0 ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Inbox className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {unreadTotal} unread submission{unreadTotal === 1 ? "" : "s"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contactUnread} contact · {enquiryUnread} enquiry
                </p>
              </div>
            </div>
            <Link
              href="/admin/submissions"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View inbox
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {contentSections.map((section) => (
        <div key={section.label}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {section.label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => {
              const Icon = item.icon;
              const count = counts[item.href];
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-base">{item.title}</CardTitle>
                        </div>
                        {count !== undefined ? (
                          <Badge variant="secondary">{count}</Badge>
                        ) : null}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Manage
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Submissions</CardTitle>
          <CardDescription>Latest messages from contact and enquiry forms</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">{item.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.type}</Badge>
                    {!item.read ? <Badge>New</Badge> : null}
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
