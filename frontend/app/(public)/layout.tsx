import {
  FloatingButtons,
  RevealShell,
  SiteFooter,
  SiteHeader,
} from "@/components/eliweb/Layout";

export const dynamic = "force-dynamic";
import { apiGet } from "@/lib/api";
import type { FooterLink, SiteSettings } from "@/lib/types";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, footerLinks] = await Promise.all([
    apiGet<SiteSettings>("/api/settings"),
    apiGet<FooterLink[]>("/api/footer"),
  ]);

  return (
    <RevealShell>
      <SiteHeader />
      <div className="animate-[reveal-up_300ms_ease_both]">{children}</div>
      <SiteFooter settings={settings} footerLinks={footerLinks} />
      <FloatingButtons whatsappUrl={settings.whatsapp_url} />
    </RevealShell>
  );
}
