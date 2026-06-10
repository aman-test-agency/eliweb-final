"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FormSkeleton } from "@/components/admin/loading-skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { StringListField } from "@/components/admin/string-list-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { apiFetch } from "@/lib/admin-api";
import { toastFormErrors } from "@/lib/admin-form";

const schema = z.object({
  headline: z.string().min(1, "Headline is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  cta1Label: z.string().min(1, "CTA 1 label is required"),
  cta1Url: z.string().min(1, "CTA 1 URL is required"),
  cta2Label: z.string().min(1, "CTA 2 label is required"),
  cta2Url: z.string().min(1, "CTA 2 URL is required"),
  trustPills: z.array(z.string()),
  tickerItems: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

export default function HeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: "",
      subtitle: "",
      cta1Label: "",
      cta1Url: "",
      cta2Label: "",
      cta2Url: "",
      trustPills: [],
      tickerItems: [],
    },
  });

  useEffect(() => {
    apiFetch<FormValues>("/api/hero")
      .then((data) => {
        form.reset({
          headline: data.headline,
          subtitle: data.subtitle,
          cta1Label: data.cta1Label,
          cta1Url: data.cta1Url,
          cta2Label: data.cta2Label,
          cta2Url: data.cta2Url,
          trustPills: data.trustPills ?? [],
          tickerItems: data.tickerItems ?? [],
        });
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      await apiFetch("/api/hero", {
        method: "PUT",
        body: JSON.stringify({
          ...values,
          trustPills: values.trustPills.filter(Boolean),
          tickerItems: values.tickerItems.filter(Boolean),
        }),
      });
      toast.success("Hero content saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader
        title="Hero"
        description="Edit the main banner visitors see first — headline, buttons, trust badges, and scrolling topics"
      />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, toastFormErrors)} className="space-y-4">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cta1Label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA 1 Label</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cta1Url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA 1 URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cta2Label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA 2 Label</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cta2Url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA 2 URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <StringListField
                label="Trust Pills"
                values={form.watch("trustPills")}
                onChange={(v) => form.setValue("trustPills", v, { shouldDirty: true })}
              />
              <StringListField
                label="Ticker Items"
                values={form.watch("tickerItems")}
                onChange={(v) => form.setValue("tickerItems", v, { shouldDirty: true })}
              />
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
