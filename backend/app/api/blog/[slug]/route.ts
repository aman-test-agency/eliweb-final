import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });

    if (!post || post.status !== "published")
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data:  { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch post" }, { status: 500 });
  }
}