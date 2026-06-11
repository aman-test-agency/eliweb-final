import type { Metadata } from "next";

import { ServicesPageContent } from "@/components/public/ServicesPageContent";
import { apiGet } from "@/lib/api";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Web development, app development, SEO, digital marketing, video editing and more — end-to-end digital services by EliWeb.in.",
  openGraph: {
    title: "Services | EliWeb.in",
    url: "https://eliweb.in/services",
  },
};

export default async function ServicesPage() {
  const services = await apiGet<Service[]>("/api/services");
  return <ServicesPageContent services={services ?? []} />;
}
