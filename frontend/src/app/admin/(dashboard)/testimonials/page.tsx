"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DeleteButton } from "@/components/admin/delete-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { FormSkeleton } from "@/components/admin/loading-skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/admin/empty-state";
import { apiFetch } from "@/lib/admin-api";
import { toastFormErrors } from "@/lib/admin-form";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  order: number;
};

const schema = z.object({
  quote: z.string().min(1, "Quote is required"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  avatarUrl: z.string().min(1, "Avatar is required — upload a file or paste a URL"),
  order: z.coerce.number().int(),
});

type FormValues = z.infer<typeof schema>;

const empty: FormValues = {
  quote: "",
  name: "",
  role: "",
  avatarUrl: "",
  order: 0,
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });

  const load = useCallback(() => {
    setLoading(true);
    apiFetch<Testimonial[]>("/api/testimonials")
      .then(setItems)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    form.reset({ ...empty, order: items.length });
    setOpen(true);
  }

  function openEdit(item: Testimonial) {
    setEditing(item);
    form.reset(item);
    setOpen(true);
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/testimonials/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Testimonial updated");
      } else {
        await apiFetch("/api/testimonials", { method: "POST", body: JSON.stringify(values) });
        toast.success("Testimonial created");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/api/testimonials/${id}`, { method: "DELETE" });
      toast.success("Testimonial deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Client testimonials"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          description="Add client testimonials to build trust on the homepage."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Testimonial
            </Button>
          }
        />
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-full border object-cover"
                />
                <div>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{item.quote}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <DeleteButton onConfirm={() => handleDelete(item.id)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, toastFormErrors)} className="space-y-4">
              <FormField
                control={form.control}
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <ImageUploadField hideLabel value={field.value} onChange={field.onChange} />
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
