"use client";
import { useEffect, useState, useCallback } from "react";
import BlogCard from "@/components/public/BlogCard";
import BlogOptIn from "@/components/public/BlogOptIn";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function BlogPage() {
  const [posts, setPosts]           = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory]     = useState("");
  const [loading, setLoading]       = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "9",
        ...(search   && { search }),
        ...(category && { category }),
      });
      const res  = await fetch(`${API}/api/blog?${params}`);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data.posts);
        setTotal(json.data.total);
        setTotalPages(json.data.totalPages);
        setCategories(json.data.categories);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const featuredPost = posts.find((p) => p.featured);
  const gridPosts    = featuredPost && page === 1
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A]">

      {/* Hero */}
      <section className="relative py-28 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1460D6]/10 via-transparent to-[#00D4A6]/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative">
          <span className="inline-block text-xs font-semibold text-[#1460D6] dark:text-[#00D4A6] uppercase tracking-widest mb-4 bg-[#1460D6]/10 dark:bg-[#00D4A6]/10 px-4 py-1.5 rounded-full">
            Our Blog
          </span>
          <h1 className="text-5xl md:text-6xl font-bold font-[Syne] text-gray-900 dark:text-white mb-4">
            Insights & Ideas
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Web design, development, SEO & business growth — from the EliWeb team.
          </p>
          <p className="text-sm text-gray-400 mt-3">{total} articles published</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-24">

        {/* Filters */}
        <div className="sticky top-16 z-10 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md py-4 mb-10 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles…"
                className="w-full pl-9 pr-4 py-2.5 rounded-[0.9rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {["", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    category === cat
                      ? "bg-[#1460D6] text-white shadow-md shadow-[#1460D6]/30"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1460D6]/10"
                  }`}
                >
                  {cat || "All"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured */}
        {featuredPost && page === 1 && (
           <a
            href={`/blog/${featuredPost.slug}`}
            className="group block rounded-[0.9rem] overflow-hidden mb-12 relative h-[420px] shadow-2xl"
          >
            <img
              src={featuredPost.coverImageUrl}
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-[#00D4A6] font-bold uppercase tracking-widest bg-[#00D4A6]/20 px-3 py-1 rounded-full">
                  ★ Featured
                </span>
                <span className="text-xs text-gray-400">{featuredPost.category}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-[Syne] text-white mb-3 max-w-2xl">
                {featuredPost.title}
              </h2>
              <p className="text-gray-300 text-sm line-clamp-2 max-w-xl mb-4">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{featuredPost.author}</span>
                <span>·</span>
                <span>{featuredPost.readTime} min read</span>
                <span className="ml-2 bg-white text-black text-xs px-3 py-1 rounded-full font-semibold group-hover:bg-[#1460D6] group-hover:text-white transition-colors">
                  Read →
                </span>
              </div>
            </div>
          </a>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-[0.9rem] bg-gray-100 dark:bg-gray-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : gridPosts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-xl font-semibold mb-2">No posts found</p>
            <p className="text-sm">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-14">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 disabled:opacity-40"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                  page === p
                    ? "bg-[#1460D6] text-white shadow-md shadow-[#1460D6]/30"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-[#1460D6]/20"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}

        {/* Opt-in section */}
        <div className="mt-24 max-w-lg mx-auto">
          <BlogOptIn />
        </div>
      </div>
    </main>
  );
}