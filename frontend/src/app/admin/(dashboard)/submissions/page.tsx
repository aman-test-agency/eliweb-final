"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { TableSkeleton } from "@/components/admin/loading-skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: "contact" | "enquiry";
};

export default function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState<"contact" | "enquiry">("contact");

  const load = useCallback(() => {
    setLoading(true);
    apiFetch<Submission[]>("/api/submissions")
      .then(setItems)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = items.filter((s) => s.type === tab);

  async function markRead(item: Submission) {
    try {
      await apiFetch(`/api/submissions/${item.id}?type=${item.type}`, {
        method: "PUT",
        body: JSON.stringify({ type: item.type }),
      });
      toast.success("Marked as read");
      setItems((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, read: true } : s)),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  function preview(item: Submission) {
    return item.message.slice(0, 60) + (item.message.length > 60 ? "…" : "");
  }

  return (
    <div>
      <PageHeader title="Submissions" description="Contact and enquiry form submissions" />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "contact" | "enquiry")}>
        <TabsList>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="enquiry">Enquiry</TabsTrigger>
        </TabsList>

        {(["contact", "enquiry"] as const).map((type) => (
          <TabsContent key={type} value={type}>
            {loading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items
                    .filter((s) => s.type === type)
                    .map((item) => (
                      <Fragment key={item.id}>
                        <TableRow
                          className={cn(
                            "cursor-pointer",
                            !item.read && "bg-primary/5 font-medium",
                          )}
                          onClick={() =>
                            setExpanded(expanded === item.id ? null : item.id)
                          }
                        >
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell className="max-w-[200px] truncate text-muted-foreground">
                            {preview(item)}
                          </TableCell>
                          <TableCell>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {item.read ? (
                              <Badge variant="outline">Read</Badge>
                            ) : (
                              <Badge>New</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        {expanded === item.id ? (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Card>
                                <CardContent className="space-y-3 pt-4">
                                  {item.phone ? (
                                    <p className="text-sm">
                                      <span className="font-medium">Phone:</span> {item.phone}
                                    </p>
                                  ) : null}
                                  {item.service ? (
                                    <p className="text-sm">
                                      <span className="font-medium">Service:</span>{" "}
                                      {item.service}
                                    </p>
                                  ) : null}
                                  <p className="whitespace-pre-wrap text-sm">{item.message}</p>
                                  {!item.read ? (
                                    <Button size="sm" onClick={() => markRead(item)}>
                                      Mark as read
                                    </Button>
                                  ) : null}
                                </CardContent>
                              </Card>
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </Fragment>
                    ))}
                </TableBody>
              </Table>
            )}
            {!loading && filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No {type} submissions yet.
              </p>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
