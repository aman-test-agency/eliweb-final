"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DeleteButton } from "@/components/admin/delete-button";
import { TableSkeleton } from "@/components/admin/loading-skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/admin/empty-state";
import { apiFetch } from "@/lib/admin-api";
import { toastFormErrors } from "@/lib/admin-form";

type Stat = { id: string; value: string; label: string; order: number };

const schema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
  order: z.coerce.number().int(),
});

type FormValues = z.infer<typeof schema>;

export default function StatsPage() {
  const [items, setItems] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { value: "", label: "", order: 0 },
  });

  const load = useCallback(() => {
    setLoading(true);
    apiFetch<Stat[]>("/api/stats")
      .then(setItems)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateRow(id: string, field: keyof FormValues, value: string | number) {
    const item = items.find((s) => s.id === id);
    if (!item) return;
    const updated = { ...item, [field]: value };
    try {
      await apiFetch(`/api/stats/${id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      setItems((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
      load();
    }
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      await apiFetch("/api/stats", { method: "POST", body: JSON.stringify(values) });
      toast.success("Stat created");
      setOpen(false);
      form.reset({ value: "", label: "", order: items.length });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/api/stats/${id}`, { method: "DELETE" });
      toast.success("Stat deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Stats"
        description="Homepage statistics"
        action={
          <Button
            onClick={() => {
              form.reset({ value: "", label: "", order: items.length });
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Stat
          </Button>
        }
      />

      {loading ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="No stats yet"
          description="Add homepage statistics like project count or client satisfaction."
          action={
            <Button
              onClick={() => {
                form.reset({ value: "", label: "", order: items.length });
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Stat
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    defaultValue={item.value}
                    onBlur={(e) => {
                      if (e.target.value !== item.value) {
                        void updateRow(item.id, "value", e.target.value);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    defaultValue={item.label}
                    onBlur={(e) => {
                      if (e.target.value !== item.label) {
                        void updateRow(item.id, "label", e.target.value);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={item.order}
                    className="w-20"
                    onBlur={(e) => {
                      const n = Number(e.target.value);
                      if (n !== item.order) {
                        void updateRow(item.id, "order", n);
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DeleteButton onConfirm={() => handleDelete(item.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stat</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, toastFormErrors)} className="space-y-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="50+" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Projects" />
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
