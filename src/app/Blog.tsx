"use client";

import type { BlogPostSummary } from "@/types/blog";
import Link from "next/link";
import { useMemo, useState } from "react";

type BlogProps = {
  posts: BlogPostSummary[];
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function Blog({ posts }: BlogProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [tag, setTag] = useState<string>("All");

  const uniqueTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchesQuery = (post: BlogPostSummary) =>
      [post.title, post.subtitle, post.summary]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q));

    const matchesTag = (post: BlogPostSummary) =>
      tag === "All" ? true : post.tags.includes(tag);

    const arr = posts.filter((post) => matchesQuery(post) && matchesTag(post));

    return arr.sort((a, b) =>
      sort === "new"
        ? +new Date(b.date) - +new Date(a.date)
        : +new Date(a.date) - +new Date(b.date)
    );
  }, [posts, query, sort, tag]);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-14 lg:pb-20">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold tracking-widest uppercase opacity-70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Fresh Notes & Essays
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Build Logs, Experiments & Essays
        </h1>
        <p className="max-w-2xl text-sm opacity-70 sm:text-base">
          A living archive of what I&apos;m shipping, learning, and unlearning across AI,
          full-stack product, and robotics. Filter by topic, skim the highlights, or dive
          into the long-form breakdowns.
        </p>
      </div>

      {/* Controls */}
      <section className="mt-10 grid gap-4 lg:grid-cols-[1.8fr,1fr]">
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/60 bg-white/60 px-4 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/50 sm:flex-row sm:items-center sm:px-6">
          <div className="group relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts by title, idea, or keyword…"
              className="w-full rounded-xl border border-neutral-200 bg-white/70 px-4 py-2.5 pr-12 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-400/60 dark:border-neutral-800 dark:bg-neutral-900/70 dark:focus:ring-blue-400/40"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wide opacity-50">
              ⌘K
            </span>
          </div>

          <div className="flex gap-3">
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-200 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-400/60 dark:border-neutral-800 dark:bg-neutral-900/70 dark:focus:ring-blue-400/40 sm:w-40"
            >
              <option value="All">All topics</option>
              {uniqueTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "new" || value === "old") {
                  setSort(value);
                }
              }}
              className="w-36 rounded-xl border border-neutral-200 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-400/60 dark:border-neutral-800 dark:bg-neutral-900/70 dark:focus:ring-blue-400/40"
            >
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
            </select>
          </div>
        </div>{/*
        <div className="rounded-2xl border border-neutral-200/60 bg-gradient-to-br from-neutral-100/90 via-white/90 to-white/40 px-6 py-5 text-left shadow-sm backdrop-blur dark:border-neutral-800 dark:from-neutral-900/70 dark:via-neutral-900/50 dark:to-neutral-900/40">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
            Newsletter
          </p>
          <h2 className="mt-2 text-lg font-semibold">Monthly ship notes</h2>
          <p className="mt-1 text-sm opacity-70">
            Get a distilled recap of the best experiments, wins, and prototypes.
          </p>
          <Link
            href="mailto:nyanjprakash@gmail.com"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Join the list
            <span aria-hidden>→</span>
          </Link>
        </div>
        */}
      </section>

      {/* Browse posts */}
      <section className="mt-12">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Browse the archive
          </h2>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
            {filtered.length} post{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-200/60 p-10 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            No posts match that search just yet. Try a different keyword or tag.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/80 p-0 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-950/70"
              >
                <div
                  className={`relative h-32 overflow-hidden bg-gradient-to-br ${post.accent}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.65),transparent_55%)] mix-blend-screen" />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                    <span>{post.readingMinutes} min read</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-900 transition group-hover:text-neutral-600 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {post.subtitle || post.summary}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {post.tags.map((tagName) => (
                      <span
                        key={tagName}
                        className="rounded-full border border-neutral-200/60 bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                      >
                        {tagName}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 transition group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
                    Read post
                    <span aria-hidden>↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-16 rounded-3xl border border-neutral-200/60 bg-white/80 px-8 py-6 text-center text-xs uppercase tracking-[0.35em] text-neutral-500 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-neutral-400">
        © {new Date().getFullYear()} — Built in public. Subscribe for the next drop.
      </footer>
    </main>
  );
}
