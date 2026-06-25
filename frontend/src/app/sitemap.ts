import type { MetadataRoute } from "next";

export const revalidate = 3600; // Revalidate sitemap every hour

const API = process.env.NEXT_PUBLIC_API_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://eliweb.in",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://eliweb.in/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://eliweb.in/services",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://eliweb.in/portfolio",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://eliweb.in/contact",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: "https://eliweb.in/enquiry",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: "https://eliweb.in/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Fetch all published blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  if (API) {
    try {
      const res  = await fetch(`${API}/api/blog?limit=1000&page=1`, { 
        cache: "no-store",
        signal: AbortSignal.timeout(15000), // 15s timeout
      });
      const json = await res.json();
      if (json.success && json.data.posts) {
        blogPages = json.data.posts.map((post: any) => ({
          url:             `https://eliweb.in/blog/${post.slug}`,
          lastModified:    new Date(post.updatedAt || post.publishedAt || new Date()),
          changeFrequency: "weekly" as const,
          priority:        0.8,
        }));
      }
    } catch (error) {
      console.error("Sitemap: failed to fetch blog posts", error);
    }
  }

  return [...staticPages, ...blogPages];
}