// "use client";

// import Link from "next/link";
// import {
//   ArrowRight,
//   Instagram,
//   Linkedin,
//   Menu,
//   Moon,
//   Sun,
//   X,
//   Youtube,
// } from "lucide-react";
// import { usePathname } from "next/navigation";
// import { useEffect, useRef, useState } from "react";

// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import type { FooterLink, SiteSettings } from "@/lib/types";

// const logoUrl = "/eliweb-logo.png";

// const navItems = [
//   { label: "Home", href: "/" },
//   { label: "Services", href: "/services" },
//   { label: "Portfolio", href: "/portfolio" },
//   { label: "About", href: "/about" },
//   { label: "Contact", href: "/contact" },
// ] as const;

// export function BrandMark({ className }: { className?: string }) {
//   return (
//     <Link href="/" className={cn("group inline-flex items-center gap-2", className)}>
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         src={logoUrl}
//         alt="EliWeb logo"
//         className="size-10 object-contain transition-transform group-hover:scale-105"
//       />
//       <span className="font-glow text-2xl text-gradient-teal">EliWeb.in</span>
//     </Link>
//   );
// }

// function useTheme() {
//   const [dark, setDark] = useState(true);
//   useEffect(() => {
//     const stored = window.localStorage.getItem("eliweb-theme");
//     const shouldDark = stored ? stored === "dark" : true;
//     setDark(shouldDark);
//     document.documentElement.classList.toggle("dark", shouldDark);
//   }, []);
//   const toggleTheme = () => {
//     setDark((prev) => {
//       const next = !prev;
//       document.documentElement.classList.toggle("dark", next);
//       window.localStorage.setItem("eliweb-theme", next ? "dark" : "light");
//       return next;
//     });
//   };
//   return { dark, toggleTheme };
// }

// export function SiteHeader() {
//   const [open, setOpen] = useState(false);
//   const { dark, toggleTheme } = useTheme();

//   return (
//     <>
//       <header className="fixed inset-x-0 top-0 z-50 hidden items-center justify-between gap-4 px-6 pt-5 lg:flex animate-[reveal-nav_500ms_ease_both]">
//         <Link
//           href="/"
//           aria-label="Home"
//           className="group flex shrink-0 items-center transition-all duration-200 hover:opacity-90"
//         >
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={logoUrl}
//             alt="EliWeb logo"
//             className="size-12 object-contain transition-transform duration-200 group-hover:scale-110"
//           />
//         </Link>

//         <div className="pill-navbar flex items-center gap-1 rounded-full border border-border/40 px-2 py-1.5 shadow-navbar">
//           <nav className="flex items-center gap-0.5">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="nav-pill rounded-full px-4 py-2 font-label text-[13px] font-semibold text-gradient transition-all duration-200 hover:bg-foreground/8"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </nav>
//           <Link
//             href="/contact"
//             className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-label text-[13px] font-medium text-primary-foreground transition-all duration-300 hover:opacity-90 hover:scale-[1.03]"
//           >
//             Get a Free Quote
//             <ArrowRight className="size-3.5" />
//           </Link>
//         </div>

//         <LanguageSwitcher />
//       </header>

//       <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-center px-3 pt-3 lg:hidden animate-[reveal-nav_500ms_ease_both]">
//         <div className="pill-navbar flex w-full max-w-md items-center justify-between rounded-full border border-border/40 px-3 py-2 shadow-navbar">
//           <Link href="/" aria-label="Home" className="grid size-10 place-items-center">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img src={logoUrl} alt="EliWeb logo" className="size-full object-contain" />
//           </Link>
//           <span className="font-glow text-base text-gradient-teal">EliWeb.in</span>
//           <div className="flex items-center gap-1">
//             <LanguageSwitcher />
//             <button
//               aria-label="Open menu"
//               onClick={() => setOpen(true)}
//               className="grid size-10 place-items-center rounded-full transition hover:bg-foreground/8"
//             >
//               <Menu className="size-5" />
//             </button>
//           </div>
//         </div>
//       </header>

//       <div
//         className={cn(
//           "fixed inset-0 z-50 bg-background/70 backdrop-blur-sm transition lg:hidden",
//           open ? "opacity-100" : "pointer-events-none opacity-0",
//         )}
//         onClick={() => setOpen(false)}
//       />
//       <aside
//         className={cn(
//           "fixed right-0 top-0 z-50 h-dvh w-[min(88vw,380px)] border-l border-border bg-card p-6 shadow-card transition-transform duration-300 lg:hidden",
//           open ? "translate-x-0" : "translate-x-full",
//         )}
//       >
//         <div className="flex items-center justify-between">
//           <BrandMark />
//           <button
//             aria-label="Close menu"
//             onClick={() => setOpen(false)}
//             className="grid size-10 place-items-center rounded-full border border-border transition hover:scale-[1.04]"
//           >
//             <X className="size-5" />
//           </button>
//         </div>
//         <nav className="mt-10 grid gap-3">
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               onClick={() => setOpen(false)}
//               className="rounded-2xl border border-border bg-surface px-4 py-4 font-heading text-lg font-bold"
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>
//         <div className="mt-8 grid gap-3">
//           <div className="flex justify-center">
//             <LanguageSwitcher />
//           </div>
//           <button
//             onClick={toggleTheme}
//             className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 font-label"
//           >
//             {dark ? <Sun className="size-4" /> : <Moon className="size-4" />} Toggle theme
//           </button>
//           <Button variant="hero" size="xl" asChild>
//             <Link href="/contact" onClick={() => setOpen(false)}>
//               Get a Free Quote <ArrowRight className="size-4" />
//             </Link>
//           </Button>
//         </div>
//       </aside>
//     </>
//   );
// }

// export function SiteFooter({
//   settings,
//   footerLinks,
// }: {
//   settings: SiteSettings;
//   footerLinks: FooterLink[];
// }) {
//   const company = footerLinks.filter((l) => l.column === "company");
//   const services = footerLinks.filter((l) => l.column === "services");
//   const social = [
//     { Icon: Instagram, href: settings.instagram_url },
//     { Icon: Linkedin, href: settings.linkedin_url },
//     { Icon: Youtube, href: settings.youtube_url },
//   ];

//   return (
//     <footer className="mt-24 border-t border-border bg-surface/70" data-reveal>
//       <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(3,1fr)]">
//         <div>
//           <BrandMark />
//           <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
//             {settings.brand_tagline ??
//               "We Build. We Edit. We Elevate. Premium websites and cinematic video content for ambitious brands."}
//           </p>
//           <div className="mt-6 flex gap-3">
//             {social.map(({ Icon, href }, index) => (
//               <a
//                 key={index}
//                 href={href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:scale-105 hover:text-primary"
//               >
//                 <Icon className="size-4" />
//               </a>
//             ))}
//           </div>
//         </div>
//         <FooterColumn title="Company" links={company} />
//         <FooterColumn title="Services" links={services} />
//         <div>
//           <h3 className="font-label text-sm uppercase tracking-[0.14em] text-foreground">Contact</h3>
//           <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
//             <span>{settings.hello_email ?? settings.email}</span>
//             <span>{settings.location}</span>
//             <span>{settings.response_time}</span>
//           </div>
//         </div>
//       </div>
//       <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
//         © {settings.copyright_year ?? "2025"} EliWeb.in — All Rights Reserved
//       </div>
//     </footer>
//   );
// }

// function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
//   return (
//     <div>
//       <h3 className="font-label text-sm uppercase tracking-[0.14em] text-foreground">{title}</h3>
//       <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
//         {links.map((link) => (
//           <Link key={link.id} href={link.url} className="footer-link transition hover:text-primary">
//             {link.label}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// function useRevealOnNavigate(rootRef: React.RefObject<HTMLElement | null>) {
//   const pathname = usePathname();

//   useEffect(() => {
//     let observer: IntersectionObserver | null = null;
//     let mutationObserver: MutationObserver | null = null;
//     let fallbackTimer: number | undefined;
//     let rafId = 0;

//     const revealElement = (element: HTMLElement) => {
//       element.classList.add("is-visible");
//       observer?.unobserve(element);
//     };

//     const isInViewport = (element: HTMLElement) => {
//       const rect = element.getBoundingClientRect();
//       return rect.bottom > 0 && rect.top < window.innerHeight;
//     };

//     const observeNewElements = () => {
//       const root = rootRef.current ?? document.body;
//       const elements = root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");

//       elements.forEach((element) => {
//         if (isInViewport(element)) {
//           revealElement(element);
//           return;
//         }
//         if (element.dataset.revealObserved === "true") return;
//         element.dataset.revealObserved = "true";
//         observer?.observe(element);
//       });
//     };

//     const setup = () => {
//       observer?.disconnect();
//       observer = new IntersectionObserver(
//         (entries) => {
//           entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//               revealElement(entry.target as HTMLElement);
//             }
//           });
//         },
//         { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
//       );

//       observeNewElements();

//       mutationObserver?.disconnect();
//       mutationObserver = new MutationObserver(() => {
//         observeNewElements();
//       });
//       mutationObserver.observe(rootRef.current ?? document.body, {
//         childList: true,
//         subtree: true,
//       });

//       fallbackTimer = window.setTimeout(() => {
//         const root = rootRef.current ?? document.body;
//         root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach(revealElement);
//       }, 800);
//     };

//     rafId = window.requestAnimationFrame(() => {
//       window.requestAnimationFrame(setup);
//     });

//     return () => {
//       window.cancelAnimationFrame(rafId);
//       observer?.disconnect();
//       mutationObserver?.disconnect();
//       if (fallbackTimer) window.clearTimeout(fallbackTimer);
//     };
//   }, [pathname, rootRef]);
// }

// export function RevealShell({ children }: { children: React.ReactNode }) {
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (document.getElementById("google-translate-script")) return;
//     (window as Window & { googleTranslateElementInit?: () => void }).googleTranslateElementInit =
//       () => {
//         // @ts-expect-error google global
//         new window.google.translate.TranslateElement(
//           { pageLanguage: "en", autoDisplay: false },
//           "google_translate_element",
//         );
//       };
//     const s = document.createElement("script");
//     s.id = "google-translate-script";
//     s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     s.async = true;
//     document.body.appendChild(s);
//   }, []);

//   useRevealOnNavigate(contentRef);

//   useEffect(() => {
//     const loader = document.querySelector(".page-loader");
//     if (loader) {
//       const t = window.setTimeout(() => loader.classList.add("is-hidden"), 600);
//       return () => window.clearTimeout(t);
//     }
//   }, []);

//   return (
//     <div ref={contentRef} className="min-h-screen overflow-hidden bg-background text-foreground">
//       <div className="page-loader fixed inset-0 z-[10000] grid place-items-center bg-background">
//         <div className="loader-mark font-heading text-4xl font-extrabold text-gradient">
//           EliWeb.in
//         </div>
//       </div>
//       {children}
//     </div>
//   );
// }

// export function FloatingButtons({ whatsappUrl }: { whatsappUrl?: string }) {
//   const { dark, toggleTheme } = useTheme();
//   return (
//     <>
//       <Link
//         href="/enquiry"
//         aria-label="Enquire Now"
//         className="group fixed right-0 top-1/2 z-[999] -translate-y-1/2 px-2.5 py-5 font-label text-xs font-semibold tracking-[0.2em] text-white shadow-lg transition-all duration-300 hover:pr-4"
//         style={{
//           writingMode: "vertical-rl",
//           textOrientation: "mixed",
//           backgroundColor: "#7C3AED",
//           borderRadius: "8px 0 0 8px",
//         }}
//       >
//         ENQUIRE NOW
//       </Link>

//       <a
//         href={whatsappUrl ?? "https://wa.me/917973851691"}
//         target="_blank"
//         rel="noopener noreferrer"
//         aria-label="Chat on WhatsApp"
//         className="group fixed z-[9999] grid place-items-center rounded-full text-white transition-transform duration-200 hover:scale-110 wa-float"
//       >
//         <span className="wa-pulse" aria-hidden="true" />
//         <svg
//           viewBox="0 0 24 24"
//           className="relative size-6 fill-current md:size-7"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
//         </svg>
//         <span className="wa-tooltip pointer-events-none">Chat with us</span>
//       </a>

//       <button
//         type="button"
//         onClick={toggleTheme}
//         aria-label="Toggle theme"
//         className="group z-[9999] grid place-items-center rounded-full transition-transform duration-200 hover:scale-110 theme-float"
//       >
//         {dark ? <Sun className="size-5 md:size-6" /> : <Moon className="size-5 md:size-6" />}
//         <span className="theme-tooltip pointer-events-none">
//           {dark ? "Light mode" : "Dark mode"}
//         </span>
//       </button>
//     </>
//   );
// }

// const LANGUAGES: { code: string; flag: string; label: string }[] = [
//   { code: "en", flag: "gb", label: "English" },
//   { code: "fr", flag: "fr", label: "Français" },
//   { code: "de", flag: "de", label: "Deutsch" },
//   { code: "es", flag: "es", label: "Español" },
//   { code: "pt", flag: "pt", label: "Português" },
//   { code: "it", flag: "it", label: "Italiano" },
//   { code: "pl", flag: "pl", label: "Polski" },
//   { code: "zh-CN", flag: "cn", label: "中文" },
//   { code: "ar", flag: "sa", label: "العربية" },
//   { code: "hi", flag: "in", label: "हिन्दी" },
// ];

// function setGoogleTranslateLang(lang: string) {
//   const host = window.location.hostname;
//   const value = `/en/${lang}`;
//   document.cookie = `googtrans=${value};path=/;`;
//   document.cookie = `googtrans=${value};path=/;domain=${host};`;
//   document.cookie = `googtrans=${value};path=/;domain=.${host};`;
//   window.location.reload();
// }

// function LanguageSwitcher() {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="relative">
//       <div id="google_translate_element" className="hidden" />
//       <button
//         type="button"
//         onClick={() => setOpen((v) => !v)}
//         className="pill-navbar inline-flex items-center gap-2 rounded-full border border-border/40 px-3 py-2 shadow-navbar transition hover:opacity-90"
//         aria-label="Change language"
//       >
//         <span className="fi fi-gb" aria-hidden="true" />
//         <span className="font-label text-[12px] font-semibold text-foreground">EN</span>
//       </button>
//       {open && (
//         <div
//           className="absolute right-0 mt-2 grid w-[240px] grid-cols-2 gap-1 rounded-2xl border border-border bg-card/95 p-2 shadow-card backdrop-blur"
//           onMouseLeave={() => setOpen(false)}
//         >
//           {LANGUAGES.map((l) => (
//             <button
//               key={l.code}
//               type="button"
//               onClick={() => setGoogleTranslateLang(l.code)}
//               title={l.label}
//               className="flex items-center gap-2 rounded-md bg-transparent px-2 py-1.5 transition hover:bg-foreground/8"
//             >
//               <span className={`fi fi-${l.flag}`} aria-hidden="true" />
//               <span className="font-label text-[12px] font-semibold uppercase text-foreground">
//                 {l.code}
//               </span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Instagram,
  Linkedin,
  Menu,
  Moon,
  Sun,
  X,
  Youtube,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FooterLink, SiteSettings } from "@/lib/types";

const logoUrl = "/eliweb-logo.png";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt="EliWeb logo"
        className="size-10 object-contain transition-transform group-hover:scale-105"
      />
      <span className="font-glow text-2xl text-gradient-teal">EliWeb.in</span>
    </Link>
  );
}

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const stored = window.localStorage.getItem("eliweb-theme");
    const shouldDark = stored ? stored === "dark" : true;
    setDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);
  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("eliweb-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggleTheme };
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 hidden items-center justify-between gap-4 px-6 pt-5 lg:flex animate-[reveal-nav_500ms_ease_both]">
        <Link
          href="/"
          aria-label="Home"
          className="group flex shrink-0 items-center transition-all duration-200 hover:opacity-90"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="EliWeb logo"
            className="size-12 object-contain transition-transform duration-200 group-hover:scale-110"
          />
        </Link>

        <div className="pill-navbar flex items-center gap-1 rounded-full border border-border/40 px-2 py-1.5 shadow-navbar">
          <nav className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-pill rounded-full px-4 py-2 font-label text-[13px] font-semibold text-gradient transition-all duration-200 hover:bg-foreground/8"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-label text-[13px] font-medium text-primary-foreground transition-all duration-300 hover:opacity-90 hover:scale-[1.03]"
          >
            Get a Free Quote
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <LanguageSwitcher />
      </header>

      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-center px-3 pt-3 lg:hidden animate-[reveal-nav_500ms_ease_both]">
        <div className="pill-navbar flex w-full max-w-md items-center justify-between rounded-full border border-border/40 px-3 py-2 shadow-navbar">
          <Link href="/" aria-label="Home" className="grid size-10 place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="EliWeb logo" className="size-full object-contain" />
          </Link>
          <span className="font-glow text-base text-gradient-teal">EliWeb.in</span>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full transition hover:bg-foreground/8"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/70 backdrop-blur-sm transition lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-dvh w-[min(88vw,380px)] border-l border-border bg-card p-6 shadow-card transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <BrandMark />
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid size-10 place-items-center rounded-full border border-border transition hover:scale-[1.04]"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="mt-10 grid gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-border bg-surface px-4 py-4 font-heading text-lg font-bold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 grid gap-3">
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 font-label"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />} Toggle theme
          </button>
          <Button variant="hero" size="xl" asChild>
            <Link href="/contact" onClick={() => setOpen(false)}>
              Get a Free Quote <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );
}

export function SiteFooter({
  settings,
  footerLinks,
}: {
  settings: SiteSettings;
  footerLinks: FooterLink[];
}) {
  const company = footerLinks.filter((l) => l.column === "company");
  const services = footerLinks.filter((l) => l.column === "services");
  const social = [
    { Icon: Instagram, href: settings.instagram_url },
    { Icon: Linkedin, href: settings.linkedin_url },
    { Icon: Youtube, href: settings.youtube_url },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-surface/70" data-reveal>
      <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            {settings.brand_tagline ??
              "We Build. We Edit. We Elevate. Premium websites and cinematic video content for ambitious brands."}
          </p>
          <div className="mt-6 flex gap-3">
            {social.map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:scale-105 hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <FooterColumn title="Company" links={company} />
        <FooterColumn title="Services" links={services} />
        <div>
          <h3 className="font-label text-sm uppercase tracking-[0.14em] text-foreground">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <span>{settings.hello_email ?? settings.email}</span>
            <span>{settings.location}</span>
            <span>{settings.response_time}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {settings.copyright_year ?? "2025"} EliWeb.in — All Rights Reserved
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="font-label text-sm uppercase tracking-[0.14em] text-foreground">{title}</h3>
      <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
        {links.map((link) => (
          <Link key={link.id} href={link.url} className="footer-link transition hover:text-primary">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function useRevealOnNavigate(rootRef: React.RefObject<HTMLElement | null>) {
  const pathname = usePathname();

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let fallbackTimer: number | undefined;
    let rafId = 0;

    const revealElement = (element: HTMLElement) => {
      element.classList.add("is-visible");
      observer?.unobserve(element);
    };

    const isInViewport = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const observeNewElements = () => {
      const root = rootRef.current ?? document.body;
      const elements = root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");

      elements.forEach((element) => {
        if (isInViewport(element)) {
          revealElement(element);
          return;
        }
        if (element.dataset.revealObserved === "true") return;
        element.dataset.revealObserved = "true";
        observer?.observe(element);
      });
    };

    const setup = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealElement(entry.target as HTMLElement);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
      );

      observeNewElements();

      mutationObserver?.disconnect();
      mutationObserver = new MutationObserver(() => {
        observeNewElements();
      });
      mutationObserver.observe(rootRef.current ?? document.body, {
        childList: true,
        subtree: true,
      });

      fallbackTimer = window.setTimeout(() => {
        const root = rootRef.current ?? document.body;
        root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach(revealElement);
      }, 800);
    };

    rafId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(setup);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      observer?.disconnect();
      mutationObserver?.disconnect();
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [pathname, rootRef]);
}

export function RevealShell({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;
    (window as Window & { googleTranslateElementInit?: () => void }).googleTranslateElementInit =
      () => {
        // @ts-expect-error google global
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element",
        );
      };
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  useRevealOnNavigate(contentRef);

  useEffect(() => {
    const loader = document.querySelector(".page-loader");
    if (loader) {
      const t = window.setTimeout(() => loader.classList.add("is-hidden"), 600);
      return () => window.clearTimeout(t);
    }
  }, []);

  return (
    <div ref={contentRef} className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="page-loader fixed inset-0 z-[10000] grid place-items-center bg-background">
        <div className="loader-mark font-heading text-4xl font-extrabold text-gradient">
          EliWeb.in
        </div>
      </div>
      {children}
    </div>
  );
}

export function FloatingButtons({ whatsappUrl }: { whatsappUrl?: string }) {
  const { dark, toggleTheme } = useTheme();
  return (
    <>
      <Link
        href="/enquiry"
        aria-label="Enquire Now"
        className="group fixed right-0 top-1/2 z-[999] -translate-y-1/2 px-2.5 py-5 font-label text-xs font-semibold tracking-[0.2em] text-white shadow-lg transition-all duration-300 hover:pr-4"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          backgroundColor: "#7C3AED",
          borderRadius: "8px 0 0 8px",
        }}
      >
        ENQUIRE NOW
      </Link>
<a
      
        href={whatsappUrl ?? "https://wa.me/917973851691"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group fixed z-[9999] grid place-items-center rounded-full text-white transition-transform duration-200 hover:scale-110 wa-float"
      >
        <span className="wa-pulse" aria-hidden="true" />
        <svg
          viewBox="0 0 24 24"
          className="relative size-6 fill-current md:size-7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="wa-tooltip pointer-events-none">Chat with us</span>
      </a>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="group z-[9999] grid place-items-center rounded-full transition-transform duration-200 hover:scale-110 theme-float"
      >
        {dark ? <Sun className="size-5 md:size-6" /> : <Moon className="size-5 md:size-6" />}
        <span className="theme-tooltip pointer-events-none">
          {dark ? "Light mode" : "Dark mode"}
        </span>
      </button>
    </>
  );
}

const LANGUAGES: { code: string; flag: string; label: string }[] = [
  { code: "en", flag: "gb", label: "English" },
  { code: "fr", flag: "fr", label: "Français" },
  { code: "de", flag: "de", label: "Deutsch" },
  { code: "es", flag: "es", label: "Español" },
  { code: "pt", flag: "pt", label: "Português" },
  { code: "it", flag: "it", label: "Italiano" },
  { code: "pl", flag: "pl", label: "Polski" },
  { code: "zh-CN", flag: "cn", label: "中文" },
  { code: "ar", flag: "sa", label: "العربية" },
  { code: "hi", flag: "in", label: "हिन्दी" },
];

function setGoogleTranslateLang(lang: string) {
  const host = window.location.hostname;
  const value = `/en/${lang}`;
  document.cookie = `googtrans=${value};path=/;`;
  document.cookie = `googtrans=${value};path=/;domain=${host};`;
  document.cookie = `googtrans=${value};path=/;domain=.${host};`;
  window.location.reload();
}

// ✅ FIXED LanguageSwitcher
function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(LANGUAGES[0]);

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match) {
      const found = LANGUAGES.find((l) => l.code === match[1]);
      if (found) setCurrent(found);
    }
  }, []);

  const handleSelect = (l: (typeof LANGUAGES)[0]) => {
    setCurrent(l);
    setOpen(false);
    if (l.code === "en") {
      const host = window.location.hostname;
      const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = `googtrans=;path=/;${expires}`;
      document.cookie = `googtrans=;path=/;domain=${host};${expires}`;
      document.cookie = `googtrans=;path=/;domain=.${host};${expires}`;
      window.location.reload();
    } else {
      setGoogleTranslateLang(l.code);
    }
  };

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pill-navbar inline-flex items-center gap-2 rounded-full border border-border/40 px-3 py-2 shadow-navbar transition hover:opacity-90"
        aria-label="Change language"
      >
        <span className={`fi fi-${current.flag}`} aria-hidden="true" />
        <span className="font-label text-[12px] font-semibold text-foreground">
          {current.code.toUpperCase().slice(0, 2)}
        </span>
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 grid w-[240px] grid-cols-2 gap-1 rounded-2xl border border-border bg-card/95 p-2 shadow-card backdrop-blur"
          onMouseLeave={() => setOpen(false)}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelect(l)}
              title={l.label}
              className="flex items-center gap-2 rounded-md bg-transparent px-2 py-1.5 transition hover:bg-foreground/8"
            >
              <span className={`fi fi-${l.flag}`} aria-hidden="true" />
              <span className="font-label text-[12px] font-semibold uppercase text-foreground">
                {l.code.slice(0, 2)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}