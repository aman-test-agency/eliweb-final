import { prisma } from "../lib/prisma";

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, title: true, slug: true, content: true },
  });
  
  for (const post of posts) {
    const htmlTags = post.content.match(/<[a-z/][^>]*>/gi);
    if (htmlTags) {
      console.log(`POST WITH HTML (${post.title} - ${post.slug}):`);
      console.log(`Tags found:`, Array.from(new Set(htmlTags)).slice(0, 10));
      console.log(`Content snippet:`, post.content.substring(0, 300));
      console.log("-----------------------------------------");
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
