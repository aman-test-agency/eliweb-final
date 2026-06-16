import { notFound } from "next/navigation";
import ReadingProgress from "@/components/public/ReadingProgress";
import TableOfContents from "@/components/public/TableOfContents";
import BlogOptIn from "@/components/public/BlogOptIn";
import ShareButtons from "@/components/public/ShareButtons";
// Add this import at the top of the file
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const res  = await fetch(`${API}/api/blog/${params.slug}`, { cache: "no-store" });
    const json = await res.json();
    if (!json.success) return { title: "Post Not Found" };
    const post = json.data;
    return {
      title:       post.metaTitle || post.title,
      description: post.metaDesc  || post.excerpt,
      openGraph: {
        title:       post.metaTitle || post.title,
        description: post.metaDesc  || post.excerpt,
        images:      [post.coverImageUrl],
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const res  = await fetch(`${API}/api/blog/${params.slug}`, { cache: "no-store" });
  const json = await res.json();
  if (!json.success) notFound();

  const post = json.data;
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "";

  const relRes  = await fetch(`${API}/api/blog/related/${params.slug}`, { cache: "no-store" });
  const relJson = await relRes.json();
  const related = relJson.success ? relJson.data : [];

  return (
    <>
      <ReadingProgress />
      <main className="min-h-screen bg-white dark:bg-[#0A0A0A]">

        {/* Cover hero */}
        <div className="relative h-[480px] w-full">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-5xl mx-auto left-0 right-0">
            <span className="text-xs text-[#00D4A6] font-bold uppercase tracking-widest mb-3">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-[Syne] text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-300 text-sm">
              {post.authorAvatar && (
                <img src={post.authorAvatar} alt={post.author}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
              )}
              <span className="font-medium text-white">{post.author}</span>
              <span className="text-gray-500">·</span>
              <span>{date}</span>
              <span className="text-gray-500">·</span>
              <span>{post.readTime} min read</span>
              <span className="text-gray-500">·</span>
              <span>{post.views} views</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-400 flex gap-2">
          <a href="/" className="hover:text-[#1460D6] transition-colors">Home</a>
          <span>›</span>
          <a href="/blog" className="hover:text-[#1460D6] transition-colors">Blog</a>
          <span>›</span>
          <span className="text-gray-600 dark:text-gray-300 line-clamp-1">{post.title}</span>
        </div>

        {/* Content + sidebar */}
        <div className="max-w-6xl mx-auto px-4 pb-24 flex gap-12">

          {/* Article */}
          <article className="flex-1 min-w-0">
            <div className="prose prose-lg dark:prose-invert max-w-none
  prose-headings:font-[Syne] prose-headings:text-gray-900 dark:prose-headings:text-white
  prose-a:text-[#1460D6] prose-a:no-underline hover:prose-a:underline
  prose-code:text-[#1460D6] prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
  prose-blockquote:border-[#1460D6] prose-blockquote:text-gray-500
  prose-img:rounded-[0.9rem]">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {post.content}
  </ReactMarkdown>
</div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500 mr-2">Tags:</span>
              {post.tags.map((tag: string) => (
                <a
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1460D6]/10 hover:text-[#1460D6] transition-colors"
                >
                  #{tag}
                </a>
              ))}
            </div>

            {/* Share */}
            <ShareButtons title={post.title} />

            {/* Back */}
            <a href="/blog" className="inline-flex items-center gap-2 mt-10 text-[#1460D6] hover:underline text-sm">
              ← Back to Blog
            </a>
          </article>

          {/* Sidebar */}
          <aside className="w-72 shrink-0 hidden lg:flex flex-col gap-6">
            <div className="sticky top-24 flex flex-col gap-6">
              <TableOfContents content={post.content} />
              <BlogOptIn />
              {related.length > 0 && (
                <div className="rounded-[0.9rem] border border-gray-100 dark:border-gray-800 p-5">
                  <h3 className="font-bold font-[Syne] text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                    Related Posts
                  </h3>
                  <div className="flex flex-col gap-4">
                    {related.map((r: any) => (
                      <a key={r.id} href={`/blog/${r.slug}`} className="flex gap-3 group">
                        <img
                          src={r.coverImageUrl}
                          alt={r.title}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 group-hover:opacity-80 transition-opacity"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#1460D6] line-clamp-2 transition-colors">
                            {r.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{r.readTime} min read</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}