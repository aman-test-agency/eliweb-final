"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Clapperboard,
  Globe2,
  Handshake,
  Lightbulb,
  Megaphone,
  Play,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { SectionHeading, TextLink } from "@/components/eliweb/Section";
import { Button } from "@/components/ui/button";
import type { Faq, HeroContent, Project, Service, Stat, TechTool, Testimonial } from "@/lib/types";

type Props = {
  hero: HeroContent;
  services: Service[];
  stats: Stat[];
  projects: Project[];
  testimonials: Testimonial[];
  faqs: Faq[];
  techTools: TechTool[];
};

export function HomePageContent({
  hero,
  services,
  stats,
  projects,
  testimonials,
  faqs,
  techTools,
}: Props) {
  return (
    <main id="main-content" className="animate-[reveal-up_300ms_ease_both]">
      <HeroSection hero={hero} />
      <TickerSection items={hero.tickerItems} />
      <ServicesSection services={services} />
      <TechStackSection tools={techTools} />
      <WhyChooseSection />
      <StatsSection stats={stats} />
      <PortfolioTeaser projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection faqs={faqs} />
      <CtaBanner />
    </main>
  );
}

function HeroSection({ hero }: { hero: HeroContent }) {
  const lines = hero.headline.split(" / ").map((part) => part.trim().split(" "));
  const particles = Array.from({ length: 28 });

  return (
    <section
      aria-label="EliWeb.in — Web Development and Digital Marketing Agency India"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="hero-anim-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-glow-a" />
        <div className="hero-glow-b" />
        <div className="hero-orb" />
        <div className="hero-noise" />
        {particles.map((_, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              left: `${(i * 37) % 100}%`,
              animationDuration: `${12 + (i % 8) * 2}s`,
              animationDelay: `${(i % 10) * -1.5}s`,
              opacity: 0.3 + (i % 5) * 0.1,
            } as CSSProperties}
          />
        ))}
      </div>
      <div className="section-shell relative flex flex-col items-center justify-center py-20 text-center">
        <h1 className="grid gap-3 font-belagak text-5xl leading-[1.1] md:text-7xl lg:text-[5.5rem]">
          {lines.map((line, lineIndex) => (
            <span key={lineIndex} className="block">
              {line.map((word, wordIndex) => {
                const index = lineIndex * 3 + wordIndex;
                return (
                  <span
                    key={`${word}-${index}`}
                    className="mr-4 inline-block text-gradient reveal-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
        <p className="mt-7 max-w-2xl text-md leading-6 text-gradient md:text-lg reveal-up mx-auto font-medium">
          {hero.subtitle}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row reveal-up">
          <Button variant="hero" size="xl" asChild>
            <Link href={hero.cta1Url}>{hero.cta1Label}</Link>
          </Button>
          <Button variant="studio" size="xl" asChild>
            <Link href={hero.cta2Url}>
              {hero.cta2Label} <Play className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          {hero.trustPills.map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <Check className="size-4 text-accent" />
              {item}
            </span>
          ))}
        </div>
        <ArrowDown className="mx-auto mt-12 size-6 text-muted-foreground bounce-soft" />
      </div>
    </section>
  );
}

function TickerSection({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden border-y border-border bg-surface py-5" aria-hidden="true">
      <div className="marquee-track flex w-max gap-8">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="font-label text-lg text-gradient">
            ✦ {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServicesSection({ services }: { services: Service[] }) {
  const icons = [Globe2, Megaphone];
  const tones = ["text-primary", "text-accent"];

  return (
    <section className="section-shell py-24" aria-label="Our Services">
      <SectionHeading eyebrow="What We Do" title="Everything You Need to Dominate Online" />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {services.map((service, index) => {
          const Icon = icons[index % icons.length];
          return (
            <article
              key={service.id}
              className="gradient-border card-hover overflow-hidden rounded-3xl border border-border bg-card"
              data-reveal
              style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.imageUrl}
                alt={service.title}
                width={800}
                height={500}
                loading="lazy"
                className="h-64 w-full object-cover"
              />
              <div className="p-7 md:p-9">
                <Icon className={`service-icon size-10 ${tones[index % tones.length]}`} />
                <h2 className="mt-7 font-heading text-3xl font-extrabold">{service.title}</h2>
                <p className="mt-4 leading-7 text-muted-foreground">{service.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <TextLink href="/services">Explore {service.title} →</TextLink>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const features = [
    [Zap, "Lightning Fast Delivery", "We respect your deadlines."],
    [Target, "Conversion-First Design", "Every pixel placed with purpose."],
    [Handshake, "Dedicated Support", "We're with you beyond launch day."],
    [Lightbulb, "Creative + Strategic", "Built to perform, not just pretty."],
  ];
  return (
    <section className="section-shell py-16" aria-label="Why Choose EliWeb.in">
      <SectionHeading title="Why Businesses Choose EliWeb.in" />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {features.map(([Icon, title, desc], index) => (
          <div
            key={String(title)}
            className="rounded-3xl border border-border bg-surface p-6 card-hover"
            data-reveal="scale"
            style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
          >
            <Icon className="service-icon size-7 text-primary" />
            <h3 className="mt-5 font-heading text-xl font-bold">{title as string}</h3>
            <p className="mt-2 text-muted-foreground">{desc as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection({ stats }: { stats: Stat[] }) {
  const values = stats.map((s) => parseInt(s.value.replace(/\D/g, ""), 10) || 0);
  const suffixes = stats.map((s) => (s.value.includes("+") ? "+" : s.value.includes("%") ? "%" : ""));
  const [counts, setCounts] = useState(stats.map(() => 0));
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const animate = (time: number) => {
        const progress = Math.min((time - start) / 2000, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCounts(values.map((value) => Math.round(value * eased)));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      observer.disconnect();
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stats]);

  return (
    <section className="section-shell py-16" aria-label="EliWeb.in by the numbers">
      <div
        ref={ref}
        className="gradient-border grid gap-6 rounded-3xl border border-border bg-card p-8 md:grid-cols-4"
        data-reveal
      >
        {stats.map((stat, index) => (
          <div key={stat.id} className="text-center">
            <div className="font-heading text-4xl font-extrabold text-gradient md:text-5xl">
              {counts[index]}
              {suffixes[index]}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PortfolioTeaser({ projects }: { projects: Project[] }) {
  return (
    <section className="section-shell py-24" aria-label="Portfolio">
      <SectionHeading title="Work That Speaks for Itself" />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {projects.map((project, i) => (
          <Link
            href="/portfolio"
            key={project.id}
            className="group relative min-h-[320px] overflow-hidden rounded-3xl border border-border bg-card card-hover"
            data-reveal="scale"
            style={{ "--reveal-delay": `${i * 100}ms` } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.name}
              className="media-zoom absolute inset-0 h-full w-full object-cover"
            />
            <div className="image-overlay absolute inset-x-0 bottom-0 border-t border-border bg-background/85 p-5 backdrop-blur">
              <h3 className="font-heading text-xl font-bold">{project.name}</h3>
              <p className="text-sm text-muted-foreground">{project.category}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button variant="studio" size="xl" asChild>
          <Link href="/portfolio">
            View All Work <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    const id = window.setInterval(
      () => setActive((v) => (v + 1) % testimonials.length),
      4000,
    );
    return () => window.clearInterval(id);
  }, [paused, testimonials.length]);

  return (
    <section className="section-shell py-16" aria-label="Testimonials">
      <SectionHeading title="What Our Clients Say" />
      <div
        className="mt-12 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        data-reveal
      >
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {testimonials.map((t) => (
            <article key={t.id} className="w-full shrink-0 px-1">
              <div className="h-full rounded-3xl border border-border bg-card p-6 card-hover">
                <div className="flex gap-1 text-chart-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 leading-7">"{t.quote}"</blockquote>
                <footer className="mt-6 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatarUrl} alt={t.name} className="size-12 rounded-full object-cover" />
                  <div>
                    <cite className="font-heading font-bold not-italic">{t.name}</cite>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section-shell py-16" aria-label="FAQ">
      <SectionHeading eyebrow="FAQ" title="Common Questions" />
      <div className="mt-10 mx-auto max-w-3xl divide-y divide-border">
        {faqs.map((faq, i) => (
          <div key={faq.id}>
            <button
              className="flex w-full items-center justify-between gap-4 py-5 text-left font-heading font-bold hover:text-primary"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span>{faq.question}</span>
              <span>{open === i ? "−" : "+"}</span>
            </button>
            {open === i ? (
              <p className="pb-5 text-muted-foreground leading-7">{faq.answer}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="section-shell py-20">
      <div className="rounded-[2rem] bg-brand-gradient p-8 text-center text-primary-foreground shadow-glow md:p-14">
        <Clapperboard className="mx-auto mb-5 size-10" />
        <h2 className="font-heading text-3xl font-extrabold md:text-5xl">
          Ready to Build Something Great?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/85">
          Let's turn your vision into a digital reality.
        </p>
        <Button className="mt-8" variant="secondary" size="xl" asChild>
          <Link href="/contact">
            Book a Free Call <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function TechStackSection({ tools }: { tools: TechTool[] }) {
  const row1 = tools;
  const row2 = [...tools].reverse();
  return (
    <section className="py-20" style={{ background: "var(--surface)" }}>
      <div className="section-shell">
        <SectionHeading
          eyebrow="Our Stack"
          title="Technology & Platforms We Work With"
          subtitle="Industry-leading tools and technologies for every project."
        />
        <div className="mt-14 flex flex-col gap-5">
          <TechRow tools={row1} />
          <TechRow tools={row2} reverse />
        </div>
      </div>
    </section>
  );
}

function TechRow({ tools, reverse = false }: { tools: TechTool[]; reverse?: boolean }) {
  const doubled = [...tools, ...tools];
  return (
    <div className="tech-ticker" aria-hidden="true">
      <div className={`tech-track${reverse ? " reverse" : ""}`}>
        {doubled.map((tool, i) => (
          <div className="tech-card" key={`${tool.id}-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tool.logoUrl} alt={tool.name} loading="lazy" />
            <span>{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
