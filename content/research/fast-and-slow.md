---
title: Fast and slow vision
date: 2026-09-21
period: Sep 2026
kind: experiment
post: seeing-fast-and-slow
status: superseded
question: "Can small, fast models describe people well enough - posture, ownership, contact, motion - for slower models to reason on top?"
finding: "Not yet. A small third-party VLM (Laya Vision) fails grounding controls - the answer follows the letter, not the person (5.3% actor-swap consistency). A DINOv2 posture readout passed a fresh audit."
led_to: "Better outputs aren't progress on their own. Measure engagement itself."
summary: "Kahneman's thinking fast and slow, applied to seeing: cheap, reflexive models underneath, slow reasoning on top. A month of studies on what that fast layer needs to be - mostly honest negatives, and a few things that held up."
metrics:
  - value: "36% → 67%"
    label: posture, released model vs frozen visual probe
  - value: "82.0%"
    label: DINO, best of three encoders compared
  - value: "62%"
    label: less movement error, tracking limb pairs
links:
  - label: code
    href: https://github.com/dhruvinci/fast-slow-vision
---
