"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FormSkeleton } from "@/components/admin/loading-skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/admin-api";

type FooterRow = { label: string; url: string; order: number };

type FooterState = {
  company: FooterRow[];
  services: FooterRow[];
};

const emptyRow = (): FooterRow => ({ label: "", url: "", order: 0 });

export default function FooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<FooterState>({ company: [], services: [] });

  useEffect(() => {
    apiFetch<Array<{ column: string; label: string; url: string; order: number }>>(
      "/api/footer",
    )
      .then((links) => {
        setData({
          company: links
            .filter((l) => l.column === "company")
            .sort((a, b) => a.order - b.order)
            .map(({ label, url, order }) => ({ label, url, order })),
          services: links
            .filter((l) => l.column === "services")
            .sort((a, b) => a.order - b.order)
            .map(({ label, url, order }) => ({ label, url, order })),
        });
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  function updateColumn(
    column: keyof FooterState,
    index: number,
    field: keyof FooterRow,
    value: string,
  ) {
    setData((prev) => {
      const rows = [...prev[column]];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, [column]: rows };
    });
  }

  function addRow(column: keyof FooterState) {
    setData((prev) => ({
      ...prev,
      [column]: [...prev[column], { ...emptyRow(), order: prev[column].length }],
    }));
  }

  function removeRow(column: keyof FooterState, index: number) {
    setData((prev) => ({
      ...prev,
      [column]: prev[column].filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    const filterRows = (rows: FooterRow[]) =>
      rows.filter((r) => r.label.trim() && r.url.trim());

    const payload = {
      company: filterRows(data.company).map((r, i) => ({ ...r, order: i })),
      services: filterRows(data.services).map((r, i) => ({ ...r, order: i })),
    };
    try {
      const saved = await apiFetch<
        Array<{ column: string; label: string; url: string; order: number }>
      >("/api/footer", { method: "PUT", body: JSON.stringify(payload) });
      setData({
        company: saved
          .filter((l) => l.column === "company")
          .sort((a, b) => a.order - b.order)
          .map(({ label, url, order }) => ({ label, url, order })),
        services: saved
          .filter((l) => l.column === "services")
          .sort((a, b) => a.order - b.order)
          .map(({ label, url, order }) => ({ label, url, order })),
      });
      toast.success("Footer links saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <FormSkeleton />;

  function ColumnEditor({
    title,
    column,
  }: {
    title: string;
    column: keyof FooterState;
  }) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => addRow(column)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {data[column].map((row, index) => (
            <div key={index} className="flex gap-2">
              <div className="grid flex-1 gap-2">
                <div>
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={row.label}
                    onChange={(e) => updateColumn(column, index, "label", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={row.url}
                    onChange={(e) => updateColumn(column, index, "url", e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="mt-5 shrink-0"
                onClick={() => removeRow(column, index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {data[column].length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet.</p>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <PageHeader title="Footer" description="Footer navigation links" />
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <ColumnEditor title="Company" column="company" />
        <ColumnEditor title="Services" column="services" />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save Footer"}
      </Button>
    </div>
  );
}
