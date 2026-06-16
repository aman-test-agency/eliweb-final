"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts]     = useState<any[]>([]);
  const [stats, setStats]     = useState({ total: 0, published: 0, drafts: 0, totalViews: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState("");
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting]     = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10", ...(search && { search }), ...(status && { status }) });
      const res  = await fetch(`${API}/api/admin/blog?${params}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setPosts(json.data.posts);
        setTotalPages(json.data.totalPages);
        setStats(json.data.stats);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch_(); }, [page, search, status]);

  const toggleStatus = async (id: string) => {
    await fetch(`${API}/api/admin/blog/${id}/toggle-status`, { method: "POST", credentials: "include" });
    fetch_();
  };

  const toggleFeatured = async (id: string) => {
    await fetch(`${API}/api/admin/blog/${id}/toggle-featured`, { method: "POST", credentials: "include" });
    fetch_();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`${API}/api/admin/blog/${id}`, { method: "DELETE", credentials: "include" });
    setDeleting(null);
    fetch_();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-[Syne] text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all blog content</p>
        </div>
        <button
          onClick={() => router.push("/admin/blog/new")}
          className="bg-[#1460D6] text-white px-5 py-2.5 rounded-[0.9rem] text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          + New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Posts",   value: stats.total },
          { label: "Published",     value: stats.published },
          { label: "Drafts",        value: stats.drafts },
          { label: "Total Views",   value: stats.totalViews },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[0.9rem] p-5">
            <p className="text-2xl font-bold font-[Syne] text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search posts…"
          className="flex-1 px-4 py-2 rounded-[0.9rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-[0.9rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[0.9rem] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📝</p>
            <p>No posts yet. Create your first one!</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Post</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Featured</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Views</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={post.coverImageUrl} alt={post.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#1460D6]/10 text-[#1460D6]">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleStatus(post.id)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {post.status === "published" ? "● Published" : "○ Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <button
                      onClick={() => toggleFeatured(post.id)}
                      className={`text-lg transition-transform hover:scale-110 ${post.featured ? "opacity-100" : "opacity-30"}`}
                    >
                      ★
                    </button>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-gray-500">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/blog/${post.slug}`} target="_blank"
                        className="text-gray-400 hover:text-[#1460D6] transition-colors text-xs px-2 py-1">
                        View
                      </a>
                      <button
                        onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                        className="text-gray-400 hover:text-[#1460D6] transition-colors text-xs px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        disabled={deleting === post.id}
                        className="text-gray-400 hover:text-red-500 transition-colors text-xs px-2 py-1 disabled:opacity-50"
                      >
                        {deleting === post.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-full text-sm ${page === p ? "bg-[#1460D6] text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}