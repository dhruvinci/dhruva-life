---
title: CV
description: Research, experience, and skills
aliases: [resume]
next: [research, work, contact]
---

**Dhruva Chakravarthi** · Bangalore, India · [0xdhruva@gmail.com](mailto:0xdhruva@gmail.com) · [dhruva.life](https://www.dhruva.life) · [GitHub](https://github.com/dhruvinci) · [LinkedIn](https://in.linkedin.com/in/dhruva-chakravarthi)

Applied AI engineer and independent researcher building vision-language systems that understand human movement. Sole-author paper at CAISc 2026; founder of kakashi.ai. Previously founding AI engineer at Zopu.ai (~200K DAU), founder and CEO of Dehidden (acquired by Polygon), and enterprise architect at PwC US. Open to research positions and to roles in vision AI and robotics.

## Research

**Harnessing Vision–Language Models for Faithful Human-Movement Understanding.** D. Chakravarthi. *CAISc 2026*, accepted. [Paper](https://openreview.net/pdf?id=uWNdzkIJ7g) · [Code & MoveBench v0](https://github.com/dhruvinci/moveharness)

- Proposed a measurement-grounded harness for frozen VLMs: cheap CV anchors (pose, optical flow, contact) constrain, route and verify model output over minutes-long video.
- Grounding improved position macro-F1 ~11x on a densely annotated match; 58.9% position identification across 496 clips.
- On 200 out-of-distribution uploads (4,620 expert-reviewed segments), accuracy fell to 46.7% but 93% of errors were adjacent-position confusions - graceful, structured degradation.
- Released MoveBench v0: an ontology-based scorer with strict, alias-folding and LLM-as-judge regimes.

**Current work** - System 1 / System 2 visual understanding: fast CV and classifier models paired with slow VLM reasoning; probing vision-tower layers of a fine-tuned Qwen model for recoverable spatial information; trained a lightweight actor-segmentation decoder on frozen Qwen3-VL and SAM 3 features for identity-aware segmentation of people in close contact.

## Experience

**kakashi.ai** - Founder · Bangalore · Oct 2025 – Present

*AI video analysis for jiu-jitsu and combat sports; started as research, launched March 2026.*

- Designed and built, nearly single-handedly, a production CV + VLM pipeline: YOLO pose, optical flow and contact signals feeding multi-pass Gemini 2.5 analysis with context caching.
- Shipped the full product: React/Vite on Vercel; Express API with pg-boss workers and FFmpeg on Railway; Supabase auth and Postgres; Cloudflare R2 video storage; subscriptions and credits via DodoPayments.
- Launched after a closed alpha with gyms and athletes; built a coach-in-the-loop review flow that turns expert corrections into evaluation data.
- Benchmarked open and closed VLMs (LLaVA, Qwen2.5-VL, Keye-VL, Gemini 2.5 Flash/Pro) on long-form grappling footage; built a human-review tool and hand-labelled ground truth.
- Converted the production harness into peer-reviewed research (CAISc 2026) and open-sourced the benchmark.

**Zopu.ai** (formerly WideCanvas.ai) - Founding AI Engineer · Jan 2025 – Dec 2025

*Visual vibe-coding platform: users draw products, architectures and systems on a canvas and get working software.*

- Built the end-to-end drawing-to-output pipeline, turning shapes, labels and connections on a canvas into structured intent and generated applications.
- Architected multi-model inference - routing sub-tasks across specialised models, optimising latency and cost, and self-hosting on our own servers.
- Scaled with the product to ~200,000 daily active users at peak.

**Career break** · Jan 2024 – Dec 2024

*Trained jiu-jitsu full time; competed at ADCC India Nationals and Strangle (2024) and PKD (2025).*

**Dehidden** - Founder & CEO · Aug 2021 – Dec 2023 · *Acquired by Polygon*

*Web3 and NFT products for global brands.*

- Built and led the company; owned every client partnership, product delivery and solution architecture across 29 brand clients, including Adidas x Prada, Mercedes, Coinbase and Polygon Studios.
- Shipped one of the first one-click, open-edition free mints, abstracting wallets and smart contracts away entirely: 1M+ mints in four days with near-zero incidents.
- Built an enterprise minting suite and Quests, an engage-to-earn product on dynamic and soulbound NFTs; early to token-gated access, dynamic metadata and airdrops at scale.
- Productised repeated client work into a self-serve platform, which led to the acquisition by Polygon.
- Hired and mentored a Web3 engineering team from non-traditional backgrounds; several went on to found companies.

**PwC US** - Consultant → Enterprise Architect · Jan 2018 – Nov 2021

*Enterprise architecture and integration for Fortune 500 clients.*

- Integrated Salesforce across 157 PwC member firms, cutting service time by 30%.
- Rationalised a client's 50+ tools into 10 core systems, cutting costs by 50%.
- Built a contracting application for a Fortune 500 food and beverage client, saving $10M+ annually.
- Led technology separation for a multi-billion-dollar engineering services divestiture without disrupting operations.
- Delivered $20M+ in client savings overall; managed offshore development teams of 5–15 engineers.

## Open source

- **[moveharness](https://github.com/dhruvinci/moveharness)** - measurement-grounded VLM harness and MoveBench v0 (MIT code, CC BY 4.0 data).
- **[vlm-experiments](https://github.com/dhruvinci/vlm-experiments)** - staged VLM + CV pipelines for long-form grappling video, with a human-in-the-loop evaluation tool.
- **[keepr](https://github.com/dhruvinci/keepr)** - crypto-inheritance vault on Solana: Anchor program in Rust, keeper bot, Next.js app.

## Education

- **MS, Computer Science** (machine learning, game theory) - Syracuse University, NY · 2016 – 2017
- **BE, Computer Science** - BNM Institute of Technology, Bangalore · 2012 – 2016

## Skills

- **Vision & ML:** VLMs (Gemini 2.5, Qwen2.5-VL, Qwen3-VL, LLaVA, Keye-VL), SAM / SAM 3, YOLO pose, ViTPose, MediaPipe, ByteTrack, RAFT optical flow, ST-GCN, representation probing, PyTorch, GPU training on RunPod
- **Evaluation:** benchmark and ontology design, LLM-as-judge, bootstrap confidence intervals, human-in-the-loop labelling, classical baselines (HMM)
- **LLM systems:** multi-model orchestration, context caching, prompt and pipeline versioning, latency and cost optimisation, self-hosted inference
- **Languages:** Python, TypeScript, JavaScript, Rust, Solidity, SQL
- **Product engineering:** React, Next.js, Astro, Node/Express, FastAPI, Postgres, Supabase, job queues, FFmpeg, Cloudflare R2 and Workers, Vercel, Railway, Fly.io, GitHub Actions
- **Web3:** Solana/Anchor, Polygon, ethers/viem, NFT and token systems
- **Enterprise:** Salesforce, MuleSoft, integration and solution architecture, M&A technology
