import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const current = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
    if (!current) return NextResponse.json({ success: true, data: [] });

    const related = await prisma.blogPost.findMany({
      where: {
        status: "published",
        NOT: { slug: params.slug },
        OR: [
          { category: current.category },
          { tags: { hasSome: current.tags } },
        ],
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    return NextResponse.json({ success: true, data: related });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}