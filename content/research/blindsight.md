---
title: Can a VLM measure what it sees?
date: 2026-10-29
period: Oct 2026 – now
kind: experiment
status: current
question: "Asked how far away something is, does a vision-language model give a measurement or a guess? And if the measurement is somewhere inside it, can we read it out instead of running a separate computer-vision model?"
finding: "Inside, mostly yes: a probe on the word that names an object reads its depth nearly as well as a dedicated depth model (abs-rel 0.172 vs MoGe-2's 0.138, lower is better), and the same goes for which way it faces. Out loud, no: asked, Qwen3.8-27B is no better than guessing from the object's name (0.370 vs 0.394); counting is the one measure it says as well as a detector. Spatial fine-tuning changes what a model says, not what it holds, and a decoder trained on some kinds of scene doesn't carry over to new ones: the order of depths transfers, metres don't."
summary: "Five open VLMs and six public datasets: each model is asked, then probed layer by layer, on depth, which way things face, surfaces, motion and counts, and compared with MoGe-2, RF-DETR and ViTPose+. Every experiment pre-registered, about $13 of cloud GPU in all. The paper, Blindsight: Vision-Language Models Know More About Space Than They Say, is written and on its way to arXiv."
metrics:
  - value: "0.17 vs 0.37"
    label: depth error, probe vs the model's own answer
  - value: "36° vs 52°"
    label: which way an object faces, probe vs the model's own answer
  - value: "1 of 26"
    label: decoder tests passed on a scene type it never saw
links:
  - label: code
    href: https://github.com/dhruvinci/vlm-spatial-probe
---
