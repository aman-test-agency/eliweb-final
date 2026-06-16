"use client";
import BlogEditor from "@/components/admin/BlogEditor";

export default function EditBlogPost({ params }: { params: { id: string } }) {
  return <BlogEditor postId={params.id} />;
}