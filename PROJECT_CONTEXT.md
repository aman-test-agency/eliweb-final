# EliWeb.in — Monorepo Architecture

## Structure
eliweb-dummy/
├── frontend/    ← Next.js 14 public UI
├── backend/     ← Next.js 14 API only
└── PROJECT_CONTEXT.md

## Frontend (port 3000)
- Next.js 14 App Router, TypeScript, Tailwind CSS v3, shadcn/ui
- NO Prisma, NO DB, NO JWT logic
- Fetches all data from backend via NEXT_PUBLIC_API_URL
- Port all pages/components from existing src/ folder

## Backend (port 4000)
- Next.js 14, TypeScript, API routes only (no UI pages)
- Prisma + NeonDB PostgreSQL
- JWT auth with jose + httpOnly cookies
- File uploads → backend/public/uploads/
- Resend for email

## Database
postgresql://neondb_owner:npg_WX82RhkzFUCd@ep-soft-meadow-aortra1e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

## Brand
- Name: EliWeb.in
- Email: eliweb.in@gmail.com / hello@eliweb.in
- Phone: +91 79 7385 1691
- WhatsApp: https://wa.me/917973851691
- Location: India (Remote-First)
- Social: instagram.com/eliwebin, linkedin.com/company/eliwebin, twitter.com/eliwebin

## Design
- Fonts: Outfit, Nunito, Syne
- Light: brand blue #1460D6, accent teal #00D4A6
- Dark: gold #F5C842 on near-black #0A0A0A
- Border radius: 0.9rem

## DB Tables (16)
AdminUser, HeroContent, Service, Project, CaseStudy, Testimonial,
Faq, TeamMember, Stat, TechTool, AboutContent, Value, SiteSettings,
FooterLink, ContactSubmission, EnquirySubmission

## Admin sections (12)
hero, services, projects, testimonials, faqs, team, stats,
tech-tools, about, settings, footer, submissions