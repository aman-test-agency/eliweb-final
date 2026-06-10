import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)} data-reveal>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="font-heading text-3xl font-extrabold leading-tight md:text-5xl text-gradient">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{subtitle}</p>
      )}
    </div>
  );
}

export function PageHero({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle: string;
  breadcrumb?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44">
      <div className="absolute inset-0 bg-soft-mesh" />
      <div className="absolute left-1/2 top-28 size-64 -translate-x-1/2 rounded-full bg-brand-gradient opacity-20 blur-3xl mesh-orbit" />
      <div className="section-shell relative text-center" data-reveal>
        {breadcrumb && <p className="eyebrow mb-5">{breadcrumb}</p>}
        <h1 className="mx-auto max-w-4xl font-heading text-5xl font-extrabold leading-tight md:text-7xl text-gradient">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-label text-sm text-primary transition hover:text-accent"
    >
      {children}
      <ArrowRight className="size-4" />
    </Link>
  );
}

export function VisualMockup({
  variant = "web",
  image,
  alt,
}: {
  variant?: "web" | "video" | "team";
  image?: string;
  alt?: string;
}) {
  return (
    <div
      className="gradient-border group relative min-h-[320px] overflow-hidden rounded-3xl border border-border bg-card shadow-card"
      data-reveal="scale"
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={alt ?? `${variant} project preview`}
          width={800}
          height={500}
          loading="lazy"
          className="media-zoom h-full min-h-[320px] w-full object-cover"
        />
      ) : (
        <div className="relative h-full min-h-[320px] p-4">
          <div className="absolute inset-0 bg-soft-mesh opacity-80" />
          <div className="relative h-full rounded-2xl border border-border bg-background/60 p-4 glass-panel">
            <div className="flex gap-2">
              <span className="size-3 rounded-full bg-destructive" />
              <span className="size-3 rounded-full bg-chart-5" />
              <span className="size-3 rounded-full bg-whatsapp" />
            </div>
            {variant === "video" ? (
              <VideoVisual />
            ) : variant === "team" ? (
              <TeamVisual />
            ) : (
              <WebVisual />
            )}
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
    </div>
  );
}

function WebVisual() {
  return (
    <div className="mt-8 grid gap-4">
      <div className="h-24 rounded-2xl bg-brand-gradient opacity-90" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-24 rounded-2xl bg-surface" />
        <div className="h-24 rounded-2xl bg-surface" />
        <div className="h-24 rounded-2xl bg-surface" />
      </div>
      <div className="h-12 rounded-full border border-border bg-card" />
    </div>
  );
}
function VideoVisual() {
  return (
    <div className="mt-8 grid grid-cols-[.8fr_1.2fr] gap-4">
      <div className="h-56 rounded-3xl bg-brand-gradient shadow-cyan" />
      <div className="grid gap-3">
        <div className="h-14 rounded-2xl bg-surface" />
        <div className="h-20 rounded-2xl bg-card" />
        <div className="h-24 rounded-2xl border border-primary/40 bg-surface" />
      </div>
    </div>
  );
}
function TeamVisual() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <div className="h-52 rounded-[2rem] bg-brand-gradient opacity-90" />
      <div className="mt-10 h-52 rounded-[2rem] border border-border bg-surface" />
    </div>
  );
}
