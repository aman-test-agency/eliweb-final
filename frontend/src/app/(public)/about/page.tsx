import type { Metadata } from "next";

import { AboutPageContent } from "@/components/public/AboutPageContent";
import { apiGet } from "@/lib/api";
import type { AboutContent, TeamMember, Value } from "@/lib/types";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about EliWeb.in — our story, mission, vision, and the passionate team behind India's leading digital agency.",
  openGraph: {
    title: "About EliWeb.in",
    url: "https://eliweb.in/about",
  },
};

export default async function AboutPage() {
  const [about, team, values] = await Promise.all([
    apiGet<AboutContent>("/api/about"),
    apiGet<TeamMember[]>("/api/team"),
    apiGet<Value[]>("/api/values"),
  ]);

  return <AboutPageContent about={about} team={team} values={values} />;
}
