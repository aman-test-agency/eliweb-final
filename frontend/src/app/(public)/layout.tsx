import {
  FloatingButtons,
  RevealShell,
  SiteFooter,
  SiteHeader,
} from "@/components/public/Layout";

export const dynamic = "force-dynamic";
import BackendDownBanner from "@/components/BackendDownBanner";
import { apiGet } from "@/lib/api";
import type { FooterLink, SiteSettings } from "@/lib/types";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, footerLinks] = await Promise.all([
    apiGet<SiteSettings>("/api/settings"),
    apiGet<FooterLink[]>("/api/footer"),
  ]);

  const backendDown = settings === null || footerLinks === null;

  return (
    <RevealShell>
      {backendDown ? <BackendDownBanner /> : null}
      <SiteHeader />
      <div className="animate-[reveal-up_300ms_ease_both]">{children}</div>
      <SiteFooter settings={settings ?? {}} footerLinks={footerLinks ?? []} />
      <FloatingButtons whatsappUrl={settings?.whatsapp_url} />
    </RevealShell>
  );
}
