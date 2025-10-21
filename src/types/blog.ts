export type BlogFrontmatter = {
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  readingMinutes: number;
  accent: string;
  summary: string;
};

export type BlogPostSummary = BlogFrontmatter & {
  slug: string;
};

export type BlogPost = BlogPostSummary & {
  body: string;
};
