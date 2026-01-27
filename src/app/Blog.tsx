"use client";

import type { BlogPostSummary } from "@/types/blog";
import Link from "next/link";
import { useMemo, useState, useRef, useEffect } from "react";

type BlogProps = {
  posts: BlogPostSummary[];
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export default function Blog({ posts }: BlogProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [tag, setTag] = useState<string>("All");
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

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
    <main 
      className="mx-auto max-w-6xl"
      style={{ 
        padding: 'var(--spacing-3xl) var(--spacing-lg)',
        backgroundColor: 'var(--background)'
      }}
    >
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="text-center"
        style={{
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          marginBottom: 'var(--spacing-3xl)'
        }}
      >
        <div 
          className="inline-flex items-center gap-2 rounded-full px-4 py-1"
          style={{
            border: '1px solid var(--gray-200)',
            fontSize: 'var(--font-size-tiny)',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 'var(--spacing-lg)'
          }}
        >
          <span 
            className="h-1.5 w-1.5 rounded-full" 
            style={{ backgroundColor: 'var(--accent)' }}
          />
          Build Logs & Experiments
        </div>
        <h1 
          style={{
            fontSize: 'var(--font-size-display)',
            fontWeight: 700,
            marginBottom: 'var(--spacing-md)',
            color: 'var(--foreground)'
          }}
        >
          Technical Blog
        </h1>
        <p 
          style={{
            maxWidth: '42rem',
            margin: '0 auto',
            fontSize: 'var(--font-size-base)',
            opacity: 0.7,
            lineHeight: 1.6
          }}
        >
          Deep dives into AI, computer vision, and full-stack development. 
          Exploring what works, what doesn&apos;t, and the lessons learned along the way.
        </p>
      </section>

      {/* Search & Filter Section */}
      <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <div 
          className="rounded-2xl"
          style={{
            border: '1px solid var(--gray-200)',
            backgroundColor: 'var(--surface)',
            padding: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: 'var(--font-size-small)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--background)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--gray-200)'}
              />
            </div>

            <div className="flex gap-3">
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: 'var(--font-size-small)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--background)',
                  outline: 'none',
                  minWidth: '140px'
                }}
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
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: 'var(--font-size-small)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--background)',
                  outline: 'none',
                  minWidth: '140px'
                }}
              >
                <option value="new">Newest first</option>
                <option value="old">Oldest first</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section>
        <div 
          className="flex items-center gap-3"
          style={{ marginBottom: 'var(--spacing-xl)' }}
        >
          <h2 
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              color: 'var(--foreground)'
            }}
          >
            Latest Posts
          </h2>
          <span 
            style={{
              fontSize: 'var(--font-size-tiny)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.5
            }}
          >
            {filtered.length} post{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div 
            className="rounded-2xl text-center"
            style={{
              border: '2px dashed var(--gray-200)',
              padding: 'var(--spacing-2xl)',
              fontSize: 'var(--font-size-small)',
              opacity: 0.6
            }}
          >
            No posts match that search. Try a different keyword or tag.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--gray-200)',
                  backgroundColor: 'var(--surface)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s ease',
                  opacity: 0,
                  animation: `fadeInUp 0.5s ease forwards ${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Card Header with Gradient */}
                <div
                  className={`relative bg-gradient-to-br ${post.accent}`}
                  style={{ height: '8rem' }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3), transparent 60%)',
                      mixBlendMode: 'overlay'
                    }}
                  />
                </div>

                {/* Card Content */}
                <div 
                  className="flex flex-1 flex-col"
                  style={{ padding: 'var(--spacing-lg)', gap: 'var(--spacing-md)' }}
                >
                  <div 
                    className="flex items-center gap-3"
                    style={{
                      fontSize: 'var(--font-size-tiny)',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      opacity: 0.6
                    }}
                  >
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <span>{post.readingMinutes} min</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 
                      style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 600,
                        color: 'var(--foreground)',
                        marginBottom: 'var(--spacing-sm)',
                        lineHeight: 1.3
                      }}
                    >
                      {post.title}
                    </h3>
                    <p 
                      style={{
                        fontSize: 'var(--font-size-small)',
                        lineHeight: 1.6,
                        opacity: 0.7
                      }}
                    >
                      {post.subtitle || post.summary}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tagName) => {
                      const colors = [
                        { bg: 'var(--primary-light)', text: 'var(--primary-dark)' },
                        { bg: 'var(--secondary-light)', text: 'var(--secondary-dark)' },
                        { bg: '#e8f5e9', text: '#2e7d32' },
                        { bg: '#fff3e0', text: '#e65100' },
                      ];
                      
                      let hash = 0;
                      for (let i = 0; i < tagName.length; i++) {
                        hash = ((hash << 5) - hash) + tagName.charCodeAt(i);
                        hash = hash & hash;
                      }
                      const colorIndex = Math.abs(hash) % colors.length;
                      const selectedColor = colors[colorIndex];

                      return (
                        <span
                          key={tagName}
                          className="rounded-full px-3 py-1"
                          style={{
                            backgroundColor: selectedColor.bg,
                            color: selectedColor.text,
                            fontSize: 'var(--font-size-tiny)',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                          }}
                        >
                          {tagName}
                        </span>
                      );
                    })}
                  </div>

                  {/* Read More Link */}
                  <div 
                    className="flex items-center gap-2"
                    style={{
                      fontSize: 'var(--font-size-small)',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      marginTop: 'var(--spacing-sm)'
                    }}
                  >
                    Read post
                    <span aria-hidden>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
