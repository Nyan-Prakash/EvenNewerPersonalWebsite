---
title: "Ship notes #14"
subtitle: "A monthly roundup of experiments, wins, and bugs worth remembering."
date: "2024-05-01"
tags:
  - Builder Log
readingMinutes: 3
accent: "from-violet-500/70 via-fuchsia-500/60 to-pink-500/70"
summary: "Highlights from May: prototyping a Unity robotics visualizer, shipping a custom CRM agent, and the documentation habits that saved me twice in one week."
---

May was about instrumentation. Three different projects needed reliable traces, so I unified everything behind a single PostHog project with consistent event names.

### Highlights

- Unity robotics visualizer now exports lesson clips automatically.
- CRM agent hit 88% task completion with human-in-the-loop review.
- Added a `/debug` route to every prototype to unblock teammates quickly.

June focus: pushing latency down and documenting failure playbooks within 24 hours of each incident.
