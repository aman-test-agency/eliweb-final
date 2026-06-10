"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DeleteButton } from "@/components/admin/delete-button";
import { FormSkeleton } from "@/components/admin/loading-skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/admin/empty-state";
import { apiFetch } from "@/lib/admin-api";
import { toastFormErrors } from "@/lib/admin-form";

type TechTool = { id: string; name: string; logoUrl: string; order: number };

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  logoUrl: z.string().url("Enter a valid logo URL (e.g. devicon CDN link)"),
  order: z.coerce.number().int(),
});

type FormValues = z.infer<typeof schema>;

export default function TechToolsPage() {
  const [items, setItems] = useState<TechTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", logoUrl: "", order: 0 },
  });

  const load = useCallback(() => {
    setLoading(true);
    apiFetch<TechTool[]>("/api/tech-tools")
      .then(setItems)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      await apiFetch("/api/tech-tools", { method: "POST", body: JSON.stringify(values) });
      toast.success("Tech tool added");
      setOpen(false);
      form.reset({ name: "", logoUrl: "", order: items.length });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/api/tech-tools/${id}`, { method: "DELETE" });
      toast.success("Tech tool deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader
        title="Tech Tools"
        description="Technology logos grid"
        action={
          <Button
            onClick={() => {
              form.reset({ name: "", logoUrl: "", order: items.length });
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Tool
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          title="No tech tools yet"
          description="Add technology logos using devicon CDN URLs."
          action={
            <Button
              onClick={() => {
                form.reset({ name: "", logoUrl: "", order: items.length });
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Tool
            </Button>
          }
        />
      ) : (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-col items-center pt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.logoUrl} alt={item.name} className="mb-2 h-12 w-12 object-contain" />
              <p className="mb-3 text-center text-sm font-medium">{item.name}</p>
              <DeleteButton onConfirm={() => handleDelete(item.id)} label="Remove" />
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tech Tool</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, toastFormErrors)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL (devicon)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
