import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page     = parseInt(searchParams.get("page")  ?? "1");
    const limit    = parseInt(searchParams.get("limit") ?? "9");
    const category = searchParams.get("category") ?? "";
    const tag      = searchParams.get("tag")      ?? "";
    const search   = searchParams.get("search")   ?? "";
    const featured = searchParams.get("featured");

    const where: any = { status: "published" };
    if (category) where.category = category;
    if (tag)      where.tags     = { has: tag };
    if (featured === "true") where.featured = true;
    if (search)   where.OR = [
      { title:   { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    const all = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { category: true, tags: true },
    });
   const categories = Array.from(new Set(all.map((p) => p.category)));
   const tags       = Array.from(new Set(all.flatMap((p) => p.tags)));

    return NextResponse.json({
      success: true,
      data: { posts, total, totalPages: Math.ceil(total / limit), categories, tags },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch posts" }, { status: 500 });
  }
}