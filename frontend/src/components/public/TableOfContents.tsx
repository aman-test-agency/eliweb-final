"use client";
import { useEffect, useState } from "react";

interface Heading { id: string; text: string; level: number; }

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive]     = useState("");

  useEffect(() => {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(content, "text/html");
    const nodes  = doc.querySelectorAll("h2, h3");
    setHeadings(
      Array.from(nodes).map((n) => ({
        id:    n.textContent!.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        text:  n.textContent!,
        level: parseInt(n.tagName[1]),
      }))
    );
  }, [content]);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "0px 0px -60% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="rounded-[0.9rem] border border-gray-100 dark:border-gray-800 p-5">
      <h3 className="font-bold font-[Syne] text-xs text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
        Contents
      </h3>
      <ul className="flex flex-col gap-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block text-sm py-0.5 transition-colors ${h.level === 3 ? "pl-3" : ""} ${
                active === h.id
                  ? "text-[#1460D6] font-medium"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#1460D6]"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}