---
title: Can a model watch a whole match?
date: 2025-10-01
period: Oct 2025 – Mar 2026
kind: experiment
status: superseded
question: "Can a frozen vision-language model produce a correct timeline of a whole jiu-jitsu match?"
finding: "It finds where things happen, not what: span overlap about 0.7, but position macro-F1 no better than 0.14. One pass mostly missed the match; caching over-segmented it 7.5×."
led_to: "Structure, not scale: build a harness around the model."
summary: "The 2025 Gemini pipelines on one 16-minute no-gi match."
post: fluent-is-not-faithful
metrics:
  - value: "~0.7"
    label: span overlap - it finds where
  - value: "≤ 0.14"
    label: position macro-F1 - not what
links:
  - label: code
    href: https://github.com/dhruvinci/vlm-experiments
---
