---
title: kakashi.ai
cluster: Vision AI
status: Beta 1 complete
year: "2026"
period: Oct 2025 – 2026
order: 1
side: true
role: Founder & Engineer
summary: "An AI training partner for jiu-jitsu: upload a roll, get back what actually happened - positions, transitions, and what to work on."
combines: [jiu-jitsu, vision AI, product]
metrics:
  - value: "377"
    label: beta users
  - value: "250+"
    label: gyms around the world
  - value: "~6¢"
    label: per match analysed
stack: [Gemini 2.5 Pro, YOLO pose, React, Node/Express, pg-boss, Postgres (Supabase), FFmpeg, Cloudflare R2, Railway, Vercel]
links:
  - label: kakashi.ai
    href: https://kakashi.ai
highlights:
  - "Analysis pipeline: matches go to Gemini in 60-second chunks, three at a time; who's-who is carried across chunks, and swaps are caught and fixed."
  - "A harness around a frozen model: thirteen versioned prompts and parsers behind one registry, every change tested in an offline lab before it shipped."
  - "The whole product: transcoding (including a fix for iPhone HDR footage that crashed the workers), an API and two queue workers, accounts, and payments that refund failed analyses."
  - "Came out of my research, and fed it back: crowdsourced data and coaches correcting the model."
  - "Beta 1 is done. Beta 2 comes with a sharper engagement pipeline and longitudinal insights - more value for athletes, in exchange for more data."
posts: [shipping-kakashi, a-coach-that-watches]
---
