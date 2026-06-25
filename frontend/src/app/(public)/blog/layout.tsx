import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the latest insights on web development, SEO, digital marketing, and AI tools from the EliWeb team.",
  alternates: {
    canonical: "https://eliweb.in/blog",
  },
  openGraph: {
    title: "Blog | ELIWEB",
    description:
      "Read the latest insights on web development, SEO, digital marketing, and AI tools from the EliWeb team.",
    url: "https://eliweb.in/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
