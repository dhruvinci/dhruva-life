---
title: Whose arm is it?
date: 2026-08-27
kind: experiment
summary: "Can a VLM's sense of who's who fix whose limb is whose when two people are tangled together? With a global actor code, no - and the controls show exactly why."
---

The question is narrow on purpose. Same image, query athlete A1, get A1's mask. Query A2, get A2's mask. Recognising that an armbar is happening, or describing the two athletes well, doesn't count if the dense output hands the trapped arm to the wrong person.

I used one of the hardest clips I have: a two-athlete armbar, 146 frames, with the bodies maximally entangled near the end.

**Tool-chain diagnostics.** Before touching Qwen, I tested how far off-the-shelf tools get:

- SAM 2.1 with boxes separated the athletes cleanly early on and fell apart once they tangled. Box confidence didn't track correct limb ownership.
- GPT-5.6 supplying identity, boxes and signed points to SAM 3 / 3.1 kept identity consistent, but neither SAM version recovered the final trapped arm. One proposed arm point landed on the other athlete's torso, and no candidate mask covered all three arm probes. The semantics survived; the step from semantics to pixels didn't.
- Temporal propagation lost the masks before the final frame in every arm. PromptHMR body priors sometimes overrode a local mask error, but collapsed the two bodies together at 3.5 seconds. Temporal smoothing cut bone-length variation from 0.180 to about 0.010 without fixing the arm.

**Frozen Qwen3.8-27B.** I ran a pinned open-weight extraction campaign on a cloud RTX PRO 6000: all 27 vision layers, merged vision embeddings, and actor marker states across 64 language layers, with temporal and thinking controls - 11,204 artifacts, about 146 GiB, for roughly $5 of GPU time.

Grounding first: across eight armbar prompts, Qwen never explicitly recognised the armbar. With thinking off it confidently described the wrong action. With maximum thinking it was more cautious, but still missed the hold.

Then an ownership probe: frozen Qwen features, a small background/A1/A2 head, 24 training frames and 8 held-out frames from the same clip.

| Condition | Pooled actor IoU | Contact margin toward correct owner |
|---|---:|---:|
| Vision only | **0.693 ± 0.006** | −0.657 |
| + action query, thinking off | 0.665 ± 0.015 | −0.679 |
| + action query, maximum thinking | 0.681 ± 0.017 | −0.478 |
| + matched random actor code | 0.669 ± 0.012 | −0.555 |

Nothing beat vision alone, and the contact margin stayed negative everywhere - the trapped arm kept going to the wrong athlete.

The decisive control held one trained decoder fixed and swapped only the actor states. Six real semantic variants moved IoU by about 0.001. Swapping A1 and A2 flipped the entire athlete map (0.666 → 0.066) instead of repairing the arm. The query was acting as an identity code, not as spatial understanding.

**Follow-up across encoders.** On four grappling clips with whole-video holdouts, fusing DINO and Qwen features raised sparse body-region IoU from about 45.6% to 57.1% - and dropped reviewed contact ownership from 60.5% to 31.3%. Better body cores, worse arms. Qwen's features did carry complementary posture information: on a separate posture readout it recovered more seated and crouched examples than DINO.

**What I'm taking from it:**

- Global semantics need a genuinely spatial interface. Per-frame, query-conditioned patch states or query-to-patch attention are the next hypotheses.
- Score contact ownership separately from body overlap. The two can move in opposite directions.
- Controls do the real work here: fixed-decoder query swaps, matched random codes, actor swaps, and ordered-versus-shuffled frames.

This is one clip, within-clip evaluation, with conservative SAM-derived labels rather than dense human masks. It's a negative result for this interface and training recipe, not a claim that no Qwen representation can solve ownership.
