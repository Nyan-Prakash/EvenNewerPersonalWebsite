---
title: "The personal website stack I keep rebuilding"
subtitle: "Notes on typography, motion, and polish from version 7 of this site."
date: "2024-06-15"
tags:
  - Frontend
  - Process
readingMinutes: 4
accent: "from-amber-300/70 via-orange-400/60 to-rose-400/70"
summary: "Every redesign teaches me something about pacing and storytelling. This round I leaned into micro-interactions, reduced the tech stack to Next.js + Tailwind, and focused on high-contrast readability. Here’s how the pieces fit together."
---

Version 7 focuses on rhythm—how quickly can someone grok who I am, then dive deeper?

Tailwind’s new design tokens made it trivial to keep spacing honest. I leaned on CSS `@property` to animate gradients without re-rendering whole sections.

> If a section doesn’t earn its scroll depth, compress it or cut it.

Still on the roadmap: more performant image pipeline and theme toggles synced to OS settings.
