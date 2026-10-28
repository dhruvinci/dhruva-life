---
title: Harnessing Vision–Language Models for Faithful Human-Movement Understanding
date: 2026-07-15
kind: paper
short_title: Faithful human-movement understanding
period: Mar – Jul 2026
posts: [chasing-what-is-true, vibe-researching]
venue_note: "CAISc 2026 is a new conference for research co-authored with AI (Open-Ended Problems track). The experiments and claims are mine; most of the prose was written with AI, which I wrote about in Vibe Researching."
status: accepted
venue: CAISc 2026
question: "Can a frozen vision-language model give a temporally coherent, technically correct, grounded account of long, contact-heavy movement?"
finding: "Grounding a frozen VLM in cheap computer-vision signals lifted position F1 from 0.017 to 0.189 (Δ +0.174, 95% CI [0.031, 0.209]) - but a CV-only baseline scored 0.213, and the paper says so. On 200 unseen real uploads it was 92.9% right to within a neighbouring position."
led_to: "If the CV anchors carry the signal, measure with computer vision directly."
summary: "VLMs describe movement fluently but not faithfully. A harness built on cheap computer-vision signals makes them far more accurate - and makes them fail in predictable ways."
highlights:
  - "Grounding a frozen VLM in cheap CV signals: position macro-F1 0.017 → 0.189, Δ +0.174 [95% CI 0.031, 0.209]; a CV-only baseline scored 0.213"
  - "58.9% [54.5, 63.1] position identification across 496 clips"
  - "On 200 unseen real uploads (4,620 segments I reviewed by hand): 46.7% exact, 92.9% right to within a neighbouring position"
  - "Reported against itself: a CV-only baseline matched the best VLM"
metrics:
  - value: "0.017 → 0.189"
    label: position F1 from CV grounding (CV-only baseline 0.213)
  - value: "58.9%"
    label: positions identified, 496 clips
  - value: "4,620"
    label: real-upload segments reviewed by hand
links:
  - label: paper
    href: https://openreview.net/pdf?id=uWNdzkIJ7g
  - label: code
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
