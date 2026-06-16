import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  try {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post)
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  try {
    const body = await req.json();
    const slug = body.slug ? body.slug.trim() : slugify(body.title);

    const conflict = await prisma.blogPost.findFirst({
      where: { slug, NOT: { id: params.id } },
    });
    if (conflict)
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 409 });

    const current = await prisma.blogPost.findUnique({ where: { id: params.id } });
    const publishedAt =
      body.status === "published" && !current?.publishedAt
        ? new Date()
        : body.status === "draft"
        ? null
        : current?.publishedAt;

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title:        body.title,
        slug,
        excerpt:      body.excerpt,
        content:      body.content,
        coverImageUrl: body.coverImageUrl,
        author:       body.author,
        authorAvatar: body.authorAvatar,
        category:     body.category,
        tags:         body.tags         ?? [],
        status:       body.status,
        featured:     body.featured     ?? false,
        readTime:     body.readTime     ?? 5,
        metaTitle:    body.metaTitle    ?? "",
        metaDesc:     body.metaDesc     ?? "",
        publishedAt,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  try {
    await prisma.blogPost.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}