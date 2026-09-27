---
title: Vibe Researching
date: 2026-05-31
excerpt: "Most of the sentences in my first paper weren't written by me. Every claim in it was."
---

Honestly, most of the sentences in my first paper weren't written by me.

I want to say that plainly before anyone else does, because it's submission season, the paper is out of my hands, and I've been thinking a lot about what it means to write research this way. The questions were mine. The experiments were mine. The implementation, the evaluation, the late nights staring at why a number went down when it should've gone up, the analysis - all mine. But the prose? Mostly written with an AI, and then argued with, cut, rewritten, and argued with again.

When Karpathy coined "vibe coding", people laughed, and then it quietly democratised building software for everyone. I've been living inside it for a while now, first at Zopu and then building Kakashi almost alone, with a small army of AI subscriptions and me designing the architecture and making the calls. Architect-in-the-loop. Writing a paper this way felt like the natural next step. Vibe researching, if you like (Karpathy, please don't sue).

Here's what it's genuinely great at.

It gets you past the blank page. I'm a builder first, and I'd never written a paper before. I knew what I'd found, I knew why it mattered, but turning a messy folder of experiments into something that reads like a paper is its own craft, with its own conventions, and the AI knew those conventions far better than I did. It's a patient sparring partner for structure. It helped me turn rough scripts into clean evaluation code. It's fast at the tedious stuff - tables, formatting, reorganising a section for the fifth time because I changed my mind about what the main point was.

And here's where it's dangerous, which is the part I actually want to write about.

The whole paper is about the fact that vision-language models are fluent but not faithful. They'll describe a jiu-jitsu roll in lovely, confident prose that's often wrong. And then I sat down to write about that with a language model, and it did exactly the same thing to me. It would write a results paragraph that sounded better than my results. It would describe a finding with a little more certainty than the numbers earned. It would smooth over a limitation so gracefully you'd barely notice it was there. Not out of malice - it's just doing what it's rewarded for, which is sounding right.

The irony wasn't lost on me (chuckle chuckle).

So the job changed. I stopped being the person who writes the sentences and became the person who checks every sentence against the truth. Is that number actually what the experiment produced? Does "improves" mean what I think it means here, or is it hiding a caveat? Did I evaluate on one densely annotated match, and does the paragraph say so, clearly, or has it been politely tucked away? Every claim had to trace back to something I ran, looked at, and understood. If I couldn't point to it, it came out.

That's the rule I landed on. The AI can own the sentences. The human owns the truth.

I think the danger with vibe researching is that it lowers the cost of producing something that looks like research far more than it lowers the cost of doing research. A paper-shaped document is now cheap. The experiments, the careful evaluation, the honest reading of your own results, the willingness to publish the part where your system struggles - none of that got any cheaper. If anything it matters more, because the polish that used to signal effort is now free.

And the questions. The AI never once told me what to look for. It didn't know that a model confusing two positions that sit right next to each other is a very different failure from one confusing two positions that have nothing to do with each other. That came from years on the mat. It didn't know to ask whether the cheap computer vision was doing more of the work than the big model. That came from a moment of doubt at my desk in January. Research starts with a question someone actually cares about, and I haven't seen a model care about anything yet.

So yes, I vibe researched my first paper, and I'd do it again. I'd just do it the same way, with the AI on the keyboard and me holding the pen that signs off on what's true.

Now I wait.
