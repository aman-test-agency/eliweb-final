"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/admin-api";
import { toastFormErrors } from "@/lib/admin-form";

type AboutContent = Record<string, string>;

type Value = { id: string; icon: string; label: string; order: number };

const storySchema = z.object({
  story_heading: z.string().min(1, "Story heading is required"),
  story_body: z.string().min(1, "Story body is required"),
  story_image: z.string().optional(),
});

const missionSchema = z.object({
  mission: z.string().min(1, "Mission is required"),
  vision: z.string().min(1, "Vision is required"),
});

const valueSchema = z.object({
  icon: z.string().min(1, "Icon name is required"),
  label: z.string().min(1, "Label is required"),
  order: z.coerce.number().int(),
});

type StoryValues = z.infer<typeof storySchema>;
type MissionValues = z.infer<typeof missionSchema>;
type ValueForm = z.infer<typeof valueSchema>;

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [savingStory, setSavingStory] = useState(false);
  const [savingMission, setSavingMission] = useState(false);
  const [values, setValues] = useState<Value[]>([]);
  const [valueOpen, setValueOpen] = useState(false);
  const [valueSaving, setValueSaving] = useState(false);

  const storyForm = useForm<StoryValues>({
    resolver: zodResolver(storySchema),
    defaultValues: { story_heading: "", story_body: "", story_image: "" },
  });

  const missionForm = useForm<MissionValues>({
    resolver: zodResolver(missionSchema),
    defaultValues: { mission: "", vision: "" },
  });

  const valueForm = useForm<ValueForm>({
    resolver: zodResolver(valueSchema),
    defaultValues: { icon: "", label: "", order: 0 },
  });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      apiFetch<AboutContent>("/api/about"),
      apiFetch<Value[]>("/api/values"),
    ])
      .then(([about, vals]) => {
        storyForm.reset({
          story_heading: about.story_heading ?? "",
          story_body: about.story_body ?? "",
          story_image: about.story_image ?? "",
        });
        missionForm.reset({
          mission: about.mission ?? "",
          vision: about.vision ?? "",
        });
        setValues(vals);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveStory(data: StoryValues) {
    setSavingStory(true);
    try {
      await apiFetch("/api/about", { method: "PUT", body: JSON.stringify(data) });
      toast.success("Story saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingStory(false);
    }
  }

  async function saveMission(data: MissionValues) {
    setSavingMission(true);
    try {
      await apiFetch("/api/about", { method: "PUT", body: JSON.stringify(data) });
      toast.success("Mission & vision saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingMission(false);
    }
  }

  async function addValue(data: ValueForm) {
    setValueSaving(true);
    try {
      await apiFetch("/api/values", { method: "POST", body: JSON.stringify(data) });
      toast.success("Value added");
      setValueOpen(false);
      valueForm.reset({ icon: "", label: "", order: values.length });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setValueSaving(false);
    }
  }

  async function deleteValue(id: string) {
    try {
      await apiFetch(`/api/values/${id}`, { method: "DELETE" });
      toast.success("Value deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader title="About" description="About page content" />

      <Tabs defaultValue="story">
        <TabsList>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
        </TabsList>

        <TabsContent value="story">
          <Card>
            <CardContent className="pt-6">
              <Form {...storyForm}>
                <form
                  onSubmit={storyForm.handleSubmit(saveStory, toastFormErrors)}
                  className="space-y-4"
                >
                  <FormField
                    control={storyForm.control}
                    name="story_heading"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story Heading</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={storyForm.control}
                    name="story_body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story Body</FormLabel>
                        <FormControl>
                          <Textarea rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={storyForm.control}
                    name="story_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story Image (optional)</FormLabel>
                        <FormControl>
                          <ImageUploadField
                            hideLabel
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={savingStory}>
                    {savingStory ? "Saving…" : "Save Story"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mission">
          <Card>
            <CardContent className="pt-6">
              <Form {...missionForm}>
                <form
                  onSubmit={missionForm.handleSubmit(saveMission, toastFormErrors)}
                  className="space-y-4"
                >
                  <FormField
                    control={missionForm.control}
                    name="mission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={missionForm.control}
                    name="vision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vision</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={savingMission}>
                    {savingMission ? "Saving…" : "Save Mission & Vision"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values">
          <div className="mb-4 flex justify-end">
            <Button
              onClick={() => {
                valueForm.reset({ icon: "", label: "", order: values.length });
                setValueOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Value
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {values.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.icon}</TableCell>
                  <TableCell>{v.label}</TableCell>
                  <TableCell>{v.order}</TableCell>
                  <TableCell className="text-right">
                    <DeleteButton onConfirm={() => deleteValue(v.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <Dialog open={valueOpen} onOpenChange={setValueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Value</DialogTitle>
          </DialogHeader>
          <Form {...valueForm}>
            <form onSubmit={valueForm.handleSubmit(addValue, toastFormErrors)} className="space-y-4">
              <FormField
                control={valueForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (Lucide name)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Flame" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={valueForm.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={valueForm.control}
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
                <Button type="submit" disabled={valueSaving}>
                  {valueSaving ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
