---
title: Engagement in 3D
date: 2026-10-01
period: Oct 2026 – now
kind: ongoing
status: current
question: "Can engagement between two people - where they touch, which surfaces, whose limbs wrap whom - be measured in 3D from one ordinary camera, and checked against independent ground truth?"
finding: "Distance between two athletes 11.2 → 3.2 cm on held-out sequences: 11.2 cm from SAM 3D Body alone, 3.95 cm with combined depth, 3.2 cm with a small learned placement model on top. Ballroom dancing measures well (2.7 cm, touching F1 0.96); limbs hidden inside tangles are still 4–6 cm off, and time alone doesn't fill them in. A truth-free trust flag spots bad frames (AUROC 0.795 held out). SAM 3D Body saw Harmony4D in training, so absolute errors are likely optimistic."
led_to: "Peel the whole video into layers, and test it across every kind of engagement."
summary: "Pre-registered experiments measuring two-person engagement in 3D from one camera."
metrics:
  - value: "11.2 → 3.2 cm"
    label: distance between two athletes, raw → final, held out
  - value: "0.46 → 0.60"
    label: which body surfaces touch (F1)
  - value: "1,068"
    label: held-out views, never trained on
links:
  - label: code
    href: https://github.com/dhruvinci/engage3d
  - label: model
    href: https://huggingface.co/0xdhruva/engage3d-placement-v1
---
