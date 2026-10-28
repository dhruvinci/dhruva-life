---
title: Measuring movement under contact
date: 2026-08-01
period: Aug 2026
kind: experiment
status: completed
question: "Can movement be measured reliably - with error bars - from one ordinary camera, when two people are overlapping?"
finding: "The camera's lens is the biggest lever: 3D placement error 60.5 → 8.4 cm with the true lens. Separating two people in contact stays unsolved - the detector finds both, and de-duplication deletes one."
led_to: "Separation is the bottleneck. When limbs are entangled, does a model even know which belongs to whom?"
summary: "Taking computer vision on its own as far as it goes on tangled bodies: 3D body models, cameras, occlusion, and the evaluation bugs I had to catch in my own work along the way."
metrics:
  - value: "60.5 → 8.4 cm"
    label: 3D error, wrong vs true camera
  - value: "98.7% → 50.9%"
    label: telling two people apart, heavy occlusion
  - value: "19"
    label: retractions, kept on record
links:
  - label: code
    href: https://github.com/dhruvinci/movement-research
---
