---
title: Fast and slow vision
date: 2026-09-20
kind: ongoing
summary: "Putting System 1 and System 2 together for visual understanding: quick reflexive models that react, slow VLMs that reason."
---

This is what I'm in the middle of right now, so it's rough.

The idea comes from Kahneman's *Thinking, Fast and Slow*. Humans have a fast, reflexive System 1 and a slow, deliberate System 2. VLMs and big transformer models are very System 2 - slow, expensive, good at reasoning. Classifiers, pose estimation, segmentation and other CV tools are System 1 - fast, cheap, instinctive. My paper showed the two work much better together than apart. Now I want to build that marriage properly instead of bolting one onto the other.

What I'm doing: pairing Laya Vision (small, question-conditioned visual decision models) with a small VLM and a fine-tuned Qwen model. I've pulled the vision tower out and probed its layers to see how much spatial information is actually recoverable, and where. Next is working out an architecture that routes between the two.

Related experiments have been about the hardest version of the problem - two people in close contact, and a model keeping track of whose limbs are whose.

More when there's something worth writing up.
