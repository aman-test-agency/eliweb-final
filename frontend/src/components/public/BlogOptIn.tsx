"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function BlogOptIn() {
  const [email, setEmail]   = useState("");
  const [name, setName]     = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/enquiry`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    name || "Blog Subscriber",
          email,
          message: "Blog newsletter opt-in",
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-[0.9rem] p-6 relative overflow-hidden border border-[#1460D6]/20"
      style={{ background: "linear-gradient(135deg, rgba(20,96,214,0.08) 0%, rgba(0,212,166,0.08) 100%)" }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#00D4A6]/10 -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="text-3xl mb-3">✉️</div>
        <h3 className="font-bold font-[Syne] text-gray-900 dark:text-white text-lg mb-1">
          Get our latest articles
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          No spam — only insights on web design, development & growth.
        </p>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-[#00D4A6] font-semibold">You're in!</p>
            <p className="text-xs text-gray-400 mt-1">Check your inbox for a confirmation.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Your name (optional)"
              className="px-3 py-2 rounded-[0.9rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="your@email.com"
              className="px-3 py-2 rounded-[0.9rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1460D6]"
            />
            <button
              onClick={submit}
              disabled={status === "loading"}
              className="bg-[#1460D6] text-white text-sm font-semibold py-2.5 rounded-[0.9rem] hover:bg-blue-700 transition-colors disabled:opacity-60 mt-1"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe →"}
            </button>
            {status === "error" && (
              <p className="text-red-500 text-xs text-center">Something went wrong. Try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}