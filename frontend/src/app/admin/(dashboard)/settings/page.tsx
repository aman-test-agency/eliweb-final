"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormSkeleton } from "@/components/admin/loading-skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/admin-api";
import { toastFormErrors } from "@/lib/admin-form";

const SETTING_FIELDS: Array<{ key: string; label: string; multiline?: boolean }> = [
  { key: "email", label: "Email" },
  { key: "hello_email", label: "Hello Email" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp_url", label: "WhatsApp URL" },
  { key: "location", label: "Location" },
  { key: "response_time", label: "Response Time" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "linkedin_url", label: "LinkedIn URL" },
  { key: "youtube_url", label: "YouTube URL" },
  { key: "brand_tagline", label: "Brand Tagline", multiline: true },
  { key: "copyright_year", label: "Copyright Year" },
];

type SettingsForm = Record<string, string>;

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<SettingsForm>({
    defaultValues: Object.fromEntries(SETTING_FIELDS.map((f) => [f.key, ""])),
  });

  useEffect(() => {
    apiFetch<SettingsForm>("/api/settings")
      .then((data) => form.reset(data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: SettingsForm) {
    setSaving(true);
    try {
      await apiFetch("/api/settings", { method: "PUT", body: JSON.stringify(values) });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader title="Settings" description="Global site settings" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, toastFormErrors)} className="space-y-4">
              {SETTING_FIELDS.map((field) => (
                <FormField
                  key={field.key}
                  control={form.control}
                  name={field.key}
                  render={({ field: input }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.multiline ? (
                          <Textarea rows={3} {...input} />
                        ) : (
                          <Input {...input} />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save All Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
