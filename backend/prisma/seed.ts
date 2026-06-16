import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.blogPost.deleteMany(); 
  await prisma.contactSubmission.deleteMany();
  await prisma.enquirySubmission.deleteMany();
  await prisma.footerLink.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.value.deleteMany();
  await prisma.aboutContent.deleteMany();
  await prisma.techTool.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.heroContent.deleteMany();
  await prisma.adminUser.deleteMany();

  const hashedPassword = await bcrypt.hash("eliweb@admin2024", 10);

  await prisma.adminUser.create({
    data: {
      email: "admin@eliweb.in",
      password: hashedPassword,
    },
  });

  await prisma.heroContent.create({
    data: {
      headline: "We Build Websites. / We Craft Videos. / We Grow Brands.",
      subtitle:
        "EliWeb.in is your end-to-end digital partner — building powerful software products and growing your brand with data-driven digital marketing.",
      cta1Label: "Start Your Project",
      cta1Url: "/contact",
      cta2Label: "Watch Our Projects",
      cta2Url: "/portfolio",
      trustPills: [
        "50+ Projects Delivered",
        "100% Client Satisfaction",
        "5★ Rated Agency",
      ],
      tickerItems: [
        "Software Development",
        "Digital Marketing",
        "Web & App Development",
        "Brand Building",
        "SEO & Search Visibility",
        "Paid Ads & Promotion",
        "Content Strategy",
      ],
    },
  });

  await prisma.service.createMany({
    data: [
      {
        title: "Software Development",
        description:
          "We build powerful, scalable digital products — from stunning websites to full-featured web and mobile apps. Our team works across modern technologies to deliver solutions tailored to your business needs.",
        category: "software",
        imageUrl:
          "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
        tags: [
          "Web Development",
          "App Development",
          "Next.js",
          "WordPress",
          "Shopify",
          "API Integration",
        ],
        items: [
          "Web Development",
          "App Development",
          "Node.js & Next.js",
          "WordPress & Webflow",
          "Shopify & eCommerce",
          "API Integration",
          "Backend Systems",
        ],
        steps: ["Discovery", "Design", "Develop", "Test", "Launch"],
        ctaLabel: "Start Your Software Project",
        order: 0,
      },
      {
        title: "Digital Marketing",
        description:
          "Grow your brand online with data-driven strategies that get real results. We manage your entire digital presence — from social media to search visibility — so you can focus on running your business.",
        category: "marketing",
        imageUrl:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
        tags: [
          "Social Media",
          "Brand Building",
          "Paid Ads",
          "SEO",
          "Content Strategy",
          "Email Marketing",
        ],
        items: [
          "Social Media Management",
          "Brand Building",
          "Online Promotion & Paid Ads",
          "SEO & Search Visibility",
          "Content Strategy & Creation",
          "Email Marketing Campaigns",
        ],
        steps: ["Audit", "Strategy", "Execute", "Optimize", "Report"],
        ctaLabel: "Start Growing Your Brand",
        order: 1,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        name: "Analytics Dashboard",
        category: "Web Projects",
        tags: ["E-Commerce", "React"],
        description:
          "A premium storefront redesigned for faster browsing and stronger conversion.",
        imageUrl:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80",
        featured: true,
        homepageTeaser: true,
        order: 0,
      },
      {
        name: "Developer Portfolio",
        category: "Web Projects",
        tags: ["Personal Brand", "Code"],
        description:
          "A sharp developer portfolio designed around clarity, credibility, and speed.",
        imageUrl:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=80",
        featured: false,
        homepageTeaser: false,
        order: 1,
      },
      {
        name: "Brand Story Film",
        category: "Video Projects",
        tags: ["Brand Video", "Story"],
        description:
          "A cinematic brand film structured for emotion, trust, and audience retention.",
        imageUrl:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=700&q=80",
        featured: true,
        homepageTeaser: true,
        order: 2,
      },
      {
        name: "SaaS Landing Page",
        category: "Web Projects",
        tags: ["Web App", "SaaS"],
        description:
          "Conversion-first SaaS landing page with crisp storytelling and fast load times.",
        imageUrl:
          "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&q=80",
        featured: false,
        homepageTeaser: false,
        order: 3,
      },
      {
        name: "Product Launch Reel",
        category: "Video Projects",
        tags: ["Instagram Reel", "Launch"],
        description:
          "High-impact launch cuts optimized for paid social and audience retention.",
        imageUrl:
          "https://images.unsplash.com/photo-1536240478700-b869ad10e2ab?w=700&q=80",
        featured: false,
        homepageTeaser: false,
        order: 4,
      },
      {
        name: "Restaurant Website",
        category: "Web Projects",
        tags: ["Business Site", "UI/UX"],
        description:
          "A warm, polished business site built to drive bookings and local trust.",
        imageUrl:
          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=80",
        featured: true,
        homepageTeaser: true,
        order: 5,
      },
    ],
  });

  await prisma.caseStudy.create({
    data: {
      title: "Nova Commerce",
      description:
        "Nova Commerce needed a high-converting ecommerce platform to scale their D2C brand across India. We rebuilt their storefront with a modern stack, optimized checkout flow, and mobile-first UX designed to turn browsers into buyers.",
      results:
        "340% increase in online revenue within 90 days of launch. Average page load dropped to 2.1 seconds. Cart abandonment reduced by 45%. Mobile conversion rate improved by 62% through streamlined checkout and trust signals.",
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    },
  });

  await prisma.testimonial.createMany({
    data: [
      {
        quote:
          "EliWeb.in transformed our landing page — leads doubled in 3 weeks!",
        name: "Ravi S.",
        role: "Founder",
        avatarUrl: "https://i.pravatar.cc/80?img=32",
        order: 0,
      },
      {
        quote: "The reel they edited went viral. Insane quality and speed.",
        name: "Priya M.",
        role: "Content Creator",
        avatarUrl: "https://i.pravatar.cc/80?img=44",
        order: 1,
      },
      {
        quote:
          "Professional, fast, and creative. Best agency decision we made.",
        name: "Amandeep K.",
        role: "E-Commerce Brand Owner",
        avatarUrl: "https://i.pravatar.cc/80?img=15",
        order: 2,
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      {
        question: "What services does EliWeb.in offer?",
        answer:
          "We offer end-to-end digital services: web development (React, Next.js, WordPress, Shopify), mobile app development, UI/UX design, SEO, social media marketing, paid advertising, content strategy, and brand building.",
        page: "homepage",
        order: 0,
      },
      {
        question: "How much does a website cost?",
        answer:
          "Pricing depends on project scope. We serve startups to enterprises with competitive packages. Book a free call for a custom quote.",
        page: "homepage",
        order: 1,
      },
      {
        question: "Do you work with international clients?",
        answer:
          "Yes! While based in India, we work with clients across the US, UK, UAE, Australia, and beyond.",
        page: "homepage",
        order: 2,
      },
      {
        question: "How long does a website take to build?",
        answer:
          "Most projects are delivered in 2–6 weeks. We prioritise speed without sacrificing quality.",
        page: "homepage",
        order: 3,
      },
      {
        question: "How long does a website take?",
        answer:
          "Most projects ship within 2–6 weeks depending on scope, with a clear timeline confirmed before kickoff.",
        page: "contact",
        order: 0,
      },
      {
        question: "What's included in your video editing package?",
        answer:
          "Our video editing packages include concept review, rough cut, colour grading, sound design, motion graphics, and platform-optimised exports for Reels, YouTube, and ads — with two revision rounds included.",
        page: "contact",
        order: 1,
      },
      {
        question: "Do you work with international clients?",
        answer:
          "Yes — we are a remote-first team and work with clients across the world.",
        page: "contact",
        order: 2,
      },
      {
        question: "Can I see samples before starting?",
        answer:
          "Absolutely — see our portfolio for recent web and video work, and request samples relevant to your industry.",
        page: "contact",
        order: 3,
      },
      {
        question: "What are your payment terms?",
        answer:
          "Typically 50% upfront and 50% on delivery; milestone-based billing is available for larger projects.",
        page: "contact",
        order: 4,
      },
    ],
  });

  await prisma.teamMember.createMany({
    data: [
      {
        name: "Arjun Sharma",
        role: "Founder & CEO",
        imageUrl: "https://i.pravatar.cc/200?img=12",
        order: 0,
      },
      {
        name: "Neha Kapoor",
        role: "Creative Director",
        imageUrl: "https://i.pravatar.cc/200?img=25",
        order: 1,
      },
      {
        name: "Vikram Bose",
        role: "Lead Developer",
        imageUrl: "https://i.pravatar.cc/200?img=33",
        order: 2,
      },
    ],
  });

  await prisma.stat.createMany({
    data: [
      { value: "50+", label: "Projects", order: 0 },
      { value: "30+", label: "Clients", order: 1 },
      { value: "3+", label: "Years", order: 2 },
      { value: "100%", label: "Retention", order: 3 },
    ],
  });

  await prisma.techTool.createMany({
    data: [
      {
        name: "Figma",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        order: 0,
      },
      {
        name: "Photoshop",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg",
        order: 1,
      },
      {
        name: "Illustrator",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
        order: 2,
      },
      {
        name: "Canva",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
        order: 3,
      },
      {
        name: "HTML",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        order: 4,
      },
      {
        name: "CSS",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        order: 5,
      },
      {
        name: "JavaScript",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        order: 6,
      },
      {
        name: "React",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        order: 7,
      },
      {
        name: "WordPress",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
        order: 8,
      },
      {
        name: "After Effects",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg",
        order: 9,
      },
    ],
  });

  await prisma.aboutContent.createMany({
    data: [
      {
        key: "mission",
        value: "To empower brands with world-class digital experiences.",
      },
      {
        key: "vision",
        value: "To be India's most trusted creative agency for web and video.",
      },
      {
        key: "story_heading",
        value: "Born From Passion. Built for Performance.",
      },
      {
        key: "story_body",
        value:
          "EliWeb.in started with a simple belief — that every business, big or small, deserves a powerful digital presence. We're a team of designers, developers, and video editors obsessed with craft, strategy, and results.",
      },
    ],
  });

  await prisma.value.createMany({
    data: [
      { icon: "Flame", label: "Passion", order: 0 },
      { icon: "Target", label: "Precision", order: 1 },
      { icon: "Zap", label: "Speed", order: 2 },
      { icon: "Handshake", label: "Transparency", order: 3 },
    ],
  });

  await prisma.siteSettings.createMany({
    data: [
      { key: "email", value: "eliweb.in@gmail.com" },
      { key: "hello_email", value: "hello@eliweb.in" },
      { key: "phone", value: "+91 79 7385 1691" },
      { key: "whatsapp_url", value: "https://wa.me/917973851691" },
      { key: "location", value: "India (Remote-First)" },
      { key: "response_time", value: "Reply within 24 hours" },
      {
        key: "instagram_url",
        value: "https://www.instagram.com/eliwebin",
      },
      {
        key: "linkedin_url",
        value: "https://www.linkedin.com/company/eliwebin",
      },
      {
        key: "youtube_url",
        value: "https://www.youtube.com/@eliwebin",
      },
      {
        key: "brand_tagline",
        value:
          "We Build. We Edit. We Elevate. Premium websites and cinematic video content for ambitious brands.",
      },
      { key: "copyright_year", value: "2025" },
    ],
  });

  await prisma.footerLink.createMany({
    data: [
      { column: "company", label: "About", url: "/about", order: 0 },
      { column: "company", label: "Portfolio", url: "/portfolio", order: 1 },
      { column: "company", label: "Contact", url: "/contact", order: 2 },
      {
        column: "services",
        label: "Website Development",
        url: "/services",
        order: 0,
      },
      {
        column: "services",
        label: "Video Editing",
        url: "/services",
        order: 1,
      },
      {
        column: "services",
        label: "UI/UX Design",
        url: "/services",
        order: 2,
      },
    ],
  });
  // ─── Blog Posts ───────────────────────────────────────────
  const blogPosts = [
    {
      title: 'Why Your Business Needs a Custom Website in 2024',
      slug: 'why-your-business-needs-a-custom-website-2024',
      excerpt: 'Template sites hold you back. A custom-built website converts better, loads faster, and scales with you.',
      content: `## The problem with templates\n\nPagebuilders come with hidden costs: you inherit their performance bottlenecks, design limitations, and pricing models.\n\n## What a custom site gives you\n\nEvery line of code serves your users and goals. Core Web Vitals scores climb. Bounce rates fall.\n\n## The ROI case\n\nA one-second improvement in load time increases conversions by up to 7%. The upfront investment pays back quickly.\n\n## How to get started\n\nStart with a discovery workshop. Understand your users, map conversion goals, and audit your current site's weaknesses.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80',
      author: 'EliWeb Team',
      authorAvatar: 'https://i.pravatar.cc/150?img=12',
      category: 'Web Strategy',
      tags: ['custom development', 'business growth', 'web performance'],
      status: 'published',
      featured: true,
      readTime: 6,
      views: 1842,
      metaTitle: 'Why Your Business Needs a Custom Website in 2024 | EliWeb',
      metaDesc: 'Discover why a custom-built website outperforms templates in speed, conversions, and long-term ROI.',
      publishedAt: new Date('2024-02-14T09:00:00Z'),
    },
    {
      title: 'Next.js vs Remix: Which Framework Should You Choose?',
      slug: 'nextjs-vs-remix-which-framework-2024',
      excerpt: 'Both frameworks are excellent — but they make different trade-offs. Here is how we think about the decision.',
      content: `## Two philosophies\n\nNext.js has the larger ecosystem and deeper Vercel integration. Its App Router brings React Server Components to the mainstream.\n\n## Remix strengths\n\nRemix is designed around web fundamentals — forms, HTTP, progressive enhancement. It shines on data-heavy apps with lots of user interaction.\n\n## Our rule of thumb\n\nMarketing sites and e-commerce: Next.js. Data-driven dashboards and complex forms: Remix.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
      author: 'EliWeb Team',
      authorAvatar: 'https://i.pravatar.cc/150?img=33',
      category: 'Development',
      tags: ['Next.js', 'Remix', 'React', 'framework comparison'],
      status: 'published',
      featured: true,
      readTime: 8,
      views: 3210,
      metaTitle: 'Next.js vs Remix: Which Framework to Choose | EliWeb',
      metaDesc: 'A practical comparison of Next.js and Remix to help you pick the right React framework for your next project.',
      publishedAt: new Date('2024-03-05T10:00:00Z'),
    },
    {
      title: 'Core Web Vitals: The Complete Guide for Developers',
      slug: 'core-web-vitals-complete-guide-2024',
      excerpt: 'LCP, CLS, and INP explained clearly — plus the techniques we use on every project to hit green scores.',
      content: `## Why Core Web Vitals matter\n\nGoogle's page experience signals directly influence rankings. A site that scores well is genuinely pleasant to use.\n\n## The three metrics\n\n**LCP** — how quickly main content loads. Target: under 2.5s.\n**CLS** — visual stability. Target: under 0.1.\n**INP** — responsiveness to input. Target: under 200ms.\n\n## The fixes that move the needle\n\n- Use next/image for automatic optimisation\n- Preload the LCP element\n- Defer non-critical JavaScript\n- Use content-visibility: auto on below-the-fold sections`,
      coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      author: 'EliWeb Team',
      authorAvatar: 'https://i.pravatar.cc/150?img=47',
      category: 'Performance',
      tags: ['Core Web Vitals', 'performance', 'SEO', 'LCP', 'CLS', 'INP'],
      status: 'published',
      featured: false,
      readTime: 10,
      views: 5670,
      metaTitle: 'Core Web Vitals 2024: Complete Developer Guide | EliWeb',
      metaDesc: 'Master LCP, CLS, and INP with our complete guide. Techniques we use to hit green scores on every project.',
      publishedAt: new Date('2024-03-22T08:00:00Z'),
    },
    {
      title: 'Designing for Accessibility: More Than a Checkbox',
      slug: 'designing-for-accessibility-more-than-a-checkbox',
      excerpt: 'Accessibility done right improves the experience for every user — not just those with disabilities.',
      content: `## The mindset shift\n\nAccessibility is too often a compliance exercise bolted on at the end. We treat it as a design constraint from the first wireframe.\n\n## Practical patterns we use\n\n- Semantic HTML first — gives keyboard navigation and screen reader support for free\n- Focus indicators styled consistently with the brand\n- Colour contrast ratios checked at every breakpoint\n- Alt text that describes the function of an image\n- Testing with VoiceOver, NVDA, and keyboard-only navigation before every release\n\n## The business case\n\nRoughly 1 in 5 people live with a disability. An inaccessible site turns them away and exposes you to legal risk.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80',
      author: 'EliWeb Team',
      authorAvatar: 'https://i.pravatar.cc/150?img=12',
      category: 'Design',
      tags: ['accessibility', 'WCAG', 'inclusive design', 'UX'],
      status: 'published',
      featured: false,
      readTime: 7,
      views: 2390,
      metaTitle: 'Designing for Accessibility: A Practical Guide | EliWeb',
      metaDesc: 'Build accessible websites that work for everyone — and why it matters for your business, SEO, and users.',
      publishedAt: new Date('2024-04-10T09:30:00Z'),
    },
    {
      title: 'How We Structure Large-Scale React Projects',
      slug: 'how-we-structure-large-scale-react-projects',
      excerpt: "After shipping dozens of React apps, we've settled on a folder structure that keeps codebases maintainable as they grow.",
      content: `## The problem with "just start coding"\n\nSmall React projects are forgiving. At a hundred components, a flat folder becomes a maze.\n\n## Feature-based organisation\n\n\`\`\`\nsrc/\n  features/\n    auth/\n      components/\n      hooks/\n      api.ts\n      index.ts\n    dashboard/\n  shared/\n    components/\n    hooks/\n    utils/\n\`\`\`\n\n## Other conventions we follow\n\n- Co-locate tests with the code they test\n- Custom hooks over bloated components (>150 lines is a signal)\n- Absolute imports via tsconfig paths: \`@/features/auth\``,
      coverImageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
      author: 'EliWeb Team',
      authorAvatar: 'https://i.pravatar.cc/150?img=33',
      category: 'Development',
      tags: ['React', 'project structure', 'best practices', 'TypeScript'],
      status: 'published',
      featured: false,
      readTime: 9,
      views: 4120,
      metaTitle: 'How to Structure Large-Scale React Projects | EliWeb',
      metaDesc: 'Our battle-tested folder structure and conventions for keeping React codebases maintainable as they grow.',
      publishedAt: new Date('2024-05-01T08:00:00Z'),
    },
    {
      title: 'The Hidden Costs of Slow Websites',
      slug: 'hidden-costs-of-slow-websites',
      excerpt: 'Every second of load time costs you users, revenue, and ranking. We break down the numbers and show you the highest-impact fixes.',
      content: `## Speed is a business problem\n\nThe impact of a slow site is concrete and measurable.\n\n## What the data says\n\n- A 1-second delay reduces conversions by 7%\n- 53% of mobile users abandon sites that take over 3 seconds to load\n- Google's algorithm incorporates Core Web Vitals\n\n## Where the time goes\n\n1. Unoptimised images — convert to WebP/AVIF, lazy-load below the fold\n2. Too much JavaScript — code-split and defer non-critical scripts\n3. No CDN — serving from a single origin adds latency for distant users\n4. Render-blocking resources in the \`<head>\`\n5. Slow hosting with poor TTFB\n\n## The 80/20\n\nFixing images and bundle size solves 80% of performance problems. Start there.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80',
      author: 'EliWeb Team',
      authorAvatar: 'https://i.pravatar.cc/150?img=47',
      category: 'Performance',
      tags: ['web performance', 'page speed', 'conversion rate', 'business impact'],
      status: 'draft',
      featured: false,
      readTime: 6,
      views: 0,
      metaTitle: 'The Hidden Costs of Slow Websites | EliWeb',
      metaDesc: 'Slow websites cost you users, sales, and rankings. Learn the highest-impact fixes with real data behind them.',
      publishedAt: null,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
  }
  // ─────────────────────────────────────────────────────────

  console.log("Seed completed successfully.");

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
