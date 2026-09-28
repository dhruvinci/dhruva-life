---
title: CV
description: Research, work, and what I did there
aliases: [resume]
next: [research, work, contact]
---

**Dhruva Chakravarthi** · Bangalore, India · [0xdhruva@gmail.com](mailto:0xdhruva@gmail.com) · [GitHub](https://github.com/dhruvinci) · [LinkedIn](https://in.linkedin.com/in/dhruva-chakravarthi)

Applied AI engineer and independent researcher working on vision-language models for human movement - making models faithful, not just fluent, on long, occluded, contact-heavy video. Founder of kakashi.ai. Previously founding AI engineer at Zopu.ai (~200K DAU), founder and CEO of Dehidden (acquired by Polygon), and enterprise architect at PwC US. Open to research positions and to roles in vision AI and robotics.

## Research

**Harnessing Vision–Language Models for Faithful Human-Movement Understanding** - sole author. CAISc 2026, accepted. [Paper](https://openreview.net/pdf?id=uWNdzkIJ7g) · [Code](https://github.com/dhruvinci/moveharness) · [Summary](/research/faithful-movement)

- Introduced a measurement-grounded harness around a frozen VLM: cheap CV anchors (pose, optical flow, contact) constrain, route and verify the model's output over long video.
- ~11x position macro-F1 from grounding on a densely annotated match; 58.9% position identification across 496 in-distribution clips.
- On 200 out-of-distribution real-world uploads (4,620 expert-reviewed segments), exact accuracy degrades to 46.7%, with 93% of errors confined to adjacent positions - structured, graceful degradation rather than collapse.
- Proposed semantic, vector-valued evaluation over an ontology (strict, alias-folding and LLM-as-judge regimes); released MoveBench v0 with scorer and ontology.

**Ongoing** - fast and slow vision: combining System 1 models (classifiers, segmentation, pose) with System 2 VLMs; probing vision-tower representations of a fine-tuned Qwen for recoverable spatial information; identity-aware segmentation of people in close contact. [Notes](/research/fast-and-slow)

## Experience

**Founder** - [kakashi.ai](https://kakashi.ai) · Oct 2025 – present

*AI video analysis for jiu-jitsu and combat sports. Started as research in Oct 2025, built into a product from Jan 2026, launched Mar 2026 after a closed alpha with gyms and athletes.*

- Built the analysis pipeline, app and business end to end, nearly single-handedly: CV pre-processing (YOLO pose, optical flow, contact signals) feeding a multi-pass Gemini analysis with context caching.
- Production stack: React/Vite on Vercel; Express API with pg-boss job workers and FFmpeg on Railway; Postgres and auth on Supabase; video on Cloudflare R2; subscriptions and credits via DodoPayments.
- Designed a coach-in-the-loop feedback flow where expert corrections to outputs become labelled data for evaluation and improvement.
- Built a human-review tool and hand-labelled ground truth (positions, sub-segments, technique labels over a 91-term ontology) to evaluate the system honestly.
- Took the system from product to peer-reviewed research: the harness behind Kakashi is the subject of my CAISc 2026 paper.

**Founding AI Engineer** - [Zopu.ai](https://zopu.ai) (formerly WideCanvas.ai) · Jan 2025 – Dec 2025

*Vibe coding for people who can't prompt: draw a product, architecture or system on an interactive board, get working output.*

- Built the entire drawing-to-output pipeline - interpreting shapes, labels and connections on a canvas and turning them into generated software.
- Designed the multi-model architecture: routing sub-tasks across specialised models, optimising latency and cost, and hosting inference on our own servers.
- Helped scale the product to ~200,000 daily active users at peak.

**Career break** · Jan 2024 – Dec 2024

*Trained jiu-jitsu full time at the Institute of Jiu Jitsu, Bangalore. Competed at ADCC India Nationals and Strangle (2024) and PKD (2025).*

**Founder & CEO** - Dehidden · Aug 2021 – Dec 2023 · acquired by Polygon

*Web3 and NFT products for brands.*

- Led every client partnership and product delivery, and owned product and solution architecture, for 29 brand clients including Adidas x Prada, Mercedes, Coinbase and Polygon Studios.
- Built an enterprise minting suite and Quests, an engage-to-earn product using dynamic and soulbound NFTs; early to token-gated access, dynamic metadata and airdrops at scale.
- Shipped one of the first one-click open-edition free mints, abstracting wallets and smart contracts away entirely: 1M+ mints in four days.
- Turned repeated client patterns into a self-serve product; that product led to the acquisition by Polygon.
- Hired and mentored a team of Web3 engineers largely from non-traditional backgrounds, several of whom went on to become founders themselves.

**Consultant, then Enterprise Architect** - PwC US · Jan 2018 – Nov 2021

*Enterprise architecture and integration for Fortune 500 clients.*

- Architected Salesforce and MuleSoft integrations, including a Salesforce integration spanning PwC's global network of member firms.
- Rationalised a client's sprawl of 50+ tools down to a core of about 10 systems.
- Led technology workstreams for M&A and a multi-billion-dollar divestiture, separating and consolidating systems without disrupting operations.
- Built a contracting application for a Fortune 500 food and beverage client.
- Managed offshore development teams of 5–15 engineers across time zones.

## Open source

- [moveharness](https://github.com/dhruvinci/moveharness) - the paper's harness and MoveBench v0 benchmark (MIT code, CC BY 4.0 data).
- [vlm-experiments](https://github.com/dhruvinci/vlm-experiments) - staged VLM + CV pipelines for long-form grappling video, with a human-in-the-loop evaluation tool.
- [keepr](https://github.com/dhruvinci/keepr) - a Solana/Anchor crypto-inheritance vault with a keeper bot (devnet).

## Education

- **MS, Computer Science** - Syracuse University, New York · 2016 – 2017 · machine learning and game theory; Master's thesis.
- **BE, Computer Science** - BNM Institute of Technology, Bangalore · 2012 – 2016

## Skills

- **Vision & ML:** vision-language models (Gemini, Qwen-VL, LLaVA), pose estimation (YOLO, MediaPipe), segmentation (SAM), optical flow, tracking, evaluation and benchmark design, LLM-as-judge, PyTorch, GPU workflows on RunPod
- **Engineering:** Python, TypeScript, React, Node/Express, FastAPI, Postgres, Supabase, job queues, FFmpeg, Cloudflare R2, Vercel, Railway
- **Web3:** Solidity, Solana/Anchor, NFT and token systems, smart contract architecture
- **Enterprise:** Salesforce, MuleSoft, solution and integration architecture, M&A technology
- **Ways of working:** AI-native development (architect-in-the-loop), founder-led sales and partnerships, hiring and mentoring

## Beyond work

Jiu-jitsu competitor · documenting the indie scene at [pushit.tv](https://www.pushit.tv) · combat sports photographer · [265+ bands seen live](/music)
