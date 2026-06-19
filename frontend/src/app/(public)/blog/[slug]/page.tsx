import { notFound } from "next/navigation";
import ReadingProgress from "@/components/public/ReadingProgress";
import TableOfContents from "@/components/public/TableOfContents";
import BlogOptIn from "@/components/public/BlogOptIn";
import ShareButtons from "@/components/public/ShareButtons";
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
  // Fetch primary post data
  const res  = await fetch(`${API}/api/blog/${params.slug}`, { cache: "no-store" });
  const json = await res.json();
  if (!json.success || !json.data) notFound();

  const post = json.data;
  
  // Format published timestamp securely
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric", 
        month: "long", 
        year: "numeric",
      })
    : "";

  // Fetch related articles layout data
  const relRes  = await fetch(`${API}/api/blog/related/${params.slug}`, { cache: "no-store" });
  const relJson = await relRes.json();
  const related = relJson.success ? relJson.data : [];

  return (
    <>
      <ReadingProgress />
      <main className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 transition-colors duration-200">
{/* Cover Hero Banner */}
<div className="relative h-[480px] w-full bg-gray-900 overflow-hidden -mt-[80px] pt-[80px]">
          <img
            src={post.coverImageUrl || "/placeholder-cover.jpg"}
            alt={post.title}
            className="w-full h-full object-cover opacity-80"
          />
          {/* Enhanced readability overlay mask gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-6xl mx-auto w-full left-0 right-0 z-10">
            <span className="text-xs text-[#00D4A6] font-bold uppercase tracking-widest mb-3 inline-block">
              {post.category || "General"}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-[Syne] text-white mb-6 leading-tight max-w-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-300 text-sm border-t border-white/10 pt-4 w-fit">
              {post.authorAvatar && (
                <img src={post.authorAvatar} alt={post.author}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20" />
              )}
              <span className="font-medium text-white">{post.author}</span>
              <span className="text-gray-500">·</span>
              <span>{date}</span>
              <span className="text-gray-500">·</span>
              <span>{post.readTime || 5} min read</span>
              <span className="text-gray-500">·</span>
              <span>{post.views || 0} views</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation Layout */}
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
          <a href="/" className="hover:text-[#1460D6] transition-colors">Home</a>
          <span className="text-gray-300 dark:text-gray-600">›</span>
          <a href="/blog" className="hover:text-[#1460D6] transition-colors">Blog</a>
          <span className="text-gray-300 dark:text-gray-600">›</span>
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1 font-medium">{post.title}</span>
        </div>

        {/* Content Structure + Sticky Sidebar Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-24 flex flex-col lg:flex-row gap-12 items-start">

          {/* Core Article Area */}
          <article className="flex-1 w-full min-w-0">
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-[Syne] prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-[#1460D6] prose-a:no-underline hover:prose-a:underline
              prose-code:text-[#1460D6] prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-blockquote:border-l-4 prose-blockquote:border-[#1460D6] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-900/50 prose-blockquote:py-1 prose-blockquote:px-4
              prose-img:rounded-[0.9rem] prose-img:shadow-md">
              
              {post.content && post.content.trim() !== "" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              ) : (
                <div className="rounded-[0.9rem] border border-dashed border-gray-200 dark:border-gray-800 p-8 text-center bg-gray-50 dark:bg-gray-900/30">
                  <p className="text-gray-400 dark:text-gray-500 italic my-0">
                    This post does not contain markdown document body strings. Please populate the write field in your admin dashboard panel layout.
                  </p>
                </div>
              )}
              
            </div>

            {/* Categorized Taxonomy Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider mr-2">Tags:</span>
                {post.tags.map((tag: string) => (
                  <a
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1460D6]/10 hover:text-[#1460D6] font-medium transition-colors"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            )}

            {/* Social Sharing Component Hook */}
            <div className="mt-8">
              <ShareButtons title={post.title} />
            </div>

            {/* Back Redirect Anchor */}
            <a href="/blog" className="inline-flex items-center gap-2 mt-12 text-[#1460D6] hover:text-blue-700 font-semibold text-sm group transition-colors">
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Back to Blog Feed
            </a>
          </article>

          {/* Right Sidebar Layout Panel */}
          <aside className="w-full lg:w-72 shrink-0 hidden lg:block self-start sticky top-24">
            <div className="flex flex-col gap-8">
              {/* Table of Contents will only attempt parsing if content exists */}
              {post.content && post.content.trim() !== "" && (
                <TableOfContents content={post.content} />
              )}
              
              <BlogOptIn />
              
              {related.length > 0 && (
                <div className="rounded-[0.9rem] border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900/50 shadow-sm">
                  <h3 className="font-bold font-[Syne] text-gray-900 dark:text-white mb-4 text-xs uppercase tracking-wider">
                    Related Articles
                  </h3>
                  <div className="flex flex-col gap-4">
                    {related.map((r: any) => (
                      <a key={r.id || r.slug} href={`/blog/${r.slug}`} className="flex gap-3 group">
                        <img
                          src={r.coverImageUrl || "/placeholder-thumb.jpg"}
                          alt={r.title}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 group-hover:opacity-80 transition-opacity bg-gray-150"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#1460D6] line-clamp-2 transition-colors leading-snug">
                            {r.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{r.readTime || 5} min read</p>
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