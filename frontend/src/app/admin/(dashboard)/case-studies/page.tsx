"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/admin/empty-state";
import { ImageUploadField } from "@/components/admin/image-upload-field";
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
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/admin-api";
import { toastFormErrors } from "@/lib/admin-form";

type CaseStudy = {
  id: string;
  title: string;
  description: string;
  results: string;
  imageUrl: string;
};

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  results: z.string().min(1, "Results are required"),
  imageUrl: z.string().min(1, "Image is required — upload a file or paste a URL"),
});

type FormValues = z.infer<typeof schema>;

const empty: FormValues = {
  title: "",
  description: "",
  results: "",
  imageUrl: "",
};

export default function CaseStudiesPage() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });

  const load = useCallback(() => {
    setLoading(true);
    apiFetch<CaseStudy[]>("/api/case-studies")
      .then(setItems)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    form.reset(empty);
    setOpen(true);
  }

  function openEdit(item: CaseStudy) {
    setEditing(item);
    form.reset(item);
    setOpen(true);
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/case-studies/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Case study updated");
      } else {
        await apiFetch("/api/case-studies", { method: "POST", body: JSON.stringify(values) });
        toast.success("Case study created");
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
      await apiFetch(`/api/case-studies/${id}`, { method: "DELETE" });
      toast.success("Case study deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Case Studies"
        description="In-depth project stories shown on the portfolio page"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Case Study
          </Button>
        }
      />

      {loading ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="No case studies yet"
          description="Add your first case study to showcase project results on the portfolio page."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Case Study
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {item.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteButton onConfirm={() => handleDelete(item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Case Study" : "Add Case Study"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, toastFormErrors)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="results"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Results</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} placeholder="Key outcomes and metrics" />
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
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUploadField
                        hideLabel
                        value={field.value}
                        onChange={field.onChange}
                      />
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
