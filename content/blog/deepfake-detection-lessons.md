---
title: "Deepfake detection: lessons from the field"
subtitle: "What actually matters when building multimodal detection systems."
date: "2024-03-18"
tags:
  - Security
  - AI
readingMinutes: 8
accent: "from-slate-700/80 via-stone-800/70 to-neutral-900/80"
summary: "Signal processing still matters. I walk through how our team combined classical audio features with transformer embeddings, the evaluation metrics we almost chose, and how product constraints shaped the model’s final architecture."
---

Deepfakes fail in weird edges. We built a triage system that surfaces frequency anomalies, facial landmark drift, and transcript sentiment in one dashboard.

Our best-performing stack was hybrid: MFCC features for audio, CLIP embeddings for frames, and a late-fusion classifier tuned on hard negatives.

> Ground truth comes from humans. We paid for annotation rather than trusting synthetic labels—it doubled precision overnight.

### Three guardrails we keep

- Every alert links to raw media slices for manual review.
- Confidence scores are conservative and paired with narrative explanations.
- We log adversarial samples for weekly red-team sessions.

Future work: streaming inference with WebRTC taps and watermark detection on-device.
