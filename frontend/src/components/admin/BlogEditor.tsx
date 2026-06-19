"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { Markdown } from "tiptap-markdown";

const API = process.env.NEXT_PUBLIC_API_URL;

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

const EMPTY_FORM = {
  title: "", slug: "", excerpt: "", coverImageUrl: "",
  author: "EliWeb Team", authorAvatar: "", category: "",
  tags: [] as string[], status: "draft", featured: false,
  readTime: 5, metaTitle: "", metaDesc: "",
};

export default function BlogEditor({ postId }: { postId?: string }) {
  const router   = useRouter();
  const isEdit   = !!postId;
  const [form, setForm]         = useState(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const autoSaveRef = useRef<ReturnType<typeof setTimeout>>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Start writing your article…" }),
      Highlight,
      Markdown,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      // Captures clean markdown string instead of HTML
     const markdownContent = (editor.storage as any).markdown.getMarkdown();
      triggerAutoSave(markdownContent);
    },
  });

  // Load existing post
  useEffect(() => {
    if (!isEdit || !postId) return;
    fetch(`${API}/api/admin/blog/${postId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setForm({ ...EMPTY_FORM, ...json.data, tags: json.data.tags ?? [] });
          editor?.commands.setContent(json.data.content ?? "");
        }
      });
  }, [postId, editor]);

  const triggerAutoSave = (content: string) => {
    clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => autoSave(content), 3000);
  };

  const autoSave = async (content: string) => {
    if (!form.title) return;
    setSaveMsg("Saving…");
    const slug = form.slug || slugify(form.title);
    const body = { ...form, slug, content, status: "draft" };
    try {
      const res  = isEdit
        ? await fetch(`${API}/api/admin/blog/${postId}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch(`${API}/api/admin/blog`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      setSaveMsg(json.success ? "Saved ✓" : "Save failed");
    } catch {
      setSaveMsg("Save failed");
    }
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title)        e.title        = "Title is required";
    if (!form.category)     e.category     = "Category is required";
    if (!form.coverImageUrl) e.coverImageUrl = "Cover image is required";
    if (!editor?.getText()) e.content      = "Content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (publishStatus: "draft" | "published") => {
    if (!validate()) return;
    setSaving(true);
    const slug    = form.slug || slugify(form.title);
    // Extracted markdown format for final submissions
   const content = (editor as any)?.storage?.markdown?.getMarkdown() ?? "";
    const body    = { ...form, slug, content, status: publishStatus };

    try {
      const res  = isEdit
        ? await fetch(`${API}/api/admin/blog/${postId}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch(`${API}/api/admin/blog`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (json.success) router.push("/admin/blog");
      else alert(json.error ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res  = await fetch(`${API}/api/admin/blog/upload-image`, { method: "POST", credentials: "include", body: fd });
    const json = await res.json();
    if (json.success) setForm((f) => ({ ...f, coverImageUrl: `${API}${json.data.url}` }));
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  };

  const removeTag = (tag: string) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const setField = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/blog")}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            ← Back
          </button>
          <h1 className="text-xl font-bold font-[Syne] text-gray-900 dark:text-white">
            {isEdit ? "Edit Post" : "New Post"}
          </h1>
          {saveMsg && <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{saveMsg}</span>}
        </div>
        <div className="flex gap-3">
          <button onClick={() => submit("draft")} disabled={saving}
            className="px-5 py-2 rounded-[0.9rem] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => submit("published")} disabled={saving}
            className="px-5 py-2 rounded-[0.9rem] bg-[#1460D6] text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      <div className="flex gap-8">

        {/* Left — main editor */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Title */}
          <div>
            <input
              value={form.title}
              onChange={(e) => {
                setField("title", e.target.value);
                if (!isEdit) setField("slug", slugify(e.target.value));
              }}
              placeholder="Post title…"
              className={`w-full text-3xl font-bold font-[Syne] bg-transparent border-0 border-b-2 pb-3 focus:outline-none focus:border-[#1460D6] text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-colors ${errors.title ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">URL Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder="post-url-slug"
              className="mt-1 w-full px-4 py-2 rounded-[0.9rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Preview: <span className="text-[#1460D6]">eliweb.in/blog/{form.slug || "your-slug"}</span>
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              rows={3}
              placeholder="A short summary shown in blog cards…"
              className="mt-1 w-full px-4 py-3 rounded-[0.9rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6] resize-none"
            />
          </div>

          {/* Rich text editor */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</label>
            {/* Toolbar */}
            <div className="mt-1 flex flex-wrap gap-1 p-3 border border-b-0 border-gray-200 dark:border-gray-700 rounded-t-[0.9rem] bg-gray-50 dark:bg-gray-800">
              {[
                { label: "B",    action: () => editor?.chain().focus().toggleBold().run(),        active: editor?.isActive("bold") },
                { label: "I",    action: () => editor?.chain().focus().toggleItalic().run(),      active: editor?.isActive("italic") },
                { label: "S",    action: () => editor?.chain().focus().toggleStrike().run(),      active: editor?.isActive("strike") },
                { label: "H2",   action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
                { label: "H3",   action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive("heading", { level: 3 }) },
                { label: "UL",   action: () => editor?.chain().focus().toggleBulletList().run(),  active: editor?.isActive("bulletList") },
                { label: "OL",   action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive("orderedList") },
                { label: "\"",   action: () => editor?.chain().focus().toggleBlockquote().run(),  active: editor?.isActive("blockquote") },
                { label: "</>",  action: () => editor?.chain().focus().toggleCodeBlock().run(),   active: editor?.isActive("codeBlock") },
              ].map((btn) => (
                <button key={btn.label} onClick={btn.action}
                  className={`w-9 h-8 rounded text-sm font-medium transition-colors ${
                    btn.active ? "bg-[#1460D6] text-white" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                  }`}>
                  {btn.label}
                </button>
              ))}
              <button
                onClick={() => {
                  const url = prompt("Enter image URL:");
                  if (url) editor?.chain().focus().setImage({ src: url }).run();
                }}
                className="px-3 h-8 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 border border-gray-200 dark:border-gray-600"
              >
                🖼 Image
              </button>
              <button
                onClick={() => {
                  const url = prompt("Enter link URL:");
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                  else editor?.chain().focus().unsetLink().run();
                }}
                className="px-3 h-8 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 border border-gray-200 dark:border-gray-600"
              >
                🔗 Link
              </button>
            </div>
            <div className={`border border-gray-200 dark:border-gray-700 rounded-b-[0.9rem] bg-white dark:bg-gray-900 min-h-[400px] ${errors.content ? "border-red-400" : ""}`}>
              <EditorContent
                editor={editor}
                className="p-5 min-h-[400px] prose prose-sm dark:prose-invert max-w-none focus:outline-none"
              />
            </div>
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="w-72 shrink-0 flex flex-col gap-5">

          {/* Cover image */}
          <div className="rounded-[0.9rem] border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Cover Image</label>
            <div className="flex gap-2 mb-3">
              {["url", "upload"].map((t) => (
                <button key={t} onClick={() => setImageTab(t as any)}
                  className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${imageTab === t ? "bg-[#1460D6] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600"}`}>
                  {t === "url" ? "URL" : "Upload"}
                </button>
              ))}
            </div>
            {imageTab === "url" ? (
              <input value={form.coverImageUrl} onChange={(e) => setField("coverImageUrl", e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]" />
            ) : (
              <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); }}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#1460D6] file:text-white hover:file:bg-blue-700" />
            )}
            {form.coverImageUrl && (
              <div className="mt-3 relative">
                <img src={form.coverImageUrl} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
                <button onClick={() => setField("coverImageUrl", "")}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600">
                  ×
                </button>
              </div>
            )}
            {errors.coverImageUrl && <p className="text-red-500 text-xs mt-1">{errors.coverImageUrl}</p>}
          </div>

          {/* Post details */}
          <div className="rounded-[0.9rem] border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900 flex flex-col gap-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Post Details</label>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Author</label>
              <input value={form.author} onChange={(e) => setField("author", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Category</label>
              <input value={form.category} onChange={(e) => setField("category", e.target.value)}
                placeholder="e.g. Web Design"
                className={`w-full px-3 py-2 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6] ${errors.category ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`} />
              {errors.category && <p className="text-red-500 text-xs mt-0.5">{errors.category}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Read time (minutes)</label>
              <input type="number" value={form.readTime} onChange={(e) => setField("readTime", parseInt(e.target.value) || 5)} min={1}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]" />
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-[0.9rem] border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Tags</label>
            <div className="flex gap-2 mb-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag, press Enter"
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]" />
              <button onClick={addTag} className="px-3 py-1.5 bg-[#1460D6] text-white text-xs rounded-lg hover:bg-blue-700">+</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#1460D6]/10 text-[#1460D6]">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-0.5">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="rounded-[0.9rem] border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Options</label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Featured post</span>
              <div
                onClick={() => setField("featured", !form.featured)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.featured ? "bg-[#1460D6]" : "bg-gray-300 dark:bg-gray-600"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
          </div>

          {/* SEO */}
          <details className="rounded-[0.9rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <summary className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer">SEO Settings</summary>
            <div className="px-5 pb-5 flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Meta Title <span className="text-gray-400">({form.metaTitle.length}/60)</span></label>
                <input value={form.metaTitle} onChange={(e) => setField("metaTitle", e.target.value)} maxLength={60}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Meta Description <span className="text-gray-400">({form.metaDesc.length}/160)</span></label>
                <textarea value={form.metaDesc} onChange={(e) => setField("metaDesc", e.target.value)} rows={3} maxLength={160}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6] resize-none" />
              </div>
              {/* Google preview */}
              {(form.metaTitle || form.title) && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs">
                  <p className="text-blue-600 font-medium truncate">{form.metaTitle || form.title}</p>
                  <p className="text-green-600 text-[10px]">eliweb.in/blog/{form.slug}</p>
                  <p className="text-gray-500 mt-0.5 line-clamp-2">{form.metaDesc || form.excerpt}</p>
                </div>
              )}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}