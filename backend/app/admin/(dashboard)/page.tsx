import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";

import { adminNavSections } from "@/components/admin/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [
    serviceCount,
    projectCount,
    caseStudyCount,
    testimonialCount,
    faqCount,
    teamCount,
    statCount,
    techToolCount,
    valueCount,
    footerCount,
    contactUnread,
    enquiryUnread,
    submissions,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.project.count(),
    prisma.caseStudy.count(),
    prisma.testimonial.count(),
    prisma.faq.count(),
    prisma.teamMember.count(),
    prisma.stat.count(),
    prisma.techTool.count(),
    prisma.value.count(),
    prisma.footerLink.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.enquirySubmission.count({ where: { read: false } }),
    prisma.$transaction([
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.enquirySubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]),
  ]);

  const [contacts, enquiries] = submissions;
  const unreadTotal = contactUnread + enquiryUnread;
  const recent = [
    ...contacts.map((s) => ({ ...s, type: "contact" as const })),
    ...enquiries.map((s) => ({ ...s, type: "enquiry" as const })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const counts: Record<string, number> = {
    "/admin/services": serviceCount,
    "/admin/projects": projectCount,
    "/admin/case-studies": caseStudyCount,
    "/admin/testimonials": testimonialCount,
    "/admin/faqs": faqCount,
    "/admin/team": teamCount,
    "/admin/stats": statCount,
    "/admin/tech-tools": techToolCount,
    "/admin/about": valueCount,
    "/admin/footer": footerCount,
    "/admin/submissions": contactUnread + enquiryUnread + contacts.length + enquiries.length,
  };

  const contentSections = adminNavSections.filter(
    (s) => s.label && s.label !== "Inbox",
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage everything visitors see on EliWeb.in. Pick a section below to edit content.
        </p>
      </div>

      {unreadTotal > 0 ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Inbox className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {unreadTotal} unread submission{unreadTotal === 1 ? "" : "s"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contactUnread} contact · {enquiryUnread} enquiry
                </p>
              </div>
            </div>
            <Link
              href="/admin/submissions"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View inbox
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {contentSections.map((section) => (
        <div key={section.label}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {section.label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => {
              const Icon = item.icon;
              const count = counts[item.href];
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-base">{item.title}</CardTitle>
                        </div>
                        {count !== undefined ? (
                          <Badge variant="secondary">{count}</Badge>
                        ) : null}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Manage
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Submissions</CardTitle>
          <CardDescription>Latest messages from contact and enquiry forms</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">{item.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.type}</Badge>
                    {!item.read ? <Badge>New</Badge> : null}
                    <span className="text-xs text-muted-foreground">
                      {item.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
