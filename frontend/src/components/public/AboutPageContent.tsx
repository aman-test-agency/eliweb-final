"use client";

import Link from "next/link";
import { ArrowRight, Flame, Handshake, Linkedin, Sparkles, Target, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { PageHero, VisualMockup } from "@/components/public/Section";
import { Button } from "@/components/ui/button";
import type { AboutContent, TeamMember, Value } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Flame,
  Target,
  Zap,
  Handshake,
  Sparkles,
};

type Props = {
  about: AboutContent;
  team: TeamMember[];
  values: Value[];
};

export function AboutPageContent({ about, team, values }: Props) {
  return (
    <>
      <PageHero
        title="About EliWeb.in"
        subtitle="A passionate team of builders and creatives on a mission to elevate brands."
      />
      <section className="section-shell grid items-center gap-10 py-20 lg:grid-cols-2">
        <div data-reveal>
          <p className="eyebrow mb-4">Our story</p>
          <h2 className="font-heading text-4xl font-extrabold md:text-6xl">
            {about.story_heading}
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">{about.story_body}</p>
        </div>
        <VisualMockup
          variant="team"
          image={about.story_image ?? "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"}
          alt="EliWeb.in team"
        />
      </section>
      <section className="section-shell grid gap-5 py-12 md:grid-cols-2">
        {[
          [Target, "Our Mission", about.mission],
          [Sparkles, "Our Vision", about.vision],
        ].map(([Icon, title, text], index) => {
          const MissionIcon = Icon as LucideIcon;
          return (
          <div
            key={String(title)}
            className="rounded-3xl border border-border bg-card p-8 card-hover"
            data-reveal="scale"
            style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
          >
            <MissionIcon className="service-icon size-8 text-primary" />
            <h3 className="mt-6 font-heading text-2xl font-bold">{title as string}</h3>
            <p className="mt-3 text-muted-foreground">{text as string}</p>
          </div>
        );})}
      </section>
      <section className="section-shell py-20">
        <div className="text-center">
          <p className="eyebrow mb-4">Team</p>
          <h2 className="font-heading text-4xl font-extrabold">Meet the Minds Behind EliWeb.in</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <div
              key={member.id}
              className="rounded-3xl border border-border bg-card p-5 text-center card-hover"
              data-reveal
              style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.imageUrl}
                alt={member.name}
                className="mx-auto size-28 rounded-3xl object-cover"
              />
              <h3 className="mt-5 font-heading text-xl font-bold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <Linkedin className="mx-auto mt-4 size-4 text-primary" />
            </div>
          ))}
        </div>
      </section>
      <section className="section-shell py-12">
        <div className="grid gap-5 md:grid-cols-4">
          {values.map((value, index) => {
            const Icon = iconMap[value.icon] ?? Sparkles;
            return (
              <div
                key={value.id}
                className="rounded-3xl border border-border bg-surface p-6 text-center card-hover"
                data-reveal="scale"
                style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
              >
                <Icon className="service-icon mx-auto mb-4 size-7 text-accent" />
                <span className="font-heading text-xl font-bold">{value.label}</span>
              </div>
            );
          })}
        </div>
      </section>
      <section className="section-shell py-20">
        <div className="rounded-[2rem] bg-brand-gradient p-10 text-center text-primary-foreground">
          <h2 className="font-heading text-4xl font-extrabold">Want to work with us?</h2>
          <Button className="mt-7" variant="secondary" size="xl" asChild>
            <Link href="/contact">
              Let's Connect <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
