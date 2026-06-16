import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 import { requireAdmin } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  try {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post)
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data:  { featured: !post.featured },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}