import type { NextRequest } from "next/server";

import { json, requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
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
      ...contacts.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        read: s.read,
        createdAt: s.createdAt.toISOString(),
        type: "contact" as const,
      })),
      ...enquiries.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        read: s.read,
        createdAt: s.createdAt.toISOString(),
        type: "enquiry" as const,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
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
      "/admin/submissions":
        contactUnread + enquiryUnread + contacts.length + enquiries.length,
    };

    return json(
      {
        counts,
        unreadTotal,
        contactUnread,
        enquiryUnread,
        recent,
      },
    
    
    );
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
