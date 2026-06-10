"use client";

import { ExternalLink, Play, X } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import { PageHero } from "@/components/eliweb/Section";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CaseStudy, Project } from "@/lib/types";

type Props = {
  projects: Project[];
  caseStudy: CaseStudy | null;
};

export function PortfolioPageContent({ projects, caseStudy }: Props) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<Project | null>(null);
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <PageHero
        title="Our Work"
        subtitle="A showcase of websites built and videos crafted for real brands."
      />
      <section className="section-shell py-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-full px-5 py-3 font-label text-sm transition ${
                filter === tab
                  ? "bg-brand-gradient text-primary-foreground shadow-glow"
                  : "border border-border bg-surface text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((project, i) => (
            <button
              key={project.id}
              onClick={() => setActive(project)}
              className="group relative min-h-[340px] overflow-hidden rounded-3xl border border-border bg-card text-left card-hover"
              data-reveal="scale"
              style={{ "--reveal-delay": `${i * 100}ms` } as CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageUrl}
                alt={project.name}
                className="media-zoom absolute inset-0 h-full w-full object-cover"
              />
              <div className="image-overlay absolute inset-x-0 bottom-0 bg-background/85 p-6 backdrop-blur">
                <h3 className="font-heading text-2xl font-bold">{project.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{project.category}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-label text-sm text-primary">
                  View Project <ExternalLink className="size-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {caseStudy ? (
        <section className="section-shell py-20">
          <div className="gradient-border rounded-[2rem] border border-border bg-card p-8 md:p-12">
            <p className="eyebrow mb-4">Case Study</p>
            <h2 className="font-heading text-3xl font-extrabold md:text-5xl">{caseStudy.title}</h2>
            <p className="mt-4 max-w-3xl text-muted-foreground">{caseStudy.description}</p>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">{caseStudy.results}</p>
          </div>
        </section>
      ) : null}

      <Dialog open={!!active} onOpenChange={() => setActive(null)}>
        <DialogContent className="max-w-3xl rounded-3xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-3xl">{active?.name}</DialogTitle>
            <DialogDescription>{active?.category}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative min-h-64 overflow-hidden rounded-3xl">
              {active ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.imageUrl}
                  alt={active.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 grid place-items-center bg-background/30">
                <Play className="size-14 text-primary-foreground" />
              </div>
            </div>
            <div>
              <p className="leading-7 text-muted-foreground">{active?.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {active?.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <Button className="mt-8" variant="hero">
                View Project <ExternalLink className="size-4" />
              </Button>
            </div>
          </div>
          <button aria-label="Close" onClick={() => setActive(null)} className="absolute right-4 top-4">
            <X className="size-4" />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
