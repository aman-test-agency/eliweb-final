import type { Metadata } from "next";

import { PortfolioPageContent } from "@/components/eliweb/PortfolioPageContent";
import { apiGet } from "@/lib/api";
import type { CaseStudy, Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse our work — web projects, video productions, and brand campaigns delivered by EliWeb.in.",
};

export default async function PortfolioPage() {
  const [projects, caseStudies] = await Promise.all([
    apiGet<Project[]>("/api/projects"),
    apiGet<CaseStudy[]>("/api/case-studies"),
  ]);

  return (
    <PortfolioPageContent projects={projects} caseStudy={caseStudies[0] ?? null} />
  );
}
