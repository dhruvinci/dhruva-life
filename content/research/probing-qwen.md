---
title: Is there spatial information inside a VLM?
date: 2026-08-26
period: Aug – Oct 2026
kind: experiment
post: leg-spaghetti
status: completed
question: "Probing Qwen3.8-27B layer by layer: is there enough spatial information inside it to tell, when two bodies are tangled, which limb belongs to whom?"
finding: "Not enough for tangles. The language states add nothing - 0 of 27 trapped-arm cells right - and naming the athlete switches the whole person, not the arm. A layout audit of my own code voided the earlier spatial results (14,080 of 14,400 locations misplaced)."
led_to: "Stop asking models to label pixels. Define engagement itself as something measurable in 3D, and check it against real ground truth."
summary: "Pulling features from every vision and language layer of Qwen3.8-27B, and training probes and decoders on them, to find out what spatial information a VLM really carries."
metrics:
  - value: "27 + 64"
    label: vision and language layers probed
  - value: "0 / 27"
    label: trapped-arm cases right
  - value: "~$5"
    label: of cloud GPU for the extraction
links:
  - label: code
    href: https://github.com/dhruvinci/limb-entanglement
---
