---
title: Layered engagement in 4D
date: 2026-10-27
period: Oct 2026 – now
kind: ongoing
status: current
question: "Can one ordinary camera be peeled into every layer of engagement - who's there, their masks, skeletons and 3D bodies, how they touch, and what it means - across everything from a hug to a scramble on the ground?"
finding: "Across 29 clips - hugs, dancing, karate, MMA, grappling - and 12 with ground truth: no identity switches, 3D limbs 2.9–5.2 cm off. Difficulty depends on the layer: hugs are easy to detect but hide arms, strikes are hard to time, dancers are hard to place in depth."
summary: "A six-layer pipeline over time: tracking, masks, 2D skeletons, 3D bodies, contact events, and a VLM narration that cites the measured events. Unpublished, in progress."
metrics:
  - value: "29"
    label: clips, from hugs to ground grappling
  - value: "0"
    label: identity switches on 12 clips with truth
  - value: "2.9–5.2 cm"
    label: 3D limb error, per clip
---
