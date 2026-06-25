import type { Metadata } from "next";
import { HomePageContent } from "@/components/public/HomePageContent";
import { PageError } from "@/components/public/PageError";
import { apiGet } from "@/lib/api";
import type {
  Faq,
  HeroContent,
  Project,
  Service,
  Stat,
  TechTool,
  Testimonial,
} from "@/lib/types";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://eliweb.in",
  },
};

export default async function HomePage() {
  const [hero, services, stats, projects, testimonials, faqs, techTools] = await Promise.all([
    apiGet<HeroContent>("/api/hero"),
    apiGet<Service[]>("/api/services"),
    apiGet<Stat[]>("/api/stats"),
    apiGet<Project[]>("/api/projects?homepage=true"),
    apiGet<Testimonial[]>("/api/testimonials"),
    apiGet<Faq[]>("/api/faqs?page=homepage"),
    apiGet<TechTool[]>("/api/tech-tools"),
  ]);

  if (!hero) {
    return (
      <PageError message="Unable to load content. Please try again later." />
    );
  }

  return (
    <HomePageContent
      hero={hero}
      services={services ?? []}
      stats={stats ?? []}
      projects={projects ?? []}
      testimonials={testimonials ?? []}
      faqs={faqs ?? []}
      techTools={techTools ?? []}
    />
  );
}
