import {
  BarChart3,
  Briefcase,
   BookOpen, 
  FileText,
  Footprints,
  HelpCircle,
  Home,
  Inbox,
  Layout,
  MessageSquare,
  Cpu,
  Settings,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const adminNavSections: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: Home,
        description: "Overview of your site content and recent activity",
      },
    ],
  },
  {
    label: "Homepage",
    items: [
      {
        title: "Hero",
        href: "/admin/hero",
        icon: Sparkles,
        description: "Main headline, CTAs, and scrolling ticker on the homepage",
      },
      {
        title: "Stats",
        href: "/admin/stats",
        icon: BarChart3,
        description: "Number highlights shown on the homepage (e.g. 50+ Projects)",
      },
      {
        title: "Tech Tools",
        href: "/admin/tech-tools",
        icon: Cpu,
        description: "Technology logos displayed in the tools section",
      },
      {
        title: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquare,
        description: "Client quotes and reviews on the homepage",
      },
    ],
  },
  {
    label: "Services & Portfolio",
    items: [
      {
        title: "Services",
        href: "/admin/services",
        icon: Wrench,
        description: "Software and marketing service offerings",
      },
      {
        title: "Projects",
        href: "/admin/projects",
        icon: Layout,
        description: "Portfolio projects shown on the portfolio page",
      },
      {
        title: "Case Studies",
        href: "/admin/case-studies",
        icon: Briefcase,
        description: "Detailed case studies on the portfolio page",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Blog",
        href: "/admin/blog",
        icon: BookOpen,
        description: "Write and manage blog posts published on the site",
      },
    ],
  },
  {
    label: "About & Team",
    items: [
      {
        title: "About",
        href: "/admin/about",
        icon: FileText,
        description: "Company story, mission, vision, and core values",
      },
      {
        title: "Team",
        href: "/admin/team",
        icon: Users,
        description: "Team member profiles on the about page",
      },
    ],
  },
  {
    label: "Site Settings",
    items: [
      {
        title: "FAQs",
        href: "/admin/faqs",
        icon: HelpCircle,
        description: "Questions on the homepage and contact page",
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
        description: "Contact info, social links, and brand details",
      },
      {
        title: "Footer",
        href: "/admin/footer",
        icon: Footprints,
        description: "Footer navigation links",
      },
    ],
  },
  {
    label: "Inbox",
    items: [
      {
        title: "Submissions",
        href: "/admin/submissions",
        icon: Inbox,
        description: "Contact form and enquiry messages from visitors",
      },
    ],
  },
];

export const adminNav: NavItem[] = adminNavSections.flatMap((section) => section.items);

export const sectionLinks = adminNav.filter(
  (item) => item.href !== "/admin/dashboard",
);
