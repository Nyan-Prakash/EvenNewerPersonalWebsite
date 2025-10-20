"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

// Types
export type BlogPost = {
  id: number;
  title: string;
  date: string; // ISO string: YYYY-MM-DD
  content: string; // plain text or short HTML
};

// Demo data — replace with your real data source
const posts: BlogPost[] = [
  {
    id: 1,
    title: "Welcome to My Blog",
    date: "2024-06-10",
    content:
      "This is the first post on my personal blog. Stay tuned for more updates!",
  }
];

// Utilities
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Component
export default function Blog() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [sort, setSort] = useState<"new" | "old">("new");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = posts.filter((p) =>
      [p.title, p.content].some((s) => s.toLowerCase().includes(q))
    );
    return arr.sort((a, b) =>
      sort === "new"
        ? +new Date(b.date) - +new Date(a.date)
        : +new Date(a.date) - +new Date(b.date)
    );
  }, [query, sort]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="sticky top-0 z-10 -mx-4 mb-6 bg-gradient-to-b from-white/80 to-transparent px-4 py-4 backdrop-blur dark:from-neutral-950/80">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-1 max-w-prose text-sm opacity-70">
          Thoughts on building, learning, and shipping.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="group relative w-full sm:w-80">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full rounded-xl border px-4 py-2.5 pr-9 shadow-sm outline-none transition focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-50">
            ⌘K
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="sort" className="opacity-70">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-lg border px-3 py-2 shadow-sm"
          >
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-5">
        {filtered.map((post, idx) => {
          const isOpen = !!expanded[post.id];
          return (
            <article
              key={post.id}
              className={classNames(
                "group relative overflow-hidden rounded-2xl border",
                "bg-white/60 shadow-sm backdrop-blur transition hover:shadow-md dark:bg-neutral-900/60",
                "before:absolute before:-left-16 before:-top-16 before:h-40 before:w-40 before:rounded-full before:bg-gradient-to-br before:from-black/5 before:to-transparent before:blur-2xl before:transition group-hover:before:opacity-100",
                "dark:before:from-white/10"
              )}
            >
              {/* Card body */}
              <div className="p-5 sm:p-6">
                <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    <Link href={`#post-${post.id}`} className="transition hover:opacity-90">
                      {post.title}
                    </Link>
                  </h2>
                  <time
                    dateTime={post.date}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium opacity-80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {formatDate(post.date)}
                  </time>
                </header>

                {/* Excerpt / Content */}
                <div className={classNames("prose prose-neutral max-w-none text-sm dark:prose-invert", isOpen ? "line-clamp-none" : "line-clamp-3")}
                >
                  {post.content}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setExpanded((s) => ({ ...s, [post.id]: !s[post.id] }))
                    }
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition hover:shadow"
                  >
                    {isOpen ? "Show less" : "Read more"}
                  </button>

                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <span className="hidden sm:inline">#{idx + 1}</span>
                    <span>~{Math.max(1, Math.round(post.content.split(" ").length / 180))} min</span>
                  </div>
                </div>
              </div>

              {/* Accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/15" />
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border p-8 text-center text-sm opacity-70">
            No posts found. Try a different search.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-10 border-t pt-6 text-center text-xs opacity-60">
        © {new Date().getFullYear()} — Built with Next.js & Tailwind
      </div>
    </main>
  );
}
