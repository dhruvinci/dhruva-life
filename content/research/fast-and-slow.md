---
title: Fast and slow vision
date: 2026-09-24
kind: ongoing
summary: "Can small, fast \"System 1\" models describe people well enough for slower models to reason on top? A month of experiments, mostly honest negatives, and a few things that held up."
---

The idea comes from Kahneman's *Thinking, Fast and Slow*. VLMs are System 2: slow, expensive, good at reasoning. Classifiers, pose estimators, segmenters and small decision models are System 1: fast, cheap, reflexive. My paper showed the two work better together. This program asks what a good System 1 layer for people actually looks like - a reusable description of configuration, visible parts, ownership, contact, motion and uncertainty that decisions can be made from.

It started with Laya, a small question-conditioned decision model, and grew into a set of frozen-encoder studies (Laya, DINO, Qwen) with small trained readouts. Jiu-jitsu is the hardest test case, not the whole scope: the data also includes boxing, judo, wrestling, exercise and public action benchmarks.

**What didn't work**

- Adapting Laya's decision head with relational supervision didn't improve posture (18/36 either way) and failed its grounding and reliability gates. Blank images kept 36 of 41 previously correct answers, and answers moved with option order.
- Limb ownership: a simple geometry baseline beat every fitted visual ownership head. The best compact scorer matched geometry but showed no visual benefit at all - image and blanked-image decisions were identical.
- Temporal completion: a learned temporal adapter never beat plain interpolation for filling in hidden poses. Neither did learned temporal heads for posture (interpolation 0.82 macro recall versus 0.62 and 0.48).
- More data isn't more coverage. Adding correlated upright examples made one readout regress to "everyone is standing".

**What held up**

- A frozen DINO posture readout passed a fresh, three-family audit: 36 of 47 known labels, 0.789 macro recall, against 0.25 for the majority baseline, with gains in every family. Wrestling stayed weak.
- Movement without identity: tracking the midpoint of each limb pair, instead of individual left and right limbs, cut movement error by 62% versus a no-movement baseline, with 98.5% coverage at 8.5% error on a prospective confirmation set.
- Matched encoder comparison (same crops, same tiny ridge head): DINO 82.0% correct and the most consistent across sources, Qwen 75.6% with the best pooled macro recall, Laya 70.9%. No universal winner.
- A working local pipeline: uploads, prompted masks, pose, posture, timestamped measurements, and a blind review workbench.

**Lessons so far**

- Simple baselines keep winning, which is exactly why they have to be in every table.
- Identity binding is the central problem. Actor references, correct limb association and temporal correspondence are three different requirements.
- Keep representation, readout and reasoning claims separate. Useful features can coexist with bad ownership and biased heads.
- AI agreement isn't human truth. Human review of the anatomy and ownership questions is still pending.

**Open threads:** an ownership data-scaling study (32/96/288 photos) is prepared but not run; a larger fighting-data labelling batch is partial; a contact-aware spatial decoder needs denser, independently reviewed contact labels. Related: [Whose arm is it?](/research/whose-arm-is-it)
