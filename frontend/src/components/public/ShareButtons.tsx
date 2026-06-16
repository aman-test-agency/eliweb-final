"use client";

export default function ShareButtons({ title }: { title: string }) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  const share = (platform: string) => {
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/917973851691?text=${encodeURIComponent(title + " " + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    };
    window.open(urls[platform], "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="text-sm text-gray-500 font-medium">Share:</span>
      <button onClick={() => share("whatsapp")}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-sm hover:bg-green-600 transition-colors">
        WhatsApp
      </button>
      <button onClick={() => share("linkedin")}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A66C2] text-white text-sm hover:bg-blue-700 transition-colors">
        LinkedIn
      </button>
      <button onClick={() => share("twitter")}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition-colors">
        Twitter / X
      </button>
      <button onClick={copyLink}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm hover:border-[#1460D6] transition-colors">
        Copy Link
      </button>
    </div>
  );
}