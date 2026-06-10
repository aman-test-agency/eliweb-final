import type { Metadata } from "next";

import { ContactPageContent } from "@/components/eliweb/ContactPageContent";
import { apiGet } from "@/lib/api";
import type { Faq, SiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with EliWeb.in. Book a free call, send a message, or chat on WhatsApp.",
};

export default async function ContactPage() {
  const [settings, faqs] = await Promise.all([
    apiGet<SiteSettings>("/api/settings"),
    apiGet<Faq[]>("/api/faqs?page=contact"),
  ]);

  return <ContactPageContent settings={settings} faqs={faqs} />;
}
