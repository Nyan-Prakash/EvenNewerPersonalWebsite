import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { ShareLinkButton } from "./ShareLinkButton";

type Params = {
  slug: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {
      title: "Blog post",
    };
  }

  return {
    title: `${post.title} — Blog`,
    description: post.subtitle,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subtitle,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const others = getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-5 pb-20 pt-14 lg:pb-28">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200/60 px-4 py-2 tracking-[0.25em] text-neutral-500 transition hover:-translate-x-1 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          <span aria-hidden>←</span>
          Back to posts
        </Link>
        <span>{post.readingMinutes} min read</span>
      </div>

      <header
        className={`mt-10 overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br ${post.accent} p-[1px] shadow-xl shadow-black/5 dark:border-neutral-800`}
      >
        <div className="rounded-[calc(1.5rem-1px)] bg-white/85 p-10 backdrop-blur dark:bg-neutral-950/85 sm:p-12">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200/60 bg-white/70 px-4 py-1 dark:border-neutral-800 dark:bg-neutral-900/70"
              >
                {tag}
              </span>
            ))}
            <span className="h-1 w-1 rounded-full bg-neutral-600 opacity-60 dark:bg-neutral-300" />
            <time dateTime={post.date}>{new Date(post.date).toDateString()}</time>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-200 sm:text-base">
            {post.subtitle}
          </p>
          <div className="mt-6 inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
            <span className="rounded-full border border-neutral-200/60 bg-white px-3 py-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80">
              {post.readingMinutes} minute read
            </span>
            <ShareLinkButton slug={post.slug} />
          </div>
        </div>
      </header>

      <ReactMarkdown
        className="mt-12 space-y-7 text-base leading-7 text-neutral-700 dark:text-neutral-200"
        rehypePlugins={[rehypeRaw]}
        components={{
          h2: (props) => (
            <h2
              className="text-lg font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-300"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
              {...props}
            />
          ),
          p: (props) => (
            <p
              className="text-[0.975rem] leading-7 opacity-90 sm:text-base"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="rounded-2xl border border-neutral-200/60 bg-white/70 p-6 text-base font-medium italic leading-relaxed text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-100"
              {...props}
            />
          ),
          ul: (props) => (
            <ul
              className="space-y-3 rounded-2xl border border-neutral-200/60 bg-white/70 p-6 text-sm leading-relaxed text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-neutral-200"
              {...props}
            />
          ),
          li: ({ children, ...props }) => (
            <li className="flex items-start gap-3" {...props}>
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-neutral-900/70 dark:bg-neutral-200" />
              <span>{children}</span>
            </li>
          ),
          strong: (props) => (
            <strong
              className="font-semibold text-neutral-900 dark:text-neutral-100"
              {...props}
            />
          ),
          code: ({ inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-sm text-neutral-100"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={`font-mono text-sm text-neutral-100 ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: (props) => (
            <pre
              className="overflow-x-auto rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
              {...props}
            />
          ),
          iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement>) => (
            <div className="my-8 overflow-hidden rounded-2xl border border-neutral-200/60 shadow-lg dark:border-neutral-800">
              <iframe
                {...props}
                className="w-full aspect-video"
                allowFullScreen
              />
            </div>
          ),
        }}
      >
        {post.body}
      </ReactMarkdown>

      {others.length > 0 ? (
        <section className="mt-16 rounded-3xl border border-neutral-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/70">
          <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-300">
            Keep reading
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="group rounded-2xl border border-neutral-200/60 bg-white/80 p-5 text-left transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70"
              >
                <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 transition group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
                  {formatDate(item.date)}
                </span>
                <p className="mt-3 text-base font-semibold text-neutral-900 transition group-hover:text-neutral-600 dark:text-white">
                  {item.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 transition group-hover:text-neutral-500 dark:text-neutral-300">
                  {item.subtitle}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 transition group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
                  Read post
                  <span aria-hidden>↗</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
