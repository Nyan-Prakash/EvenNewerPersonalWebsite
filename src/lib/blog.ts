import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BlogPost, BlogPostSummary } from "@/types/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const requiredFields = [
  "title",
  "subtitle",
  "date",
  "tags",
  "readingMinutes",
  "accent",
  "summary",
] as const;

function ensureDirExists() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

function parsePost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  for (const field of requiredFields) {
    if (data[field] === undefined) {
      throw new Error(`Missing "${field}" in blog post frontmatter: ${slug}`);
    }
  }

  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];

  return {
    slug,
    title: String(data.title),
    subtitle: String(data.subtitle),
    date: String(data.date),
    tags,
    readingMinutes: Number(data.readingMinutes),
    accent: String(data.accent),
    summary: String(data.summary),
    body: content.trim(),
  };
}

export function getAllPostSlugs(): string[] {
  ensureDirExists();
  return fs
    .readdirSync(BLOG_DIR)
    .filter(
      (file) =>
        file.endsWith(".md") &&
        file !== "README.md" &&
        !file.startsWith("_")
    )
    .map((file) => file.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): BlogPost | null {
  ensureDirExists();
  return parsePost(slug);
}

export function getAllPosts(): BlogPost[] {
  ensureDirExists();
  return getAllPostSlugs()
    .map((slug) => parsePost(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getPostSummaries(): BlogPostSummary[] {
  return getAllPosts().map((post) => {
    const { body, ...summary } = post;
    void body;
    return summary;
  });
}
