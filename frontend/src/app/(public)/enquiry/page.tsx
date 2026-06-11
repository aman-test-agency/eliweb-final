import type { Metadata } from "next";

import { ClientEnquiryForm } from "@/components/public/ClientEnquiryForm";
import { PageHero } from "@/components/public/Section";

export const metadata: Metadata = {
  title: "Enquire Now",
  description:
    "Tell us about your project and we'll get back to you within 24 hours.",
  openGraph: {
    title: "Enquire Now | EliWeb.in",
    url: "https://eliweb.in/enquiry",
  },
};

export default function EnquiryPage() {
  return (
    <>
      <PageHero
        title="Enquire Now"
        subtitle="Tell us about your project and we'll get back to you within 24 hours."
        breadcrumb="Enquiry"
      />
      <section className="section-shell py-16">
        <div className="mx-auto max-w-2xl">
          <ClientEnquiryForm />
        </div>
      </section>
    </>
  );
}
