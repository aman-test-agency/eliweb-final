// "use client";
// import { useEffect, useState, useCallback } from "react";
// import BlogOptIn from "@/components/public/BlogOptIn";

// const API = process.env.NEXT_PUBLIC_API_URL;

// function formatDate(dateStr: string) {
//   if (!dateStr) return "";
//   return new Date(dateStr).toLocaleDateString("en-US", {
//     day: "numeric", month: "short", year: "numeric",
//   });
// }

// export default function BlogPage() {
//   const [posts, setPosts]             = useState<any[]>([]);
//   const [categories, setCategories]   = useState<string[]>([]);
//   const [total, setTotal]             = useState(0);
//   const [totalPages, setTotalPages]   = useState(1);
//   const [page, setPage]               = useState(1);
//   const [search, setSearch]           = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [category, setCategory]       = useState("");
//   const [loading, setLoading]         = useState(true);

//   const fetchPosts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: String(page),
//         limit: "9",
//         ...(search   && { search }),
//         ...(category && { category }),
//       });
//       const res  = await fetch(`${API}/api/blog?${params}`);
//       const json = await res.json();
//       if (json.success) {
//         setPosts(json.data.posts);
//         setTotal(json.data.total);
//         setTotalPages(json.data.totalPages);
//         setCategories(json.data.categories);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, category]);

//   useEffect(() => { fetchPosts(); }, [fetchPosts]);

//   useEffect(() => {
//     const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   const featuredPost = page === 1 && !search && !category ? posts[0] : null;
//   const gridPosts     = featuredPost ? posts.slice(1) : posts;

//   return (
//     <main className="min-h-screen bg-white dark:bg-[#0A0A0A]">
//       <div className="max-w-5xl mx-auto px-5 pt-16 pb-24">

//         {/* Title */}
//         {/* <h1 className="text-2xl font-bold font-[Syne] text-gray-900 dark:text-white mb-8">
//           Blog
//         </h1> */}

//         {/* Search + category filters */}
//         {/* <div className="flex flex-col sm:flex-row gap-3 mb-10">
//           <div className="relative flex-1 sm:max-w-xs">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search articles…"
//               className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]/40"
//             />
//           </div>
//           <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
//             {["", ...categories].map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => { setCategory(cat); setPage(1); }}
//                 className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
//                   category === cat
//                     ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
//                     : "bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"
//                 }`}
//               >
//                 {cat || "All"}
//               </button>
//             ))}
//           </div>
//         </div> */}

//         {loading ? (
//           <div className="flex flex-col gap-10">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-pulse">
//               <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-md" />
//               <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-md" />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="flex gap-4 animate-pulse">
//                   <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-md shrink-0" />
//                   <div className="flex-1 space-y-2 pt-1">
//                     <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
//                     <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
//                     <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : posts.length === 0 ? (
//           <div className="py-20 text-gray-400 text-sm">
//             No posts found. Try a different search or category.
//           </div>
//         ) : (
//           <>
//             {/* Featured post — text left, image right */}
//             {featuredPost && (
//               <a
//                 href={`/blog/${featuredPost.slug}`}
//                 className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-12 mb-16 pb-12 border-b border-gray-100 dark:border-gray-800"
//               >
//                 <div className="order-2 md:order-1">
//                   <span className="text-xs text-gray-400 mb-3 block">Featured</span>
//                   <h2 className="text-3xl font-bold font-[Syne] text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-[#1460D6] transition-colors">
//                     {featuredPost.title}
//                   </h2>
//                   <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
//                     <span>{formatDate(featuredPost.publishedAt)}</span>
//                     <span>·</span>
//                     <span>{featuredPost.category}</span>
//                   </div>
//                   <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 group-hover:border-gray-900 dark:group-hover:border-white transition-colors">
//                     Read blog
//                   </span>
//                 </div>
//                 <div className="order-1 md:order-2 aspect-video rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
//                   <img
//                     src={featuredPost.coverImageUrl}
//                     alt={featuredPost.title}
//                     className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
//                   />
//                 </div>
//               </a>
//             )}

//              <div className="flex flex-col sm:flex-row gap-3 mt-10 mb-10">
//           <div className="relative flex-1 sm:max-w-xs">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search articles…"
//               className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]/40"
//             />
//           </div>
//           <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
//             {["", ...categories].map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => { setCategory(cat); setPage(1); }}
//                 className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
//                   category === cat
//                     ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
//                     : "bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"
//                 }`}
//               >
//                 {cat || "All"}
//               </button>
//             ))}
//           </div>
//         </div>


//             {/* Grid — image left, text right, repeated as rows */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
//               {gridPosts.map((post) => (
//                 <a
//                   key={post.id}
//                   href={`/blog/${post.slug}`}
//                   className="group flex gap-4 items-start"
//                 >
//                   <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
//                     <img
//                       src={post.coverImageUrl}
//                       alt={post.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     />
//                   </div>
//                   <div className="min-w-0 pt-0.5">
//                     <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
//                       <span>{formatDate(post.publishedAt)}</span>
//                       <span>·</span>
//                       <span>{post.category}</span>
//                     </div>
//                     <h3 className="text-base font-semibold font-[Syne] text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-[#1460D6] transition-colors">
//                       {post.title}
//                     </h3>
//                     <span className="text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 inline-block group-hover:border-gray-400 transition-colors">
//                       Read blog
//                     </span>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center gap-2 mt-16">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="px-4 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 disabled:opacity-40"
//             >
//               ← Prev
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//               <button
//                 key={p}
//                 onClick={() => setPage(p)}
//                 className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
//                   page === p
//                     ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
//                     : "border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400"
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="px-4 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 disabled:opacity-40"
//             >
//               Next →
//             </button>
//           </div>
//         )}

//         {/* Opt-in */}
//         <div className="mt-20 max-w-md">
//           <BlogOptIn />
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";
import { useEffect, useState, useCallback } from "react";
import BlogOptIn from "@/components/public/BlogOptIn";

const API = process.env.NEXT_PUBLIC_API_URL;

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function BlogPage() {
  const [posts, setPosts]             = useState<any[]>([]);
  const [categories, setCategories]   = useState<string[]>([]);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory]       = useState("");
  const [loading, setLoading]         = useState(true);

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

  const featuredPost = page === 1 && !search && !category ? posts[0] : null;
  const gridPosts     = featuredPost ? posts.slice(1) : posts;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-5 pt-16 pb-24">

        {/* Featured post — only shown when not loading and exists */}
        {!loading && featuredPost && (
          <a
            href={`/blog/${featuredPost.slug}`}
            className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-12 mb-16 pb-12 border-b border-gray-100 dark:border-gray-800"
          >
            <div className="order-2 md:order-1">
              <span className="text-xs text-gray-400 mb-3 block">Featured</span>
              <h2 className="text-3xl font-bold font-[Syne] text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-[#1460D6] transition-colors">
                {featuredPost.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <span>{formatDate(featuredPost.publishedAt)}</span>
                <span>·</span>
                <span>{featuredPost.category}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 group-hover:border-gray-900 dark:group-hover:border-white transition-colors">
                Read blog
              </span>
            </div>
            <div className="order-1 md:order-2 aspect-video rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={featuredPost.coverImageUrl}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </a>
        )}

        {/* Search + category filters — ALWAYS mounted, never unmounts */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 mb-10">
          <div className="relative flex-1 sm:max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]/40"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {["", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                  category === cat
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                    : "bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"
                }`}
              >
                {cat || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Results area — this can safely swap between loading/empty/grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-md shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-gray-400 text-sm">
            No posts found. Try a different search or category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
            {gridPosts.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 items-start"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>·</span>
                    <span>{post.category}</span>
                  </div>
                  <h3 className="text-base font-semibold font-[Syne] text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-[#1460D6] transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 inline-block group-hover:border-gray-400 transition-colors">
                    Read blog
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-16">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 disabled:opacity-40"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                  page === p
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}

        {/* Opt-in */}
        <div className="mt-20 max-w-md">
          <BlogOptIn />
        </div>
      </div>
    </main>
  );
}