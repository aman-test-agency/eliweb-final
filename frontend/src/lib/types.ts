export type SiteSettings = Record<string, string>;

export type HeroContent = {
  headline: string;
  subtitle: string;
  cta1Label: string;
  cta1Url: string;
  cta2Label: string;
  cta2Url: string;
  trustPills: string[];
  tickerItems: string[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[];
  items: string[];
  steps: string[];
  ctaLabel: string;
  order: number;
};

export type Project = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  imageUrl: string;
  featured: boolean;
  homepageTeaser: boolean;
  order: number;
};

export type CaseStudy = {
  id: string;
  title: string;
  description: string;
  results: string;
  imageUrl: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  order: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  page: string;
  order: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  order: number;
};

export type Stat = {
  id: string;
  value: string;
  label: string;
  order: number;
};

export type TechTool = {
  id: string;
  name: string;
  logoUrl: string;
  order: number;
};

export type AboutContent = Record<string, string>;

export type Value = {
  id: string;
  icon: string;
  label: string;
  order: number;
};

export type FooterLink = {
  id: string;
  column: string;
  label: string;
  url: string;
  order: number;
};
