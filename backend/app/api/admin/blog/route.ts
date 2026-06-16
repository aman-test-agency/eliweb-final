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

export async function GET(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return err;

  try {
    const { searchParams } = new URL(req.url);
    const page   = parseInt(searchParams.get("page")  ?? "1");
    const limit  = parseInt(searchParams.get("limit") ?? "10");
    const status = searchParams.get("status") ?? "";
    const search = searchParams.get("search") ?? "";

    const where: any = {};
    if (status) where.status = status;
    if (search) where.OR = [
      { title:   { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];

    const [posts, total, published, drafts, viewsAgg] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
      prisma.blogPost.count({ where: { status: "published" } }),
      prisma.blogPost.count({ where: { status: "draft" } }),
      prisma.blogPost.aggregate({ _sum: { views: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        total,
        totalPages: Math.ceil(total / limit),
        stats: {
          total: published + drafts,
          published,
          drafts,
          totalViews: viewsAgg._sum.views ?? 0,
        },
      },
    });
  } catch (error) {
     console.error("GET /api/admin/blog error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return err;

  try {
    const body = await req.json();
    const slug = body.slug ? body.slug.trim() : slugify(body.title);

    if (!slug)
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });

    const exists = await prisma.blogPost.findUnique({ where: { slug } });
    if (exists)
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 409 });

    const post = await prisma.blogPost.create({
      data: {
        title:        body.title,
        slug,
        excerpt:      body.excerpt      ?? "",
        content:      body.content      ?? "",
        coverImageUrl: body.coverImageUrl ?? "",
        author:       body.author       ?? "EliWeb Team",
        authorAvatar: body.authorAvatar ?? "",
        category:     body.category     ?? "",
        tags:         body.tags         ?? [],
        status:       body.status       ?? "draft",
        featured:     body.featured     ?? false,
        readTime:     body.readTime     ?? 5,
        metaTitle:    body.metaTitle    ?? "",
        metaDesc:     body.metaDesc     ?? "",
        publishedAt:
          body.status === "published"
            ? body.publishedAt
              ? new Date(body.publishedAt)
              : new Date()
            : null,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
     console.error("POST /api/admin/blog error:", error);
    return NextResponse.json({ success: false, error: "Failed to create" }, { status: 500 });
  }
}