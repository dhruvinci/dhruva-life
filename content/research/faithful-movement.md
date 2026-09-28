---
title: Harnessing Vision–Language Models for Faithful Human-Movement Understanding
date: 2026-07-15
kind: paper
venue: CAISc 2026
summary: "VLMs describe movement fluently but not faithfully. A harness built on cheap computer-vision signals makes them far more accurate - and makes them fail in predictable ways."
highlights:
  - "~11x position macro-F1 on a densely annotated match, from grounding a frozen VLM in cheap computer-vision signals"
  - "58.9% position identification across 496 clips"
  - "On 200 unseen real uploads, 93% of errors were confusions between adjacent positions - it fails well"
links:
  - label: Paper (OpenReview)
    href: https://openreview.net/pdf?id=uWNdzkIJ7g
  - label: Code + MoveBench v0
    href: https://github.com/dhruvinci/moveharness
bibtex: |
  @inproceedings{chakravarthi2026faithful,
    title     = {Harnessing Vision--Language Models for Faithful Human-Movement Understanding},
    author    = {Chakravarthi, Dhruva},
    booktitle = {Conference for AI Scientists (CAISc)},
    year      = {2026},
    url       = {https://openreview.net/forum?id=uWNdzkIJ7g}
  }
---

My first paper, and the research behind [Kakashi](/work/kakashi). Sole author, accepted at CAISc 2026.

Ask a vision-language model to describe a few minutes of grappling and you get lovely, confident prose that's often wrong. It loses track of time, invents positions when bodies overlap, and gets expensive fast. Physio, injury prevention, coaching and elder care all need the opposite - an account that's precise, grounded and correct over minutes of footage.

So instead of a bigger model, I built a harness around a frozen one. The through-line is *win by removing*: give the model small computer-vision anchors (pose, optical flow, contact) instead of everything, ask for a compact output instead of verbose JSON, treat the anchors as hints and not gospel, and cache the video once so you can make multiple cheap passes.

What came out of it:

- **Grounding helps a lot.** On one densely annotated match, position accuracy (macro-F1) goes up about 11x. Across 496 clips, it identifies the position 58.9% of the time.
- **It fails well.** On 200 real uploads it had never seen (4,620 expert-reviewed segments), exact accuracy drops to 46.7% - but 93% of the mistakes are confusions between *adjacent* positions. It degrades gracefully instead of falling apart.
- **Score by meaning, not by string match.** A generative model needs to be graded against an ontology, and the gaps between strict and lenient scoring are results in themselves.

What it doesn't show yet: the dense evaluation is one match, all the models are frozen and from one family, and it's single-camera. Each of those is the next thing to fix - more videos and annotators, other model families, and seeing whether the right grounding can lift much smaller models.

The code and a first cut of the benchmark, MoveBench v0, are [open source](https://github.com/dhruvinci/moveharness).

