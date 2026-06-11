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

type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  order: number;
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  imageUrl: z.string().min(1, "Photo is required — upload a file or paste a URL"),
  order: z.coerce.number().int(),
});

type FormValues = z.infer<typeof schema>;

const empty: FormValues = { name: "", role: "", imageUrl: "", order: 0 };

export default function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });

  const load = useCallback(() => {
    setLoading(true);
    apiFetch<TeamMember[]>("/api/team")
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

  function openEdit(item: TeamMember) {
    setEditing(item);
    form.reset(item);
    setOpen(true);
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/team/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Team member updated");
      } else {
        await apiFetch("/api/team", { method: "POST", body: JSON.stringify(values) });
        toast.success("Team member created");
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
      await apiFetch(`/api/team/${id}`, { method: "DELETE" });
      toast.success("Team member deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader
        title="Team"
        description="Team members"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          title="No team members yet"
          description="Add team members to display on the about page."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          }
        />
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt=""
                className="mb-3 h-24 w-24 rounded-lg border object-cover"
              />
              <p className="font-semibold">{item.name}</p>
              <p className="mb-4 text-sm text-muted-foreground">{item.role}</p>
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
            <DialogTitle>{editing ? "Edit Member" : "Add Member"}</DialogTitle>
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
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
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
