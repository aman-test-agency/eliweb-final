"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DeleteButton } from "@/components/admin/delete-button";
import { FormSkeleton } from "@/components/admin/loading-skeleton";
import { PageHeader } from "@/components/admin/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/admin/empty-state";
import { apiFetch } from "@/lib/admin-api";
import { toastFormErrors } from "@/lib/admin-form";

type Faq = {
  id: string;
  question: string;
  answer: string;
  page: string;
  order: number;
};

const schema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  page: z.enum(["homepage", "contact"]),
  order: z.coerce.number().int(),
});

type FormValues = z.infer<typeof schema>;

export default function FaqsPage() {
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"homepage" | "contact">("homepage");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { question: "", answer: "", page: "homepage", order: 0 },
  });

  const load = useCallback(() => {
    setLoading(true);
    apiFetch<Faq[]>("/api/faqs")
      .then(setItems)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = items
    .filter((f) => f.page === tab)
    .sort((a, b) => a.order - b.order);

  function openCreate() {
    setEditing(null);
    form.reset({
      question: "",
      answer: "",
      page: tab,
      order: filtered.length,
    });
    setOpen(true);
  }

  function openEdit(item: Faq) {
    setEditing(item);
    form.reset({
      question: item.question,
      answer: item.answer,
      page: item.page as "homepage" | "contact",
      order: item.order,
    });
    setOpen(true);
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/faqs/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("FAQ updated");
      } else {
        await apiFetch("/api/faqs", { method: "POST", body: JSON.stringify(values) });
        toast.success("FAQ created");
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
      await apiFetch(`/api/faqs/${id}`, { method: "DELETE" });
      toast.success("FAQ deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Frequently asked questions"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "homepage" | "contact")}>
        <TabsList>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {(["homepage", "contact"] as const).map((page) => (
          <TabsContent key={page} value={page}>
            {items.filter((f) => f.page === page).length === 0 ? (
              <EmptyState
                title={`No ${page} FAQs yet`}
                description={`Add FAQs that appear on the ${page === "homepage" ? "homepage" : "contact page"}.`}
                action={
                  <Button onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Add FAQ
                  </Button>
                }
              />
            ) : (
            <Accordion type="single" collapsible className="w-full">
              {items
                .filter((f) => f.page === page)
                .sort((a, b) => a.order - b.order)
                .map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-3 text-sm text-muted-foreground">{faq.answer}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(faq)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <DeleteButton onConfirm={() => handleDelete(faq.id)} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, toastFormErrors)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
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
              <input type="hidden" {...form.register("page")} />
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
