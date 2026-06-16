import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where:  { status: "published" },
      select: { category: true },
    });
    // const categories = [...new Set(posts.map((p) => p.category))];
    const categories = Array.from(new Set(posts.map((p) => p.category)));
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}