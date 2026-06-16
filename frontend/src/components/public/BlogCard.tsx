import Link from "next/link";

export default function BlogCard({ post }: { post: any }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-[0.9rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-[#1460D6]/50 hover:shadow-xl hover:shadow-[#1460D6]/10 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-900"
    >
      <div className="overflow-hidden h-48">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <span className="text-xs font-semibold text-[#1460D6] dark:text-[#F5C842] uppercase tracking-wider mb-2">
          {post.category}
        </span>

        <h3 className="font-bold font-[Syne] text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#1460D6] transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 flex-1 mb-4">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
          <span>{post.author}</span>
          <span>{date} · {post.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}