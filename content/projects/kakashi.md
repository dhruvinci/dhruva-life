---
title: kakashi.ai
cluster: Vision AI
status: Active
year: "2026"
period: Oct 2025 – now
order: 1
role: Founder, sole engineer
summary: "An AI training partner for jiu-jitsu: upload a roll, get back what actually happened - positions, transitions, and what to work on."
stack: [Gemini, YOLO pose, optical flow, React, Express, Postgres, Cloudflare R2]
links:
  - label: kakashi.ai
    href: https://kakashi.ai
---

It started as a hobby in October 2025. I wanted something that could watch my rolls the way a coach does, and the models I tried couldn't - they'd describe a scramble beautifully and get the position completely wrong. So I kept building around them. By January 2026 it had grown wings into a full product, and after a small alpha with really positive feedback, it launched in March.

The trick that made it work was the harness, not the model. Cheap computer vision signals - pose, optical flow, who's touching whom - get passed to the VLM as hints, so it looks where it should and stays honest over a long match. That work is written up in [my paper](/research/faithful-movement).

Gyms and athletes use it to break down training footage, and every upload makes the system better, because coaches review and correct what it says. I built all of it myself - the analysis pipeline, the app, payments, the lot.

Kakashi carries on as a side project while I go deeper on the research.
