"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ClientContactForm } from "@/components/eliweb/ClientContactForm";
import { PageHero } from "@/components/eliweb/Section";
import type { Faq, SiteSettings } from "@/lib/types";
import { Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  settings: SiteSettings;
  faqs: Faq[];
};

export function ContactPageContent({ settings, faqs }: Props) {
  const social = [
    { Icon: Instagram, href: settings.instagram_url },
    { Icon: Linkedin, href: settings.linkedin_url },
    { Icon: Youtube, href: settings.youtube_url },
  ];

  return (
    <>
      <PageHero
        title="Let's Build Something Together"
        subtitle="Fill in the form or reach out directly — we respond within 24 hours."
      />
      <section className="section-shell grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 md:p-9" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-15"
          />
          <div className="relative">
            <p className="eyebrow mb-5">Contact info</p>
            <div className="grid gap-5 text-muted-foreground">
              <Info icon={Mail} text={settings.hello_email ?? settings.email} />
              <Info icon={MessageCircle} text="Chat Now on WhatsApp" accent />
              <Info icon={MapPin} text={settings.location} />
              <Info icon={Phone} text={settings.response_time} />
            </div>
            <div className="mt-8 flex gap-3">
              {social.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-border bg-surface transition hover:scale-105"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </aside>
        <ClientContactForm />
      </section>
      <section className="section-shell py-16">
        <h2 className="text-center font-heading text-4xl font-extrabold">FAQ</h2>
        <Accordion type="single" collapsible className="mx-auto mt-8 max-w-3xl rounded-3xl border border-border bg-card p-4">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left font-heading text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <section className="section-shell py-16" data-reveal>
        <div className="grid min-h-72 place-items-center rounded-[2rem] border border-border bg-soft-mesh">
          <div className="text-center">
            <MapPin className="mx-auto mb-4 size-8 text-primary" />
            <h2 className="font-heading text-3xl font-extrabold">Remote-first across India</h2>
            <p className="mt-2 text-muted-foreground">Available for global collaborations.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function Info({ icon: Icon, text, accent }: { icon: LucideIcon; text: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid size-10 place-items-center rounded-full ${accent ? "bg-whatsapp text-primary-foreground" : "bg-surface text-primary"}`}
      >
        <Icon className="size-4" />
      </span>
      <span>{text}</span>
    </div>
  );
}
