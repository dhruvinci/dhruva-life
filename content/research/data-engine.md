---
title: Auto-labelling combat video
date: 2026-09-28
period: Sep – Oct 2026
kind: experiment
status: superseded
question: "Can a VLM agent plus SAM 3.1 label combat-sports video at scale - and can a person steer it where it fails?"
finding: "485,028 person masks over 1,526 intervals - but my own gold review found 52–70% fully right, below every AI audit. Dot-assisted correction (932 dots on 94 frames, five rounds) reached held-out accuracy 75% → 90% in the final round, and won blind reviews 28–6. None of it made a model better."
led_to: "Fixing outputs is evaluation, not progress. Define engagement as something you can measure, and measure it."
summary: "A combat-sports video library, an AI auto-labeller, a tangle tracker, and dot-assisted correction. The tooling stayed; the lesson changed what I was working on."
metrics:
  - value: "120 h"
    label: combat-sports video library
  - value: "485,028"
    label: people auto-labelled
  - value: "75% → 90%"
    label: held-out, final dot-assisted round
links:
  - label: code
    href: https://github.com/dhruvinci/kakashi-autolabel
  - label: tracker
    href: https://github.com/dhruvinci/limb-entanglement
---
