---
title: "I Built a Blackjack Advisor That Watches Your Cards"
subtitle: "Using a webcam and Python to get real-time strategy advice while playing."
date: "2026-01-25"
tags:
  - Computer Vision
  - Python
  - OpenCV
  - Game AI
readingMinutes: 8
accent: "from-red-700/80 via-black/90 to-green-800/80"
summary: "I pointed a camera at playing cards and taught it to recognize them, track them across frames, and tell me the optimal move. Here's how it works and what I learned building it."
---

I had the idea to build a blackjack advisor that watches your card through a camera and tell you what is the mathematically optimal move in real-time.

So I did.

## Demo

<iframe
  src="https://www.youtube.com/embed/-KoWjjwZPmM"
  title="Blackjack Computer Vision Demo"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
></iframe>

Here's how I did it.

## The Big Picture

The system has three main parts working together:

1. **Find the cards** - Detect rectangular card shapes in the video feed
2. **Remember what they are** - Track each card across frames so it doesn't flicker
3. **Give advice** - Calculate hand totals and recommend the best move

## Using Roboflow

In the beginning, I wanted to use Roboflow to do card detection and recognition. I took over 20 pictures of 10–15 cards on a table, uploaded them to a dataset in Roboflow, and started labeling. I labeled each card individually (this is important).

Once I finished, I tested the model, but it wasn’t accurate at all. I retried with another model and still got poor results. Looking back, I think this was because even though I had 20 different images, the dataset only contained about 3–5 variations of each individual card. Also, all the cards look very similar — the only real differences are the number and suit in the corners.

Now you might think: “You don’t need to know the suit in blackjack.”
That’s true, but the problem is that when detecting the whole card, each number–suit combination is technically a different class. So detection would only work well if the model had seen many examples of each exact card. In other words, I was trying to detect 52 very similar objects with very little data per class.

After trying again with a new dataset, I realized that either Roboflow wasn’t a good fit for my use case, or I didn’t know how to use it properly. What I actually needed was a system that could detect the number and suit separately, so that each symbol would have many more data points and generalize better.

I also tried detecting just the number, but that didn’t work either. I relabeled all ~120 cards across 20 images using only the numbers, and the model was still inaccurate.

In the end, I decided to move away from the Roboflow approach and build my own detection and recognition system from scratch using traditional computer vision techniques. However, it’s possible that I missed a feature in Roboflow or didn’t explore it deeply enough. It’s also possible that I simply didn’t have enough training data. The final solution I implemented only required detecting each number and one instance of each suit.


## Part 1: Finding Cards in the Frame

The first challenge is just finding where the cards are. I used OpenCV's contour detection to find the rectanglur shape of the card

```python
def _detect_cards(image, rank_library, frame_height):
    # Make the image easier to work with
    pre_proc = Cards.preprocess_image(image)
    
    # Find all the card-shaped objects
    cnts_sort, cnt_is_card = Cards.find_cards(pre_proc)
    
    # For each card, figure out what rank it is
    for contour, is_card in zip(cnts_sort, cnt_is_card):
        if not is_card:
            continue
        qcard = Cards.preprocess_card(contour, image)
        best_rank, rank_diff = _match_rank_only(qcard, rank_library)
```

Once I have the card shapes, I need to figure out which cards belong to the dealer and which belong to the player. My solution? Just split the screen. Cards in the top 40% go to the dealer, everything else is yours.

```python
if detection["center"][1] <= frame_height * 0.4:
    dealer_detections.append(detection)
else:
    player_detections.append(detection)
```

Simple, but it works great if you position the camera right.

## Part 2: The Tracking Problem

Okay, so detecting cards frame-by-frame works in theory, but there's a huge problem: it's  noisy. One frame the card is a "7", next frame it's "Unknown", then it's "9", then back to "7". The video feed would just flicker constantly.

The solution is to track cards over time. When a card appears, I give it an identity and follow it across frames. If it keeps saying "7" for a few frames in a row, then I trust it's actually a 7.

```python
class CardTracker:
    def __init__(self):
        self.tracks = []  # List of cards we're tracking
    
    def update(self, detections):
        for det in detections:
            # Is this detection close to a card we're already tracking?
            best_track = self._find_nearest_track(det["center"])
            
            if best_track:
                # Update the existing track
                best_track["candidate_rank"] = det["rank"]
                best_track["candidate_count"] += 1
            else:
                # New card appeared, start tracking it
                self.tracks.append(create_track(det))
```


## Part 3: Recognizing the Cards

So how does it actually know what card it's looking at? I use **template matching** comparing the detected card to a library of reference images.

```python
def _match_rank_only(qcard, rank_library):
    best_rank_name = "Unknown"
    best_rank_diff = float('inf')
    
    for train_rank in rank_library:
        # Compare pixel-by-pixel
        diff_img = cv2.absdiff(qcard.rank_img, train_rank.img)
        rank_diff = int(np.sum(diff_img) / 255)
        
        if rank_diff < best_rank_diff:
            best_rank_diff = rank_diff
            best_rank_name = train_rank.name
    
    return best_rank_name, best_rank_diff
```

It takes the corner of the detected card (where the rank symbol is) and compares it to every reference image. Whichever one matches best wins. I set a threshold so if nothing matches well enough, it just says "Unknown" instead of guessing.

## Part 4: Blackjack Logic

Once I know what cards everyone has, I need to actually calculate the best move. This is where I implemented basic strategy to give matematically optimal way to play blackjack.

A difficult part is handling aces, because they can be worth 1 or 11:

```python
def _hand_total_and_soft(ranks):
    total = 0
    aces = 0
    
    for rank in ranks:
        if rank == "Ace":
            aces += 1
            total += 11  # Start by counting aces as 11
        else:
            total += card_value(rank)
    
    # If we're busting, convert aces from 11 to 1
    while total > 21 and aces > 0:
        total -= 10
        aces -= 1
    
    # "Soft" means we still have an ace counting as 11
    is_soft = (aces > 0)
    return total, is_soft
```

Then the  engine checks what you should do based on your cards and the dealer's upcard. Should you hit? Stand? Double down? Split a pair? The rules are all in there.

```python
def _basic_strategy_action(player_ranks, dealer_rank):
    # Handle pairs first (like splitting Aces or 8s)
    if is_pair(player_ranks):
        return pair_strategy(player_ranks, dealer_rank)
    
    total, is_soft = _hand_total_and_soft(player_ranks)
    
    # Soft hands play differently (you have an ace as 11)
    if is_soft:
        if total >= 19:
            return "Stand"
        if total == 18 and dealer in {3,4,5,6}:
            return "Double"
        # ... more logic
    
    # Hard hands
    if total >= 17:
        return "Stand"
    if total >= 13 and dealer in {2,3,4,5,6}:
        return "Stand"
    # ... more logic
```

## The Overlay

All of this is useless if you can't see what's happening. So I built an overlay that shows:

- What cards the dealer has
- What cards you have and your total
- Whether you should Hit, Stand, Double, or Split
- Who's winning (or if it's a push)
- Live FPS counter


## Final Thoughts

This was a fun project to build during the Fractal Bootcamp. You could extend the same approach to other card games or board game assistants. I think it would be really cool to connect this to the Meta Ray-Bans as the camera and have them stream video to my computer for realtime detection and assistance.

*Want to chat about computer vision or see more projects? [Let's talk!](https://calendly.com/nyanjprakash/a-meeting)*
