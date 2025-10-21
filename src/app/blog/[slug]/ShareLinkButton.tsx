"use client";

import { useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ShareLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (typeof window === "undefined") return;

    const url = `${window.location.origin}${basePath}/blog/${slug}`;
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        window.prompt("Copy blog link", url);
      }
    } else {
      window.prompt("Copy blog link", url);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full border border-neutral-200/60 px-3 py-1 text-xs font-semibold tracking-[0.18em] transition hover:-translate-y-0.5 hover:shadow dark:border-neutral-800"
    >
      {copied ? "Link copied!" : "Share"}
      <span aria-hidden>↗</span>
    </button>
  );
}
