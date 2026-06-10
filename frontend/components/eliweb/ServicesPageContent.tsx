"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import { PageHero, VisualMockup } from "@/components/eliweb/Section";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/types";

type Props = { services: Service[] };

export function ServicesPageContent({ services }: Props) {
  const [tab, setTab] = useState<"all" | "software" | "marketing">("all");
  const filtered = useMemo(() => {
    if (tab === "all") return services;
    return services.filter((s) => s.category === tab);
  }, [services, tab]);

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Two core services. Infinite possibilities for your brand."
        breadcrumb="Home > Services"
      />
      <div className="section-shell flex flex-wrap justify-center gap-3 py-8">
        {[
          ["all", "All"],
          ["software", "Software"],
          ["marketing", "Marketing"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`rounded-full px-5 py-3 font-label text-sm transition ${
              tab === key
                ? "bg-brand-gradient text-primary-foreground shadow-glow"
                : "border border-border bg-surface text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {filtered.map((service, index) => (
        <ServiceBlock key={service.id} service={service} reverse={index % 2 === 1} />
      ))}
    </>
  );
}

function ServiceBlock({
  service,
  reverse,
}: {
  service: Service;
  reverse?: boolean;
}) {
  return (
    <section className="section-shell py-20">
      <div
        className={`grid items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        <div data-reveal>
          <p className="eyebrow mb-4">Core Service</p>
          <h2 className="font-heading text-4xl font-extrabold md:text-6xl text-gradient">
            {service.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{service.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {service.items.map((label, index) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-surface p-4 card-hover"
                data-reveal="scale"
                style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
              >
                <span className="font-label text-sm">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {service.steps.map((step, i) => (
              <span
                key={step}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
              >
                {String(i + 1).padStart(2, "0")} {step}
              </span>
            ))}
          </div>
          <Button className="mt-8" variant="hero" size="xl" asChild>
            <Link href="/contact">
              {service.ctaLabel} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <VisualMockup
          variant={service.category === "marketing" ? "video" : "web"}
          image={service.imageUrl}
          alt={service.title}
        />
      </div>
    </section>
  );
}
