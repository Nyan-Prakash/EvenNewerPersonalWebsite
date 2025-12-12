# Blog content

- Add a new `.md` file in this directory for each post.
- Use [YAML frontmatter](https://jekyllrb.com/docs/front-matter/) with the fields shown below:

```yaml
---
title: "Post title"
subtitle: "Short hook that appears in previews"
date: "2024-12-01"
tags:
  - AI
readingMinutes: 5
accent: "from-sky-500/80 via-indigo-500/70 to-purple-500/80"
summary: "One-sentence teaser used in cards and the featured hero."
---

Body content written in Markdown.
```

- The file name becomes the post slug (e.g. `my-new-post.md` → `/blog/my-new-post`).
- Run `npm run build` (or `npm run dev`) to see the post rendered in the Blog tab and `/blog` route.
