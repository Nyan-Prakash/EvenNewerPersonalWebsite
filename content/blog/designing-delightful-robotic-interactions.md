---
title: "Building the perfect Black Jack assistant"
subtitle: "Using computer vision in python to create a black jack assistance HUD"
date: "2025-10-17"
tags:
  - Python
  - Computer Vision
readingMinutes: 5
accent: "from-emerald-400/70 via-teal-500/60 to-cyan-500/70"
summary: "I set out to build the optimal black assistant using computer. Here is how it went..."
---

I started by learning the optimal black jack strategy and how to count cards. I learned that they are very basic rules to play optimal so the most difficult part of this project is the computer vision. I start by using Roboflow.

### Robofllow

I took about 30 photos of different layouts of 5–10 cards on a table from the same angle. I created a Roboflow account and a new object classification project, uploaded the images, and spent time labeling every card by rank (2–Ace) while ignoring suit (which I think was my mistake but more on that later). After waiting about two hours for the model to train, I tested it and it didn’t work: it missed roughly half the cards, and the labels it did produce were incorrect. Soooooo... I switched to OpenCV

### OpenCV